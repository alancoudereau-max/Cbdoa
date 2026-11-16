import type { Metadata } from "next";
import Link from "next/link";
import { guides, guideCategories } from "@/data/guides";
import { PageHero } from "@/components/ui/PageHero";
import { fr } from "@/lib/utils";
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
    <div>
      <JsonLd data={itemListJsonLd("Guides CBDoux", guides.map((g) => ({ name: g.title, path: `/guides/${g.slug}` })))} />
      <PageHero
        crumbs={[{ name: "Guides", path: "/guides" }]}
        title="Comprendre le CBD, choisir en connaissance de cause"
        titleClassName="max-w-[18ch]"
        lead="Des réponses claires et sourcées, sans promesse miracle : la loi, les produits, les bons gestes."
      />
      <div className="paper">
        {guideCategories.map((cat) => {
          const items = guides.filter((g) => g.category === cat);
          return (
            <section key={cat} className="wrap grid gap-6 border-b border-foreground/20 py-14 last:border-b-0 sm:py-20 lg:grid-cols-12 lg:gap-10">
              <h2 className="t-h3 lg:col-span-4">{cat}</h2>
              <ul className="lg:col-span-7 lg:col-start-6">
                {items.map((g) => (
                  <li key={g.slug} className="border-t border-foreground/25 last:border-b">
                    <Link href={`/guides/${g.slug}`} className="group block py-5 sm:py-6">
                      <h3 className="softens t-h3">{fr(g.title)}</h3>
                      <p className="mt-2.5 measure-wide text-[0.9688rem] text-foreground/80">{fr(g.description)}</p>
                      <p className="t-fine mt-2.5">{g.readingMinutes} min de lecture</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
