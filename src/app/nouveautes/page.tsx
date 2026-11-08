import type { Metadata } from "next";
import { newProducts } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buildMetadata } from "@/lib/seo";
import { getAvailabilityMap } from "@/lib/stock";

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: "Nouveautés CBD : les dernières références CBDoux",
  description: "Découvrez les dernières arrivées CBDoux : Olivette Gold, Beldia, Piatella, Californienne Small Buds. Fleurs et résines CBD analysées, livraison France 24/48 h.",
  path: "/nouveautes",
});

export default async function NouveautesPage() {
  const availability = getAvailabilityMap();
  return (
    <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 py-10 sm:py-14">
      <Breadcrumbs items={[{ name: "Boutique", path: "/boutique" }, { name: "Nouveautés", path: "/nouveautes" }]} className="mb-8" />
      <SectionHeading as="h1" kicker="Nouveautés" title="Les dernières" italic="arrivées." className="mb-12">
        Nos références les plus récentes, sélectionnées et analysées comme toute la gamme.
      </SectionHeading>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {newProducts.map((p, i) => (
          <ProductCard key={p.slug} product={p} priority={i < 2} available={p.variants.some((v) => availability[v.sku] !== false)} />
        ))}
      </div>
    </div>
  );
}
