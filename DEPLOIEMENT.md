# Mise en ligne de cbdoux.fr — guide pas à pas

Temps estimé : **1 h 30 à 2 h** (hors délais de validation Mollie). Tout se fait depuis un navigateur. Chaque étape indique ce qu'il faut récupérer et où le coller.

> **Coûts mensuels prévisionnels** : Vercel Pro ≈ 20 $/mois (obligatoire pour un usage commercial ; alternative gratuite : Netlify) · Supabase gratuit · Resend gratuit (3 000 emails/mois) · Mollie : 0 € d'abonnement, commission par transaction (≈ 1,8 % + 0,25 € pour les cartes européennes) · domaine ≈ 10 €/an.

---

## 0. Récapitulatif des variables à renseigner

| Variable | Où la trouver |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://cbdoux.fr` (votre domaine final) |
| `SUPABASE_URL` | Supabase → Project Settings → API → *Project URL* |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → *service_role* (secret !) |
| `MOLLIE_API_KEY` | Mollie → Développeurs → Clés API (`test_…` puis `live_…`) |
| `RESEND_API_KEY` | Resend → API Keys |
| `EMAIL_FROM` | `CBDoux <commandes@cbdoux.fr>` (domaine vérifié dans Resend) |
| `MERCHANT_EMAIL` | `contact@smart-vend.com` (reçoit les commandes et messages) |
| `ADMIN_PASSWORD` | mot de passe long de votre choix (≥ 16 caractères) |
| `ADMIN_SESSION_SECRET` | chaîne aléatoire de 64 caractères (ex. générée sur https://1password.com/password-generator) |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console (facultatif) |

---

## 1. Le nom de domaine `cbdoux.fr`

1. Vérifiez la disponibilité et achetez-le chez un registrar français : **OVHcloud** (ovhcloud.com), **Gandi** (gandi.net) ou **Ionos**. Prenez `cbdoux.fr` (et, si possible, `cbdoux.com` pour le protéger).
2. Ne configurez rien d'autre pour l'instant : les enregistrements DNS seront donnés par Vercel à l'étape 5.

## 2. La base de données — Supabase (gratuit)

1. Créez un compte sur https://supabase.com → **New project** : nom `cbdoux`, région **EU (Frankfurt ou Paris)**, mot de passe base de données fort (notez-le).
2. Menu **SQL Editor** → **New query** → collez tout le contenu de `supabase/schema.sql` → **Run**. Les tables `orders`, `order_items`, `stock`, `promo_codes`, `contact_messages`, `webhook_events` sont créées et le code `BIENVENUE10` inséré.
3. **Project Settings → API** : copiez *Project URL* → `SUPABASE_URL` et la clé **service_role** → `SUPABASE_SERVICE_ROLE_KEY`. Cette clé est secrète : jamais dans le code, uniquement dans les variables Vercel.

## 3. Le paiement — Mollie

1. Créez un compte sur https://www.mollie.com/fr → renseignez la société (SARL SMART VEND, SIREN 101 678 175), le gérant, l'IBAN de la société.
2. **Site web** : indiquez `https://cbdoux.fr`. Mollie vérifie le site : il doit être en ligne avec CGV, mentions légales, vérification d'âge et analyses — tout est déjà prévu. Déployez donc le site (étape 5) **avant** d'envoyer le dossier à la validation.
3. **Dossier CBD** : Mollie peut demander le Kbis, les certificats d'analyse (page `/analyses-laboratoires`), les factures fournisseurs. Précisez : fleurs/résines de chanvre THC < 0,3 %, huiles cosmétiques, pas de cannabinoïdes de synthèse, pas d'allégations thérapeutiques.
4. **Développeurs → Clés API** : utilisez d'abord la clé `test_…` dans `MOLLIE_API_KEY` pour tester une commande (cartes de test Mollie), puis remplacez par la clé `live_…` une fois le compte validé.
5. **Paramètres → Moyens de paiement** : activez *Cartes* (CB/Visa/Mastercard), *Apple Pay*, *Google Pay*, et si vous le souhaitez *Bancontact* et *Virement bancaire*.
6. Rien à configurer pour les webhooks : l'URL `https://cbdoux.fr/api/webhooks/mollie` est transmise automatiquement à chaque paiement.

## 4. Les emails — Resend

1. Compte sur https://resend.com → **Domains → Add domain** : `cbdoux.fr`. Resend affiche 3 enregistrements DNS (DKIM, SPF/MX) à ajouter chez votre registrar → **Verify**.
2. **API Keys → Create** : copiez la clé → `RESEND_API_KEY`.
3. `EMAIL_FROM` = `CBDoux <commandes@cbdoux.fr>`. Les réponses des clients arrivent sur `MERCHANT_EMAIL` (contact@smart-vend.com).

## 5. L'hébergement — Vercel

1. Mettez le code sur GitHub : créez un compte https://github.com → **New repository** `cbdoux-site` (privé) → importez le dossier (ou déposez le .zip décompressé via *uploading an existing file*). Si vous préférez, Claude peut pousser le code pour vous une fois le dépôt créé.
2. Compte sur https://vercel.com (connexion avec GitHub) → **Add New → Project** → importez `cbdoux-site`. Framework détecté : Next.js. Avant de cliquer sur Deploy, ouvrez **Environment Variables** et collez toutes les variables du tableau §0.
3. **Deploy** (≈ 2 minutes). Vous obtenez une URL `https://cbdoux-site.vercel.app` pour vérifier le site.
4. **Settings → Domains → Add** : `cbdoux.fr` et `www.cbdoux.fr`. Vercel affiche les enregistrements DNS exacts à créer chez le registrar (un enregistrement **A** pour `cbdoux.fr` et un **CNAME** pour `www`) : copiez-les tels quels dans la zone DNS du domaine. Propagation : de quelques minutes à quelques heures. HTTPS est automatique.
5. **Settings → General → Plan** : passez en **Pro** (usage commercial requis par les conditions Vercel).
6. Vérifiez `NEXT_PUBLIC_SITE_URL=https://cbdoux.fr` puis **Redeploy** pour que les liens canoniques, le sitemap et les emails utilisent le bon domaine.

## 6. Test de bout en bout (avec la clé Mollie `test_`)

1. Ouvrez le site, ajoutez un produit, allez jusqu'au paiement : vous êtes redirigé vers la page Mollie de test → choisissez « Paid ».
2. Vous devez recevoir l'email de confirmation (client) et la notification (marchand) ; la commande apparaît dans `/admin/commandes` avec le statut **Payée**.
3. Dans l'admin, passez-la en **Expédiée** avec un numéro de suivi : le client reçoit l'email de suivi.
4. Testez aussi « Retrait gratuit » avec « Payer sur place ».
5. Puis remplacez `MOLLIE_API_KEY` par la clé `live_…` (Vercel → Environment Variables → Redeploy).

## 7. Référencement — les 7 actions du jour J

1. **Google Search Console** (search.google.com/search-console) : ajoutez `cbdoux.fr`, vérifiez via la balise HTML (collez le code dans `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` puis redeploy), soumettez `https://cbdoux.fr/sitemap.xml`.
2. **Bing Webmaster Tools** : importez depuis la Search Console en un clic.
3. **Redirection de l'ancien site** `cbdoux.lovable.app` → `cbdoux.fr` : demandez à Claude de l'activer dans le projet Lovable (redirection 301 de toutes les anciennes URLs vers les nouvelles) afin de transférer le référencement acquis. Ne supprimez pas l'ancien projet avant 3 mois.
4. **Fiche Google Business Profile** (business.google.com) : mettez à jour le site web vers cbdoux.fr, ajoutez les deux distributeurs (Charquemont, Le Russey) comme établissements, publiez des photos et demandez des avis clients (lien direct dans la fiche). C'est le levier n° 1 du SEO local.
5. **Facebook** : remplacez le lien du site par cbdoux.fr dans la page.
6. **Mollie / Resend / Supabase** : vérifiez que tout est en mode production.
7. Dans 7 jours : contrôlez dans la Search Console que les 90 pages sont indexées et corrigez les éventuelles erreurs.

## 8. Au quotidien

- **Commandes** : `/admin/commandes` — statut, numéro de suivi (l'email part automatiquement), notes client. Vous recevez aussi un email à chaque commande.
- **Ruptures de stock** : `/admin/stock` — désactivez une variante ou un produit entier en un clic (visible immédiatement sur le site).
- **Codes promo** : `/admin/codes-promo` — montant ou pourcentage, minimum d'achat, date de fin, nombre d'utilisations.
- **Messages du formulaire** : `/admin/messages` (et par email).
- **Expédition** : achetez vos étiquettes sur La Poste Pro / Colissimo (ou Boxtal pour comparer Colissimo, Chronopost, Mondial Relay), collez le numéro de suivi dans l'admin.
- **Modifier un prix ou un texte** : fichier `src/data/products.ts` (ou demandez à Claude), puis push GitHub → Vercel redéploie automatiquement.

## 9. Sécurité et sauvegardes

- Les clés (`service_role`, Mollie `live`, Resend, mot de passe admin) ne sont **jamais** dans le code : uniquement dans Vercel → Environment Variables.
- Supabase sauvegarde quotidiennement (plan Pro) ; sur le plan gratuit, exportez de temps en temps la table `orders` (Table Editor → Export CSV).
- Changez `ADMIN_PASSWORD` si vous soupçonnez une fuite ; les sessions admin expirent au bout de 12 h.
- Mettez à jour les dépendances tous les 2-3 mois (`npm update`) ou demandez à Claude.
