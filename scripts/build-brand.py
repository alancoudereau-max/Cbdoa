#!/usr/bin/env python3
"""
Identité CBDoux : génère le logo vectoriel et tous les fichiers qui en dérivent.

Le logo reprend l'enseigne d'origine (« CBD » en capitales, la rosace à huit pétales
à la place du « o », « ux » en italique) en tracés nets, sans le fond rectangulaire :
il se pose sur n'importe quel fond du site.

Les lettres viennent de Playfair Display SemiBold (licence libre SIL OFL), converties
en tracés : aucune police supplémentaire n'est chargée par le site.

Usage (depuis la racine du dépôt) :
    npm i --no-save @fontsource/playfair-display
    pip install fonttools brotli pillow playwright
    python3 scripts/build-guilloche.py     # le guilloché sert de fond à l'image de partage
    python3 scripts/build-brand.py         # CBDOUX_CHROME=/chemin/vers/chrome si Playwright n'a pas son Chromium

Fichiers écrits :
    src/components/brand/logo-data.ts          tracés utilisés par <Logo /> et <Rosette />
    public/images/brand/cbdoux-logo.svg        logo or, fond transparent
    public/images/brand/cbdoux-logo.png        idem en PNG (2000 px de large)
    public/images/brand/cbdoux-bandeau.png     logo sur bandeau vert liseré d'or (1200 × 400)
    public/images/brand/cbdoux-rosace.svg      la rosace seule (traits renforcés, pour les puces)
    public/favicon.ico, icon.png, icon-192.png, icon-512.png, apple-icon.png
    public/images/og/og-default.jpg            image de partage par défaut (1200 × 630)
"""
from __future__ import annotations

import asyncio
import base64
import math
import os
import sys
from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
FONT_DIR = Path(os.environ.get("CBDOUX_FONT_DIR") or ROOT / "node_modules" / "@fontsource" / "playfair-display" / "files")
SITE_FONTS = ROOT / "src" / "fonts"
BRAND = ROOT / "public" / "images" / "brand"

# ── Réglages du logo ───────────────────────────────────────────────────────────
WEIGHT = 600
TRACK = 0.012        # interlettrage de « CBD » (en cadratins)
GAP_LEFT = 0.035     # blanc entre le D et la rosace
GAP_RIGHT = 0.02     # blanc entre la rosace et le u
ROSETTE_RATIO = 1.1  # diamètre de la rosace / hauteur de capitale
PAD = 5              # marge autour du logo (hauteur de capitale = 100)

# Pétale de la rosace dans un repère 100 × 100 (centre 50/50, pointe vers le haut)
PETAL = [(50, 42), (62.5, 37.5), (66, 21), (50, 5.6), (34, 21), (37.5, 37.5), (50, 42)]
RING_R, CENTRE_R = 46.2, 8.0
# Épaisseurs : « fin » pour les grands formats, « gras » pour les petites tailles (en-tête, icônes)
STROKES = {"fine": (3.8, 2.4, 2.8), "bold": (4.8, 3.2, 3.6)}

GOLD_DARK, GOLD_LIGHT, GOLD = "#b98a2e", "#f3dfa0", "#d6ac4f"
# Verts du site (voir src/app/globals.css) : nuit, sapin, sapin relevé
INK, GREEN_DEEP, GREEN = "#0a2219", "#12372a", "#1c4a39"
PAPER = "#f2ead6"


def nt(v: float) -> str:
    s = f"{v:.1f}"
    return s.rstrip("0").rstrip(".") if "." in s else s


def glyph(font: TTFont, ch: str, dx: float, scale: float):
    gs = font.getGlyphSet()
    name = font.getBestCmap()[ord(ch)]
    t = (scale, 0, 0, -scale, dx, 0)
    pen = SVGPathPen(gs, ntos=nt)
    gs[name].draw(TransformPen(pen, t))
    bp = BoundsPen(gs)
    gs[name].draw(TransformPen(bp, t))
    return pen.getCommands(), gs[name].width * scale, bp.bounds


