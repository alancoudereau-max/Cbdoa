import { JsonLd } from "@/components/JsonLd";
import { faqJsonLd } from "@/lib/seo";

export type FaqItem = { q: string; a: string };

/** Typographie française : pas de retour à la ligne avant « ? ! : ; » ni entre un nombre et son unité (%, €, h, g). */
function fr(text: string): string {
  return text.replace(/ ([?!:;»])/g, " $1").replace(/(« )/g, "« ").replace(/(\d) (%|€|h\b|g\b|km\b|°C)/g, "$1 $2");
}

/** FAQ accessible (details/summary natif) avec balisage FAQPage. */
export function Faq({ items, withJsonLd = true, className = "" }: { items: FaqItem[]; withJsonLd?: boolean; className?: string }) {
  return (
    <div className={`faq ${className}`}>
      {withJsonLd && <JsonLd data={faqJsonLd(items)} />}
      {items.map((item) => (
        <details key={item.q}>
          <summary>
            <span className="q">{fr(item.q)}</span>
            <span aria-hidden className="mark" />
          </summary>
          <div className="answer">{fr(item.a)}</div>
        </details>
      ))}
    </div>
  );
}
