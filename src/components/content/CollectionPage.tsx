import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { getCollection, type CollectionSlug } from "@/data/collections";
import { categories, categoryOrder } from "@/data/products";
import { getGuide } from "@/data/guides";
import { ProductCard } from "@/components/product/ProductCard";
import { Blocks } from "@/components/content/Blocks";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata, itemListJsonLd } from "@/lib/seo";
import { getAvailabilityMap } from "@/lib/stock";

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
    <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 py-10 sm:py-14">
      <JsonLd data={itemListJsonLd(c.name, c.products.map((p) => ({ name: p.name, path: `/produit/${p.slug}`, image: p.image })))} />
      <Breadcrumbs items={[{ name: "Boutique", path: "/boutique" }, { name: c.name, path: `/${c.slug}` }]} className="mb-8" />

      <header className="max-w-3xl mb-12">
        <p className="kicker mb-3">{c.kicker}</p>
        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[0.95] mb-6">
          <span className="text-gradient-gold">{c.h1}</span>
          <br />
          <span className="font-serif-italic text-foreground/55 text-4xl sm:text-5xl lg:text-6xl">{c.h1Italic}</span>
        </h1>
        <p className="text-base sm:text-lg text-foreground/75 leading-relaxed">{c.intro}</p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {c.products.map((p, i) => (
          <ProductCard key={p.slug} product={p} priority={i < 2} headingLevel={2} available={p.variants.some((v) => availability[v.sku] !== false)} />
        ))}
      </div>

      <section className="mt-16 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 prose-cbd">
          {c.sections.map((s) => (
            <div key={s.heading}>
              <h2>{s.heading}</h2>
              <Blocks blocks={s.blocks} />
            </div>
          ))}
          <p>
            Produits réservés aux personnes majeures, qui ne sont pas des médicaments. Consultez nos <Link href="/conseils-prudence">conseils de prudence</Link> et nos{" "}
            <Link href="/analyses-laboratoires">analyses de laboratoire</Link>.
          </p>
        </div>
        <aside className="lg:col-span-5">
          <h2 className="font-serif text-2xl mb-4">Questions fréquentes</h2>
          <Faq items={c.faq} />
        </aside>
      </section>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-3xl mb-6">Pour aller plus loin</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {related.map((g) => (
              <Link key={g.slug} href={`/guides/${g.slug}`} className="lift group rounded-2xl border border-foreground/10 bg-card/50 p-6 hover:border-gold/40 transition-colors">
                <p className="kicker mb-2">{g.category}</p>
                <h3 className="font-serif text-xl leading-tight group-hover:text-gold transition-colors">{g.title}</h3>
                <p className="text-sm text-foreground/60 mt-2 line-clamp-2">{g.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <nav aria-label="Catégories" className="mt-16 flex flex-wrap gap-3">
        {categoryOrder.map((k) => (
          <Link key={k} href={`/${categories[k].slug}`} className="btn-outline rounded-full px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em]">
            {categories[k].name} →
          </Link>
        ))}
        <Link href="/boutique" className="btn-gold inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold">
          Tout le catalogue <ArrowRight size={14} />
        </Link>
      </nav>
    </div>
  );
}
