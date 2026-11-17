import manifest from "@/data/etiquettes.json";
import photos from "@/data/photos.json";

const surPapier = new Set<string>(manifest as string[]);

/**
 * Image à afficher sur une étiquette crème : la copie « sur papier » de la photo produit quand elle existe
 * (photos sur fond blanc, préparées par scripts/build-etiquettes.py), sinon la photo d'origine.
 */
export function labelImage(src: string): string {
  const name = src.split("/").pop() ?? "";
  return surPapier.has(name) ? `/images/etiquettes/${name}` : src;
}

/** Vrai si la photo a une copie « sur papier » (photo détourée sur fond clair, à ne pas rogner). */
export function isOnPaper(src: string): boolean {
  return surPapier.has(src.split("/").pop() ?? "");
}

/** Taille d'origine d'une photo produit, en pixels (notée par scripts/build-etiquettes.py), ou null si inconnue. */
export function photoSize(src: string): [number, number] | null {
  const size = (photos as Record<string, number[]>)[src.split("/").pop() ?? ""];
  return size ? [size[0], size[1]] : null;
}
