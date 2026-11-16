import type { Category } from "@/data/products";

/**
 * Photo qui représente chaque rayon dans les médaillons (accueil, en-tête de rayon).
 * `blend` : la photo a un fond blanc et se fond dans le disque de papier crème.
 */
export const categoryVisual: Record<Category, { src: string; blend: boolean }> = {
  fleurs: { src: "/images/products/orangello-hydroponie.jpg", blend: true },
  resines: { src: "/images/products/olivette-gold.jpg", blend: true },
  huiles: { src: "/images/products/huile-full-spectrum-10.jpg", blend: false },
  vape: { src: "/images/products/pods-cbd-rechargeables.jpg", blend: true },
};
