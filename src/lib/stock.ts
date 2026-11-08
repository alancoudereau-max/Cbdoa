import { products } from "@/data/products";

/**
 * Disponibilité des variantes, calculée depuis le catalogue (`soldOut` sur un produit ou une variante).
 * Pour signaler une rupture : dans src/data/products.ts, ajoutez `soldOut: true` au produit ou à la variante.
 */
export function getAvailabilityMap(): Record<string, boolean> {
  const map: Record<string, boolean> = {};
  for (const p of products) {
    for (const v of p.variants) map[v.sku] = !(p.soldOut || v.soldOut);
  }
  return map;
}
