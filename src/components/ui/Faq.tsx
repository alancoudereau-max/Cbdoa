import { JsonLd } from "@/components/JsonLd";
import { faqJsonLd } from "@/lib/seo";
import { fr } from "@/lib/utils";

export type FaqItem = { q: string; a: string };

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
