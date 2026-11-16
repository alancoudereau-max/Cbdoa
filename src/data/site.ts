/**
 * Configuration centrale du site CBDoux.
 * → Tout ce qui est « à compléter » est signalé par TODO et se retrouve
 *   automatiquement dans les mentions légales, CGV, emails, JSON-LD…
 */

/**
 * Adresse publique du site. Elle est déterminée automatiquement au build dans next.config.ts
 * (domaine principal Netlify / Vercel, ou variable NEXT_PUBLIC_SITE_URL) : ne mettez pas de domaine en dur ici.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const site = {
  name: "CBDoux",
  tagline: "La douceur du Haut-Doubs",
  shortDescription:
    "Boutique CBD premium du Haut-Doubs : fleurs, résines, huiles cutanées et vape. Expédition discrète partout en France en 24/48 h, retrait à Damprichard & Le Russey, distributeurs 24/7.",
  url: SITE_URL,
  locale: "fr_FR",
  lang: "fr",
  email: "contact@smart-vend.fr",
  phoneDisplay: "07 67 98 25 63",
  phoneE164: "+33767982563",
  whatsapp: "https://wa.me/33767982563",
  facebook: "https://www.facebook.com/profile.php?id=61576530651113",
  googleMaps: "https://share.google/beGYu4oykwVRiF67i",
  logo: "/images/brand/logo.png",
  ogImage: "/images/og/og-default.jpg",
  foundingYear: 2026,
  /** Zone principale (SEO local) */
  areaServed: ["Damprichard", "Le Russey", "Charquemont", "Maîche", "Morteau", "Haut-Doubs", "Doubs", "France"],
  /** Délai de réponse / horaires de contact affichés */
  supportHours: "Du lundi au dimanche, 9 h – 21 h (WhatsApp)",
} as const;

/** Société exploitante — informations vérifiées sur la synthèse officielle du Guichet unique des entreprises (création de la société, mars 2026). */
export const company = {
  legalName: "SMART VEND",
  legalForm: "SARL",
  capital: "2 000 €",
  siren: "101 678 175",
  siret: "101 678 175 00015",
  rcs: "RCS Paris 101 678 175",
  /**
   * TVA : la société relève de la franchise en base (confirmé par l'exploitant le 16/11/2026).
   * La mention ci-dessous est celle en vigueur jusqu'au 31/12/2026. Au 01/01/2027, la référence légale
   * passe au code des impositions sur les biens et services (CIBS) ; l'ancienne mention reste admise
   * pendant la période transitoire. Vérifier alors le numéro d'article avant de la remplacer.
   * Si la société devient redevable de la TVA : passer vatExempt à false et renseigner vatNumber
   * (numéro attribué par le service des impôts), puis remettre « TTC » sur les prix.
   */
  vatExempt: true,
  vatMention: "TVA non applicable, article 293 B du CGI",
  vatNumber: "",
  address: {
    street: "50 avenue des Champs-Élysées",
    postalCode: "75008",
    city: "Paris",
    country: "France",
  },
  publicationDirector: "Michaël Lahaine, gérant", // représentant légal inscrit au registre — à mettre à jour en cas de changement de gérance
  /** Médiateur de la consommation (obligatoire pour tout e-commerçant — art. L612-1 C. conso). */
  mediator: {
    name: "[Médiateur de la consommation à compléter — ex. CNPM Médiation Consommation]", // TODO
    url: "[URL du médiateur]", // TODO
    address: "[adresse postale du médiateur]", // TODO
  },
  host: {
    name: "Netlify, Inc.",
    address: "101 2nd Street, San Francisco, CA 94105, États-Unis",
    url: "https://www.netlify.com",
  },
} as const;

