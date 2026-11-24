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
| `python3 -I scripts/build-etiquettes.py` | prépare les photos produit sur fond blanc à la couleur du papier des étiquettes (`public/images/etiquettes/`) et note la taille de chaque photo (`src/data/photos.json`, pour la loupe) |
| `python3 -I scripts/build-carte.py` | régénère la carte du Haut-Doubs (`src/data/carte-haut-doubs.json`) : communes, zones de livraison, contour du Doubs |
| `python3 -I scripts/normalize-product-photos.py <photo.jpg>` | ramène au blanc le fond grisâtre d'une photo produit, avant de lancer la commande précédente |
| `python3 -I scripts/patch-fonts.py` | à relancer si un fichier de police est remplacé : l'apostrophe du clavier s'affiche en apostrophe typographique |
| `node --experimental-strip-types --no-warnings qa/pricing.test.mjs` | contrôle la règle des prix dégressifs (paliers, règle propre à une référence, formats, panier), sans navigateur |
| `node --experimental-strip-types --no-warnings --import ./qa/alias.mjs qa/catalogue.test.mjs` | contrôle le catalogue : prix des formats de la force Maxi et prix « dès » de chaque produit, sans navigateur (la liste attendue est en tête du fichier : à mettre à jour quand un prix change) |
| `python3 -I qa/seo_extract.py` | après un build : longueur des titres et descriptions de chaque page |
| `node qa/audit.mjs 320,360,390,768,1024,1280,1440` | site construit et lancé sur le port 3100 : débordements, images cassées et erreurs sur toutes les pages |
| `node qa/parcours.mjs 390` | site lancé sur le port 3100 : achat complet (tarif dégressif, Piatella, panier, récapitulatif WhatsApp, demande de prix, ancien panier), prix « dès » des cartes et vidéos de l'accueil |

## Où modifier quoi

| Besoin | Fichier |
|---|---|
| Produits, prix, forces, textes, photos, ruptures (`soldOut`) | `src/data/products.ts` (+ images dans `public/images/products/`) |
| Prix dégressifs de la force Maxi (−10 % dès 10 g, −20 % dès 25 g, prix à négocier dès 100 g) | `src/lib/pricing.ts` : seuils et taux en tête de fichier ; formats, fiches, panier et récapitulatif suivent |
| Remise propre à une référence (Piatella : −10 % dès 25 g seulement) | `src/lib/pricing.ts`, table `BULK_TIERS_BY_SLUG` (clé : le `slug` du produit), et `maxiTiers("PIAT", 800, bulkTiersFor("piatella"))` dans `src/data/products.ts` |
| Prix « dès » des cartes, des titres et de l'accueil | calculé : le prix au gramme le plus bas du produit, celui de son plus grand format (`lowestPerGram` dans `src/data/products.ts`) |
| Vidéos de l'accueil (« Regardez avant de choisir ») | liste `reels` de `src/app/page.tsx` ; boucle de 8 à 9 s dans `public/videos/loops/`, image d'attente du même nom dans `public/images/reels/` ; `own: true` seulement pour une vidéo tournée par CBDoux (pastille « Filmé chez nous », sinon « En vidéo ») |
| Prix d'un produit en force Maxi | `src/data/products.ts` : un seul nombre, le prix du gramme en centimes (`maxiTiers("BELD", 800)` = 8 € le gramme) |
| Taux de THC propre à un produit (« THC 0,1 % max ») | `src/data/products.ts`, champ `thcMax` du produit |
| Vidéo d'un produit | `public/videos/<produit>.mp4` (480 px de large, sans son ni métadonnées) + champ `video` du produit |
| Codes promo | `src/data/promos.ts` |
| Tarifs et modes de livraison, seuil port offert, codes postaux zone locale | `src/lib/shipping.ts` |
| Coordonnées, société, mentions légales (SIRET…), points de retrait, navigation | `src/data/site.ts` |
| FAQ (accueil, livraison, catégories) | `src/data/faq.ts`, `src/data/category-faq.ts` |
| Guides / blog SEO | `src/data/guides.ts` |
| Pages locales (villes) | `src/data/cities.ts` |
| Carte du Haut-Doubs (communes affichées, rayons de livraison) | `scripts/build-carte.py`, puis relancer le script |
| Suggestions du panier pour atteindre le port offert | `src/lib/suggestions.ts` (un gramme en Classique, fleurs et résines) |
| Analyses laboratoire (COA) | `src/data/coa.ts` + `public/images/coa/` |
| Textes légaux (CGV, confidentialité…) | `src/data/legal.ts` |

