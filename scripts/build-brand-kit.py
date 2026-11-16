#!/usr/bin/env python3
"""
Kit de marque CBDoux : les fichiers du logo prêts à l'emploi (réseaux sociaux, imprimeur)
et une planche de présentation. À lancer après scripts/build-brand.py.

Usage (depuis la racine du dépôt) :
    python3 scripts/build-brand-kit.py [dossier_de_sortie]      (par défaut : ./kit-cbdoux)

Rien de ce que produit ce script n'est publié sur le site : le dossier de sortie est à
transmettre à l'exploitant (il est ignoré par git).
"""
import asyncio, base64, shutil, subprocess, sys, zipfile
from pathlib import Path
from PIL import Image
from playwright.async_api import async_playwright

REPO = Path(__file__).resolve().parent.parent
BR = REPO / "public" / "images" / "brand"
OUT = Path(sys.argv[1] if len(sys.argv) > 1 else REPO / "kit-cbdoux").resolve(); OUT.mkdir(parents=True, exist_ok=True)

def old_logo_b64() -> str:
    """Ancien logo (avant novembre 2026), lu dans l'historique git pour la comparaison avant/après."""
    try:
        data = subprocess.run(["git", "-C", str(REPO), "show", "d2bb4c5:public/images/brand/logo.png"], capture_output=True, check=True).stdout
        return base64.b64encode(data).decode()
    except Exception:
        return ""
OLD = old_logo_b64()
FONTS = REPO / "src" / "fonts"

def b64(p: Path) -> str:
    return base64.b64encode(p.read_bytes()).decode()

logo_svg = (BR / "cbdoux-logo.svg").read_text()
ros_svg = (BR / "cbdoux-rosace.svg").read_text()
def uniq(svg: str, n: str) -> str:
    return svg.replace('id="or"', f'id="or{n}"').replace("url(#or)", f"url(#or{n})")

HEX = ("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='97' height='168' viewBox='0 0 48.5 84'>"
       "<path d='M24.25 0L48.5 14V42L24.25 56L0 42V14Z M24.25 56V84' fill='none' stroke='%23d9b85c' stroke-width='1'/></svg>")
CSS = f"""
@font-face{{font-family:Instrument;src:url(data:font/woff2;base64,{b64(FONTS / 'instrument-serif-latin-400-normal.woff2')})}}
@font-face{{font-family:Instrument;font-style:italic;src:url(data:font/woff2;base64,{b64(FONTS / 'instrument-serif-latin-400-italic.woff2')})}}
@font-face{{font-family:Inter;src:url(data:font/woff2;base64,{b64(FONTS / 'inter-latin-wght-normal.woff2')})}}
@font-face{{font-family:Mono;src:url(data:font/woff2;base64,{b64(FONTS / 'jetbrains-mono-latin-wght-normal.woff2')})}}
*{{box-sizing:border-box}}html,body{{margin:0}}
body{{width:1200px;background:#0d0c0a;color:#f4efe3;font-family:Inter,sans-serif}}
.k{{font:500 15px/1 Mono,monospace;letter-spacing:.3em;text-transform:uppercase;color:#d6ac4f}}
"""