def petals_path(cx: float, cy: float, k: float, narrow: float = 1.0) -> str:
    """Les huit pétales en un seul tracé. `narrow` < 1 affine les pétales (icônes pleines)."""
    out = []
    for a in range(0, 360, 45):
        ca, sa = math.cos(math.radians(a)), math.sin(math.radians(a))
        pts = [(cx + k * ((x - 50) * narrow * ca - (y - 50) * sa), cy + k * ((x - 50) * narrow * sa + (y - 50) * ca)) for x, y in PETAL]
        out.append("M%s %sC%s %s %s %s %s %sC%s %s %s %s %s %sZ" % tuple(nt(v) for p in pts for v in p))
    return "".join(out)


def compose():
    roman = TTFont(FONT_DIR / f"playfair-display-latin-{WEIGHT}-normal.woff2")
    italic = TTFont(FONT_DIR / f"playfair-display-latin-{WEIGHT}-italic.woff2")
    cap = roman["OS/2"].sCapHeight
    scale = 100.0 / cap                      # hauteur de capitale = 100 unités
    em = roman["head"].unitsPerEm * scale
    x, cbd, ux, bounds = 0.0, [], [], []
    for ch in "CBD":
        d, adv, b = glyph(roman, ch, x, scale)
        cbd.append(d); bounds.append(b)
        x += adv + TRACK * em
    dia = 100 * ROSETTE_RATIO
    cx, cy = bounds[-1][2] + GAP_LEFT * em + dia / 2, -50.0
    x = cx + dia / 2 + GAP_RIGHT * em
    for i, ch in enumerate("ux"):
        d, adv, b = glyph(italic, ch, x, scale)
        if i == 0:                           # cale le « u » sur son bord gauche réel
            x += x - b[0]
            d, adv, b = glyph(italic, ch, x, scale)
        ux.append(d); bounds.append(b)
        x += adv
    x0 = min(b[0] for b in bounds) - PAD
    x1 = max(b[2] for b in bounds) + PAD
    y0 = min(min(b[1] for b in bounds), cy - dia / 2) - PAD
    y1 = max(max(b[3] for b in bounds), cy + dia / 2) + PAD
    return {"cbd": "".join(cbd), "ux": "".join(ux), "cx": cx, "cy": cy, "dia": dia, "box": (x0, y0, x1 - x0, y1 - y0)}


def gradient(gid: str, box) -> str:
    x, y, w, h = box
    return (f'<linearGradient id="{gid}" gradientUnits="userSpaceOnUse" x1="{nt(x)}" y1="{nt(y)}" x2="{nt(x + w)}" y2="{nt(y + h)}">'
            f'<stop offset="0" stop-color="{GOLD_DARK}"/><stop offset=".45" stop-color="{GOLD_LIGHT}"/><stop offset="1" stop-color="{GOLD}"/></linearGradient>')


def rosette_markup(cx, cy, dia, variant: str, paint: str) -> str:
    ring, petal, centre = STROKES[variant]
    k = dia / (2 * (RING_R + ring / 2))
    return (f'<g fill="none" stroke="{paint}" stroke-linejoin="round">'
            f'<circle cx="{nt(cx)}" cy="{nt(cy)}" r="{nt(RING_R * k)}" stroke-width="{nt(ring * k)}"/>'
            f'<path stroke-width="{nt(petal * k)}" d="{petals_path(cx, cy, k)}"/>'
            f'<circle cx="{nt(cx)}" cy="{nt(cy)}" r="{nt(CENTRE_R * k)}" stroke-width="{nt(centre * k)}"/></g>')


