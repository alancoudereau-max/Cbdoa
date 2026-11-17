#!/usr/bin/env python3
"""Génère public/conseils-prudence.pdf (guide d'utilisation & prudence) — python3 -I scripts/build-conseils-pdf.py"""
import os, sys
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, KeepTogether
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "conseils-prudence.pdf")
LOGO = os.path.join(ROOT, "public", "images", "brand", "logo.png")

# Polices : DejaVu (présente sur la plupart des systèmes) sinon Helvetica
font, font_b = "Helvetica", "Helvetica-Bold"
for cand in ["/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", "/usr/share/fonts/dejavu/DejaVuSans.ttf"]:
    if os.path.exists(cand):
        pdfmetrics.registerFont(TTFont("DejaVu", cand))
        pdfmetrics.registerFont(TTFont("DejaVu-Bold", cand.replace("DejaVuSans.ttf", "DejaVuSans-Bold.ttf")))
        font, font_b = "DejaVu", "DejaVu-Bold"
        break

GOLD = colors.HexColor("#8a6a16")
INK = colors.HexColor("#1a1a1a")
MUTED = colors.HexColor("#555555")
LINE = colors.HexColor("#d8c98a")

h1 = ParagraphStyle("h1", fontName=font_b, fontSize=22, leading=26, textColor=GOLD, alignment=TA_CENTER, spaceAfter=4)
kicker = ParagraphStyle("k", fontName=font, fontSize=8.5, leading=11, textColor=MUTED, alignment=TA_CENTER)
h2 = ParagraphStyle("h2", fontName=font_b, fontSize=12.5, leading=15, textColor=GOLD, spaceBefore=2, spaceAfter=3)
body = ParagraphStyle("b", fontName=font, fontSize=9.8, leading=14, textColor=INK, spaceAfter=4)
small = ParagraphStyle("s", fontName=font, fontSize=8, leading=11, textColor=MUTED, alignment=TA_CENTER)
warn = ParagraphStyle("w", fontName=font_b, fontSize=9.8, leading=14, textColor=INK)

sections = [
    ("Niveaux de force", [
        "La puissance dépend de la force choisie et de la quantité utilisée.",
        "<b>Classique</b> — fleur ou résine au naturel, non enrichie. Idéal pour découvrir ou pour un usage en journée.",
        "<b>Force 2 · Modérée</b> — enrichie en cannabinoïdes. Ressenti plus présent, plutôt en fin de journée.",
        "<b>Force 3 · Puissante</b> — plus fortement enrichie en cannabinoïdes. Réservée aux consommateurs habitués. Pas de conduite après usage.",
        "<b>Force Maxi</b> — l'enrichissement en cannabinoïdes le plus élevé de la gamme (Californienne Small Buds, Beldia, Piatella). Réservée aux adultes habitués, déconseillée aux débutants : très petite quantité, attendez les effets avant toute nouvelle prise, ni conduite ni machines après usage.",
    ]),
    ("Dosage : commencer bas, augmenter lentement", [
        "Prenez une petite quantité, attendez 15 à 30 minutes et évaluez le ressenti avant d'en reprendre.",
        "Le ressenti varie selon la sensibilité, le poids, le métabolisme et le moment de la journée. Un même produit peut agir différemment d'une personne à l'autre.",
    ]),
    ("Délai et durée", [
        "<b>Vaporisation :</b> ressenti en quelques minutes, durée 1 à 3 heures.",
        "<b>Application cutanée (huiles) :</b> usage local, à renouveler selon besoin. Ne pas ingérer.",
    ]),
    ("Conduite et activités à risque", [
        "<b>Ne conduisez pas</b> après consommation, même à faible dose. Le CBD peut entraîner une somnolence, et le dépistage salivaire routier recherche le THC : les traces présentes dans un produit légal peuvent suffire à le rendre positif. Par prudence, attendez une nuit complète avant de reprendre le volant.",
        "Évitez l'utilisation de machines et toute activité nécessitant une vigilance soutenue.",
    ]),
    ("Traitements et contre-indications", [
        "Demandez l'avis d'un médecin ou d'un pharmacien avant utilisation si vous suivez un traitement : le CBD peut interagir avec certains médicaments.",
        "Cessez l'utilisation et consultez en cas d'effet indésirable (somnolence excessive, nausées, maux de tête, bouche sèche persistante).",
        "Produits strictement déconseillés aux mineurs, aux femmes enceintes ou allaitantes et aux personnes présentant des antécédents psychiatriques sans avis médical.",
    ]),
    ("Conservation", [
        "Conservez vos produits à l'abri de la lumière, de la chaleur et de l'humidité, dans leur sachet hermétique d'origine, idéalement autour de 20 °C. Tenir hors de portée des enfants et des animaux.",
    ]),
    ("Qualité, conformité et usage prévu", [
        "Tous nos produits respectent la réglementation française (THC &lt; 0,3 %) et disposent d'analyses de laboratoire consultables sur notre site, page « Analyses laboratoires ».",
        "Fleurs et résines sont destinées à la vaporisation — ni à la combustion, ni à un usage alimentaire. Les huiles sont à usage cutané exclusivement. Nos produits ne sont pas des médicaments.",
    ]),
]


