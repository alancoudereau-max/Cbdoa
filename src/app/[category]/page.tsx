import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { categories, categoryOrder, getCategoryBySlug, getProductsByCategory, forceLabels, formatPrice } from "@/data/products";
import { guides } from "@/data/guides";
import { ProductCard } from "@/components/product/ProductCard";
import { PageHero } from "@/components/ui/PageHero";
import { ForceBadge } from "@/components/ui/ForceBadge";
import { GuideRows } from "@/components/content/GuideRows";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata, itemListJsonLd } from "@/lib/seo";
import { getAvailabilityMap } from "@/lib/stock";
import { categoryFaq } from "@/data/category-faq";
import { commas, fr } from "@/lib/utils";

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
    <div>
      <JsonLd data={itemListJsonLd(cat.name, products.map((p) => ({ name: p.name, path: `/produit/${p.slug}`, image: p.image })))} />

      <PageHero
        crumbs={[
          { name: "Boutique", path: "/boutique" },
          { name: cat.name, path: `/${cat.slug}` },
        ]}
        title={cat.h1}
        lead={fr(cat.intro[0])}
        guilloche={false}
        aside={
          <div className="relative mx-auto aspect-square w-[min(72vw,19rem)] lg:ml-auto lg:mr-0 lg:w-[21rem]">
            <div aria-hidden className="guilloche guilloche-orge spin-slow opacity-[0.3] left-[-57.5%] top-[-57.5%] w-[215%]" />
            <div className="relative h-full overflow-hidden rounded-full bg-card ring-1 ring-or/60 ring-offset-[6px] ring-offset-noir [clip-path:circle(50%)]">
              <Image src={cat.image} alt={cat.name} fill sizes="(max-width: 1024px) 72vw, 340px" className="object-cover" priority />
            </div>
          </div>
        }
      >
        <p className="t-num text-[0.9688rem] text-foreground/75">
          {products.length} référence{products.length > 1 ? "s" : ""}, THC inférieur à 0,3 %
        </p>
      </PageHero>

      <section className="wrap pb-6">
        <div className="product-grid">
          {products.map((p, i) => (
            <ProductCard key={p.slug} product={p} priority={i < 2} headingLevel={2} available={p.variants.some((v) => availability[v.sku] !== false)} />
          ))}
        </div>
      </section>

      {/* Guide des forces (fleurs & résines) */}
      {(cat.key === "fleurs" || cat.key === "resines") && (
        <section className="wrap section">
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
            <h2 className="t-h2">Quelle force choisir ?</h2>
            <Link href="/guides/comprendre-les-forces-cbd" className="link">
              Le guide complet des forces
            </Link>
          </div>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4">
            {([1, 2, 3, "maxi"] as const).map((f, n) => (
              <div key={String(f)} className={`border-t border-foreground/15 py-6 lg:border-b ${n ? "lg:border-l lg:pl-7" : ""} ${n % 2 ? "sm:border-l sm:pl-7" : ""} sm:pr-7`}>
                <ForceBadge force={f} className="text-or" />
                <p className="mt-3 text-[0.9375rem] text-foreground/70">{commas(forceLabels[f].short)}</p>
                <p className="mt-3 text-[0.9688rem] leading-relaxed text-foreground/85">{fr(forceLabels[f].description)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Texte de présentation et questions, sur papier */}
      <section className={`wrap ${cat.key === "fleurs" || cat.key === "resines" ? "" : "section pb-0"}`}>
        <div className="panel sheet grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="prose-cbd lg:col-span-7">
            <h2>{fr(`${cat.name} : notre sélection, nos critères`)}</h2>
            {cat.intro.slice(1).map((p) => (
              <p key={p}>{fr(p)}</p>
            ))}
            <p>
              Tous nos produits sont réservés aux personnes majeures et ne sont pas des médicaments. Fleurs et résines sont destinées à la vaporisation (ni combustion, ni usage alimentaire) ; nos huiles sont à usage cutané exclusivement. Consultez nos{" "}
              <Link href="/conseils-prudence">conseils de prudence</Link> et nos <Link href="/analyses-laboratoires">analyses de laboratoire</Link>.
            </p>
          </div>
          <aside className="lg:col-span-5">
            <h2 className="t-h3">Questions fréquentes</h2>
            <Faq items={faq} className="mt-5" />
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

      <nav aria-label="Autres rayons" className={`wrap flex flex-wrap gap-2.5 pb-20 ${related.length ? "" : "pt-14"}`}>
        {others.map((c) => (
          <Link key={c} href={`/${categories[c].slug}`} className="btn btn-ghost btn-sm">
            {categories[c].name}
          </Link>
        ))}
        <Link href="/boutique" className="btn btn-ghost btn-sm">
          Toute la boutique
        </Link>
      </nav>
    </div>
  );
}