def logo_svg(L, variant="fine", extra_attrs="") -> str:
    x, y, w, h = L["box"]
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{nt(x)} {nt(y)} {nt(w)} {nt(h)}" role="img" aria-label="CBDoux"{extra_attrs}>'
            f'<title>CBDoux</title><defs>{gradient("or", L["box"])}</defs>'
            f'<path fill="url(#or)" d="{L["cbd"]}"/>{rosette_markup(L["cx"], L["cy"], L["dia"], variant, "url(#or)")}'
            f'<path fill="url(#or)" d="{L["ux"]}"/></svg>')


def rosette_svg(variant="fine", paint_gradient=True) -> str:
    box = (0, 0, 100, 100)
    paint = "url(#or)" if paint_gradient else GOLD
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="Rosace CBDoux"><defs>{gradient("or", box)}</defs>'
            f'{rosette_markup(50, 50, 100, variant, paint)}</svg>')


def icon_svg(size: int, k: float, radius: float = 22) -> str:
    """Icône : la rosace sur fond vert sombre. `k` = part de l'icône occupée par la rosace
    (0,60 pour les icônes « maskable », qui gardent une zone de sécurité).
    Jusqu'à 64 px, les pétales sont pleins et affinés : les filets deviendraient illisibles."""
    r = radius
    solid = size <= 64
    ring = 7.0 if solid else 4.6
    kk = 100 * k / (2 * (RING_R + ring / 2))
    cx = cy = 50
    pet = petals_path(cx, cy, kk, 0.62 if solid else 1.0)
    petals = (f'<path fill="url(#or)" d="{pet}"/>' if solid
              else f'<path fill="none" stroke="url(#or)" stroke-width="{nt(3.0 * kk)}" stroke-linejoin="round" d="{pet}"/>')
    centre = (f'<circle cx="50" cy="50" r="{nt(6.5 * kk)}" fill="#12271b"/>' if solid
              else f'<circle cx="50" cy="50" r="{nt(CENTRE_R * kk)}" fill="none" stroke="url(#or)" stroke-width="{nt(3.4 * kk)}"/>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="{size}" height="{size}"><defs>{gradient("or", (20, 20, 60, 60))}'
            f'<radialGradient id="fond" cx="50%" cy="38%" r="75%"><stop offset="0" stop-color="{GREEN}"/><stop offset="1" stop-color="{INK}"/></radialGradient></defs>'
            f'<rect width="100" height="100" rx="{r}" fill="url(#fond)"/>'
            f'<circle cx="50" cy="50" r="{nt(RING_R * kk)}" fill="none" stroke="url(#or)" stroke-width="{nt(ring * kk)}"/>{petals}{centre}</svg>')


def data_uri(svg: str) -> str:
    return "data:image/svg+xml;base64," + base64.b64encode(svg.encode()).decode()


def bandeau_html(L) -> str:
    return f"""<!doctype html><meta charset="utf-8"><style>
html,body{{margin:0}}body{{width:1200px;height:400px;background:{INK};display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}}
.band{{position:absolute;left:0;right:0;top:70px;bottom:70px;background:linear-gradient(90deg,{GREEN_DEEP},{GREEN} 50%,{GREEN_DEEP});border-top:2px solid {GOLD};border-bottom:2px solid {GOLD}}}
.band:before,.band:after{{content:"";position:absolute;left:0;right:0;height:1px;background:rgba(214,172,79,.55)}}.band:before{{top:8px}}.band:after{{bottom:8px}}
svg{{position:relative;height:170px}}</style><div class="band"></div>{logo_svg(L, "fine")}"""


