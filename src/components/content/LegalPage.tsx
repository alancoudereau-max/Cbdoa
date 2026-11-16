import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLegalDoc, legalDocs } from "@/data/legal";
import { Blocks } from "@/components/content/Blocks";
import { PageHero } from "@/components/ui/PageHero";
import { buildMetadata } from "@/lib/seo";
import { formatDateFR, fr } from "@/lib/utils";

export function legalMetadata(slug: string): Metadata {
  const d = getLegalDoc(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: `/${d.slug}` });
}

export function LegalPage({ slug }: { slug: string }) {
  const d = getLegalDoc(slug);
  if (!d) notFound();
  return (
    <div>
      <PageHero crumbs={[{ name: d.title, path: `/${d.slug}` }]} title={d.title} titleClassName="max-w-[20ch] text-[clamp(2.3rem,5.4vw,4.4rem)]">
        <p className="t-fine">Dernière mise à jour : {formatDateFR(d.updatedAt)}</p>
        <nav aria-label="Autres documents" className="chip-rail mt-7">
          {legalDocs.map((x) => (
            <Link key={x.slug} href={`/${x.slug}`} data-active={x.slug === d.slug ? "true" : undefined} className="choice choice-pill px-4 py-2 text-[0.9375rem]">
              {x.title}
            </Link>
          ))}
        </nav>
      </PageHero>

      <div className="wrap-narrow pb-24">
        <div className="paper sheet prose-cbd">
          {/* Le préambule ouvre le document, sur le papier : il se lit avant l'article 1. */}
          {d.intro && <p className="mb-10 border-b border-foreground/25 pb-8 font-serif text-[1.1875rem] font-light leading-[1.5] sm:text-[1.3125rem]">{fr(d.intro)}</p>}
          {d.sections.map((s) => (
            <section key={s.heading}>
              <h2>{fr(s.heading)}</h2>
              <Blocks blocks={s.blocks} />
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
