import type { Metadata } from "next";
import { guides, guideCategories } from "@/data/guides";
import { PageHero } from "@/components/ui/PageHero";
import { GuideRows } from "@/components/content/GuideRows";
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
        title={
          <>
            Comprendre le CBD, <em>choisir en connaissance de cause</em>
          </>
        }
        titleClassName="max-w-[18ch]"
        lead="Des réponses claires et sourcées, sans promesse miracle : la loi, les produits, les bons gestes."
      />
      <div>
        {guideCategories.map((cat) => {
          const items = guides.filter((g) => g.category === cat);
          return (
            <section key={cat} className="wrap grid gap-6 border-b border-foreground/20 py-14 last:border-b-0 sm:py-20 lg:grid-cols-12 lg:gap-10">
              <h2 className="t-h3 lg:col-span-4">{cat}</h2>
              <GuideRows guides={items} showCategory={false} className="lg:col-span-7 lg:col-start-6" />
            </section>
          );
        })}
      </div>
    </div>
  );
}
