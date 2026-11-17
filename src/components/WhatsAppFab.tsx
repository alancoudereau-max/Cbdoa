"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { site } from "@/data/site";

/** Bouton WhatsApp flottant (masqué dans le tunnel de commande, sous le menu et sous la vérification d'âge). */
export function WhatsAppFab() {
  const pathname = usePathname();
  if (pathname.startsWith("/commande")) return null;
  return (
    <a
      href={`${site.whatsapp}?text=${encodeURIComponent("Bonjour CBDoux, j'aimerais un conseil.")}`}
      onClick={(e) => {
        // Sur une fiche produit, le message nomme le produit regardé : la conversation démarre au bon endroit.
        const topic = document.querySelector<HTMLElement>("[data-wa-topic]")?.dataset.waTopic;
        e.currentTarget.href = `${site.whatsapp}?text=${encodeURIComponent(topic ? `Bonjour CBDoux, j'aimerais un conseil sur ${topic}.` : "Bonjour CBDoux, j'aimerais un conseil.")}`;
      }}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Nous écrire sur WhatsApp"
      className="wa-fab fixed bottom-4 right-4 z-40 inline-flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-full bg-[#1f8f55] text-white shadow-[0_14px_30px_-12px_rgba(3,14,10,0.9)] ring-1 ring-etiquette/25 transition-[transform,opacity,background-color] duration-300 hover:scale-105 hover:bg-[#18784a] sm:bottom-6 sm:right-6"
    >
      <MessageCircle aria-hidden size={23} strokeWidth={1.6} />
    </a>
  );
}
