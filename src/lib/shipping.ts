/**
 * Livraison : modes, tarifs et règles.
 * Tous les montants sont en centimes d'euro (prix payé par le client). Modifiez ce fichier pour changer les tarifs.
 */

export type ShippingMethodId = "lettre-suivie" | "colissimo" | "chronopost" | "livraison-locale" | "retrait";

export type ShippingMethod = {
  id: ShippingMethodId;
  name: string;
  description: string;
  delay: string;
  priceCents: number;
  /** Port offert à partir de ce sous-total (centimes). `null` = jamais offert. */
  freeFromCents: number | null;
  /** Poids total maximal (g) accepté par ce mode. `null` = illimité. */
  maxGrams: number | null;
  /** Nécessite une adresse postale */
  requiresAddress: boolean;
  /** Réservé à la zone locale (codes postaux ci-dessous) */
  localOnly?: boolean;
  /** Paiement sur place possible (retrait) */
  allowPayOnPickup?: boolean;
  carrier?: string;
  trackingUrl?: (n: string) => string;
};

/** Seuil national de port offert (Colissimo) */
export const FREE_SHIPPING_FROM_CENTS = 6000; // 60 €
/** Seuil local de livraison à domicile offerte */
export const LOCAL_FREE_FROM_CENTS = 10000; // 100 €

/** Poids d'emballage ajouté à chaque commande (sachet, enveloppe matelassée…) */
export const PACKAGING_GRAMS = 25;

export const shippingMethods: ShippingMethod[] = [
  {
    id: "lettre-suivie",
    name: "Lettre suivie La Poste",
    description: "Idéal pour les petites quantités (≤ 50 g). Dans votre boîte aux lettres, avec numéro de suivi.",
    delay: "2 à 4 jours ouvrés",
    priceCents: 390,
    freeFromCents: FREE_SHIPPING_FROM_CENTS,
    maxGrams: 50,
    requiresAddress: true,
    carrier: "La Poste",
    trackingUrl: (n) => `https://www.laposte.fr/outils/suivre-vos-envois?code=${encodeURIComponent(n)}`,
  },
  {
    id: "colissimo",
    name: "Colissimo domicile",
    description: "Livraison suivie à domicile, emballage neutre et hermétique. Offert dès 60 € d'achat.",
    delay: "48 h ouvrées",
    priceCents: 590,
    freeFromCents: FREE_SHIPPING_FROM_CENTS,
    maxGrams: null,
    requiresAddress: true,
    carrier: "Colissimo",
    trackingUrl: (n) => `https://www.laposte.fr/outils/suivre-vos-envois?code=${encodeURIComponent(n)}`,
  },
  {
    id: "chronopost",
    name: "Chronopost Express",
    description: "Commandez avant 13 h, livré le lendemain (jours ouvrés). Remise contre signature.",
    delay: "24 h",
    priceCents: 1290,
    freeFromCents: null,
    maxGrams: null,
    requiresAddress: true,
    carrier: "Chronopost",
    trackingUrl: (n) => `https://www.chronopost.fr/tracking-no-cms/suivi-page?listeNumerosLT=${encodeURIComponent(n)}`,
  },
  {
    id: "livraison-locale",
    name: "Livraison à domicile (zone locale)",
    description: "Par nos soins, dans un rayon de 30 km autour du Russey et 10 km autour de Damprichard. Offerte dès 100 €.",
    delay: "24 à 48 h, créneau convenu par WhatsApp",
    priceCents: 1000,
    freeFromCents: LOCAL_FREE_FROM_CENTS,
    maxGrams: null,
    requiresAddress: true,
    localOnly: true,
  },
  {
    id: "retrait",
    name: "Retrait gratuit",
    description: "À Damprichard ou au Russey, sur rendez-vous confirmé par WhatsApp. Paiement par lien sécurisé ou sur place.",
    delay: "Dès le lendemain",
    priceCents: 0,
    freeFromCents: 0,
    maxGrams: null,
    requiresAddress: false,
    allowPayOnPickup: true,
  },
];

/**
 * Codes postaux éligibles à la livraison locale par nos soins
 * (≈ 30 km autour du Russey, 10 km autour de Damprichard). À ajuster librement.
 */
export const LOCAL_POSTAL_CODES = new Set<string>([
  "25120", // Maîche, Charmauvillers, Thiébouhans…
  "25130", // Villers-le-Lac
  "25140", // Charquemont, Frambouhans, Les Écorces, Fournet-Blancheroche
  "25190", // Saint-Hippolyte (partiel)
  "25210", // Le Russey, Bonnétage, Les Fontenelles, Le Bélieu, Narbief…
  "25380", // Belleherbe, Vauclusotte
  "25390", // Orchamps-Vennes, Fuans, Loray
  "25450", // Damprichard
  "25470", // Trévillers, Indevillers, Goumois
  "25500", // Morteau, Les Fins, Montlebon, Grand'Combe-Châteleu
  "25510", // Pierrefontaine-les-Varans
  "25570", // Grand'Combe-Châteleu
]);

export function isLocalPostalCode(postalCode: string | undefined | null): boolean {
  if (!postalCode) return false;
  return LOCAL_POSTAL_CODES.has(postalCode.trim());
}

export type CartLineForShipping = { grams: number; quantity: number };

export function totalGrams(lines: CartLineForShipping[]): number {
  return lines.reduce((s, l) => s + l.grams * l.quantity, 0) + PACKAGING_GRAMS;
}

/** Modes disponibles pour un panier donné + prix calculé */
export function availableShippingMethods(opts: {
  subtotalCents: number;
  lines: CartLineForShipping[];
  postalCode?: string | null;
}): Array<ShippingMethod & { computedPriceCents: number; free: boolean }> {
  const grams = totalGrams(opts.lines);
  return shippingMethods
    .filter((m) => (m.maxGrams === null ? true : grams <= m.maxGrams))
    .filter((m) => (m.localOnly ? isLocalPostalCode(opts.postalCode) : true))
    .map((m) => {
      const free = m.freeFromCents !== null && opts.subtotalCents >= m.freeFromCents;
      return { ...m, computedPriceCents: free ? 0 : m.priceCents, free };
    });
}

export function getShippingMethod(id: string): ShippingMethod | undefined {
  return shippingMethods.find((m) => m.id === id);
}

export function shippingPriceFor(method: ShippingMethod, subtotalCents: number): number {
  if (method.freeFromCents !== null && subtotalCents >= method.freeFromCents) return 0;
  return method.priceCents;
}
