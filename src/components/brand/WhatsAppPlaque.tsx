import type { CSSProperties } from "react";
import { MessageCircle } from "lucide-react";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";
import { HexOrnament, Logo, Ornament } from "./Logo";

/**
 * Plaque « Pour nous rejoindre sur WhatsApp » : la version du site de l'affichette
 * posée sur les distributeurs (fond vert profond, liseré or, alvéoles).
 */
export function WhatsAppPlaque({ className }: { className?: string }) {
  return (
    <a
      href={site.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Écrire à CBDoux sur WhatsApp au ${site.phoneDisplay}`}
      className={cn("card-emerald spotlight group relative flex flex-col items-center justify-between gap-8 overflow-hidden rounded-2xl px-6 py-9 text-center transition-colors hover:border-gold", className)}
    >
      <span aria-hidden className="hex-lines" style={{ "--hex-x": "50%", "--hex-y": "110%" } as CSSProperties} />
      <span className="relative block">
        <Logo weight="fine" className="mx-auto h-12" />
        <Ornament className="mt-4" />
      </span>
      <span className="relative block">
        <span className="block font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-gold-light/85">Pour nous rejoindre sur WhatsApp</span>
        <span className="mt-4 flex items-center justify-center gap-3">
          <MessageCircle aria-hidden className="h-8 w-8 shrink-0 text-gold" />
          <span className="font-serif text-[2.6rem] leading-none text-gradient-gold whitespace-nowrap">{site.phoneDisplay}</span>
        </span>
        <span className="mt-4 block text-sm text-foreground/70">Conseil, commande, suivi de colis : une vraie personne vous répond, 7 j/7.</span>
      </span>
      <HexOrnament className="relative w-52 text-gold/55 transition-colors group-hover:text-gold/80" />
    </a>
  );
}
