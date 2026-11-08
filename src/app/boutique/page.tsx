import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { categories, categoryOrder, visibleProducts, type Category, getProductsByCategory } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata, itemListJsonLd } from "@/lib/seo";
import { getAvailabilityMap } from "@/lib/stock";
import { cn } from "@/lib/utils";

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: "Boutique CBD en ligne — fleurs, résines, huiles & vape",
  description:
    "Tout le catalogue CBDoux : fleurs indoor & hydroponie, résines filtrées, huiles Full Spectrum, vape. Prix au gramme transparents, THC < 0,3 %, livraison France 24/48 h, port offert dès 60 €.",
  path: "/boutique",
  keywords: ["boutique cbd", "acheter cbd en ligne", "cbd pas cher", "fleur cbd", "résine cbd", "cbd livraison rapide"],
});

type Search = { q?: string; categorie?: string; force?: string; tri?: string };

export default async function BoutiquePage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const availability = getAvailabilityMap();
  const q = (sp.q ?? "").trim().toLowerCase();
  const cat = categoryOrder.find((c) => c === sp.categorie) as Category | undefined;

  let list = visibleProducts;
  if (cat) list = getProductsByCategory(cat);
  if (q) {
    list = list.filter((p) =>
      [p.name, p.short, p.aromas, p.origin ?? "", ...p.keywords, categories[p.category].name].join(" ").toLowerCase().includes(q),
    );
  }
  if (sp.force === "maxi") list = list.filter((p) => p.variants.some((v) => v.force === "maxi"));
  if (sp.force === "doux") list = list.filter((p) => p.variants.some((v) => v.force === 1));
  if (sp.tri === "prix-asc") list = [...list].sort((a, b) => Math.min(...a.variants.map((v) => v.priceCents)) - Math.min(...b.variants.map((v) => v.priceCents)));
  if (sp.tri === "prix-desc") list = [...list].sort((a, b) => Math.min(...b.variants.map((v) => v.priceCents)) - Math.min(...a.variants.map((v) => v.priceCents)));

  const grouped = cat || q ? null : categoryOrder.map((c) => ({ key: c, items: getProductsByCategory(c) })).filter((g) => g.items.length);

  return (
    <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 py-10 sm:py-14">
      <JsonLd data={itemListJsonLd("Catalogue CBDoux", list.map((p) => ({ name: p.name, path: `/produit/${p.slug}`, image: p.image })))} />
      <Breadcrumbs items={[{ name: "Boutique", path: "/boutique" }]} className="mb-8" />

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-10">
        <SectionHeading as="h1" kicker="Catalogue" title="La boutique" italic="CBDoux.">
          {visibleProducts.length} références sélectionnées et analysées. Prix TTC au gramme, port offert dès 60 €, expédition sous 24 h ouvrées.
        </SectionHeading>
        <form action="/boutique" className="relative w-full lg:max-w-sm" role="search">
          <input
            type="search"
            name="q"
            defaultValue={sp.q ?? ""}
            placeholder="Rechercher une variété, un arôme…"
            aria-label="Rechercher dans la boutique"
            className="input-dark pl-11"
          />
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/45" />
        </form>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-10" aria-label="Filtrer par catégorie">
        <FilterChip href="/boutique" active={!cat && !q && !sp.force}>Tout</FilterChip>
        {categoryOrder.map((c) => (
          <FilterChip key={c} href={`/${categories[c].slug}`} active={cat === c}>
            {categories[c].name}
          </FilterChip>
        ))}
        <span className="hidden sm:block w-px bg-foreground/10 mx-1" />
        <FilterChip href="/boutique?force=doux" active={sp.force === "doux"}>Douceur · Classique</FilterChip>
        <FilterChip href="/boutique?force=maxi" active={sp.force === "maxi"}>Force Maxi</FilterChip>
        <FilterChip href="/nouveautes">Nouveautés</FilterChip>
      </div>

      {grouped ? (
        grouped.map((g) => (
          <section key={g.key} className="mb-16" id={categories[g.key].slug}>
            <div className="flex items-end justify-between gap-4 mb-6">
              <h2 className="font-serif text-3xl sm:text-4xl flex items-center gap-4">
                <span className="text-gradient-gold">{categories[g.key].name}</span>
                <span className="hidden sm:block h-px w-24 bg-gradient-to-r from-gold/40 to-transparent" />
              </h2>
              <Link href={`/${categories[g.key].slug}`} className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold hover:underline whitespace-nowrap">
                Voir la catégorie →
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {g.items.map((p, i) => (
                <ProductCard key={p.slug} product={p} priority={i < 2 && g.key === "fleurs"} available={p.variants.some((v) => availability[v.sku] !== false)} />
              ))}
            </div>
          </section>
        ))
      ) : list.length === 0 ? (
        <div className="rounded-2xl border border-foreground/10 bg-card/40 p-10 text-center">
          <p className="font-serif text-2xl mb-2">Aucun produit ne correspond à « {sp.q} ».</p>
          <p className="text-sm text-foreground/60 mb-6">Essayez « citron », « résine », « huile », « hydro »… ou parcourez tout le catalogue.</p>
          <Link href="/boutique" className="btn-gold inline-flex rounded-full px-6 py-3 text-sm font-semibold">
            Voir tout le catalogue
          </Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-foreground/55 mb-6">
            {list.length} produit{list.length > 1 ? "s" : ""}
            {q ? ` pour « ${sp.q} »` : ""}
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {list.map((p, i) => (
              <ProductCard key={p.slug} product={p} priority={i < 2} available={p.variants.some((v) => availability[v.sku] !== false)} />
            ))}
          </div>
        </>
      )}

      {/* Texte SEO */}
      <section className="mt-20 grid lg:grid-cols-2 gap-10 rounded-3xl border border-foreground/10 bg-card/30 p-7 sm:p-10">
        <div>
          <h2 className="font-serif text-3xl mb-4">Acheter du CBD en ligne, en toute confiance</h2>
          <p className="text-sm sm:text-base text-foreground/70 leading-relaxed mb-4">
            CBDoux est une boutique française indépendante installée dans le Haut-Doubs. Nous sélectionnons des fleurs de chanvre indoor, hydroponie et greenhouse, des résines filtrées et pressées, des huiles Full Spectrum à usage cutané et des solutions de vape, tous conformes à la réglementation française (THC inférieur à 0,3 %).
          </p>
          <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
            Chaque lot est accompagné d'une analyse de laboratoire indépendante que vous pouvez consulter avant d'acheter. Les prix sont affichés au gramme et par 10 g, sans surprise : ce que vous voyez est ce que vous payez.
          </p>
        </div>
        <div>
          <h2 className="font-serif text-3xl mb-4">Livraison rapide et discrète partout en France</h2>
          <p className="text-sm sm:text-base text-foreground/70 leading-relaxed mb-4">
            Commande avant 13 h, colis expédié le jour même en Lettre suivie, Colissimo 48 h (offert dès 60 €) ou Chronopost Express 24 h. Emballage neutre, sachets hermétiques inodores, suivi en temps réel. Dans le Haut-Doubs, retrait gratuit à Damprichard et au Russey ou livraison à domicile par nos soins.
          </p>
          <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
            Une question avant de commander ? Notre équipe répond sur WhatsApp 7 j/7 pour vous orienter vers la force et la variété qui vous conviennent.
          </p>
        </div>
      </section>
    </div>
  );
}

function FilterChip({ href, active, children }: { href: string; active?: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors",
        active ? "border-gold bg-gold/10 text-gold" : "border-foreground/15 text-foreground/70 hover:border-gold/50 hover:text-gold",
      )}
    >
      {children}
    </Link>
  );
}
