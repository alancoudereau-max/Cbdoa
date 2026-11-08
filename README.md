# CBDoux — boutique en ligne (site « en dur »)

Site e-commerce professionnel de **CBDoux** (SARL SMART VEND, Haut-Doubs) : fleurs, résines, huiles cutanées et vape CBD, expédition France entière, retrait local, distributeurs 24/7.

- **Framework** : Next.js 15 (App Router, React 19, TypeScript) — rendu statique/ISR, ultra-rapide, SEO natif
- **Style** : Tailwind CSS v4, identité noir profond & or champagne, polices auto-hébergées (Instrument Serif, Inter, JetBrains Mono)
- **Commande** : le client compose son panier puis envoie le récapitulatif complet sur le WhatsApp du marchand en un clic (fallback email / copie). Facturation, lien de paiement (Shine) et expédition gérés par le marchand — aucune base de données, aucun back-office à maintenir.
- **Hébergement** : Vercel ou Netlify — guide complet dans `DEPLOIEMENT.md`

## Démarrer en local

```bash
npm install
cp .env.example .env.local   # puis renseigner les clés
npm run dev                  # http://localhost:3000
```

Une seule variable est utile : `NEXT_PUBLIC_SITE_URL` (URL publique du site). Le site est entièrement statique côté données : aucun service externe n'est requis.

## Scripts

| Commande | Rôle |
|---|---|
| `npm run dev` | développement |
| `npm run build` / `npm start` | production |
| `npm run typecheck` | vérification TypeScript |
| `python3 -I scripts/build-conseils-pdf.py` | régénère `public/conseils-prudence.pdf` |

## Où modifier quoi

| Besoin | Fichier |
|---|---|
| Produits, prix, forces, textes, photos, ruptures (`soldOut`) | `src/data/products.ts` (+ images dans `public/images/products/`) |
| Codes promo | `src/data/promos.ts` |
| Tarifs et modes de livraison, seuil port offert, codes postaux zone locale | `src/lib/shipping.ts` |
| Coordonnées, société, mentions légales (SIRET…), points de retrait, navigation | `src/data/site.ts` |
| FAQ (accueil, livraison, catégories) | `src/data/faq.ts`, `src/data/category-faq.ts` |
| Guides / blog SEO | `src/data/guides.ts` |
| Pages locales (villes) | `src/data/cities.ts` |
| Analyses laboratoire (COA) | `src/data/coa.ts` + `public/images/coa/` |
| Textes légaux (CGV, confidentialité…) | `src/data/legal.ts` |

## Structure

```
src/app/            pages (App Router) : accueil, boutique, catégories, produit, panier, commande, guides, villes, légal
src/components/     composants UI (header, footer, panier, checkout WhatsApp, produit, contact…)
src/data/           contenu : produits, promos, site, FAQ, guides, villes, légal, COA
src/lib/            logique : livraison (tarifs indicatifs), panier, stock, SEO
public/             images optimisées, vidéos, PDF, icônes, manifest
scripts/            outils (import des assets, génération PDF)
```

## SEO intégré

Métadonnées par page, canonical, Open Graph (image générée par produit), JSON-LD (Organization, OnlineStore, Store ×2 distributeurs, Product/Offer, BreadcrumbList, FAQPage, Article, ItemList), `sitemap.xml` et `robots.txt` dynamiques, redirections 301 des anciennes URLs Lovable, pages catégories et pages locales à contenu éditorial, 10 guides, maillage interne, images AVIF/WebP, polices auto-hébergées, Core Web Vitals optimisés.

## Conformité CBD

Vérification d'âge 18+, bandeau et pages légales (LCEN, CGV, RGPD, cookies, rétractation), aucune allégation thérapeutique, THC < 0,3 %, conseils de prudence (page + PDF), case de prudence obligatoire pour les forces 3 et Maxi, huiles présentées à usage cutané (interdiction alimentaire du 15 mai 2026), analyses labo publiées.
