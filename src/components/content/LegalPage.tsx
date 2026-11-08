import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLegalDoc, legalDocs } from "@/data/legal";
import { Blocks } from "@/components/content/Blocks";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import { formatDateFR } from "@/lib/utils";

export function legalMetadata(slug: string): Metadata {
  const d = getLegalDoc(slug);
  if (!d) return {};
  return buildMetadata({ title: d.title, description: d.description, path: `/${d.slug}` });
}

export function LegalPage({ slug }: { slug: string }) {
  const d = getLegalDoc(slug);
  if (!d) notFound();
  return (
    <div className="mx-auto max-w-[1000px] px-5 sm:px-8 lg:px-12 py-10 sm:py-14">
      <Breadcrumbs items={[{ name: d.title, path: `/${d.slug}` }]} className="mb-8" />
      <header className="mb-10">
        <p className="kicker mb-3">Informations légales</p>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1] mb-4">{d.title}</h1>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">Dernière mise à jour : {formatDateFR(d.updatedAt)}</p>
        {d.intro && <p className="mt-6 text-base text-foreground/75 leading-relaxed max-w-3xl">{d.intro}</p>}
      </header>

      <nav aria-label="Autres documents" className="mb-10 flex flex-wrap gap-2">
        {legalDocs.map((x) => (
          <Link
            key={x.slug}
            href={`/${x.slug}`}
            className={`rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] ${x.slug === d.slug ? "border-gold bg-gold/10 text-gold" : "border-foreground/15 text-foreground/70 hover:border-gold/50 hover:text-gold"}`}
          >
            {x.title}
          </Link>
        ))}
      </nav>

      <div className="prose-cbd">
        {d.sections.map((s) => (
          <section key={s.heading}>
            <h2>{s.heading}</h2>
            <Blocks blocks={s.blocks} />
          </section>
        ))}
      </div>
    </div>
  );
}
