import Link from "next/link";
import type { Guide } from "@/data/guides";
import { fr } from "@/lib/utils";

/** Liste de guides, en lignes séparées par des filets (accueil, rayons, fiches produit, guides liés). */
export function GuideRows({ guides, headingLevel = 3, className = "" }: { guides: Guide[]; headingLevel?: 2 | 3; className?: string }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <ul className={className}>
      {guides.map((g) => (
        <li key={g.slug} className="border-t border-foreground/15 last:border-b">
          <Link href={`/guides/${g.slug}`} className="group block py-5 sm:py-6">
            <p className="t-fine">
              {g.category}, {g.readingMinutes} min de lecture
            </p>
            <Heading className="softens t-h3 mt-2">{fr(g.title)}</Heading>
            <p className="mt-2.5 measure-wide text-[0.9688rem] text-foreground/75 line-clamp-2">{fr(g.description)}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
