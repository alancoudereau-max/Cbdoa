import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Clock, ThumbsUp } from "lucide-react";
import { site } from "@/data/site";
import { ContactForm } from "@/components/contact/ContactForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact CBDoux — conseil, commande, livraison",
  description: "Contactez CBDoux par WhatsApp, email ou formulaire : conseil avant achat, suivi de commande, livraison dans le Haut-Doubs et partout en France.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-12 py-10 sm:py-14">
      <Breadcrumbs items={[{ name: "Contact", path: "/contact" }]} className="mb-8" />
      <SectionHeading as="h1" kicker="On vous répond" title="Contact" italic="& conseil." className="mb-12">
        Une commande, un conseil sur une force, une livraison à organiser ? Écrivez-nous : nous répondons rapidement, 7 jours sur 7.
      </SectionHeading>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <ContactForm />
        <div className="space-y-4">
          <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="flex gap-4 rounded-2xl border border-gold/30 bg-gold/10 p-5 hover:border-gold transition-colors">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-gold text-background"><MessageCircle aria-hidden size={24} /></span>
            <div>
              <p className="kicker mb-0.5">WhatsApp — réponse rapide</p>
              <p className="font-serif text-2xl">{site.phoneDisplay}</p>
              <p className="text-xs text-foreground/60 mt-1">{site.supportHours}</p>
            </div>
          </a>
          {[
            { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
            { icon: Clock, label: "Délai de réponse", value: "Généralement dans la journée, 7 j/7." },
            { icon: MapPin, label: "Zone", value: "Damprichard · Le Russey · Charquemont · Maîche — expédition France entière" },
          ].map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="rounded-2xl border border-gold/15 bg-card/60 p-5 flex gap-4">
              <Icon className="text-gold mt-0.5 shrink-0" size={20} />
              <div>
                <p className="kicker mb-0.5">{label}</p>
                {href ? <a href={href} className="text-sm text-foreground/90 hover:text-gold">{value}</a> : <p className="text-sm text-foreground/90">{value}</p>}
              </div>
            </div>
          ))}
          <div className="flex gap-3">
            <a href={site.facebook} target="_blank" rel="noopener noreferrer" className="btn-outline inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm"><ThumbsUp size={16} /> Facebook</a>
            <a href={site.googleMaps} target="_blank" rel="noopener noreferrer" className="btn-outline inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm"><MapPin size={16} /> Google Maps</a>
          </div>
          <p className="text-xs text-foreground/50 flex items-start gap-2"><MessageCircle size={12} className="text-gold mt-0.5" /> Pour un conseil avant achat, précisez votre expérience du CBD : nous vous orienterons vers la force adaptée.</p>
        </div>
      </div>
    </div>
  );
}
