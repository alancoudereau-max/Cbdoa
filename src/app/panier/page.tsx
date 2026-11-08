import type { Metadata } from "next";
import { CartPage } from "@/components/cart/CartPage";

export const metadata: Metadata = {
  title: "Votre panier",
  description: "Récapitulatif de votre panier CBDoux. Port offert dès 60 €, commande simple par WhatsApp.",
  robots: { index: false, follow: true },
};

export default function PanierPage() {
  return <CartPage />;
}
