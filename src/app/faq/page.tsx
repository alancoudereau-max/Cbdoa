import type { Metadata } from "next";
import Link from "next/link";
import { homeFaq, shippingFaq } from "@/data/faq";
import { categoryFaq } from "@/data/category-faq";
import { categories, categoryOrder } from "@/data/products";
import { PageHero } from "@/components/ui/PageHero";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata, faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "FAQ CBD : légalité, livraison, paiement, forces",
  description: "Vos questions sur le CBD et CBDoux : légalité en France, livraison discrète, commande et paiement, forces Classique à Maxi, fleurs, résines, huiles, vape.",
  path: "/faq",
  keywords: ["faq cbd", "questions cbd", "cbd légal", "livraison cbd", "paiement cbd"],
});

export default function FaqPage() {
  const groups = [
    { title: "Général & légalité", items: homeFaq },
    { title: "Livraison & retrait", items: shippingFaq },
    ...categoryOrder.map((c) => ({ title: categories[c].name, items: categoryFaq[c] })),
  ];
  const all = groups.flatMap((g) => g.items);
  return (
    <div>
      <JsonLd data={faqJsonLd(all)} />
      <PageHero
        crumbs={[{ name: "FAQ", path: "/faq" }]}
        title="Tout ce qu'il faut savoir"
        lead={
          <>
            Vous ne trouvez pas votre réponse ?{" "}
            <Link href="/contact" className="link">
              Écrivez-nous
            </Link>
            , nous répondons 7 jours sur 7.
          </>
        }
      />
      <div>
        {groups.map((g) => (
          <section key={g.title} className="wrap grid gap-6 border-b border-foreground/20 py-14 last:border-b-0 sm:py-20 lg:grid-cols-12 lg:gap-10">
            <h2 className="t-h3 lg:col-span-4">{g.title}</h2>
            <div className="lg:col-span-7 lg:col-start-6">
              <Faq items={g.items} withJsonLd={false} />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
