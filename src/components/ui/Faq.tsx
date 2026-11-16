import { JsonLd } from "@/components/JsonLd";
import { faqJsonLd } from "@/lib/seo";

export type FaqItem = { q: string; a: string };

/** Typographie française : pas de retour à la ligne avant « ? ! : ; » ni entre un nombre et son unité (%, €, h, g). */
function frTypo(text: string): string {
  return text.replace(/ ([?!:;»])/g, "\u00a0$1").replace(/(« )/g, "«\u00a0").replace(/(\d) (%|€|h\b|g\b|km\b|°C)/g, "$1\u00a0$2");
}

/** FAQ accessible (details/summary natif) avec balisage FAQPage. */
export function Faq({ items, withJsonLd = true, className = "" }: { items: FaqItem[]; withJsonLd?: boolean; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {withJsonLd && <JsonLd data={faqJsonLd(items)} />}
      {items.map((item) => (
        <details key={item.q} className="group rounded-xl border border-foreground/10 bg-background hover:border-gold/30 transition-colors open:border-gold/40">
          <summary className="cursor-pointer px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4">
            <span className="font-serif text-lg sm:text-xl text-foreground">{frTypo(item.q)}</span>
            <span
              aria-hidden
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-foreground/20 text-foreground/60 transition-all group-open:rotate-45 group-open:border-gold group-open:text-gold"
            >
              +
            </span>
          </summary>
          <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm text-foreground/70 leading-relaxed">{frTypo(item.a)}</div>
        </details>
      ))}
    </div>
  );
}