## Direction artistique

« Noir, or et cadran » (troisième version, 17 novembre 2026, finitions reprises le même jour) : l'ambiance noir et or voulue par Alan, avec la finition de la refonte précédente.

- **Fond noir, métal or.** Le vert de l'enseigne n'est qu'un accent : bandeau du haut, bandeau défilant, cadran de la montre, boutons posés sur papier.
- **Le papier crème est réservé aux objets** : étiquettes produit, cartes postales des distributeurs, certificats d'analyse. Tout le reste (formulaires, textes longs, tableaux, récapitulatifs) vit sur des panneaux sombres liserés d'or (`.panel`).
- **La montre** (`src/components/home/WatchDial.tsx`) : un cadran 12 heures original, signé CBDoux, qui donne l'heure exacte du Haut-Doubs (pays horloger, distributeurs ouverts jour et nuit). Elle n'imite aucune marque existante : rosace de la marque à midi, aiguilles « feuille », guichet de date. Depuis le 17 novembre : un guichet « jour et nuit » (soleil le jour, lune la nuit), la lumière du cadran qui tourne quand la page défile, une légère inclinaison vers le pointeur sur ordinateur, et les aiguilles qui font un tour quand on touche la montre ou qu'on entre sur le site.
- **Le mouvement** : apparitions au défilement, chiffres qui comptent, bandeau défilant, reflets dorés, poussière d'or. Règle absolue : **aucune image n'attend un script pour s'afficher**, et aucun effet de fusion ou de découpe n'est demandé au navigateur (c'est ce qui faisait « buguer » les photos de la version précédente).
- **La vitesse fait partie du dessin.** Les animations permanentes ne font que déplacer ou fondre des éléments (poussière d'or en CSS, reflet du titre, bandeau défilant) : le navigateur n'a rien à recalculer au repos. Le reflet doré des titres de section ne passe qu'une fois, à leur arrivée à l'écran.
- **Vérification d'âge** (`src/components/AgeGate.tsx`) : écrite dans le HTML de chaque page et pilotée par deux petits scripts, elle s'affiche dès la première image, sans attendre le reste du JavaScript. L'ouverture de la page se joue au moment où l'on entre.
- **Fiche produit sur téléphone** : une barre d'achat reste en bas de l'écran (`AddToCart.tsx`). Avant le bloc d'achat, elle donne le prix et y conduit ; après, elle ajoute au panier le choix en cours.
- **La loupe d'horloger** (`src/components/product/ProductMedia.tsx`) : sur la photo d'une fiche produit, une loupe cerclée d'or grossit le détail. À la souris elle suit le pointeur ; au doigt, on touche la photo pour la poser et on la promène en glissant ; au clavier, le bouton la pose et les flèches la déplacent. Elle n'apparaît que si la photo d'origine est assez grande (voir `src/data/photos.json`) : préférez des photos d'au moins 1 000 px de côté.
- **La carte du Haut-Doubs** (`src/components/content/HautDoubsMap.tsx`) : distributeurs, points de retrait et zone de livraison à domicile, dessinés à partir des coordonnées officielles des mairies. Elle figure sur l'accueil, la page livraison, la page distributeurs, « CBD près de chez vous » et chaque page de ville (la commune y est cerclée).
- **Le défilement** : là où le navigateur le permet, les photos des rayons glissent dans leur cadre et les cartes postales se décalent pendant qu'on fait défiler la page (CSS seul, `animation-timeline`). Ailleurs, rien ne bouge et rien ne manque.
- **Le panier** : l'article ajouté s'éclaire un instant ; quand il manque 12 € ou moins pour le port offert, le panier propose un gramme à ajouter d'un geste.
- **Les prix dégressifs** (force Maxi) : la remise se calcule sur le poids total d'une même référence au panier, tous formats additionnés (10 × 1 g ou un sachet de 10 g : même prix). Une référence peut avoir sa propre règle : la Piatella n'a qu'une remise, −10 % à partir de 25 g. Les prix « dès » affichés sur les cartes, dans les titres et sur l'accueil sont les prix au gramme les plus bas (ceux du plus grand format). La fiche produit l'annonce sous les formats, le panier et le récapitulatif WhatsApp l'indiquent ligne par ligne. Le choix « 100 g et plus » remplace l'ajout au panier par une demande de prix sur WhatsApp. Un panier resté dans le navigateur reprend les prix du jour à l'ouverture du site ; un format retiré de la vente en sort.
- **Les finitions** (17 novembre 2026, vocabulaire d'horlogerie, tout est dans `globals.css`) : grain léger sur les fonds sombres (`--grain-dark`), graduation de cadran en haut des sections noires (`.minuterie`, posée d'office sur `main section.nuit`), fleuron entre deux sections de même fond (`<Fleuron />`, variante `motif="losange"` à côté du logo), coins gravés (`.coins`), panneaux à double filet (`.panel`), boutons d'or biseautés, médaillons numérotés pour les vraies étapes (`.steps`, `.step-num`), cadre imprimé et prix en caractères de titre sur les étiquettes produit, bon de bienvenue avec talon détachable et code à copier (`.ticket`, `<CopyCode />`), poinçon de la maison en pied de page (`<Poincon />`), jauge graduée du port offert (`.jauge`), lettrine dorée en tête des guides (`.prose-lettrine`), nombre de références en exposant dans le menu.
- **Les titres de page** suivent la règle des titres de section : la fin de la phrase en italique doré (`<em>` dans le `title` de `<PageHero />`). Ne jamais mettre d'espace insécable dans cet `<em>` : le doré est un dégradé découpé sur le texte, tout ce qui dépasse de la boîte devient invisible.
- **Un décor ne doit jamais faire défiler** : dans un panneau qui défile (vérification d'âge, menu), une gravure en position absolue qui dépasse crée un défilement « dans le vide ». Elle est donc fixée à l'écran (classe `fixed`).
- **L'étiquette produit s'adapte à sa propre largeur** (requêtes de conteneur) : très étroite, l'unité s'abrège (« /g ») ; large, la force et le prix se font face ; entre les deux, ils sont l'un sous l'autre.

| Besoin | Fichier |
|---|---|
| Couleurs, tailles de texte, boutons, panneaux, animations | `src/app/globals.css` (jetons en tête de fichier ; `.paper` = papier crème, `.panel` = panneau sombre, `.nuit` = noir profond, `.ticket` = bon doré) |
| Polices | `src/fonts/` et `src/app/layout.tsx` |
| Montre, jauge des forces | `src/components/home/WatchDial.tsx`, `ForceGauge.tsx` |
| Animations (apparitions, compteurs, barre de lecture) | `src/components/motion/MotionRoot.tsx` : marquer un bloc `data-reveal`, un chiffre `data-count` |
| Fiche produit en forme d'étiquette | `src/components/product/ProductCard.tsx` |
| Photos produit sur papier | `python3 -I scripts/build-etiquettes.py` (à relancer après tout ajout de photo) |
| Carte | `src/components/content/HautDoubsMap.tsx`, données dans `src/data/carte-haut-doubs.json` (générées) |
| Loupe, engagements, partage (fiche produit) | `src/components/product/ProductMedia.tsx`, `Reassurance.tsx`, `ShareButton.tsx` |

Règles de typographie : titres en Fraunces, la seconde moitié de la phrase en italique doré (`<em>`) ; phrases en minuscules, pas de flèche dans les boutons, numéros uniquement pour de vraies étapes. Les espaces insécables françaises sont posées automatiquement sur les textes du catalogue par `fr()` (`src/lib/utils.ts`) et écrites telles quelles dans les pages : avant « ? ! : ; », entre un nombre et son unité (« 18 ans », « 30 km », « 73 microns », « 10 % »), et « 7 jours sur 7 » d'un seul tenant. Tout nom de produit, format ou libellé venu des données s'affiche à travers `fr()` (ou `commas()`, qui l'applique aussi) ; les comparaisons et le message WhatsApp gardent le texte brut.

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

Vocabulaire des distributeurs : « caméra connectée avec haut-parleur intégré », jamais « interphone ». Vérification d'âge 18+, bandeau et pages légales (LCEN, CGV, RGPD, cookies, rétractation), aucune allégation thérapeutique, THC < 0,3 %, conseils de prudence (page + PDF), case de prudence obligatoire pour les forces 3 et Maxi, huiles présentées à usage cutané (interdiction alimentaire du 15 mai 2026), analyses labo publiées.