def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont(font, 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawCentredString(A4[0] / 2, 12 * mm, "CBDoux · SARL SMART VEND · SIREN 101 678 175 · WhatsApp 07 67 98 25 63 · Réservé aux adultes · THC < 0,3 %")
    canvas.drawRightString(A4[0] - 14 * mm, 7 * mm, f"Page {doc.page}")
    canvas.restoreState()


def main():
    doc = SimpleDocTemplate(OUT, pagesize=A4, leftMargin=16 * mm, rightMargin=16 * mm, topMargin=14 * mm, bottomMargin=20 * mm, title="Conseils d'utilisation & prudence — CBDoux", author="CBDoux — SMART VEND", subject="Guide d'utilisation des produits CBD CBDoux")
    story = []
    if os.path.exists(LOGO):
        story.append(Image(LOGO, width=52 * mm, height=10.4 * mm))
        story.append(Spacer(1, 4 * mm))
    story.append(Paragraph("GUIDE D'UTILISATION", kicker))
    story.append(Paragraph("Conseils &amp; prudence", h1))
    story.append(Paragraph("Nos produits CBD sont conçus pour des moments de détente. Pour en profiter sereinement, lisez attentivement les recommandations ci-dessous.", ParagraphStyle("i", parent=body, alignment=TA_CENTER, textColor=MUTED)))
    story.append(Spacer(1, 4 * mm))

    box = Table([[Paragraph("<b>Réservé aux adultes (18+).</b> Nos produits ne sont pas destinés aux mineurs, aux femmes enceintes ou allaitantes, ni aux personnes sous traitement médical sans avis d'un professionnel de santé. Ils ne sont pas des médicaments.", warn)]], colWidths=[A4[0] - 32 * mm])
    box.setStyle(TableStyle([("BOX", (0, 0), (-1, -1), 0.8, GOLD), ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#fbf6e6")), ("LEFTPADDING", (0, 0), (-1, -1), 10), ("RIGHTPADDING", (0, 0), (-1, -1), 10), ("TOPPADDING", (0, 0), (-1, -1), 8), ("BOTTOMPADDING", (0, 0), (-1, -1), 8)]))
    story.append(box)
    story.append(Spacer(1, 5 * mm))

    for title, paras in sections:
        block = [Paragraph(title, h2)] + [Paragraph(t, body) for t in paras]
        t = Table([[block]], colWidths=[A4[0] - 32 * mm])
        t.setStyle(TableStyle([("BOX", (0, 0), (-1, -1), 0.6, LINE), ("LEFTPADDING", (0, 0), (-1, -1), 10), ("RIGHTPADDING", (0, 0), (-1, -1), 10), ("TOPPADDING", (0, 0), (-1, -1), 7), ("BOTTOMPADDING", (0, 0), (-1, -1), 6)]))
        story.append(KeepTogether([t, Spacer(1, 3.5 * mm)]))

    story.append(Spacer(1, 3 * mm))
    story.append(Paragraph("Un doute, une question ? Demandez-nous conseil avant tout achat sur WhatsApp au 07 67 98 25 63 — nous vous orientons vers le produit et la force adaptés à votre profil.", ParagraphStyle("c", parent=body, alignment=TA_CENTER)))
    story.append(Spacer(1, 2 * mm))
    story.append(Paragraph("Les informations de ce document ne se substituent pas à l'avis d'un professionnel de santé. CBDoux ne saurait être tenu responsable d'une utilisation inappropriée de ses produits. Document mis à jour le 08/11/2026.", small))
    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    print("PDF écrit :", OUT, os.path.getsize(OUT) // 1024, "KB")


if __name__ == "__main__":
    main()
