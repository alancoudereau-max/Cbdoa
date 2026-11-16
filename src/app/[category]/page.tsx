import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { categories, categoryOrder, getCategoryBySlug, getProductsByCategory, forceLabels, formatPrice } from "@/data/products";
import { guides } from "@/data/guides";
import { ProductCard } from "@/components/product/ProductCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata, itemListJsonLd } from "@/lib/seo";
import { getAvailabilityMap } from "@/lib/stock";
import { categoryFaq } from "@/data/category-faq";

export const dynamicParams = false;

export function generateStaticParams() {
  return categoryOrder.map((c) => ({ category: categories[c].slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) return {};
  // Prix au gramme le plus bas de la catégorie, repris dans le titre (toujours à jour avec le catalogue).
  const perGram = getProductsByCategory(cat.key).flatMap((p) => p.variants.filter((v) => v.format === "1 g").map((v) => v.priceCents));
  const title = perGram.length ? `${cat.title} dès ${formatPrice(Math.min(...perGram))}/g` : cat.title;
  return buildMetadata({ title, description: cat.description, path: `/${cat.slug}`, image: cat.image, keywords: cat.keywords });
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) notFound();
  const products = getProductsByCategory(cat.key);
  const availability = getAvailabilityMap();
  const faq = categoryFaq[cat.key];
  const related = guides.filter((g) => g.relatedProducts.some((slug) => products.some((p) => p.slug === slug))).slice(0, 3);
  const others = categoryOrder.filter((c) => c !== cat.key);

  return (
    <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 py-10 sm:py-14">
      <JsonLd data={itemListJsonLd(cat.name, products.map((p) => ({ name: p.name, path: `/produit/${p.slug}`, image: p.image })))} />
      <Breadcrumbs items={[{ name: "Boutique", path: "/boutique" }, { name: cat.name, path: `/${cat.slug}` }]} className="mb-8" />

      <header className="grid lg:grid-cols-12 gap-8 items-end mb-12">
        <div className="lg:col-span-8">
          <p className="kicker mb-3">{products.length} référence{products.length > 1 ? "s" : ""} · THC &lt; 0,3 %</p>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[0.95] mb-6">
            <span className="text-gradient-gold">{cat.h1}</span>
          </h1>
          <p className="text-base sm:text-lg text-foreground/75 leading-relaxed max-w-3xl">{cat.intro[0]}</p>
        </div>
        <div className="lg:col-span-4 relative aspect-[4/3] lg:aspect-square overflow-hidden rounded-3xl border border-gold/20">
          <Image src={cat.image} alt={cat.name} fill sizes="(max-width: 1024px) 100vw, 400px" className="object-cover" priority />
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {products.map((p, i) => (
          <ProductCard key={p.slug} product={p} priority={i < 2} headingLevel={2} available={p.variants.some((v) => availability[v.sku] !== false)} />
        ))}
      </div>

      {/* Guide des forces (fleurs & résines) */}
      {(cat.key === "fleurs" || cat.key === "resines") && (
        <section className="mt-16 rounded-3xl border border-gold/20 bg-card/40 p-7 sm:p-10">
          <h2 className="font-serif text-3xl sm:text-4xl mb-6">Quelle force choisir ?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {([1, 2, 3, "maxi"] as const).map((f) => (
              <div key={String(f)} className="rounded-2xl border border-foreground/10 bg-background/60 p-5">
                <p className="font-serif text-2xl text-gold mb-1">{forceLabels[f].label}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50 mb-3">{forceLabels[f].short}</p>
                <p className="text-sm text-foreground/70 leading-relaxed">{forceLabels[f].description}</p>
              </div>
            ))}
          </div>
          <Link href="/guides/comprendre-les-forces-cbd" className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-gold hover:underline">
            Le guide complet des forces <ArrowRight size={14} />
          </Link>
        </section>
      )}

      {/* Texte SEO */}
      <section className="mt-16 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 prose-cbd">
          <h2>{cat.name} : notre sélection, nos critères</h2>
          {cat.intro.slice(1).map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p>
            Tous nos produits sont réservés aux personnes majeures et ne sont pas des médicaments. Fleurs et résines sont destinées à la vaporisation (ni combustion, ni usage alimentaire) ; nos huiles sont à usage cutané exclusivement. Consultez nos{" "}
            <Link href="/conseils-prudence">conseils de prudence</Link> et nos <Link href="/analyses-laboratoires">analyses de laboratoire</Link>.
          </p>
        </div>
        <aside className="lg:col-span-5">
          <h2 className="font-serif text-2xl mb-4">Questions fréquentes</h2>
          <Faq items={faq} />
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

      <nav aria-label="Autres catégories" className="mt-16 flex flex-wrap gap-3">
        {others.map((c) => (
          <Link key={c} href={`/${categories[c].slug}`} className="btn-outline rounded-full px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em]">
            {categories[c].name} →
          </Link>
        ))}
      </nav>
    </div>
  );
}
