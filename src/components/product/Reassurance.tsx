import type { ReactNode } from "react";
import { cn, fr } from "@/lib/utils";

const items: { text: string; icon: ReactNode }[] = [
  {
    text: "THC inférieur à 0,3 %",
    // Fiole d'analyse
    icon: <path d="M7 2.6h4M8 2.6v4.1l-3.7 6.6a1.5 1.5 0 0 0 1.3 2.2h6.8a1.5 1.5 0 0 0 1.3-2.2L10 6.7V2.6M6.1 11.2h5.8" />,
  },
  {
    text: "Expédié sous 24 h",
    // Cadran
    icon: (
      <>
        <circle cx="9" cy="9" r="6.6" />
        <path d="M9 5.3V9l2.5 1.7" />
      </>
    ),
  },
  {
    text: "Colis neutre",
    // Colis fermé
    icon: <path d="M2.7 5.6 9 2.6l6.3 3v6.8L9 15.4l-6.3-3zM2.7 5.6 9 8.6l6.3-3M9 8.6v6.8" />,
  },
  {
    text: "Paiement par lien sécurisé",
    // Cadenas
    icon: (
      <>
        <rect x="3.8" y="8" width="10.4" height="7.3" rx="1.3" />
        <path d="M6 8V5.9a3 3 0 0 1 6 0V8" />
      </>
    ),
  },
];

/**
 * Les quatre engagements rappelés sur chaque fiche produit : sous la photo sur ordinateur, sous le bloc d'achat sur téléphone.
 * `thc` remplace le premier quand le produit a un taux de THC particulier (« THC 0,1 % max ») ;
 * `delay` remplace le deuxième pour une référence sur commande (« Livré sous 1 semaine »).
 */
export function Reassurance({ className, thc, delay }: { className?: string; thc?: string; delay?: string }) {
  const list = items.map((item, n) => (n === 0 && thc ? { ...item, text: thc } : n === 1 && delay ? { ...item, text: delay } : item));
  return (
    <ul className={cn("grid grid-cols-2 text-[0.875rem] text-foreground/80", className)}>
      {list.map((item, n) => (
        <li key={item.text} className={cn("flex items-center gap-2.5 border-t border-foreground/15 py-3", n % 2 ? "border-l pl-4" : "pr-3", n >= 2 && "border-b")}>
          <svg aria-hidden width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-or">
            {item.icon}
          </svg>
          <span>{fr(item.text)}</span>
        </li>
      ))}
    </ul>
  );
}
