import Link from "next/link";
import type { Metadata } from "next";
import { getCollection, type CollectionSlug } from "@/data/collections";
import { categories, categoryOrder } from "@/data/products";
import { getGuide } from "@/data/guides";
import { ProductCard } from "@/components/product/ProductCard";
import { Blocks } from "@/components/content/Blocks";
import { PageHero } from "@/components/ui/PageHero";
import { GuideRows } from "@/components/content/GuideRows";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata, itemListJsonLd } from "@/lib/seo";
import { getAvailabilityMap } from "@/lib/stock";
import { fr } from "@/lib/utils";

export function collectionMetadata(slug: CollectionSlug): Metadata {
  const c = getCollection(slug);
  return buildMetadata({ title: c.title, description: c.description, path: `/${c.slug}`, keywords: c.keywords });
}

/** Page « sélection » (CBD puissant, CBD pas cher) : produits calculés depuis le catalogue + conseils + FAQ. */
export function CollectionPage({ slug }: { slug: CollectionSlug }) {
  const c = getCollection(slug);
  const availability = getAvailabilityMap();
  const related = c.relatedGuides.map(getGuide).filter((g): g is NonNullable<typeof g> => Boolean(g));

  return (
    <div>
      <JsonLd data={itemListJsonLd(c.name, c.products.map((p) => ({ name: p.name, path: `/produit/${p.slug}`, image: p.image })))} />

      <PageHero
        crumbs={[
          { name: "Boutique", path: "/boutique" },
          { name: c.name, path: `/${c.slug}` },
        ]}
        title={`${c.h1}, ${c.h1Italic}`}
        titleClassName="max-w-[20ch]"
        lead={fr(c.intro)}
      />

      <section className="wrap pb-6">
        <div className="product-grid">
          {c.products.map((p, i) => (
            <ProductCard key={p.slug} product={p} priority={i < 2} headingLevel={2} available={p.variants.some((v) => availability[v.sku] !== false)} />
          ))}
        </div>
      </section>

      <section className="wrap section pb-0">
        <div className="paper sheet grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="prose-cbd min-w-0 lg:col-span-7">
            {c.sections.map((s) => (
              <div key={s.heading}>
                <h2>{fr(s.heading)}</h2>
                <Blocks blocks={s.blocks} />
              </div>
            ))}
            <p>
              Produits réservés aux personnes majeures, qui ne sont pas des médicaments. Consultez nos <Link href="/conseils-prudence">conseils de prudence</Link> et nos{" "}
              <Link href="/analyses-laboratoires">analyses de laboratoire</Link>.
            </p>
          </div>
          <aside className="lg:col-span-5">
            <h2 className="t-h3">Questions fréquentes</h2>
            <Faq items={c.faq} className="mt-5" />
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="wrap section grid gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <h2 className="t-h2">Pour aller plus loin</h2>
          </div>
          <GuideRows guides={related} className="lg:col-span-7 lg:col-start-6" />
        </section>
      )}

      <nav aria-label="Rayons" className={`wrap flex flex-wrap gap-2.5 pb-20 ${related.length ? "" : "pt-14"}`}>
        {categoryOrder.map((k) => (
          <Link key={k} href={`/${categories[k].slug}`} className="btn btn-ghost btn-sm">
            {categories[k].name}
          </Link>
        ))}
        <Link href="/boutique" className="btn btn-primary btn-sm">
          Tout le catalogue
        </Link>
      </nav>
    </div>
  );
}
