import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderLookup } from "@/components/checkout/OrderLookup";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Suivre ma commande",
  description: "Suivez l'avancement de votre commande CBDoux : préparation, expédition, numéro de suivi Colissimo / Chronopost, retrait.",
  path: "/suivi",
  noIndex: true,
});

export default async function SuiviPage({ searchParams }: { searchParams: Promise<{ numero?: string; email?: string }> }) {
  const sp = await searchParams;
  return (
    <div className="mx-auto max-w-[900px] px-5 sm:px-8 py-10 sm:py-14">
      <Breadcrumbs items={[{ name: "Suivre ma commande", path: "/suivi" }]} className="mb-8" />
      <h1 className="font-serif text-4xl sm:text-6xl mb-4">
        Suivre <span className="font-serif-italic text-gradient-gold">ma commande</span>
      </h1>
      <p className="text-foreground/65 mb-10 max-w-xl">Saisissez votre numéro de commande (reçu par email, format CBD-XXXXXX-XXXX) et l'email utilisé lors de la commande.</p>
      <Suspense fallback={null}>
        <OrderLookup initialNumber={sp.numero} initialEmail={sp.email} />
      </Suspense>
    </div>
  );
}
