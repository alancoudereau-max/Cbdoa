#!/usr/bin/env python3
"""Prépare les photos produit pour les étiquettes crème du site.

    python3 -I scripts/build-etiquettes.py

Les fiches produit sont des étiquettes en papier crème. Une photo prise sur fond blanc y dessinerait un
carré blanc : ce script en fabrique une copie dont le fond est exactement la couleur du papier
(public/images/etiquettes/, même nom de fichier). Les photos plein cadre (mains gantées, mises en scène
sombres) sont laissées telles quelles. La liste des copies est écrite dans src/data/etiquettes.json ;
le site s'en sert pour choisir la bonne image (src/lib/etiquettes.ts) et retombe sur la photo d'origine
si la copie n'existe pas. Aucun effet de fusion n'est demandé au navigateur : l'image est déjà finie.

À relancer après avoir ajouté ou remplacé une photo dans public/images/products/.
"""
import json
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "images" / "products"
OUT = ROOT / "public" / "images" / "etiquettes"
MANIFEST = ROOT / "src" / "data" / "etiquettes.json"
PAPIER = np.array([233, 223, 198], dtype=np.float32)  # #e9dfc6, la zone photo de l'étiquette (globals.css)


def fond_blanc(a: np.ndarray) -> bool:
    """Vrai si la photo est posée sur un fond blanc : bord haut blanc et au moins deux coins blancs."""
    lum = a.mean(axis=2)
    h, w = lum.shape
    b = max(2, int(0.06 * min(h, w)))
    coins = [lum[:b, :b].mean(), lum[:b, -b:].mean(), lum[-b:, :b].mean(), lum[-b:, -b:].mean()]
    return lum[: max(2, b // 3), :].mean() > 235 and sum(c > 232 for c in coins) >= 2


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    faits = []
    for f in sorted(SRC.glob("*.jpg")):
        a = np.asarray(Image.open(f).convert("RGB")).astype(np.float32)
        if not fond_blanc(a):
            print(f"  plein cadre, laissée telle quelle : {f.name}")
            continue
        a = np.clip(a * (255.0 / 246.0), 0, 255)  # le blanc cassé du fond devient un vrai blanc
        out = np.clip(a * (PAPIER / 255.0), 0, 255).astype(np.uint8)
        Image.fromarray(out).save(OUT / f.name, quality=88, optimize=True)
        faits.append(f.name)
        print(f"  sur papier : {f.name}")
    for old in OUT.glob("*.jpg"):
        if old.name not in faits:
            old.unlink()
    MANIFEST.write_text(json.dumps(faits, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"{len(faits)} photo(s) sur papier, liste écrite dans {MANIFEST.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
