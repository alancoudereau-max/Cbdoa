#!/usr/bin/env python3
"""Génère les motifs guillochés du site (gravure de cadran, clin d'œil au pays horloger).

    python3 -I scripts/build-guilloche.py

Sorties dans public/images/brand/ :
  - guilloche-orge.svg    « grain d'orge » : anneaux ondulés en opposition de phase (tour du cadran) ;
  - guilloche-rosace.svg  rosace de cercles entrelacés, symétrie d'ordre 8 comme la rosace du logo (grands fonds).

Les tracés sont dessinés à l'or de l'enseigne (constante OR ci-dessous) sur fond transparent : le site les pose
en image de fond (classe .guilloche) et règle leur présence avec l'opacité de l'élément.
Chaque motif est décrit par un seul tracé de base, répété par <use> : les fichiers restent très légers.
"""
from __future__ import annotations

import math
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "public" / "images" / "brand"
OR = "#d7b565"  # même valeur que --color-or dans src/app/globals.css


def fmt(v: float, digits: int = 2) -> str:
    return f"{v:.{digits}f}".rstrip("0").rstrip(".")


def wave_ring(amplitude: float, lobes: int, steps_per_lobe: int = 6) -> str:
    """Cercle de rayon 100 centré sur l'origine, dont le rayon ondule de ± amplitude."""
    n = lobes * steps_per_lobe
    pts = []
    for i in range(n):
        t = 2 * math.pi * i / n
        r = 100 + amplitude * math.sin(lobes * t)
        pts.append(f"{fmt(r * math.cos(t))} {fmt(r * math.sin(t))}")
    return "M" + " ".join(pts) + "Z"


def build_orge() -> str:
    """Grain d'orge : anneaux ondulés en progression géométrique, un sur deux déphasé d'une demi-période."""
    lobes = 60
    half_period = 180 / lobes  # en degrés
    ratio = 1.0265  # rapport entre deux anneaux voisins
    amplitude = 100 * (ratio - 1) * 0.5  # l'ondulation touche presque l'anneau voisin : effet « grain »
    uses = []
    r, k = 232.0, 0
    while r <= 494:
        s = r / 100
        rot = half_period if k % 2 else 0
        opacity = 0.95 if k % 2 == 0 else 0.62
        uses.append(
            f'<use href="#o" transform="translate(500 500) rotate({fmt(rot)}) scale({fmt(s, 3)})" '
            f'stroke-width="{fmt(1.05 / s, 3)}" stroke-opacity="{opacity}"/>'
        )
        r *= ratio
        k += 1
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">'
        f'<defs><path id="o" d="{wave_ring(amplitude, lobes)}"/></defs>'
        f'<g fill="none" stroke="{OR}" stroke-linejoin="round">{"".join(uses)}</g></svg>'
    )


def build_rosace() -> str:
    """Rosace : deux couronnes de cercles entrelacés (64 + 64), cœur dégagé, cerclée de deux filets."""
    parts = []
    for count, radius, dist, op in ((64, 172, 300, 0.85), (64, 96, 388, 0.5), (32, 60, 150, 0.6)):
        for i in range(count):
            a = 360 * i / count
            x = 500 + dist * math.cos(math.radians(a))
            y = 500 + dist * math.sin(math.radians(a))
            parts.append(f'<circle cx="{fmt(x, 1)}" cy="{fmt(y, 1)}" r="{radius}" stroke-opacity="{op}"/>')
    parts.append('<circle cx="500" cy="500" r="494"/><circle cx="500" cy="500" r="486" stroke-opacity="0.5"/>')
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">'
        f'<g fill="none" stroke="{OR}" stroke-width="1">{"".join(parts)}</g></svg>'
    )


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name, svg in (("guilloche-orge.svg", build_orge()), ("guilloche-rosace.svg", build_rosace())):
        path = OUT / name
        path.write_text(svg, encoding="utf-8")
        print(f"{name}: {len(svg) / 1024:.1f} Ko")


if __name__ == "__main__":
    main()
