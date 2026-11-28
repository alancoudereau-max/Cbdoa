import { site } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * « Nous recherchons des emplacements » : l'appel à toute personne, professionnel ou particulier, qui dispose d'un
 * lieu pour accueillir un distributeur. Posé sur le vert de l'enseigne, entre deux filets d'or, pour se détacher
 * des sections sombres qui l'entourent. Affiché sur l'accueil et sur la page des distributeurs.
 * Le bouton ouvre WhatsApp avec un premier message déjà écrit (`MESSAGE`).
 */
const MESSAGE = "Bonjour, j'ai un emplacement à vous proposer pour un distributeur.";

/** Les conditions, telles que l'exploitant les a données le 28/11/2026. */
const conditions = ["Loyer négociable", "Professionnels comme particuliers", "Contrat d'exploitation, ou autre formule à discuter"];

export function RechercheEmplacements({ className }: { className?: string }) {
  return (
    <section id="emplacements" className={cn("band band-rules section-tight relative scroll-mt-24 overflow-hidden text-foreground", className)}>
      <div aria-hidden className="guilloche guilloche-rosace opacity-[0.14] w-[130vw] sm:w-[820px] -right-[78vw] sm:-right-[340px] top-1/2 -translate-y-1/2" />
      <div className="relative wrap grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-10">
        <div className="lg:col-span-7">
          <h2 className="t-h2">
            Nous recherchons <em>des emplacements.</em>
          </h2>
          <p className="t-lead mt-6 measure">{site.name} est en recherche permanente de nouveaux emplacements pour installer ses distributeurs automatiques.</p>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <ul className="points text-[1.0625rem] font-medium">
            {conditions.map((c) => (
              <li key={c} className="border-t border-or/30 py-3.5 last:border-b before:top-[1.735rem]">
                {c}
              </li>
            ))}
          </ul>
          <a href={`${site.whatsapp}?text=${encodeURIComponent(MESSAGE)}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-8 max-sm:w-full">
            Contactez-moi sur WhatsApp
          </a>
          <p className="t-fine mt-4">
            WhatsApp&nbsp;: <span className="t-num whitespace-nowrap">{site.phoneDisplay}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
