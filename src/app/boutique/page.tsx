import type { Metadata } from "next";
import Link from "next/link";
import { categories, categoryOrder, visibleProducts, visibleOnOrderProducts, getProductsByCategory, type Product } from "@/data/products";
import { ON_ORDER_DELAY, ON_ORDER_STEPS } from "@/lib/pricing";
import { fr } from "@/lib/utils";
import { ProductCard } from "@/components/product/ProductCard";
import { BoutiqueCatalog, type CatalogEntry, type CatalogGroup } from "@/components/product/BoutiqueCatalog";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata, itemListJsonLd } from "@/lib/seo";
import { getAvailabilityMap } from "@/lib/stock";

export const metadata: Metadata = buildMetadata({
  title: "Acheter du CBD en ligne : fleurs, résines, vape",
  description:
    "Tout le catalogue CBDoux : fleurs indoor et hydroponie, résines filtrées, huiles cutanées, vape. Prix au gramme, THC < 0,3 %, port offert dès 60 €.",
  path: "/boutique",
  keywords: ["boutique cbd", "acheter cbd en ligne", "cbd pas cher", "fleur cbd", "résine cbd", "cbd livraison rapide"],
});

/**
 * Page 100 % statique : tout le catalogue est dans le HTML (rapide, lisible par les moteurs de recherche).
 * La recherche et les filtres (?q=, ?force=, ?tri=) sont appliqués dans le navigateur par <BoutiqueCatalog />.
 */
export default function BoutiquePage() {
  const availability = getAvailabilityMap();
  const isAvailable = (p: Product) => p.variants.some((v) => availability[v.sku] !== false);

  const groups: CatalogGroup[] = categoryOrder
    .map((c) => ({ key: c, slug: categories[c].slug, name: categories[c].name, slugs: getProductsByCategory(c).map((p) => p.slug) }))
    .filter((g) => g.slugs.length);

  const aboveTheFold = new Set(groups[0]?.slugs.slice(0, 2));
  const cards = Object.fromEntries(
    visibleProducts.map((p) => [p.slug, <ProductCard key={p.slug} product={p} priority={aboveTheFold.has(p.slug)} available={isAvailable(p)} />]),
  );

  const entries: CatalogEntry[] = visibleProducts.map((p) => ({
    slug: p.slug,
    category: p.category,
    text: [p.name, p.short, p.aromas, p.origin ?? "", ...p.keywords, categories[p.category].name].join(" ").toLowerCase(),
    hasMaxi: p.variants.some((v) => v.force === "maxi"),
    hasDoux: p.variants.some((v) => v.force === 1),
    minPrice: Math.min(...p.variants.map((v) => v.priceCents)),
  }));

  return (
    <div>
      <JsonLd data={itemListJsonLd("Catalogue CBDoux", visibleProducts.map((p) => ({ name: p.name, path: `/produit/${p.slug}`, image: p.image })))} />

      <BoutiqueCatalog
        entries={entries}
        groups={groups}
        cards={cards}
        crumbs={<Breadcrumbs items={[{ name: "Boutique", path: "/boutique" }]} />}
        heading={
          <>
            <h1 className="t-h1">La boutique</h1>
            <p className="t-lead mt-6 measure-wide">
              {visibleProducts.length} références sélectionnées et analysées. Prix au gramme, port offert dès 60&nbsp;€, expédition sous 24&nbsp;h ouvrées.
            </p>
          </>
        }
      />

      {/* Renvoi vers les références sur commande */}
      <section className="wrap pt-6 sm:pt-10">
        <div className="panel sheet flex flex-wrap items-end justify-between gap-x-10 gap-y-7">
          <div className="measure-wide">
            <h2 className="t-h2">
              Sur commande, <em>{visibleOnOrderProducts.length} références de plus.</em>
            </h2>
            <p className="mt-4 text-foreground/80">{fr(`Des fleurs et des résines que nous commandons pour vous : livrées sous ${ON_ORDER_DELAY}, vendues au gramme, avec un prix de gros dès ${ON_ORDER_STEPS[0]} g.`)}</p>
          </div>
          <Link href="/sur-commande" className="btn btn-primary">
            Voir la section sur commande
          </Link>
        </div>
      </section>

      {/* Texte de présentation, sur papier */}
      <section className="wrap section-tight">
        <div className="panel sheet grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="t-h3">Acheter du CBD en ligne, en toute confiance</h2>
            <p className="mt-5 text-foreground/85">
              CBDoux est une boutique française indépendante installée dans le Haut-Doubs. Nous sélectionnons des fleurs de chanvre indoor, hydroponie et greenhouse, des résines filtrées et pressées, des huiles Full Spectrum à usage cutané et des solutions de vape, tous conformes à la réglementation française (THC inférieur à 0,3 %).
            </p>
            <p className="mt-4 text-foreground/85">
              Chaque lot est accompagné d'une analyse de laboratoire indépendante que vous pouvez consulter avant d'acheter. Les prix sont affichés au gramme et par 10 g, sans surprise : ce que vous voyez est ce que vous payez.
            </p>
          </div>
          <div>
            <h2 className="t-h3">Livraison rapide et discrète partout en France</h2>
            <p className="mt-5 text-foreground/85">
              Commande avant 13 h, colis expédié le jour même en Lettre suivie, Colissimo 48 h (offert dès 60 €) ou Chronopost Express 24 h. Emballage neutre, sachets hermétiques inodores, suivi en temps réel. Dans le Haut-Doubs, retrait gratuit à Damprichard et au Russey ou livraison à domicile par nos soins.
            </p>
            <p className="mt-4 text-foreground/85">
              Une question avant de commander ? Notre équipe répond sur WhatsApp 7 j/7 pour vous orienter vers la force et la variété qui vous conviennent.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
