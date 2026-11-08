#!/usr/bin/env python3
"""
Importe et optimise les images exportées depuis l'ancien projet Lovable vers /public.

Usage : python3 -I scripts/import-lovable-assets.py <dossier-export-lovable> <racine-du-site>
"""
import sys, os, shutil
from PIL import Image, ImageOps

SRC = sys.argv[1]
DST = sys.argv[2]
A = os.path.join(SRC, "src", "assets")
P = os.path.join(DST, "public")

MAX_SIDE = 1600


def out(path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    return path


def save_image(src, dst, max_side=MAX_SIDE, quality=82, square=False, force_jpg=False):
    im = Image.open(src)
    im = ImageOps.exif_transpose(im)
    has_alpha = im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info)
    if has_alpha and not force_jpg:
        im = im.convert("RGBA")
    else:
        im = im.convert("RGB")
    if square:
        w, h = im.size
        s = min(w, h)
        left, top = (w - s) // 2, (h - s) // 2
        im = im.crop((left, top, left + s, top + s))
    im.thumbnail((max_side, max_side), Image.LANCZOS)
    ext = os.path.splitext(dst)[1].lower()
    out(dst)
    if ext == ".png":
        im.save(dst, "PNG", optimize=True)
    else:
        if im.mode == "RGBA":
            bg = Image.new("RGB", im.size, (255, 255, 255))
            bg.paste(im, mask=im.split()[3])
            im = bg
        im.save(dst, "JPEG", quality=quality, optimize=True, progressive=True)
    print(f"{os.path.getsize(dst)//1024:5d} KB  {im.size[0]}x{im.size[1]}  {os.path.relpath(dst, P)}")


# ───── Produits (slug → fichier source) — images carrées pour les cartes
products = {
    "super-lemon-haze-hydro-usa": "products/super-lemon-haze.jpeg",
    "amnesia-haze-hydro": "products/amnesia-hydro.jpg",
    "orangello-hydroponie": "products/orangello.jpg",
    "cali-fruit-indoor": "products/cali-fruit.jpg",
    "critical-berry-indoor-usa": "products/critical-berry.jpg",
    "fruit-haze": "products/fruit-haze.png",
    "snow-white": "products/snow-white.png",
    "bubble-gum-greenhouse": "products/bubble-gum.jpg",
    "trim-premium-indoor": "products/trim-premium.jpg",
    "3x-filtre": "products/3x-filtre-real.jpeg",
    "huile-full-spectrum-10": "products/huile-10.png",
    "huile-full-spectrum-20": "products/huile-20.png",
    "pods-cbd-rechargeables": "products/pods.jpg",
    "recharge-pods": "products/recharge-pods.jpg",
    # Visuels PROVISOIRES (les originaux étaient stockés hors dépôt) — à remplacer :
    "californienne-indoor-small-buds": "products/fleur.jpg",
    "olivette-gold": "products/resine.jpg",
    "beldia": "products/3x-filtre.jpeg",
    "piatella": "products/banana-berry-real.jpeg",
}
for slug, rel in products.items():
    save_image(os.path.join(A, rel), os.path.join(P, "images", "products", f"{slug}.jpg"), max_side=1200, square=True, force_jpg=True)

# Images de catégories
categories = {
    "fleurs-cbd": "products/fleur.jpg",
    "resines-cbd": "products/resine.jpg",
    "huiles-cbd": "products/huile-10.png",
    "vape-cbd": "products/vape.jpg",
}
for slug, rel in categories.items():
    save_image(os.path.join(A, rel), os.path.join(P, "images", "products", f"{slug}.jpg"), max_side=1200, square=True, force_jpg=True)

# ───── Marque
save_image(os.path.join(A, "brand/logo.png"), os.path.join(P, "images", "brand", "logo.png"), max_side=826)
save_image(os.path.join(A, "brand/banner-wide.png"), os.path.join(P, "images", "brand", "banner-wide.png"), max_side=1200)
save_image(os.path.join(A, "brand/banner-wide-v2.png"), os.path.join(P, "images", "brand", "banner-hero.jpg"), max_side=1600, force_jpg=True)
save_image(os.path.join(A, "brand/distributeur-poster.png"), os.path.join(P, "images", "brand", "distributeur-charquemont.jpg"), max_side=1400, force_jpg=True)
# Provisoire : affiche du Russey non présente dans l'export
save_image(os.path.join(A, "brand/distributeur-poster.png"), os.path.join(P, "images", "brand", "distributeur-le-russey.jpg"), max_side=1400, force_jpg=True)
save_image(os.path.join(A, "brand/promo-bienvenue.png"), os.path.join(P, "images", "brand", "promo-bienvenue.jpg"), max_side=1200, force_jpg=True)
save_image(os.path.join(A, "brand/whatsapp-poster.png"), os.path.join(P, "images", "brand", "whatsapp-poster.jpg"), max_side=1200, force_jpg=True)
save_image(os.path.join(A, "brand/services-affiche.jpg"), os.path.join(P, "images", "brand", "services-affiche.jpg"), max_side=1232)

# ───── Réseaux sociaux
for n in ("facebook", "whatsapp", "google-maps"):
    ext = ".png" if n != "google-maps" else ".jpg"
    save_image(os.path.join(A, f"social/{n}.png"), os.path.join(P, "images", "social", f"{n}{ext}"), max_side=400, force_jpg=(n == "google-maps"), square=True)

# ───── Analyses laboratoire (COA) — garder lisibles
for f in os.listdir(os.path.join(A, "coa")):
    save_image(os.path.join(A, "coa", f), os.path.join(P, "images", "coa", os.path.splitext(f)[0] + ".jpg"), max_side=1600, quality=85, force_jpg=True)

# ───── Icônes
fav = Image.open(os.path.join(SRC, "public", "favicon.ico")).convert("RGBA")
fav.save(out(os.path.join(P, "favicon.ico")), format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
fav.resize((180, 180), Image.LANCZOS).save(out(os.path.join(P, "apple-icon.png")), "PNG")
fav.resize((512, 512), Image.LANCZOS).save(out(os.path.join(P, "icon-512.png")), "PNG")
fav.resize((192, 192), Image.LANCZOS).save(out(os.path.join(P, "icon-192.png")), "PNG")
fav.resize((32, 32), Image.LANCZOS).save(out(os.path.join(P, "icon.png")), "PNG")

# ───── Image Open Graph par défaut (1200×630) à partir de la bannière
hero = Image.open(os.path.join(A, "brand/banner-wide-v2.png")).convert("RGB")
og = ImageOps.fit(hero, (1200, 630), Image.LANCZOS, centering=(0.5, 0.5))
og.save(out(os.path.join(P, "images", "og", "og-default.jpg")), "JPEG", quality=85, optimize=True)
print("OG par défaut OK")

# PDF conseils (sera régénéré, on garde l'original en secours)
shutil.copy(os.path.join(SRC, "public", "conseils-prudence.pdf"), out(os.path.join(P, "conseils-prudence-original.pdf")))
print("Terminé.")