board = f"""<!doctype html><meta charset="utf-8"><style>{CSS}
section{{padding:56px 64px;position:relative;overflow:hidden}}
.hero{{padding:84px 64px 72px;text-align:center;background:radial-gradient(900px 480px at 20% 0%,#1d3a2b,transparent 70%),#0d0c0a}}
.hex{{position:absolute;inset:0;background:url("{HEX}") 0 0/72px 125px;opacity:.12;-webkit-mask-image:radial-gradient(ellipse 80% 90% at 100% 0%,#000,transparent 70%)}}
.hero svg{{height:190px;position:relative}}
.hero h1{{font:400 46px/1.05 Instrument,serif;margin:34px 0 0;position:relative}}.hero h1 em{{color:#f3dfa0}}
.band{{background:linear-gradient(90deg,#143524,#1f4a37 50%,#143524);border-top:2px solid #d6ac4f;border-bottom:2px solid #d6ac4f;text-align:center;padding:44px 0;position:relative}}
.band:before,.band:after{{content:"";position:absolute;left:0;right:0;height:1px;background:rgba(214,172,79,.5)}}.band:before{{top:9px}}.band:after{{bottom:9px}}
.band svg{{height:128px}}
.row{{display:flex;gap:44px;align-items:center;margin-top:30px}}
.row figure{{margin:0;text-align:center}}.row figcaption{{font:400 17px/1.3 Inter;color:rgba(244,239,227,.6);margin-top:14px}}
.icon{{width:200px;height:200px;border-radius:44px;background:radial-gradient(circle at 50% 38%,#1f4a37,#0d0c0a 75%);display:flex;align-items:center;justify-content:center;border:1px solid rgba(214,172,79,.35)}}
.icon svg{{width:150px;height:150px}}
.ros svg{{width:200px;height:200px}}
.fav{{display:flex;gap:18px;align-items:flex-end;justify-content:center;height:200px}}.fav img{{image-rendering:auto;border-radius:22%}}
.sw{{display:grid;grid-template-columns:repeat(5,1fr);gap:18px;margin-top:30px}}
.sw div{{height:132px;border-radius:20px;padding:16px;display:flex;flex-direction:column;justify-content:flex-end;font:500 16px/1.25 Inter;border:1px solid rgba(244,239,227,.14)}}
.sw small{{font:400 14px Mono;opacity:.75;margin-top:4px}}
.ba{{display:grid;grid-template-columns:1fr 1fr;gap:26px;margin-top:30px}}
.ba div{{border:1px solid rgba(244,239,227,.14);border-radius:22px;height:200px;display:flex;align-items:center;justify-content:center;position:relative;background:#0d0c0a}}
.ba span{{position:absolute;left:18px;top:14px;font:500 13px Mono;letter-spacing:.24em;text-transform:uppercase;color:rgba(244,239,227,.55)}}
.ba img{{width:82%}}.ba svg{{width:82%}}
</style>
<section class="hero"><div class="hex"></div>{uniq(logo_svg,'a')}<h1>Le logo CBDoux, <em>redessiné au net.</em></h1></section>
<div class="band">{uniq(logo_svg,'b')}</div>
{f'''<section>
  <p class="k">Avant · après</p>
  <div class="ba"><div><span>Avant</span><img src="data:image/png;base64,{OLD}"></div><div><span>Après</span>{uniq(logo_svg,'c')}</div></div>
</section>''' if OLD else ""}
<section style="padding-top:{0 if OLD else 56}px">
  <p class="k">La rosace, seule</p>
  <div class="row">
    <figure><div class="icon">{uniq(ros_svg,'d')}</div><figcaption>Icône d'application<br>et photo de profil</figcaption></figure>
    <figure class="ros">{uniq(ros_svg,'e')}<figcaption>Puce, filigrane,<br>tampon</figcaption></figure>
    <figure><div class="fav"><img src="data:image/png;base64,{b64(REPO / 'public' / 'icon-192.png')}" width="120"><img src="data:image/png;base64,{b64(REPO / 'public' / 'icon.png')}" width="64"><img src="data:image/png;base64,{b64(REPO / 'public' / 'icon.png')}" width="32"></div><figcaption>Onglet du navigateur<br>(du grand au tout petit)</figcaption></figure>
  </div>
</section>
<section style="padding-top:0">
  <p class="k">Les couleurs</p>
  <div class="sw">
    <div style="background:#0d0c0a">Noir chaud<small>#0D0C0A</small></div>
    <div style="background:#143524">Vert profond<small>#143524</small></div>
    <div style="background:#1f4a37">Vert enseigne<small>#1F4A37</small></div>
    <div style="background:linear-gradient(135deg,#b98a2e,#f3dfa0 45%,#d6ac4f);color:#1c1608">Or<small>#B98A2E → #F3DFA0</small></div>
    <div style="background:#f4efe3;color:#1c1608">Crème<small>#F4EFE3</small></div>
  </div>
</section>"""

