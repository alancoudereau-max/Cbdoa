import { site } from "@/data/site";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

/**
 * Plaque « Pour nous rejoindre sur WhatsApp » : la version du site de l'affichette
 * posée sur les distributeurs (vert profond, filets dorés, gravure en fond).
 */
export function WhatsAppPlaque({ className }: { className?: string }) {
  return (
    <a
      href={site.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Écrire à CBDoux sur WhatsApp au ${site.phoneDisplay}`}
      className={cn("nuit group relative block overflow-hidden rounded-[3px] px-7 py-12 text-center ring-1 ring-or/55 ring-offset-[5px] ring-offset-noir", className)}
    >
      <span aria-hidden className="guilloche guilloche-rosace opacity-[0.14] left-1/2 top-1/2 w-[34rem] -translate-x-1/2 -translate-y-1/2" />
      <span className="relative block">
        <Logo weight="fine" className="mx-auto h-11" />
        <span aria-hidden className="rule-double mx-auto mt-6 block w-20" />
        <span className="mt-7 block text-foreground/80">Pour nous rejoindre sur WhatsApp</span>
        <span className="softens t-num mt-3 block whitespace-nowrap font-serif text-[clamp(2.2rem,8vw,3rem)] font-light leading-none tracking-[-0.02em]">{site.phoneDisplay}</span>
        <span className="t-fine mx-auto mt-5 block max-w-[22rem]">Conseil, commande, suivi de colis : une vraie personne vous répond, 7 jours sur 7.</span>
      </span>
    </a>
  );
}
