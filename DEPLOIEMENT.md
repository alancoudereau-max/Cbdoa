# Mise en ligne du site CBDoux — guide pas à pas

Le site n'a **ni base de données ni back-office** : les commandes arrivent sur WhatsApp, vous facturez et encaissez avec Shine, vous expédiez. La mise en ligne tient en trois briques :

| Brique | Rôle | État |
|---|---|---|
| **GitHub** — dépôt `alancoudereau-max/Cbdoa` | conserve le code et son historique | ✅ code en ligne (16/11/2026) |
| **Netlify** | héberge le site et le reconstruit à chaque modification du dépôt | à faire (étape 2) |
| **Votre domaine `smart-vend.fr` (OVH)** | l'adresse publique du site | à brancher (étape 3) |

> `cbdoux.fr` est déjà enregistré par un tiers (une autre boutique « CBDoux » l'utilise) : ne l'utilisez nulle part. Le site détecte tout seul son adresse (domaine principal défini dans Netlify) : aucun domaine n'est écrit en dur dans le code.

---

## 1. Relier GitHub à Claude (une seule fois)

Dans Claude : **Paramètres → Connecteurs → GitHub → Connecter**, avec le compte `alancoudereau-max`, en autorisant le dépôt **Cbdoa**. Claude peut alors envoyer le code et, par la suite, faire vos modifications (prix, ruptures, nouveaux produits) : chaque envoi déclenche automatiquement une nouvelle mise en ligne.

> **Laissez le dépôt « Public »** tant que le site est sur l'offre gratuite de Netlify : avec un dépôt privé, cette offre n'accepte que le code envoyé par le titulaire du compte Netlify, ce qui peut bloquer les mises à jour faites par Claude. Le dépôt ne contient ni mot de passe ni donnée client : c'est le même contenu que le site public.

## 2. Héberger sur Netlify (10 min)

1. Sur **app.netlify.com** : *Sign up* → **GitHub** (même compte).
2. **Add new project → Import an existing project → GitHub**. Autorisez Netlify à accéder au dépôt **Cbdoa**, puis sélectionnez-le.
3. Ne changez aucun réglage : le fichier `netlify.toml` du dépôt contient déjà la configuration (commande `npm run build`, dossier `.next`, Node 22). Cliquez **Deploy**.
4. Après 2 à 3 minutes, le déploiement est terminé sur une adresse provisoire `quelque-chose.netlify.app`. **À ce stade le site est privé** : depuis juillet 2026, Netlify protège les nouveaux projets, et vous seul pouvez le voir (connecté à Netlify). Vérifiez-le sur votre téléphone.
5. Cliquez **Make public** pour l'ouvrir à tout le monde (ou *Project configuration → General → Visitor access → Project visibility*).
6. Si un petit badge « Powered by Netlify » apparaît sur le site : *Project configuration → General → Powered by Netlify badge* → désactivez-le.
7. Facultatif : *Project configuration → Change project name* pour obtenir une adresse provisoire plus lisible (ex. `cbdoux.netlify.app`).

## 3. Brancher votre domaine OVH — sans couper vos emails (15 min)

**Important :** ne changez PAS les « serveurs DNS » du domaine chez OVH et ne choisissez pas « Netlify DNS ». Vos emails (dont contact@smart-vend.fr) dépendent de la zone DNS OVH actuelle (enregistrements MX). On modifie seulement deux lignes.

1. **Dans Netlify** : *Domain management → Add a domain* → saisissez `www.smart-vend.fr` → validez. Netlify ajoute aussi le domaine sans `www` et redirigera l'un vers l'autre. Gardez **`www`** comme domaine principal (*Primary domain*) : c'est la configuration recommandée par Netlify avec un DNS externe.
2. **Chez OVH** : *Noms de domaine → smart-vend.fr → onglet Zone DNS*.
   - Ligne **A** du domaine nu (sous-domaine vide) : remplacez la cible par **`75.2.60.5`**. S'il existe une ligne **AAAA** pour le domaine nu, supprimez-la.
   - Sous-domaine **`www`** : supprimez les lignes A / AAAA / TXT existantes pour `www`, puis ajoutez une ligne **CNAME** `www` → **`votre-projet.netlify.app.`** (l'adresse provisoire Netlify, avec un point final).
   - Ne touchez à rien d'autre (MX, SPF, autodiscover…) : vos emails continuent de fonctionner.
   - Netlify affiche les valeurs exactes à côté de chaque domaine (« Awaiting External DNS » → *Check DNS configuration*) : en cas de différence avec ce guide, suivez Netlify.
3. Attendez la propagation (souvent moins d'une heure, parfois jusqu'à 24 h). Dans Netlify, *Domain management → HTTPS* : le certificat se crée automatiquement (bouton *Verify DNS configuration* pour accélérer).
4. **Relancez un déploiement** (*Deploys → Trigger deploy → Deploy project*, ou demandez à Claude) : les adresses canoniques, le sitemap et les aperçus de partage prennent alors votre domaine.

## 4. Tester une commande (5 min)

1. Ajoutez un produit, allez jusqu'à « Finaliser ma commande », remplissez vos coordonnées.
2. **Envoyer ma commande sur WhatsApp** : WhatsApp s'ouvre avec le récapitulatif complet (référence, produits, forces, quantités, prix, livraison souhaitée, adresse, notes). Envoyez-le : vous le recevez au **07 67 98 25 63**.
3. Côté vous : confirmez la disponibilité, créez la facture et le **lien de paiement Shine**, envoyez-les dans la conversation, expédiez après encaissement et renvoyez le numéro de suivi.
4. Vérifiez aussi la page **Contact** et le code promo **BIENVENUE10** (10 € dès 100 €).

## 5. Le jour de la mise en ligne — référencement (20 min)

1. **Google Search Console** (search.google.com/search-console) : *Ajouter une propriété* → votre domaine → méthode « Balise HTML » : copiez le code `content="…"`, ajoutez-le dans Netlify (*Project configuration → Environment variables*) sous le nom `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, relancez un déploiement, puis cliquez « Vérifier ». Ensuite *Sitemaps* → `sitemap.xml` → Envoyer.
2. **Bing Webmaster Tools** (bing.com/webmasters) : « Importer depuis Google Search Console ».
3. **Ancien site** `cbdoux.lovable.app` : demandez à Claude d'y activer la redirection (301) vers le nouveau domaine pour transférer le référencement acquis. Gardez l'ancien projet publié au moins 3 mois.
4. **Fiche Google Business Profile** : mettez la nouvelle adresse du site, ajoutez les photos des deux distributeurs, les horaires 24/7, et demandez des avis clients. C'est le levier n° 1 du référencement local.
5. **Facebook** : remplacez l'adresse du site et annoncez le nouveau site.
6. Dans 7 à 10 jours : dans la Search Console, vérifiez *Pages → indexées* (≈ 85 pages attendues).

## 6. Au quotidien

- **Commandes** : elles arrivent sur WhatsApp avec une référence `CBD-AAMMJJ-XXXX`.
- **Rupture de stock, prix, texte, photo, nouveau produit** : demandez à Claude (« mets la Snow White en rupture »), ou modifiez `src/data/products.ts` (`soldOut: true` pour une rupture) directement sur GitHub. Netlify remet le site en ligne tout seul en 2 à 3 minutes.
- **Tarifs de livraison** : `src/lib/shipping.ts`. **Codes promo** : `src/data/promos.ts`. **Coordonnées et société** : `src/data/site.ts`.
- **Budget Netlify** : l'offre gratuite fonctionne avec des crédits mensuels (300 par mois en novembre 2026 ; une mise en ligne en consomme 15, le trafic un peu). Regroupez donc vos modifications plutôt que de les envoyer une par une ; si les crédits sont épuisés, le site est mis en pause jusqu'au mois suivant. L'offre « Personal » (9 $/mois) donne plus de marge quand le trafic grandit.
- **TVA** : les prix sont affichés sans mention de TVA tant que le régime de la société n'est pas confirmé. Si elle est en franchise en base, il faut ajouter « TVA non applicable, art. 293 B du CGI » à l'article 4 des CGV (`src/data/legal.ts`) : demandez-le à Claude.
- **Statistiques de visite** : le site n'embarque aucun outil de mesure d'audience ; la Google Search Console (étape 5) suffit pour suivre le référencement.
- **Médiateur de la consommation** (obligatoire) : dès votre adhésion (CNPM, Medicys, CM2C…), transmettez son nom : il est repris automatiquement dans les CGV et les mentions légales.

## 7. Sécurité & sauvegarde

- Aucune donnée client n'est stockée sur le site : le panier reste sur le téléphone du client, la commande vit dans WhatsApp et dans votre facturation.
- Le code est sauvegardé sur GitHub avec tout son historique (y compris l'ancienne version avec paiement en ligne, si vous souhaitez y revenir un jour).
- Aucune clé ni mot de passe dans le dépôt.
