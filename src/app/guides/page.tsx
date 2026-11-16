import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { guides, guideCategories } from "@/data/guides";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata, itemListJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Guides CBD : légalité, choix, utilisation",
  description:
    "Tout comprendre sur le CBD : réglementation 2026, choisir sa fleur ou sa résine, forces, vaporisation, conservation, analyses labo. Les guides CBDoux.",
  path: "/guides",
  keywords: ["guide cbd", "cbd conseils", "cbd légal", "choisir cbd", "blog cbd"],
});

export default function GuidesPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12 py-10 sm:py-14">
      <JsonLd data={itemListJsonLd("Guides CBDoux", guides.map((g) => ({ name: g.title, path: `/guides/${g.slug}` })))} />
      <Breadcrumbs items={[{ name: "Guides", path: "/guides" }]} className="mb-8" />
      <SectionHeading as="h1" kicker="Guides & conseils" title="Comprendre le CBD," italic="choisir en connaissance de cause." className="mb-12">
        Des réponses claires et sourcées, sans promesse miracle : la loi, les produits, les bons gestes.
      </SectionHeading>

      {guideCategories.map((cat) => {
        const items = guides.filter((g) => g.category === cat);
        return (
          <section key={cat} className="mb-14">
            <h2 className="kicker mb-5">{cat}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((g) => (
                <Link key={g.slug} href={`/guides/${g.slug}`} className="lift group flex h-full flex-col rounded-2xl border border-foreground/10 bg-card/50 p-6 hover:border-gold/40 transition-colors">
                  <h3 className="font-serif text-2xl leading-tight mb-3 group-hover:text-gold transition-colors">{g.title}</h3>
                  <p className="text-sm text-foreground/65 flex-1">{g.description}</p>
                  <div className="mt-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">
                    <span className="inline-flex items-center gap-1.5"><Clock size={12} /> {g.readingMinutes} min</span>
                    <span className="inline-flex items-center gap-1 group-hover:text-gold">Lire <ArrowUpRight size={12} className="group-hover:rotate-45 transition-transform" /></span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
