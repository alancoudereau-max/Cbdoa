/**
 * Prix dégressifs de la force Maxi (fleurs et résines).
 *
 * La remise se calcule sur le poids total d'une même référence au panier, tous formats additionnés.
 * Règle générale : dès 10 g, 10 % de moins ; dès 25 g, 20 % de moins. Une référence peut avoir sa propre
 * règle (table BULK_TIERS_BY_SLUG : la Piatella n'a qu'un palier, −10 % dès 25 g).
 * À partir de 100 g, le prix se négocie (WhatsApp). Deux références différentes ne s'additionnent pas.
 *
 * Pour changer un seuil ou un taux, modifiez BULK_TIERS, BULK_TIERS_BY_SLUG ou QUOTE_FROM_GRAMS : les formats
 * 10 g et 25 g du catalogue, les prix « dès », les fiches produit, le panier et le récapitulatif WhatsApp
 * se recalculent tous seuls. Les montants sont en centimes d'euro.
 */

export type BulkTier = { fromGrams: number; percent: number };
export type BulkTiers = ReadonlyArray<BulkTier>;

/** Règle générale de la force Maxi. */
export const BULK_TIERS: BulkTiers = [
  { fromGrams: 10, percent: 10 },
  { fromGrams: 25, percent: 20 },
];

/** Références qui ont leur propre règle (clé : le `slug` du produit). Toutes les autres suivent BULK_TIERS. */
const BULK_TIERS_BY_SLUG: Readonly<Record<string, BulkTiers>> = {
  piatella: [{ fromGrams: 25, percent: 10 }],
};

/** Paliers de remise d'une référence. */
export function bulkTiersFor(slug: string): BulkTiers {
  return BULK_TIERS_BY_SLUG[slug] ?? BULK_TIERS;
}

/** Formats vendus en force Maxi, en grammes. Au-delà du plus grand, le client additionne les sachets. */
export const BULK_PACKS: ReadonlyArray<number> = [1, 10, 25];

/** Poids d'une même référence à partir duquel le prix se négocie. */
export const QUOTE_FROM_GRAMS = 100;

/** Remise (en %) pour un poids total donné d'une même référence : celle du plus haut palier atteint. */
export function bulkPercent(grams: number, tiers: BulkTiers = BULK_TIERS): number {
  return tiers.reduce((best, t) => (grams >= t.fromGrams && t.percent > best ? t.percent : best), 0);
}

/** Prix de `grams` grammes au prix de base `perGramCents`, une fois la remise `percent` appliquée. */
export function bulkPriceCents(perGramCents: number, grams: number, percent: number): number {
  return Math.round((perGramCents * grams * (100 - percent)) / 100);
}

/** La règle en une phrase, pour les fiches et le panier : « −10 % dès 10 g, −20 % dès 25 g ». */
export function bulkRuleText(tiers: BulkTiers = BULK_TIERS): string {
  return [...tiers]
    .sort((a, b) => a.fromGrams - b.fromGrams)
    .map((t) => `−${t.percent} % dès ${t.fromGrams} g`)
    .join(", ");
}

/** Message WhatsApp d'une demande de prix à partir du seuil où il se négocie. */
export function quoteMessage(productName: string, tierLabel: string): string {
  return `Bonjour CBDoux, je souhaite un prix pour ${QUOTE_FROM_GRAMS} g ou plus de ${productName.replace(/\s+[—–-]\s+/g, " ")} (${tierLabel}).`;
}

/** Ce qu'il faut connaître d'une ligne de panier pour en calculer le prix. */
export type Priceable = {
  slug: string;
  grams: number;
  quantity: number;
  /** Prix catalogue du format (centimes) */
  unitPriceCents: number;
  /** Prix de base au gramme : présent seulement sur les références au tarif dégressif */
  perGramCents?: number;
};

export type Priced<T> = T & {
  /** Prix payé pour une unité de ce format, remise dégressive comprise */
  unitCents: number;
  totalCents: number;
  /** Remise dégressive appliquée à cette ligne (0 s'il n'y en a pas) */
  bulkPercent: number;
};

export type PricedCart<T> = {
  lines: Priced<T>[];
  subtotalCents: number;
  /** Références dont le poids total atteint le seuil où le prix se négocie */
  quotes: Array<{ slug: string; grams: number }>;
};

/**
 * Calcule le prix de chaque ligne du panier. Les lignes d'une même référence au tarif dégressif sont
 * additionnées (1 g × 4 + 10 g = 14 g, donc −10 % sur les deux lignes) et reçoivent la remise prévue pour
 * cette référence ; les autres gardent leur prix catalogue.
 */
export function priceCart<T extends Priceable>(lines: T[]): PricedCart<T> {
  const gramsBySlug = new Map<string, number>();
  for (const l of lines) {
    if (l.perGramCents) gramsBySlug.set(l.slug, (gramsBySlug.get(l.slug) ?? 0) + l.grams * l.quantity);
  }
  const priced = lines.map((l) => {
    const percent = l.perGramCents ? bulkPercent(gramsBySlug.get(l.slug) ?? 0, bulkTiersFor(l.slug)) : 0;
    // Jamais plus cher que le prix catalogue du format (un sachet de 25 g porte déjà sa remise).
    const unitCents = l.perGramCents ? Math.min(l.unitPriceCents, bulkPriceCents(l.perGramCents, l.grams, percent)) : l.unitPriceCents;
    return { ...l, unitCents, totalCents: unitCents * l.quantity, bulkPercent: percent };
  });
  return {
    lines: priced,
    subtotalCents: priced.reduce((s, l) => s + l.totalCents, 0),
    quotes: [...gramsBySlug].filter(([, grams]) => grams >= QUOTE_FROM_GRAMS).map(([slug, grams]) => ({ slug, grams })),
  };
}
