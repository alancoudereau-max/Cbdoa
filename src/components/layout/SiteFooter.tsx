import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { site, footerNav, company } from "@/data/site";

const columns = [
  { title: "Boutique", links: footerNav.boutique },
  { title: "Infos pratiques", links: footerNav.infos },
  { title: "La maison", links: footerNav.maison },
  { title: "Légal", links: footerNav.legal },
] as const;

export function SiteFooter() {
  return (
    <footer className="nuit relative overflow-hidden">
      <div aria-hidden className="guilloche guilloche-rosace opacity-[0.1] w-[130vw] sm:w-[900px] -right-[60vw] sm:-right-72 -top-[30vw] sm:-top-64" />

      <div className="relative wrap">
        <div aria-hidden className="rule-double" />
      </div>
      <div className="relative wrap pt-20 sm:pt-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="t-h2">La douceur du Haut-Doubs.</p>
            <p className="mt-6 measure text-foreground/75">
              Du CBD choisi avec soin et analysé en laboratoire. Expédié partout en France en colis neutre, à retirer à Damprichard et au Russey, ou servi jour et nuit par nos distributeurs de Charquemont et du Russey.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                WhatsApp {site.phoneDisplay}
              </a>
              <a href={`mailto:${site.email}`} className="btn btn-ghost">
                {site.email}
              </a>
            </div>
          </div>

          <nav aria-label="Pied de page" className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:col-span-7 lg:pl-8">
            {columns.map((col) => (
              <div key={col.title}>
                <h2 className="font-sans text-[0.9375rem] font-semibold tracking-normal text-or">{col.title}</h2>
                <ul className="mt-4 space-y-2.5 text-[0.9375rem]">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-foreground/75 transition-colors hover:text-foreground">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-16 border-t border-foreground/15 pt-8 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <p className="t-fine lg:col-span-7">
            <strong className="text-foreground/90">Avertissement.</strong> Produits réservés aux personnes majeures. Ils contiennent moins de 0,3 % de THC, conformément à la réglementation française. Ils ne sont pas des médicaments et ne sont destinés ni à diagnostiquer, ni à traiter, ni à prévenir une quelconque maladie. Déconseillés aux femmes enceintes ou allaitantes. Ne pas conduire après usage. Fleurs et résines destinées à la vaporisation, non à la combustion ni à un usage alimentaire. Huiles à usage cutané exclusivement.
          </p>
          <p className="t-fine lg:col-span-5 lg:pl-8">
            Commande par WhatsApp, paiement par lien sécurisé (carte bancaire) ou virement, après confirmation.
            <br />© {new Date().getFullYear()} {site.name}, nom commercial de {company.legalName} ({company.legalForm}), SIREN {company.siren}.
          </p>
        </div>
      </div>

      {/* Le logo en grand, gravé au trait */}
      <div aria-hidden className="relative wrap pt-14 pb-24 sm:pb-10 opacity-60">
        <Logo outline weight="fine" className="h-auto w-full" />
      </div>
    </footer>
  );
}
