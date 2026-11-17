# CBDoux — boutique en ligne (site « en dur »)

Site e-commerce professionnel de **CBDoux** (SARL SMART VEND, Haut-Doubs) : fleurs, résines, huiles cutanées et vape CBD, expédition France entière, retrait local, distributeurs 24/7.

- **Framework** : Next.js 15 (App Router, React 19, TypeScript) — rendu statique/ISR, ultra-rapide, SEO natif
- **Style** : Tailwind CSS v4, direction « noir, or et cadran » (fond noir, or, touches de vert de l'enseigne, étiquettes produit en papier crème, montre CBDoux), polices auto-hébergées (Fraunces pour les titres, Hanken Grotesk pour le texte)
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
| `python3 -I scripts/build-etiquettes.py` | prépare les photos produit sur fond blanc à la couleur du papier des étiquettes (`public/images/etiquettes/`) |
| `python3 -I scripts/normalize-product-photos.py <photo.jpg>` | ramène au blanc le fond grisâtre d'une photo produit, avant de lancer la commande précédente |
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

« Noir, or et cadran » (troisième version, 17 novembre 2026) : l'ambiance noir et or voulue par Alan, avec la finition de la refonte précédente.

- **Fond noir, métal or.** Le vert de l'enseigne n'est qu'un accent : bandeau du haut, bandeau défilant, cadran de la montre, boutons posés sur papier.
- **Le papier crème est réservé aux objets** : étiquettes produit, cartes postales des distributeurs, certificats d'analyse. Tout le reste (formulaires, textes longs, tableaux, récapitulatifs) vit sur des panneaux sombres liserés d'or (`.panel`).
- **La montre** (`src/components/home/WatchDial.tsx`) : un cadran 12 heures original, signé CBDoux, qui donne l'heure exacte du Haut-Doubs (pays horloger, distributeurs ouverts jour et nuit). Elle n'imite aucune marque existante : rosace de la marque à midi, aiguilles « feuille », guichet de date. Depuis le 17 novembre : un guichet « jour et nuit » (soleil le jour, lune la nuit), la lumière du cadran qui tourne quand la page défile, une légère inclinaison vers le pointeur sur ordinateur, et les aiguilles qui font un tour quand on touche la montre ou qu'on entre sur le site.
- **Le mouvement** : apparitions au défilement, chiffres qui comptent, bandeau défilant, reflets dorés, poussière d'or. Règle absolue : **aucune image n'attend un script pour s'afficher**, et aucun effet de fusion ou de découpe n'est demandé au navigateur (c'est ce qui faisait « buguer » les photos de la version précédente).
- **La vitesse fait partie du dessin.** Les animations permanentes ne font que déplacer ou fondre des éléments (poussière d'or en CSS, reflet du titre, bandeau défilant) : le navigateur n'a rien à recalculer au repos. Le reflet doré des titres de section ne passe qu'une fois, à leur arrivée à l'écran.
- **Vérification d'âge** (`src/components/AgeGate.tsx`) : écrite dans le HTML de chaque page et pilotée par deux petits scripts, elle s'affiche dès la première image, sans attendre le reste du JavaScript. L'ouverture de la page se joue au moment où l'on entre.
- **Fiche produit sur téléphone** : une barre d'achat reste en bas de l'écran (`AddToCart.tsx`). Avant le bloc d'achat, elle donne le prix et y conduit ; après, elle ajoute au panier le choix en cours.

| Besoin | Fichier |
|---|---|
| Couleurs, tailles de texte, boutons, panneaux, animations | `src/app/globals.css` (jetons en tête de fichier ; `.paper` = papier crème, `.panel` = panneau sombre, `.nuit` = noir profond, `.ticket` = bon doré) |
| Polices | `src/fonts/` et `src/app/layout.tsx` |
| Montre, jauge des forces | `src/components/home/WatchDial.tsx`, `ForceGauge.tsx` |
| Animations (apparitions, compteurs, barre de lecture) | `src/components/motion/MotionRoot.tsx` : marquer un bloc `data-reveal`, un chiffre `data-count` |
| Fiche produit en forme d'étiquette | `src/components/product/ProductCard.tsx` |
| Photos produit sur papier | `python3 -I scripts/build-etiquettes.py` (à relancer après tout ajout de photo) |

Règles de typographie : titres en Fraunces, la seconde moitié de la phrase en italique doré (`<em>`) ; phrases en minuscules, pas de flèche dans les boutons, numéros uniquement pour de vraies étapes. Les espaces insécables françaises sont posées automatiquement sur les textes du catalogue par `fr()` (`src/lib/utils.ts`) et écrites telles quelles dans les pages.

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
