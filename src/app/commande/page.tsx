import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Finaliser ma commande",
  description: "Finalisez votre commande CBDoux : coordonnées, livraison partout en France ou retrait gratuit, envoi du récapitulatif sur WhatsApp.",
  robots: { index: false, follow: false },
};

export default function CommandePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-[1200px] px-5 py-16 text-foreground/50">Chargement…</div>}>
      <CheckoutForm />
    </Suspense>
  );
}
