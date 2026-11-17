import type { Metadata } from "next";
import { site } from "@/data/site";
import { ContactForm } from "@/components/contact/ContactForm";
import { PageHero } from "@/components/ui/PageHero";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact CBDoux — conseil, commande, livraison",
  description: "Contactez CBDoux par WhatsApp, email ou formulaire : conseil avant achat, suivi de commande, livraison dans le Haut-Doubs et partout en France.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div>
      <PageHero
        crumbs={[{ name: "Contact", path: "/contact" }]}
        title={
          <>
            Contact <em>et conseil</em>
          </>
        }
        lead="Une commande, un conseil sur une force, une livraison à organiser ? Écrivez-nous : nous répondons rapidement, 7 jours sur 7."
      />

      <div className="wrap grid gap-12 pb-24 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <ContactForm />
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="group block border-t border-foreground/15 py-6">
            <span className="block text-foreground/70">WhatsApp, la réponse la plus rapide</span>
            <span className="softens t-num mt-2 block font-serif text-[2.4rem] font-light leading-none tracking-[-0.02em]">{site.phoneDisplay}</span>
            <span className="t-fine mt-3 block">{site.supportHours}</span>
          </a>
          <dl className="text-[0.9688rem]">
            <div className="border-t border-foreground/15 py-4">
              <dt className="text-foreground/65">Email</dt>
              <dd className="mt-1">
                <a href={`mailto:${site.email}`} className="link">
                  {site.email}
                </a>
              </dd>
            </div>
            <div className="border-t border-foreground/15 py-4">
              <dt className="text-foreground/65">Délai de réponse</dt>
              <dd className="mt-1">Généralement dans la journée, 7 jours sur 7.</dd>
            </div>
            <div className="border-y border-foreground/15 py-4">
              <dt className="text-foreground/65">Zone</dt>
              <dd className="mt-1">Damprichard, Le Russey, Charquemont, Maîche. Expédition dans toute la France.</dd>
            </div>
          </dl>
          <div className="mt-7 flex flex-wrap gap-2.5">
            <a href={site.facebook} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
              Facebook
            </a>
            <a href={site.googleMaps} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
              Google Maps
            </a>
          </div>
          <p className="t-fine mt-7">Pour un conseil avant achat, précisez votre expérience du CBD : nous vous orienterons vers la force adaptée.</p>
        </div>
      </div>
    </div>
  );
}
