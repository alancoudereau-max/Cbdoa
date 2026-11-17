#!/usr/bin/env python3
"""Fabrique les données de la carte du Haut-Doubs (src/data/carte-haut-doubs.json).

    python3 -I scripts/build-carte.py

La carte du site (src/components/content/HautDoubsMap.tsx) situe les distributeurs, les points de retrait
et la zone de livraison à domicile. Tout y est placé d'après des coordonnées officielles :
  - mairies des communes : https://geo.api.gouv.fr (champ « mairie »), relevé du 17/11/2026 ;
  - contour du département du Doubs : scripts/data/doubs.geojson, issu de france-geojson
    (https://github.com/gregoiredavid/france-geojson, données IGN, Licence Ouverte).
Projection : plane, en kilomètres, centrée sur la zone (suffisant à cette échelle).

À relancer si l'on ajoute une commune ou si une zone de livraison change (rayons ci-dessous).
"""
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src" / "data" / "carte-haut-doubs.json"

# Fenêtre de la carte, en kilomètres autour du centre (x vers l'est, y vers le sud)
LAT_C, LON_C = 47.17, 6.66
X0, X1, Y0, Y1 = -33.0, 37.0, -44.0, 36.0
KX = 111.32 * math.cos(math.radians(LAT_C))
KY = 111.13

# nom, slug de la page locale, longitude, latitude de la mairie, rôle, côté de l'étiquette
#   rôle : distributeur | retrait | ville        côté : g (gauche) | d (droite) | h (haut) | b (bas)
VILLES = [
    ("Charquemont", "charquemont", 6.8231, 47.2134, "distributeur", "d"),
    ("Le Russey", "le-russey", 6.7293, 47.1624, "distributeur", "g"),
    ("Damprichard", "damprichard", 6.8822, 47.2442, "retrait", "d"),
    ("Maîche", "maiche", 6.8016, 47.2523, "ville", "g"),
    ("Saint-Hippolyte", "saint-hippolyte", 6.8121, 47.3183, "ville", "d"),
    ("Morteau", "morteau", 6.6041, 47.0569, "ville", "g"),
    ("Villers-le-Lac", "villers-le-lac", 6.6679, 47.0593, "ville", "d"),
    ("Orchamps-Vennes", "orchamps-vennes", 6.5267, 47.1311, "ville", "b"),
    ("Pontarlier", "pontarlier", 6.3542, 46.9041, "ville", "d"),
    ("Montbéliard", "montbeliard", 6.7983, 47.5102, "ville", "g"),
]
# Villes hors cadre : indiquées par une flèche sur le bord
HORS_CADRE = [
    ("Besançon", "besancon", 6.0239, 47.2377),
    ("Belfort", "belfort", 6.8629, 47.6377),
]
# Zones de livraison à domicile (src/lib/shipping.ts et page Livraison) : centre, rayon en km
ZONES = [("Le Russey", 30.0), ("Damprichard", 10.0)]


def km(lon: float, lat: float) -> tuple[float, float]:
    return ((lon - LON_C) * KX, (LAT_C - lat) * KY)


def pct(x: float, y: float) -> tuple[float, float]:
    return (round((x - X0) / (X1 - X0) * 100, 2), round((y - Y0) / (Y1 - Y0) * 100, 2))


def simplifie(points: list[tuple[float, float]], tol: float) -> list[tuple[float, float]]:
    """Douglas-Peucker, sans récursion."""
    if len(points) < 3:
        return points
    garde = [False] * len(points)
    garde[0] = garde[-1] = True
    pile = [(0, len(points) - 1)]
    while pile:
        a, b = pile.pop()
        (xa, ya), (xb, yb) = points[a], points[b]
        dx, dy = xb - xa, yb - ya
        norme = math.hypot(dx, dy) or 1e-9
        loin, ou = 0.0, -1
        for i in range(a + 1, b):
            d = abs(dy * (points[i][0] - xa) - dx * (points[i][1] - ya)) / norme
            if d > loin:
                loin, ou = d, i
        if loin > tol and ou > 0:
            garde[ou] = True
            pile += [(a, ou), (ou, b)]
    return [p for p, g in zip(points, garde) if g]


def main() -> None:
    contour = json.loads((ROOT / "scripts" / "data" / "doubs.geojson").read_text(encoding="utf-8"))["geometry"]["coordinates"][0]
    brut = [km(lon, lat) for lon, lat in contour]
    # L'anneau est fermé (premier point = dernier) : on le simplifie en deux moitiés, coupées au point le plus éloigné du départ.
    k = max(range(len(brut)), key=lambda i: math.hypot(brut[i][0] - brut[0][0], brut[i][1] - brut[0][1]))
    pts = simplifie(brut[: k + 1], 0.22) + simplifie(brut[k:], 0.22)[1:]
    # en unités de la carte (0 à 1000 sur chaque axe), une décimale
    H = round(1000 * (Y1 - Y0) / (X1 - X0))  # hauteur du dessin, pour une largeur de 1000
    u = lambda x, y: (round((x - X0) / (X1 - X0) * 1000, 1), round((y - Y0) / (Y1 - Y0) * H, 1))
    chemin = "M" + "L".join(f"{a} {b}" for a, b in (u(x, y) for x, y in pts)) + "Z"

    position = {}
    villes = []
    for nom, slug, lon, lat, role, cote in VILLES:
        x, y = km(lon, lat)
        position[nom] = (x, y)
        px, py = pct(x, y)
        villes.append({"nom": nom, "slug": slug, "x": px, "y": py, "role": role, "cote": cote})
    zones = []
    for nom, rayon in ZONES:
        x, y = position[nom]
        cx, cy = u(x, y)
        zones.append({"centre": nom, "rayonKm": rayon, "cx": cx, "cy": cy, "r": round(rayon / (X1 - X0) * 1000, 1)})
    # Flèches de bord : direction depuis le centre de la carte, posée sur le cadre
    cxm, cym = (X0 + X1) / 2, (Y0 + Y1) / 2
    hors = []
    for nom, slug, lon, lat in HORS_CADRE:
        x, y = km(lon, lat)
        dx, dy = x - cxm, y - cym
        t = min((X1 - cxm) / abs(dx) if dx else 9e9, (Y1 - cym) / abs(dy) if dy else 9e9)
        bx, by = pct(cxm + dx * t, cym + dy * t)
        dist = round(math.hypot(x - position["Le Russey"][0], y - position["Le Russey"][1]))
        hors.append({"nom": nom, "slug": slug, "x": bx, "y": by, "angle": round(math.degrees(math.atan2(dy, dx))), "km": dist})

    rx, ry = position["Le Russey"]
    data = {
        "cadreKm": [round(X1 - X0), round(Y1 - Y0)],
        "hauteur": H,
        "contour": chemin,
        "villes": villes,
        "zones": zones,
        "horsCadre": hors,
        "reperes": [{"km": k, "cx": u(rx, ry)[0], "cy": u(rx, ry)[1], "r": round(k / (X1 - X0) * 1000, 1)} for k in (10, 20)],
        "echelle10km": round(10 / (X1 - X0) * 100, 2),
    }
    OUT.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    print(f"{len(pts)} points de contour, {len(villes)} communes, écrit dans {OUT.relative_to(ROOT)} ({OUT.stat().st_size} octets)")
    for v in villes:
        print(f"  {v['nom']:16s} {v['x']:6.2f} % {v['y']:6.2f} %  {v['role']}")
    for h in hors:
        print(f"  hors cadre : {h['nom']:12s} bord {h['x']} % {h['y']} %  à {h['km']} km du Russey")


if __name__ == "__main__":
    main()
