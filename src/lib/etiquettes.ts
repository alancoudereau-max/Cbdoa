import manifest from "@/data/etiquettes.json";

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
