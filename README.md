# CBDoux — boutique en ligne (site « en dur »)

Site e-commerce professionnel de **CBDoux** (SARL SMART VEND, Haut-Doubs) : fleurs, résines, huiles cutanées et vape CBD, expédition France entière, retrait local, distributeurs 24/7.

- **Framework** : Next.js 15 (App Router, React 19, TypeScript) — rendu statique/ISR, ultra-rapide, SEO natif
- **Style** : Tailwind CSS v4, direction « le cadran et l'étiquette » (vert sapin de l'enseigne, papier crème de l'étiquette, filets d'or, guilloché horloger), polices auto-hébergées (Fraunces pour les titres, Hanken Grotesk pour le texte)
- **Commande** : le client compose son panier puis envoie le récapitulatif complet sur le WhatsApp du marchand en un clic (fallback email / copie). Facturation, lien de paiement (Shine) et expédition gérés par le marchand — aucune base de données, aucun back-office à maintenir.
- **Hébergement** : Netlify (configuration incluse : `netlify.toml`), déploiement automatique à chaque modification du dépôt GitHub — guide complet dans `DEPLOIEMENT.md`

## Démarrer en local

```bash
npm install
npm run dev                  # http://localhost:3000
```

Aucune variable n'est obligatoire. L'adresse publique du site (URLs canoniques, sitemap, Open Graph) est détectée au build dans `next.config.ts` : domaine principal du projet sur Netlify ou Vercel, sinon `NEXT_PUBLIC_SITE_URL` si vous la définissez (voir `.env.example`). Aucun domaine n'est écrit en dur dans le code. Le site est entièrement statique côté données : aucun service externe n'est requis.

## Scripts

| Commande | Rôle |
|---|---|
| `npm run dev` | développement |
| `npm run build` / `npm start` | production |
| `npm run typecheck` | vérification TypeScript |
| `python3 -I scripts/build-conseils-pdf.py` | régénère `public/conseils-prudence.pdf` |
| `python3 scripts/build-brand.py` | régénère le logo, les icônes, l'image de partage et le bandeau |
| `python3 -I scripts/build-guilloche.py` | régénère les deux gravures de fond (`public/images/brand/guilloche-*.svg`) |
| `python3 -I scripts/normalize-product-photos.py <photo.jpg>` | ramène au blanc le fond d'une photo produit, pour qu'elle se fonde dans le papier des fiches |
| `python3 -I scripts/patch-fonts.py` | à relancer si un fichier de police est remplacé : l'apostrophe du clavier s'affiche en apostrophe typographique |

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

## Direction artistique

Un seul fond (le vert sapin de l'enseigne), un seul papier (le crème de l'étiquette des flacons : fiches produit, formulaires, tickets et notices sont « imprimés » dessus), un seul métal (l'or, en filets fins). Le motif de fond est un guilloché, la gravure des cadrans de montre : le Haut-Doubs est un pays horloger. L'accueil s'ouvre sur un cadran de 24 heures qui donne l'heure réelle : les distributeurs sont ouverts sur tout le tour.

| Besoin | Fichier |
|---|---|
| Couleurs, tailles de texte, boutons, papier, filets, animations | `src/app/globals.css` (jetons en tête de fichier ; `.paper` passe une zone sur papier crème, `.nuit` sur vert nuit) |
| Polices | `src/fonts/` et `src/app/layout.tsx` |
| Cadran de l'accueil, jauge des forces | `src/components/home/HeroDial.tsx`, `ForceGauge.tsx` |
| Fiche produit en forme d'étiquette | `src/components/product/ProductCard.tsx` |
| Photo de chaque rayon (médaillons) | `src/data/category-visuals.ts` |

Règles de typographie : phrases en minuscules (pas de titres en capitales), pas de flèche dans les boutons, numéros uniquement pour de vraies étapes. Les espaces insécables françaises (avant `? ! : ;`, entre un nombre et son unité) sont posées automatiquement sur les textes du catalogue par `fr()` (`src/lib/utils.ts`) et écrites telles quelles dans les pages. Les photos produit à fond blanc se fondent dans le papier ; une photo à fond gris se corrige avec `normalize-product-photos.py`, puis se renomme (le nom de fichier sert de clé de cache).

## Structure

```
src/app/            pages (App Router) : accueil, boutique, catégories, produit, panier, commande, guides, villes, légal
src/components/     composants UI (header, footer, panier, checkout WhatsApp, produit, contact…)
src/data/           contenu : produits, promos, site, FAQ, guides, villes, légal, COA
src/lib/            logique : livraison (tarifs indicatifs), panier, stock, SEO
public/             images optimisées, vidéos, PDF, icônes, manifest
scripts/            outils (logo et icônes, gravures, photos produit, polices, PDF)
```

## SEO intégré

Métadonnées par page, canonical, Open Graph (image générée par produit), JSON-LD (Organization, OnlineStore, Store ×2 distributeurs, Product/Offer, BreadcrumbList, FAQPage, Article, ItemList), `sitemap.xml` et `robots.txt` dynamiques, redirections 301 des anciennes URLs Lovable, pages catégories et pages locales à contenu éditorial, 10 guides, maillage interne, images AVIF/WebP, polices auto-hébergées, Core Web Vitals optimisés.

## Conformité CBD

Vérification d'âge 18+, bandeau et pages légales (LCEN, CGV, RGPD, cookies, rétractation), aucune allégation thérapeutique, THC < 0,3 %, conseils de prudence (page + PDF), case de prudence obligatoire pour les forces 3 et Maxi, huiles présentées à usage cutané (interdiction alimentaire du 15 mai 2026), analyses labo publiées.
