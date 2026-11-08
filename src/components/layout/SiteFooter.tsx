import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Mail, MessageCircle, ShieldCheck, Truck, Lock, FlaskConical } from "lucide-react";
import { site, footerNav, company } from "@/data/site";

const trust = [
  { icon: Truck, t: "Expédition 24/48 h", d: "Partout en France, colis neutre" },
  { icon: Lock, t: "Paiement sécurisé", d: "CB, Apple Pay, Google Pay via Mollie" },
  { icon: FlaskConical, t: "Analyses labo", d: "THC < 0,3 %, COA consultables" },
  { icon: ShieldCheck, t: "Vendeur français", d: "SARL SMART VEND · Haut-Doubs" },
];

export function SiteFooter() {
  return (
    <footer className="relative grain border-t border-foreground/10 bg-card/40 mt-24">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-gold w-[400px] h-[400px] -bottom-32 -right-20 opacity-20" />
      </div>

      {/* Réassurance */}
      <div className="relative border-b border-foreground/10">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {trust.map(({ icon: Icon, t, d }) => (
            <div key={t} className="flex items-start gap-3">
              <Icon className="text-gold shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-medium">{t}</p>
                <p className="text-xs text-foreground/55 mt-0.5">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Image src="/images/brand/logo.png" alt="CBDoux" width={200} height={58} className="h-10 w-auto mb-6 opacity-90" />
            <p className="font-serif text-3xl leading-[1] mb-4">
              La douceur<br />
              <span className="font-serif-italic text-foreground/55">du Haut-Doubs.</span>
            </p>
            <p className="text-sm text-foreground/65 max-w-sm leading-relaxed">
              CBD premium sélectionné et testé en laboratoire. Expédition discrète partout en France, retrait à Damprichard
              et au Russey, distributeurs automatiques 24/7 à Charquemont et au Russey.
            </p>
            <div className="mt-6 space-y-2 text-xs text-foreground/55">
              <p className="flex items-center gap-2">
                <MapPin size={12} className="text-gold" /> Damprichard · Le Russey · Charquemont · Maîche
              </p>
              <p className="flex items-center gap-2">
                <Clock size={12} className="text-gold" /> Distributeurs 24 h/24 — 7 j/7
              </p>
              <a href={`mailto:${site.email}`} className="flex items-center gap-2 hover:text-gold">
                <Mail size={12} className="text-gold" /> {site.email}
              </a>
              <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-gold">
                <MessageCircle size={12} className="text-gold" /> WhatsApp · {site.phoneDisplay}
              </a>
            </div>
          </div>

          <FooterColumn title="Boutique" links={footerNav.boutique} />
          <FooterColumn title="Infos pratiques" links={footerNav.infos} />
          <FooterColumn title="La maison" links={footerNav.maison} />
          <FooterColumn title="Légal" links={footerNav.legal} />
        </div>

        <div className="mt-14 rounded-2xl border border-gold/20 bg-background/60 px-5 py-4 text-[11px] leading-relaxed text-foreground/55">
          <strong className="text-foreground/75">Avertissement.</strong> Produits réservés aux personnes majeures (18+). Nos produits
          contiennent moins de 0,3 % de THC conformément à la réglementation française. Ils ne sont pas des médicaments et ne sont
          destinés ni à diagnostiquer, ni à traiter, ni à prévenir une quelconque maladie. Déconseillés aux femmes enceintes ou
          allaitantes. Ne pas conduire après consommation. Fleurs et résines destinées à la vaporisation ou à l'infusion — non
          destinées à la combustion. Huiles à usage cutané exclusivement.
        </div>

        <div className="mt-8 pt-6 border-t border-foreground/10 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/45">
          <p>
            © {new Date().getFullYear()} {site.name} · {company.legalName} ({company.legalForm}) · SIREN {company.siren}
          </p>
          <p>Paiement sécurisé · CB · Apple Pay · Google Pay</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: ReadonlyArray<{ href: string; label: string }> }) {
  return (
    <div className="lg:col-span-2">
      <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold mb-5">{title}</h2>
      <ul className="space-y-2.5 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-foreground/75 hover:text-gold transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
