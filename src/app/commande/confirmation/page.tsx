import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { OrderStatusView } from "@/components/checkout/OrderStatusView";

export const metadata: Metadata = {
  title: "Confirmation de commande",
  robots: { index: false, follow: false },
};

export default async function ConfirmationPage({ searchParams }: { searchParams: Promise<{ n?: string; e?: string }> }) {
  const { n, e } = await searchParams;
  if (!n || !e) {
    return (
      <div className="mx-auto max-w-xl px-5 py-20 text-center">
        <h1 className="font-serif text-4xl mb-3">Commande introuvable</h1>
        <p className="text-foreground/60 mb-6">Le lien est incomplet. Utilisez la page de suivi avec votre numéro de commande et votre email.</p>
        <Link href="/suivi" className="btn-gold inline-flex rounded-full px-6 py-3 text-sm font-semibold">Suivre ma commande</Link>
      </div>
    );
  }
  return (
    <Suspense fallback={<div className="mx-auto max-w-xl px-5 py-20 text-center text-foreground/50">Vérification du paiement…</div>}>
      <OrderStatusView number={n} email={e} mode="confirmation" />
    </Suspense>
  );
}
