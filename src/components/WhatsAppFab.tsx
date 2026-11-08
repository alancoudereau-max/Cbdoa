"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { site } from "@/data/site";

export function WhatsAppFab() {
  const pathname = usePathname();
  // Pas de bouton flottant dans le tunnel de commande ni dans l'admin
  if (pathname.startsWith("/commande") || pathname.startsWith("/admin")) return null;
  return (
    <a
      href={`${site.whatsapp}?text=${encodeURIComponent("Bonjour CBDoux, j'aimerais un conseil.")}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Nous écrire sur WhatsApp"
      className="fixed bottom-5 right-5 z-40 inline-flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.6)] hover:scale-105 transition-transform"
      style={{ width: 52, height: 52 }}
    >
      <MessageCircle size={24} />
    </a>
  );
}