profile = f"""<!doctype html><meta charset="utf-8"><style>html,body{{margin:0}}body{{width:1024px;height:1024px;background:radial-gradient(circle at 50% 38%,#1f4a37,#0d0c0a 78%);display:flex;align-items:center;justify-content:center}}svg{{width:640px;height:640px}}</style>{uniq(ros_svg,'p')}"""
profile_logo = f"""<!doctype html><meta charset="utf-8"><style>html,body{{margin:0}}body{{width:1024px;height:1024px;background:radial-gradient(circle at 50% 38%,#1f4a37,#0d0c0a 78%);display:flex;align-items:center;justify-content:center}}svg{{width:760px}}</style>{uniq(logo_svg,'q')}"""
band_big = f"""<!doctype html><meta charset="utf-8"><style>html,body{{margin:0}}body{{width:2400px;height:800px;background:#0d0c0a;position:relative;display:flex;align-items:center;justify-content:center}}
.b{{position:absolute;left:0;right:0;top:140px;bottom:140px;background:linear-gradient(90deg,#143524,#1f4a37 50%,#143524);border-top:4px solid #d6ac4f;border-bottom:4px solid #d6ac4f}}
.b:before,.b:after{{content:"";position:absolute;left:0;right:0;height:2px;background:rgba(214,172,79,.55)}}.b:before{{top:16px}}.b:after{{bottom:16px}}svg{{position:relative;height:340px}}</style><div class="b"></div>{uniq(logo_svg,'r')}"""

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        async def shot(html, w, h, out, full=False, transparent=False):
            pg = await b.new_page(viewport={"width": w, "height": h})
            await pg.set_content(html); await pg.wait_for_timeout(400)
            await pg.screenshot(path=str(out), full_page=full, omit_background=transparent)
            await pg.close()
        await shot(board, 1200, 900, OUT / "CBDoux-planche-identite.png", full=True)
        await shot(profile, 1024, 1024, OUT / "CBDoux-profil-rosace.png")
        await shot(profile_logo, 1024, 1024, OUT / "CBDoux-profil-logo.png")
        await shot(band_big, 2400, 800, OUT / "CBDoux-bandeau-vert.png")
        await b.close()
asyncio.run(main())
shutil.copy(BR / "cbdoux-logo.png", OUT / "CBDoux-logo-or-fond-transparent.png")
shutil.copy(BR / "cbdoux-logo.svg", OUT / "CBDoux-logo-vectoriel.svg")
shutil.copy(BR / "cbdoux-rosace.svg", OUT / "CBDoux-rosace-vectoriel.svg")
for f in OUT.glob("*.png"):
    Image.open(f).save(f, optimize=True)
(OUT / "LISEZ-MOI.txt").write_text("""KIT LOGO CBDOUX (novembre 2026)

CBDoux-logo-or-fond-transparent.png   Le logo, à poser sur un fond sombre ou vert (site, affiches, étiquettes).
CBDoux-logo-vectoriel.svg             Le même en vectoriel : à donner à un imprimeur, net à toutes les tailles.
CBDoux-bandeau-vert.png               Le logo sur son bandeau vert liseré d'or (bannière Facebook, en-tête).
CBDoux-profil-rosace.png              Photo de profil carrée : la rosace seule (WhatsApp, Facebook, Google).
CBDoux-profil-logo.png                Photo de profil carrée : le logo entier.
CBDoux-rosace-vectoriel.svg           La rosace seule, en vectoriel.
CBDoux-planche-identite.png           Vue d'ensemble : logo, couleurs, avant/après.

Couleurs : noir #0D0C0A, vert profond #143524, vert enseigne #1F4A37, or #B98A2E à #F3DFA0, crème #F4EFE3.
Lettres du logo : Playfair Display SemiBold (police libre, licence SIL OFL), converties en tracés.
Sur un fond clair, le logo doré manque de contraste : préférer le bandeau vert.
""", encoding="utf-8")
archive = OUT.parent / "kit-cbdoux.zip"
with zipfile.ZipFile(archive, "w", zipfile.ZIP_DEFLATED) as z:
    for f in sorted(OUT.iterdir()):
        z.write(f, f"kit-cbdoux/{f.name}")
print(f"{len(list(OUT.iterdir()))} fichiers dans {OUT} ; archive : {archive}")
