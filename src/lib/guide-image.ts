import { guides, type Guide } from "@/data/guides";
import { getProduct } from "@/data/products";
import { labelImage } from "@/lib/etiquettes";

/**
 * La photo qui accompagne un guide dans les listes : celle d'un des produits qu'il cite (une vraie photo
 * CBDoux, jamais une image d'illustration). Les guides sont parcourus dans l'ordre pour que deux guides
 * voisins ne montrent pas le même produit ; le guide sur les distributeurs montre le chalet du Russey.
 */
const used = new Set<string>();
const images = new Map<string, { src: string; alt: string; paper: boolean }>();
for (const g of guides) {
  if (g.category === "Haut-Doubs") {
    images.set(g.slug, { src: "/images/distributeurs/le-russey-chalet.jpg", alt: "Le distributeur CBDoux du Russey", paper: false });
    continue;
  }
  const slug = g.relatedProducts.find((s) => !used.has(s) && getProduct(s)) ?? g.relatedProducts.find((s) => getProduct(s));
  const product = slug ? getProduct(slug) : undefined;
  if (!product) continue;
  used.add(product.slug);
  images.set(g.slug, { src: labelImage(product.image), alt: product.name, paper: true });
}

export function guideImage(guide: Guide) {
  return images.get(guide.slug) ?? null;
}
