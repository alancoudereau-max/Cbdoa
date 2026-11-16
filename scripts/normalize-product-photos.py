#!/usr/bin/env python3
"""Ramène au blanc le fond des photos produit prises sur un support gris ou bleuté.

    python3 -I scripts/normalize-product-photos.py public/images/products/ma-photo.jpg [autre.jpg …]
    python3 -I scripts/normalize-product-photos.py --bords public/images/products/ma-photo.jpg

Les fiches produit posent les photos sur du papier crème en mode « produit » (mix-blend-mode: multiply) :
un fond blanc disparaît dans le papier, un fond gris laisse un rectangle. Le script estime le fond
(tout ce qui n'est ni coloré ni sombre), le lisse largement, puis divise l'image par ce fond
(correction dite « flat-field ») : la table redevient blanche, les ombres portées sont conservées
et le produit retrouve son exposition réelle. Le fichier est réécrit sur place (JPEG qualité 88).
À n'utiliser que sur des photos à fond uni et clair.

Option --bords : ne refait pas la correction ; elle fond seulement vers le blanc le pourtour du fond
(8 % de chaque côté) quand une ombre vient mourir contre le bord du cadre et dessine une arête sur
le papier. Le produit lui-même, coloré, n'est pas touché.
"""
import sys

import cv2
import numpy as np


def normalize(path: str) -> None:
    img = cv2.imread(path)
    if img is None:
        raise SystemExit(f"Image illisible : {path}")
    f = img.astype(np.float32)
    h, w = f.shape[:2]
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    sat, val = hsv[..., 1].astype(np.float32), hsv[..., 2].astype(np.float32)
    # l'objet : tout ce qui est coloré ou sombre (élargi pour englober ses ombres proches)
    obj = ((sat > 60) | (val < 110)).astype(np.uint8)
    obj = cv2.dilate(obj, np.ones((25, 25), np.uint8))
    if (obj == 0).sum() < 0.08 * h * w:
        raise SystemExit(f"Fond insuffisant pour être estimé (photo plein cadre ?) : {path}")
    bg = f.copy()
    bg[obj == 1] = np.median(f[obj == 0].reshape(-1, 3), axis=0)
    bg = cv2.GaussianBlur(bg, (0, 0), sigmaX=max(h, w) / 12)
    out = np.clip(f / np.maximum(bg, 1) * 255.0, 0, 255).astype(np.uint8)
    cv2.imwrite(path, out, [cv2.IMWRITE_JPEG_QUALITY, 88, cv2.IMWRITE_JPEG_OPTIMIZE, 1])
    print(f"{path} : fond ramené au blanc ({w} × {h})")


def feather_edges(path: str, amount: float = 0.08) -> None:
    img = cv2.imread(path)
    if img is None:
        raise SystemExit(f"Image illisible : {path}")
    f = img.astype(np.float32)
    h, w = f.shape[:2]
    # rampe : 0 au bord du cadre, 1 à partir de « amount » de la largeur (courbe adoucie)
    ys = np.minimum(np.arange(h), np.arange(h)[::-1]) / (amount * h)
    xs = np.minimum(np.arange(w), np.arange(w)[::-1]) / (amount * w)
    ramp = np.clip(np.minimum(ys[:, None], xs[None, :]), 0, 1)
    ramp = ramp * ramp * (3 - 2 * ramp)
    # le fond : ce qui est peu coloré (le produit garde ses bords nets)
    sat = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)[..., 1].astype(np.float32)
    ground = cv2.GaussianBlur(np.clip((70 - sat) / 40, 0, 1), (0, 0), sigmaX=max(h, w) / 160)
    lift = ((1 - ramp) * ground)[..., None]
    out = np.clip(f + (255 - f) * lift, 0, 255).astype(np.uint8)
    cv2.imwrite(path, out, [cv2.IMWRITE_JPEG_QUALITY, 90, cv2.IMWRITE_JPEG_OPTIMIZE, 1])
    print(f"{path} : pourtour fondu vers le blanc ({w} × {h})")


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if a != "--bords"]
    if not args:
        raise SystemExit(__doc__)
    for p in args:
        (feather_edges if "--bords" in sys.argv else normalize)(p)
