import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Commande — livraison & paiement sécurisé",
  description: "Finalisez votre commande CBDoux : livraison partout en France, retrait gratuit, paiement sécurisé par carte, Apple Pay ou Google Pay.",
  robots: { index: false, follow: false },
};

export default function CommandePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[1200px] px-5 py-16 text-foreground/50">Chargement…</div>}>
      <CheckoutForm />
    </Suspense>
  );
}
