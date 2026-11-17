import { visibleProducts } from "@/data/products";
import type { CartLine } from "@/lib/cart-store";

export type CartSuggestion = Omit<CartLine, "quantity">;

/**
 * Petits formats proposés dans le panier quand il manque quelques euros pour le port offert :
 * un gramme de fleur ou de résine en « Classique » (la force la plus douce, sans case de prudence à cocher).
 * Calculé côté serveur, dans l'ordre du catalogue ; le panier écarte ce qui s'y trouve déjà.
 */
export function cartSuggestions(): CartSuggestion[] {
  return visibleProducts
    .filter((p) => !p.soldOut && (p.category === "fleurs" || p.category === "resines"))
    .flatMap((p) => {
      const v = p.variants.find((x) => x.force === 1 && !x.soldOut && x.grams === 1 && /g$/.test(x.format));
      return v ? [{ sku: v.sku, slug: p.slug, name: p.name, variantLabel: `${v.tierLabel} · ${v.format}`, format: v.format, grams: v.grams, unitPriceCents: v.priceCents, image: p.image, force: v.force }] : [];
    });
}
