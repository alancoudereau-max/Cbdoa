#!/usr/bin/env python3
"""Apostrophe typographique, portée par les polices du site.

    python3 -I scripts/patch-fonts.py

Dans tout le site (catalogue, guides, pages), les textes sont saisis avec l'apostrophe droite du clavier ( ' ).
En typographie française soignée, on attend l'apostrophe courbe ( ’ ). Plutôt que de réécrire des centaines de
textes — et d'imposer la bonne touche à chaque future modification —, ce script règle la question dans les
fichiers de polices : le caractère U+0027 y est dessiné avec le glyphe de l'apostrophe courbe (U+2019),
crénage compris. Le texte des pages reste inchangé (moteurs de recherche, copier-coller, messages WhatsApp).

Le script est sans effet si la correspondance est déjà faite : on peut le relancer sans risque, et il faut le
relancer après avoir remplacé un fichier de police. Polices traitées : src/fonts/*.woff2 (site) et
src/fonts/og/*.ttf (images de partage). Nécessite fonttools et brotli (pip install fonttools brotli).
"""
import glob
import os
import sys

from fontTools.ttLib import TTFont

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "src", "fonts")


def patch(path: str) -> bool:
    font = TTFont(path)
    changed = False
    for table in font["cmap"].tables:
        if not table.isUnicode():
            continue
        curly = table.cmap.get(0x2019)
        if curly and table.cmap.get(0x27) != curly:
            table.cmap[0x27] = curly
            changed = True
    if changed:
        font.save(path)
    return changed


if __name__ == "__main__":
    files = sorted(glob.glob(os.path.join(ROOT, "*.woff2")) + glob.glob(os.path.join(ROOT, "og", "*.ttf")))
    if not files:
        sys.exit("Aucune police trouvée dans src/fonts.")
    for f in files:
        print(("corrigée  " if patch(f) else "déjà faite") + " : " + os.path.relpath(f, os.path.join(ROOT, "..", "..")))