def og_html(L) -> str:
    """Image de partage par défaut : le titre de l'accueil, le guilloché et une fleur dans le verre du cadran."""
    guilloche = (BRAND / "guilloche-orge.svg").read_text(encoding="utf-8")
    photo = base64.b64encode((ROOT / "public" / "images" / "products" / "orangello-hydroponie.jpg").read_bytes()).decode()
    return f"""<!doctype html><meta charset="utf-8"><style>
@font-face{{font-family:"Fraunces";font-weight:300 500;src:url(data:font/woff2;base64,{base64.b64encode((SITE_FONTS / "fraunces-roman.woff2").read_bytes()).decode()}) format("woff2")}}
@font-face{{font-family:"Hanken";font-weight:400 700;src:url(data:font/woff2;base64,{base64.b64encode((SITE_FONTS / "hanken-roman.woff2").read_bytes()).decode()}) format("woff2")}}
html,body{{margin:0}}
body{{width:1200px;height:630px;background:radial-gradient(560px 560px at 915px 315px,#241f15 0%,#0c0b09 100%);color:{PAPER};font-family:Hanken,sans-serif;position:relative;overflow:hidden}}
.g{{position:absolute;left:465px;top:-135px;width:900px;height:900px;background:{GOLD};opacity:.42;-webkit-mask:url("{data_uri(guilloche)}") center/contain no-repeat}}
.verre{{position:absolute;left:735px;top:135px;width:360px;height:360px;border-radius:50%;background:#e9dfc6 url(data:image/jpeg;base64,{photo}) center/cover;background-blend-mode:multiply;box-shadow:0 0 0 2px {GOLD},0 0 0 9px {GREEN_DEEP},0 0 0 10px rgba(215,181,101,.6)}}
.rule{{position:absolute;left:0;right:0;height:4px;border-top:1px solid rgba(215,181,101,.85);border-bottom:1px solid rgba(215,181,101,.4)}}
.in{{position:absolute;left:78px;top:92px;bottom:88px;width:640px;display:flex;flex-direction:column;justify-content:space-between}}
svg.logo{{height:66px;align-self:flex-start}}
h1{{font:300 98px/0.93 Fraunces,serif;letter-spacing:-0.035em;font-variation-settings:"SOFT" 100,"opsz" 144;margin:0}}
p{{font:400 25px/1.35 Hanken,sans-serif;color:rgba(242,234,214,.82);margin:0}}
</style><div class="g"></div><div class="verre"></div>
<div class="rule" style="top:34px"></div><div class="rule" style="bottom:34px"></div>
<div class="in">{logo_svg(L, "fine", ' class="logo"')}
<h1>Du CBD de qualité<br>à toute heure.</h1>
<p>Fleurs, résines, huiles et vape analysés en laboratoire.<br>Livraison en France, distributeurs ouverts 24 h/24.</p></div>"""


async def render(jobs):
    """jobs : liste de (html ou data-uri, largeur, hauteur, chemin, transparent)."""
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        # CBDOUX_CHROME : chemin d'un Chrome déjà installé (sinon, le Chromium de Playwright)
        browser = await p.chromium.launch(executable_path=os.environ.get("CBDOUX_CHROME") or None)
        for src, w, h, out, transparent in jobs:
            page = await browser.new_page(viewport={"width": w, "height": h})
            if src.lstrip().startswith("<svg"):
                src = f'<!doctype html><style>html,body{{margin:0;background:transparent}}svg{{display:block;width:{w}px;height:{h}px}}</style>{src}'
            await page.set_content(src)
            await page.wait_for_timeout(600)
            await page.screenshot(path=str(out), omit_background=transparent, clip={"x": 0, "y": 0, "width": w, "height": h})
            await page.close()
        await browser.close()


