import Link from "next/link";
import Image from "next/image";
import type { Guide } from "@/data/guides";
import { guideImage } from "@/lib/guide-image";
import { fr } from "@/lib/utils";

/**
 * Liste de guides, en lignes séparées par des filets (accueil, rayons, pages de sélection, index des guides).
 * Chaque ligne porte une vignette : la photo d'un produit cité dans le guide.
 */
export function GuideRows({
  guides,
  headingLevel = 3,
  showCategory = true,
  className = "",
}: {
  guides: Guide[];
  headingLevel?: 2 | 3;
  /** La rubrique devant le temps de lecture (inutile quand la liste est déjà rangée par rubrique). */
  showCategory?: boolean;
  className?: string;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <ul className={className}>
      {guides.map((g) => {
        const img = guideImage(g);
        return (
          <li key={g.slug} data-reveal="up" className="border-t border-foreground/15 last:border-b">
            <Link href={`/guides/${g.slug}`} className={`guide-row group ${img ? "" : "guide-row-plain"}`}>
              {img && (
                <span className="guide-thumb paper">
                  <Image src={img.src} alt="" fill sizes="(max-width: 640px) 72px, 112px" className="object-cover" />
                </span>
              )}
              <span className="min-w-0 self-center">
                <span className="t-fine block">
                  {showCategory ? `${g.category}, ` : ""}
                  {g.readingMinutes} min de lecture
                </span>
                <Heading className="softens guide-title mt-1.5">{fr(g.title)}</Heading>
              </span>
              <span className="guide-desc line-clamp-2">{fr(g.description)}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
