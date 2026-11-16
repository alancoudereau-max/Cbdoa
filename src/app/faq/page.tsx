import type { Metadata } from "next";
import Link from "next/link";
import { homeFaq, shippingFaq } from "@/data/faq";
import { categoryFaq } from "@/data/category-faq";
import { categories, categoryOrder } from "@/data/products";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
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
    <div className="mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-12 py-10 sm:py-14">
      <JsonLd data={faqJsonLd(all)} />
      <Breadcrumbs items={[{ name: "FAQ", path: "/faq" }]} className="mb-8" />
      <SectionHeading as="h1" kicker="Questions fréquentes" title="Tout ce qu'il" italic="faut savoir." className="mb-12">
        Vous ne trouvez pas votre réponse ? <Link href="/contact" className="text-gold underline underline-offset-2">Écrivez-nous</Link>, nous répondons 7 j/7.
      </SectionHeading>
      <div className="space-y-12">
        {groups.map((g) => (
          <section key={g.title}>
            <h2 className="font-serif text-3xl mb-5">{g.title}</h2>
            <Faq items={g.items} withJsonLd={false} />
          </section>
        ))}
      </div>
    </div>
  );
}
