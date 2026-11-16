import { SITE_URL } from "@/data/site";

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Typographie française : pas de retour à la ligne avant « ? ! : ; » ni entre un nombre et son unité. */
export function fr(text: string): string {
  return text
    .replace(/ ([?!:;»])/g, "\u00a0$1")
    .replace(/« /g, "«\u00a0")
    .replace(/(\d) (%|€|h\b|g\b|km\b|°C|ml\b|min\b)/g, "$1\u00a0$2");
}

/** Les énumérations « A · B » des données s'affichent « A, B ». */
export function commas(text: string): string {
  return text.replace(/\s·\s/g, ", ");
}

export function formatEUR(cents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function formatDateFR(date: string | Date, withTime = false): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    ...(withTime ? { timeStyle: "short" } : {}),
    timeZone: "Europe/Paris",
  }).format(d);
}

/** Génère un numéro de commande lisible : CBD-YYMMDD-XXXX */
export function generateOrderNumber(): string {
  const d = new Date();
  const yy = String(d.getFullYear()).slice(-2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 46656)
    .toString(36)
    .toUpperCase()
    .padStart(3, "0");
  const rand2 = Math.floor(Math.random() * 36).toString(36).toUpperCase();
  return `CBD-${yy}${mm}${dd}-${rand}${rand2}`;
}
