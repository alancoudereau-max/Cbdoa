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
  email: "contact@smart-vend.com",
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

/** Société exploitante (informations communiquées par le gérant — à vérifier sur le Kbis). */
export const company = {
  legalName: "SMART VEND",
  legalForm: "SARL",
  capital: "2 000 €",
  siren: "101 678 175",
  siret: "101 678 175 00015",
  rcs: "RCS Paris 101 678 175",
  vat: "FR92101678175",
  address: {
    street: "50 avenue des Champs-Élysées",
    postalCode: "75008",
    city: "Paris",
    country: "France",
  },
  publicationDirector: "Alan Coudereau, gérant", // TODO : confirmer
  /** Médiateur de la consommation (obligatoire pour tout e-commerçant — art. L612-1 C. conso). */
  mediator: {
    name: "[Médiateur de la consommation à compléter — ex. CNPM Médiation Consommation]", // TODO
    url: "[URL du médiateur]", // TODO
    address: "[adresse postale du médiateur]", // TODO
  },
  host: {
    name: "Vercel Inc.",
    address: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
    url: "https://vercel.com",
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
      mapsUrl: "https://share.google/beGYu4oykwVRiF67i",
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
      mapsUrl: undefined as string | undefined,
    },
  ],
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
