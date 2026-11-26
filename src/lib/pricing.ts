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
 *
 * Références « Sur commande » : même principe, mais chaque référence a ses trois prix au gramme (prix de base,
 * dès 100 g, dès 500 g) dans src/data/tarifs-sur-commande.ts. Elles se commandent à partir de 25 g (ON_ORDER_PACKS) ;
 * à partir de 1 kg, le prix se fixe sur demande.
 */
import { ON_ORDER_RATES } from "@/data/tarifs-sur-commande";
import { ON_ORDER_ITEMS } from "@/data/tarifs-articles";

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

// ───────────────────────────── Sur commande ─────────────────────────────

/** Formats vendus sur commande, en grammes. Le plus petit est la commande minimale par référence. */
export const ON_ORDER_PACKS: ReadonlyArray<number> = [25, 100, 500];
/** Commande minimale d'une référence sur commande, en grammes. */
export const ON_ORDER_MIN_GRAMS = ON_ORDER_PACKS[0];
/** Poids d'une même référence qui ouvrent les deux paliers de prix sur commande. */
export const ON_ORDER_STEPS: readonly [number, number] = [100, 500];
/** Poids d'une même référence sur commande à partir duquel le prix se fixe sur demande. */
export const ON_ORDER_QUOTE_FROM_GRAMS = 1000;
/** Délai de livraison annoncé pour une référence sur commande (fiches, panier, commande, récapitulatif WhatsApp). */
export const ON_ORDER_DELAY = "1 semaine";

/** Vrai si la référence se vend sur commande (au poids ou à la pièce). */
export function isOnOrder(slug: string): boolean {
  return Object.hasOwn(ON_ORDER_RATES, slug) || Object.hasOwn(ON_ORDER_ITEMS, slug);
}

/** Identifiant d'un format d'article sur commande vendu à la pièce : « SC-raw-grinder-P0 ». */
export function onOrderItemSku(slug: string, index: number): string {
  return `SC-${slug}-P${index}`;
}

/** Les trois prix au gramme d'une référence sur commande (centimes) : prix de base, dès 100 g, dès 500 g. */
export function onOrderRates(slug: string): readonly [number, number, number] | undefined {
  return isOnOrder(slug) ? ON_ORDER_RATES[slug] : undefined;
}

/** Prix au gramme d'une référence sur commande pour un poids total donné ; `undefined` pour toute autre référence. */
export function onOrderRate(slug: string, totalGrams: number): number | undefined {
  const r = onOrderRates(slug);
  if (!r) return undefined;
  return totalGrams >= ON_ORDER_STEPS[1] ? r[2] : totalGrams >= ON_ORDER_STEPS[0] ? r[1] : r[0];
}

/** Identifiant d'un format sur commande : « SC-ketama-100G ». Il se relit avec `onOrderEntry`. */
export function onOrderSku(slug: string, grams: number): string {
  return `SC-${slug}-${grams}G`;
}

/** Prix du jour d'un format sur commande d'après son identifiant : [prix du format, prix de base au gramme]. */
export function onOrderEntry(sku: string): [number, number] | undefined {
  const item = /^SC-(.+)-P(\d+)$/.exec(sku);
  if (item) {
    const format = Object.hasOwn(ON_ORDER_ITEMS, item[1]) ? ON_ORDER_ITEMS[item[1]][Number(item[2])] : undefined;
    return format ? [format[1], 0] : undefined;
  }
  const m = /^SC-(.+)-(\d+)G$/.exec(sku);
  const grams = m ? Number(m[2]) : 0;
  const rate = m ? onOrderRate(m[1], grams) : undefined;
  if (!m || rate === undefined || !ON_ORDER_PACKS.includes(grams)) return undefined;
  return [rate * grams, ON_ORDER_RATES[m[1]][0]];
}

// ───────────────────────────── Règles communes ─────────────────────────────

/** « 100 g », « 1 kg » : un poids tel qu'on l'écrit. */
export function gramsLabel(grams: number): string {
  return grams >= 1000 && grams % 100 === 0 ? `${String(grams / 1000).replace(".", ",")} kg` : `${grams} g`;
}

/** Poids d'une même référence à partir duquel le prix se négocie : 100 g en force Maxi, 1 kg sur commande. */
export function quoteFromGrams(slug: string): number {
  return isOnOrder(slug) ? ON_ORDER_QUOTE_FROM_GRAMS : QUOTE_FROM_GRAMS;
}

/**
 * Prix payé pour un format de `grams` grammes quand le panier contient `totalGrams` grammes de la référence,
 * et la remise (en %) que cela représente sur le prix de base au gramme.
 */
export function tierPrice(slug: string, perGramCents: number, grams: number, totalGrams: number): { unitCents: number; percent: number } {
  const rate = onOrderRate(slug, totalGrams);
  if (rate !== undefined) return { unitCents: rate * grams, percent: Math.round((1 - rate / ON_ORDER_RATES[slug][0]) * 100) };
  const percent = bulkPercent(totalGrams, bulkTiersFor(slug));
  return { unitCents: bulkPriceCents(perGramCents, grams, percent), percent };
}

/** Message WhatsApp d'une demande de prix à partir du seuil où il se négocie. */
export function quoteMessage(productName: string, tierLabel: string, fromGrams: number = QUOTE_FROM_GRAMS): string {
  return `Bonjour CBDoux, je souhaite un prix pour ${gramsLabel(fromGrams)} ou plus de ${productName.replace(/\s+[—–-]\s+/g, " ")} (${tierLabel}).`;
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
  /** Références dont le poids total atteint le seuil où le prix se négocie (`fromGrams` : ce seuil) */
  quotes: Array<{ slug: string; grams: number; fromGrams: number }>;
};

/**
 * Calcule le prix de chaque ligne du panier. Les lignes d'une même référence au tarif dégressif sont
 * additionnées (1 g × 4 + 10 g = 14 g, donc −10 % sur les deux lignes) et reçoivent la remise prévue pour
 * cette référence (force Maxi) ou le prix au gramme du palier atteint (sur commande) ; les autres gardent leur
 * prix catalogue.
 */
export function priceCart<T extends Priceable>(lines: T[]): PricedCart<T> {
  const gramsBySlug = new Map<string, number>();
  for (const l of lines) {
    if (l.perGramCents) gramsBySlug.set(l.slug, (gramsBySlug.get(l.slug) ?? 0) + l.grams * l.quantity);
  }
  const priced = lines.map((l) => {
    const tier = l.perGramCents ? tierPrice(l.slug, l.perGramCents, l.grams, gramsBySlug.get(l.slug) ?? 0) : { unitCents: l.unitPriceCents, percent: 0 };
    // Jamais plus cher que le prix catalogue du format (un sachet de 25 g porte déjà sa remise).
    const unitCents = Math.min(l.unitPriceCents, tier.unitCents);
    return { ...l, unitCents, totalCents: unitCents * l.quantity, bulkPercent: tier.percent };
  });
  return {
    lines: priced,
    subtotalCents: priced.reduce((s, l) => s + l.totalCents, 0),
    quotes: [...gramsBySlug].filter(([slug, grams]) => grams >= quoteFromGrams(slug)).map(([slug, grams]) => ({ slug, grams, fromGrams: quoteFromGrams(slug) })),
  };
}
