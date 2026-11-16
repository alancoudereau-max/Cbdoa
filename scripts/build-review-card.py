#!/usr/bin/env python3
"""
Carte « Votre avis compte » (A6, PNG 300 dpi + PDF) à coller sur un distributeur :
le QR code ouvre directement le formulaire d'avis Google de la fiche du distributeur.

Usage (depuis la racine du dépôt) :
    python3 scripts/build-review-card.py "<lien d'avis Google>" "<nom du lieu>" [dossier_de_sortie]
    python3 scripts/build-review-card.py "https://search.google.com/local/writereview?placeid=…" "Le Russey"

Le lien d'avis de chaque fiche est dans src/data/site.ts (champ reviewUrl).
Rappel : ne jamais proposer de contrepartie en échange d'un avis.
"""
import asyncio, base64, re, sys
from pathlib import Path
import qrcode
from qrcode.constants import ERROR_CORRECT_Q
from playwright.async_api import async_playwright

if len(sys.argv) < 3:
    sys.exit(__doc__)
REPO = Path(__file__).resolve().parent.parent
URL, PLACE = sys.argv[1], sys.argv[2]
OUT = Path(sys.argv[3] if len(sys.argv) > 3 else REPO / "kit-cbdoux").resolve(); OUT.mkdir(parents=True, exist_ok=True)
FONTS = REPO / "src" / "fonts"
SLUG = re.sub(r"[^A-Za-z0-9]+", "-", PLACE).strip("-")

def b64(p): return base64.b64encode(Path(p).read_bytes()).decode()

qr = qrcode.QRCode(error_correction=ERROR_CORRECT_Q, box_size=1, border=0)
qr.add_data(URL); qr.make(fit=True)
m = qr.get_matrix(); n = len(m)
rects = "".join(f'<rect x="{x}" y="{y}" width="1.02" height="1.02"/>' for y, row in enumerate(m) for x, v in enumerate(row) if v)
qr_svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-3 -3 {n + 6} {n + 6}" shape-rendering="crispEdges"><rect x="-3" y="-3" width="{n + 6}" height="{n + 6}" fill="#f7f2e6"/><g fill="#10271b">{rects}</g></svg>'

logo = (REPO / "public/images/brand/cbdoux-logo.svg").read_text()
ros = (REPO / "public/images/brand/cbdoux-rosace.svg").read_text().replace('id="or"', 'id="orr"').replace("url(#or)", "url(#orr)")
HEX = ("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='97' height='168' viewBox='0 0 48.5 84'>"
       "<path d='M24.25 0L48.5 14V42L24.25 56L0 42V14Z M24.25 56V84' fill='none' stroke='%23d9b85c' stroke-width='1'/></svg>")

html = f"""<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{{font-family:Instrument;src:url(data:font/woff2;base64,{b64(FONTS / 'instrument-serif-latin-400-normal.woff2')})}}
@font-face{{font-family:Instrument;font-style:italic;src:url(data:font/woff2;base64,{b64(FONTS / 'instrument-serif-latin-400-italic.woff2')})}}
@font-face{{font-family:Inter;src:url(data:font/woff2;base64,{b64(FONTS / 'inter-latin-wght-normal.woff2')})}}
@font-face{{font-family:Mono;src:url(data:font/woff2;base64,{b64(FONTS / 'jetbrains-mono-latin-wght-normal.woff2')})}}
@page{{size:105mm 148mm;margin:0}}
*{{box-sizing:border-box}}html,body{{margin:0}}
body{{width:105mm;height:148mm;background:radial-gradient(120% 70% at 50% 0%,#24543f 0%,#143524 55%,#0d1f16 100%);color:#f4efe3;font-family:Inter,sans-serif;position:relative;overflow:hidden;text-align:center;-webkit-print-color-adjust:exact;print-color-adjust:exact}}
.hex{{position:absolute;inset:0;background:url("{HEX}") 0 0/9mm 15.6mm;opacity:.13;-webkit-mask-image:radial-gradient(ellipse 90% 60% at 50% 100%,#000,transparent 75%)}}
.frame{{position:absolute;inset:4mm;border:.35mm solid #d6ac4f;border-radius:4mm}}.frame:after{{content:"";position:absolute;inset:1.1mm;border:.15mm solid rgba(214,172,79,.55);border-radius:3.2mm}}
.in{{position:relative;padding:11.5mm 10mm 0}}
.logo svg{{height:14mm}}
.orn{{display:flex;align-items:center;justify-content:center;gap:2mm;margin-top:3.5mm}}.orn i{{display:block;width:16mm;height:.2mm;background:linear-gradient(90deg,transparent,#d6ac4f)}}.orn i:last-child{{transform:scaleX(-1)}}.orn b{{display:block;width:1.3mm;height:1.3mm;background:#d6ac4f;transform:rotate(45deg)}}.orn svg{{width:4.6mm;height:4.6mm}}
h1{{font:400 12.5mm/0.95 Instrument,serif;margin:6mm 0 0;letter-spacing:-.01em}}h1 em{{color:#f3dfa0}}
p.t{{font:400 3.5mm/1.45 Inter;color:rgba(244,239,227,.85);margin:4mm auto 0;white-space:nowrap}}
.qr{{width:48mm;height:48mm;margin:6mm auto 0;border-radius:4mm;background:#f7f2e6;padding:2.2mm;box-shadow:0 0 0 .35mm #d6ac4f,0 3mm 8mm rgba(0,0,0,.45)}}.qr svg{{width:100%;height:100%;display:block}}
p.k{{font:500 2.7mm/1.5 Mono,monospace;letter-spacing:.28em;text-transform:uppercase;color:#f3dfa0;margin:5.5mm 0 0}}
p.s{{font:400 2.9mm/1.5 Inter;color:rgba(244,239,227,.7);margin:2.2mm 0 0}}
</style></head><body>
<div class="hex"></div><div class="frame"></div>
<div class="in">
  <div class="logo">{logo}</div>
  <div class="orn"><i></i><b></b>{ros}<b></b><i></i></div>
  <h1>Votre avis <em>compte.</em></h1>
  <p class="t">Trente secondes pour nous aider :<br>scannez, puis laissez votre avis sur Google.</p>
  <div class="qr">{qr_svg}</div>
  <p class="k">Distributeur CBDoux · {PLACE}</p>
  <p class="s">Merci ! Une question ? WhatsApp 07 67 98 25 63</p>
</div></body></html>"""

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        # PNG 300 dpi : 105 mm = 1240 px, 148 mm = 1748 px ; 1 mm CSS = 3,7795 px -> facteur 3,125
        ctx = await b.new_context(viewport={"width": 397, "height": 559}, device_scale_factor=3.125)
        pg = await ctx.new_page(); await pg.set_content(html); await pg.wait_for_timeout(500)
        await pg.screenshot(path=str(OUT / f"CBDoux-carte-avis-Google-{SLUG}.png"), clip={"x": 0, "y": 0, "width": 396.85, "height": 559.37})
        await pg.pdf(path=str(OUT / f"CBDoux-carte-avis-Google-{SLUG}.pdf"), width="105mm", height="148mm", print_background=True, prefer_css_page_size=True)
        await b.close()
asyncio.run(main())
print(f"Carte écrite dans {OUT} (QR {n} x {n} modules) : vérifier le code avec un téléphone avant d'imprimer.")