def main() -> int:
    if not FONT_DIR.exists():
        print("Police introuvable : lancer « npm i --no-save @fontsource/playfair-display ».", file=sys.stderr)
        return 1
    L = compose()
    x, y, w, h = L["box"]
    BRAND.mkdir(parents=True, exist_ok=True)

    # 1. Tracés pour les composants React
    k_fine = L["dia"] / (2 * (RING_R + STROKES["fine"][0] / 2))
    ts = f"""// Fichier généré par scripts/build-brand.py — ne pas modifier à la main.
// Lettres : Playfair Display SemiBold (licence SIL OFL) converties en tracés.

export const LOGO = {{
  viewBox: "{nt(x)} {nt(y)} {nt(w)} {nt(h)}",
  box: {{ x: {nt(x)}, y: {nt(y)}, width: {nt(w)}, height: {nt(h)} }},
  /** « CBD » */
  cbd: "{L["cbd"]}",
  /** « ux » en italique */
  ux: "{L["ux"]}",
  /** Rosace : centre et diamètre extérieur dans le repère du logo */
  rosette: {{ cx: {nt(L["cx"])}, cy: {nt(L["cy"])}, diameter: {nt(L["dia"])} }},
}} as const;

/** Rosace dans un repère 100 × 100 : huit pétales (un seul tracé), anneau de rayon {RING_R}, cœur de rayon {CENTRE_R}. */
export const ROSETTE = {{
  ringRadius: {RING_R},
  centreRadius: {CENTRE_R},
  petals: "{petals_path(50, 50, 1)}",
  /** Épaisseurs [anneau, pétales, cœur] : « fine » pour les grands formats, « bold » pour les petites tailles */
  strokes: {{ fine: [{", ".join(map(str, STROKES["fine"]))}], bold: [{", ".join(map(str, STROKES["bold"]))}] }},
}} as const;

export const BRAND_GOLD = {{ dark: "{GOLD_DARK}", light: "{GOLD_LIGHT}", base: "{GOLD}" }} as const;
"""
    (ROOT / "src" / "components" / "brand" / "logo-data.ts").write_text(ts, encoding="utf-8")

    # 2. Fichiers vectoriels
    (BRAND / "cbdoux-logo.svg").write_text(logo_svg(L, "fine"), encoding="utf-8")
    (BRAND / "cbdoux-rosace.svg").write_text(rosette_svg("bold"), encoding="utf-8")  # traits renforcés : sert de puce, en petit

    # 3. Rendus
    lw = 2000
    lh = round(lw * h / w)
    tmp = ROOT / ".brand-tmp"
    tmp.mkdir(exist_ok=True)
    jobs = [
        (logo_svg(L, "fine"), lw, lh, BRAND / "cbdoux-logo.png", True),
        (bandeau_html(L), 1200, 400, BRAND / "cbdoux-bandeau.png", False),
        (og_html(L), 1200, 630, tmp / "og.png", False),
        (icon_svg(512, 0.60, 0), 512, 512, ROOT / "public" / "icon-512.png", False),   # « maskable » : plein cadre
        (icon_svg(192, 0.80), 192, 192, ROOT / "public" / "icon-192.png", True),
        (icon_svg(180, 0.72, 0), 180, 180, ROOT / "public" / "apple-icon.png", False),  # iOS arrondit lui-même
        (icon_svg(48, 0.86), 48, 48, tmp / "i48.png", True),
        (icon_svg(32, 0.86), 32, 32, ROOT / "public" / "icon.png", True),
        (icon_svg(16, 0.90), 16, 16, tmp / "i16.png", True),
    ]
    asyncio.run(render(jobs))

    Image.open(tmp / "og.png").convert("RGB").save(ROOT / "public" / "images" / "og" / "og-default.jpg", quality=88, optimize=True, progressive=True)
    i48 = Image.open(tmp / "i48.png").convert("RGBA")
    i32 = Image.open(ROOT / "public" / "icon.png").convert("RGBA")
    i16 = Image.open(tmp / "i16.png").convert("RGBA")
    i48.save(ROOT / "public" / "favicon.ico", format="ICO", sizes=[(48, 48), (32, 32), (16, 16)], append_images=[i32, i16])
    for f in (BRAND / "cbdoux-logo.png", BRAND / "cbdoux-bandeau.png", ROOT / "public" / "icon-512.png", ROOT / "public" / "icon-192.png",
              ROOT / "public" / "apple-icon.png", ROOT / "public" / "icon.png"):
        Image.open(f).save(f, optimize=True)
    for f in tmp.iterdir():
        f.unlink()
    tmp.rmdir()
    print(f"Logo : viewBox {nt(x)} {nt(y)} {nt(w)} {nt(h)} — rapport largeur/hauteur {w / h:.3f}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