/** Points de retrait & distributeurs automatiques */
export const locations = {
  pickupPoints: [
    {
      id: "damprichard",
      name: "Damprichard",
      postalCode: "25450",
      description: "Retrait gratuit sur rendez-vous, confirmé par WhatsApp après votre commande.",
    },
    {
      id: "le-russey",
      name: "Le Russey",
      postalCode: "25210",
      description: "Retrait gratuit sur rendez-vous, confirmé par WhatsApp après votre commande.",
    },
  ],
  vendingMachines: [
    {
      id: "charquemont",
      city: "Charquemont",
      postalCode: "25140",
      place: "Station Lavage Central",
      details:
        "Ancienne cabine téléphonique entièrement rénovée et transformée en distributeur. Produits conservés à 20 °C en sachets de conservation biphase.",
      hours: "24 h/24 — 7 j/7",
      payment: "Carte bancaire",
      image: "/images/brand/distributeur-charquemont.jpg",
      /** Rue communiquée par l'exploitant (le numéro reste à préciser). */
      street: "Rue de la Vierge" as string | undefined,
      /** Recherche Google Maps sur le lieu (pas encore de fiche Google propre à ce distributeur). */
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Station+de+lavage+rue+de+la+Vierge+25140+Charquemont" as string | undefined,
      /** Lien « laisser un avis Google » : à renseigner quand la fiche Google de ce distributeur existera. */
      reviewUrl: undefined as string | undefined,
    },
    {
      id: "le-russey",
      city: "Le Russey",
      postalCode: "25210",
      place: "Hôtel du Commerce — en face de la mairie",
      details:
        "Distributeur installé au cœur du village. Accès simple et discret à toute heure. Produits conservés à 20 °C en sachets de conservation biphase.",
      hours: "24 h/24 — 7 j/7",
      payment: "Carte bancaire",
      image: "/images/brand/distributeur-le-russey.jpg",
      /** Adresse de la fiche Google « PREMIUM CBD DISTRIBUTEUR LE-RUSSEY CBDoux ». */
      street: "15 place Dominique Parrenin" as string | undefined,
      /** Fiche Google du distributeur (itinéraire, avis). */
      mapsUrl: "https://www.google.com/maps?cid=4117224708896034599" as string | undefined,
      /** Lien direct « laisser un avis » sur la fiche Google. */
      reviewUrl: "https://search.google.com/local/writereview?placeid=ChIJV5x9unzxjUcRJ481Cg9SIzk" as string | undefined,
    },
  ],
} as const;

/**
 * Fonctionnement des distributeurs (confirmé par l'exploitant le 16/11/2026) : chaque vente est déverrouillée
 * à distance par un membre de l'équipe, qui voit le client par caméra, lui parle par l'interphone,
 * vérifie sa majorité puis lui communique le code d'achat — de jour comme de nuit.
 */
export const vendingSupervision = {
  title: "Chaque vente validée en direct",
  short: "Caméra et interphone : un membre de l'équipe vérifie votre majorité et vous conseille avant de déverrouiller l'achat, de jour comme de nuit.",
  steps: [
    { title: "Présentez-vous devant la caméra", text: "Le distributeur nous prévient dès que vous êtes là, à toute heure." },
    { title: "Nous vous répondons par l'interphone", text: "Un membre de l'équipe vérifie que vous êtes majeur et répond à vos questions sur les produits." },
    { title: "Recevez votre code", text: "Nous vous communiquons le code qui déverrouille l'achat. Sans code, aucune vente n'est possible." },
    { title: "Payez par carte et récupérez votre sachet", text: "Paiement sans contact ou avec code, produit conservé à 20 °C en sachet hermétique." },
  ],
  support: "Une question ou un souci devant la machine ? Appelez ou écrivez-nous sur WhatsApp : nous répondons 7 j/7.",
} as const;

/** Navigation principale */
export const mainNav = [
  { href: "/boutique", label: "Boutique" },
  { href: "/fleurs-cbd", label: "Fleurs" },
  { href: "/resines-cbd", label: "Résines" },
  { href: "/huiles-cbd", label: "Huiles" },
  { href: "/vape-cbd", label: "Vape" },
  { href: "/livraison", label: "Livraison" },
  { href: "/distributeurs", label: "Distributeurs 24/7" },
  { href: "/guides", label: "Guides" },
] as const;

export const footerNav = {
  boutique: [
    { href: "/boutique", label: "Tout le catalogue" },
    { href: "/fleurs-cbd", label: "Fleurs CBD" },
    { href: "/resines-cbd", label: "Résines CBD" },
    { href: "/huiles-cbd", label: "Huiles CBD cutanées" },
    { href: "/vape-cbd", label: "Vape & pods CBD" },
    { href: "/cbd-puissant", label: "CBD puissant" },
    { href: "/cbd-pas-cher", label: "CBD pas cher" },
    { href: "/nouveautes", label: "Nouveautés" },
  ],
  infos: [
    { href: "/livraison", label: "Livraison & retrait" },
    { href: "/distributeurs", label: "Distributeurs 24/7" },
    { href: "/analyses-laboratoires", label: "Analyses laboratoires" },
    { href: "/conseils-prudence", label: "Conseils & prudence" },
    { href: "/faq", label: "Questions fréquentes" },
  ],
  maison: [
    { href: "/a-propos", label: "À propos de CBDoux" },
    { href: "/guides", label: "Guides & actualités" },
    { href: "/cbd", label: "CBD près de chez vous" },
    { href: "/contact", label: "Contact" },
  ],
  legal: [
    { href: "/mentions-legales", label: "Mentions légales" },
    { href: "/cgv", label: "CGV" },
    { href: "/confidentialite", label: "Confidentialité" },
    { href: "/cookies", label: "Cookies" },
    { href: "/retours", label: "Retours & rétractation" },
  ],
} as const;
