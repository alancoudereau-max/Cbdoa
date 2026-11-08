# Mise en ligne de cbdoux.fr — guide pas à pas

Le site n'a **aucun back-office ni base de données** : les commandes arrivent sur votre WhatsApp, vous facturez et encaissez avec Shine, vous expédiez. Il n'y a donc que **deux choses à mettre en place** : le nom de domaine et l'hébergement. Temps estimé : **45 minutes**.

> **Coûts** : domaine ≈ 10 €/an · hébergement Vercel : plan Pro 20 $/mois (les conditions Vercel imposent le plan Pro pour un site commercial) **ou** Netlify gratuit (usage commercial autorisé sur le plan Starter). Tout le reste est gratuit.

---

## 1. Acheter le nom de domaine `cbdoux.fr`

1. Rendez-vous chez un registrar français : **OVHcloud** (ovhcloud.com), **Gandi** (gandi.net) ou **Ionos**.
2. Recherchez `cbdoux.fr` → ajoutez-le au panier (≈ 8-12 €/an). Si le budget le permet, prenez aussi `cbdoux.com` pour protéger la marque.
3. Créez votre compte avec les coordonnées de la SARL SMART VEND et validez. Ne touchez pas encore aux DNS : l'hébergeur vous donnera les valeurs exactes à l'étape 3.

## 2. Mettre le code sur GitHub (5 min)

1. Créez un compte gratuit sur https://github.com.
2. En haut à droite : **+ → New repository** → nom `cbdoux-site`, visibilité **Private** → **Create repository**.
3. Sur la page du dépôt vide, cliquez sur **uploading an existing file**, glissez-déposez le contenu du dossier `cbdoux-site` (décompressé depuis le .zip, **sans** le dossier `node_modules` s'il existe) → **Commit changes**.
   - Alternative : envoyez-moi le nom du dépôt (`votre-identifiant/cbdoux-site`) et je pousse le code pour vous.

## 3. Héberger sur Vercel (10 min)

1. Créez un compte sur https://vercel.com en choisissant **Continue with GitHub**.
2. **Add New → Project** → importez `cbdoux-site`. Vercel détecte Next.js automatiquement.
3. Ouvrez **Environment Variables** et ajoutez :
   - `NEXT_PUBLIC_SITE_URL` = `https://cbdoux.fr`
4. **Deploy** (≈ 2 minutes). Le site est en ligne sur une adresse provisoire `https://cbdoux-site-xxx.vercel.app` : vérifiez-le sur votre téléphone.
5. **Settings → Domains → Add** : saisissez `cbdoux.fr`, puis `www.cbdoux.fr`. Vercel affiche les enregistrements DNS à créer (un **A** pour `cbdoux.fr`, un **CNAME** pour `www`).
6. Chez votre registrar : **Zone DNS** → ajoutez exactement ces deux enregistrements (supprimez d'éventuels enregistrements A / CNAME existants sur les mêmes noms). La propagation prend de quelques minutes à quelques heures ; le certificat HTTPS est automatique.
7. **Settings → General → Plan** : passez le projet en **Pro** (usage commercial).

> **Variante gratuite — Netlify** : sur https://netlify.com, « Add new site → Import from Git → GitHub → cbdoux-site ». Netlify détecte Next.js. Ajoutez la variable `NEXT_PUBLIC_SITE_URL` dans *Site configuration → Environment variables*, puis *Domain management → Add a domain* pour `cbdoux.fr`.

## 4. Tester une commande (5 min)

1. Sur le site en ligne : ajoutez un produit, allez jusqu'à « Finaliser ma commande », remplissez vos coordonnées.
2. **Envoyer ma commande sur WhatsApp** : WhatsApp s'ouvre avec le récapitulatif complet (produits, forces, quantités, prix, livraison souhaitée, adresse, notes). Envoyez-le : vous le recevez sur le **07 67 98 25 63**.
3. Côté vous : confirmez la disponibilité au client, créez la facture + le **lien de paiement Shine** depuis l'app Shine et envoyez-le dans la conversation. Expédiez après encaissement et renvoyez le numéro de suivi dans la même conversation.
4. Vérifiez aussi la page **Contact** (boutons WhatsApp / email) et le code promo **BIENVENUE10** dans le panier (10 € dès 100 €).

## 5. Le jour de la mise en ligne — référencement (20 min)

1. **Google Search Console** (search.google.com/search-console) : *Ajouter une propriété* → `cbdoux.fr` → méthode « Balise HTML » : copiez le code `content="…"`, collez-le dans Vercel → Environment Variables → `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, puis **Redeploy** et cliquez « Vérifier ». Ensuite *Sitemaps* → saisissez `sitemap.xml` → Envoyer.
2. **Bing Webmaster Tools** (bing.com/webmasters) : « Importer depuis Google Search Console » en un clic.
3. **Redirection de l'ancien site** `cbdoux.lovable.app` → `cbdoux.fr` : demandez-moi de l'activer dans votre projet Lovable (redirection 301 de toutes les anciennes pages vers les nouvelles) pour transférer le référencement acquis. Gardez l'ancien projet publié au moins 3 mois.
4. **Fiche Google Business Profile** (business.google.com) : mettez `cbdoux.fr` comme site web, ajoutez les photos des deux distributeurs, publiez les horaires 24/7 et demandez des avis à vos clients (lien « Laisser un avis »). C'est le levier n° 1 du référencement local.
5. **Facebook** : remplacez l'adresse du site par `cbdoux.fr` et publiez l'annonce du nouveau site.
6. Dans 7 à 10 jours : dans la Search Console, vérifiez *Pages → indexées* (≈ 85 pages attendues).

## 6. Au quotidien

- **Commandes** : elles arrivent sur WhatsApp avec une référence `CBD-AAMMJJ-XXXX`. Répondez dans la conversation : disponibilité, facture + lien Shine, puis numéro de suivi.
- **Rupture de stock** : demandez-moi (« mets la Snow White en rupture ») ou ajoutez `soldOut: true` au produit ou à la variante dans `src/data/products.ts`, puis enregistrez sur GitHub : Vercel redéploie automatiquement en 2 minutes.
- **Changer un prix, un texte, une photo, ajouter un produit** : même principe (fichier `src/data/products.ts`, photos dans `public/images/products/`). Je peux faire ces modifications pour vous à la demande.
- **Tarifs de livraison** : `src/lib/shipping.ts` (port offert dès 60 €, Chronopost 12,90 €, zone locale…).
- **Codes promo** : `src/data/promos.ts`.
- **Médiateur de la consommation** (obligatoire) : dès que vous avez adhéré à un médiateur (ex. CNPM, Medicys, CM2C — ≈ 50 à 100 €/an), indiquez-moi son nom pour que je le renseigne dans `src/data/site.ts` (CGV et mentions légales se mettent à jour automatiquement).

## 7. Sécurité & sauvegarde

- Aucune donnée client n'est stockée sur le site : le panier reste sur le téléphone du client, la commande vit dans WhatsApp et dans votre facturation Shine. Rien à sauvegarder côté site.
- Le code est sauvegardé sur GitHub (historique complet). Vercel/Netlify redéploient à chaque modification.
- Mettez à jour les dépendances tous les 2-3 mois (`npm update`) ou demandez-moi.
