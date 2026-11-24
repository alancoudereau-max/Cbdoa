import type { Metadata } from "next";
import { newProducts } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { PageHero } from "@/components/ui/PageHero";
import { buildMetadata } from "@/lib/seo";
import { getAvailabilityMap } from "@/lib/stock";


export const metadata: Metadata = buildMetadata({
  title: "Nouveautés CBD : les dernières références CBDoux",
  description: "Les dernières arrivées CBDoux : Artic Blue, Mango Pops, Royal Dwarf Small Buds, résine Jaune Mousseux. Fleurs et résines CBD, livraison France 24/48 h.",
  path: "/nouveautes",
});

export default async function NouveautesPage() {
  const availability = getAvailabilityMap();
  return (
    <div>
      <PageHero
        crumbs={[
          { name: "Boutique", path: "/boutique" },
          { name: "Nouveautés", path: "/nouveautes" },
        ]}
        title={
          <>
            Les dernières <em>arrivées</em>
          </>
        }
        lead="Nos références les plus récentes, sélectionnées et analysées comme toute la gamme."
      />
      <section className="wrap pb-24">
        <div className="product-grid">
          {newProducts.map((p, i) => (
            <ProductCard key={p.slug} product={p} priority={i < 2} headingLevel={2} available={p.variants.some((v) => availability[v.sku] !== false)} />
          ))}
        </div>
      </section>
    </div>
  );
}
