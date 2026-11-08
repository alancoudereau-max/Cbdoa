import type { Metadata } from "next";
import Link from "next/link";
import { Truck, Package, Clock, MapPin, Lock, ArrowRight, Zap, Mail } from "lucide-react";
import { shippingMethods, FREE_SHIPPING_FROM_CENTS, LOCAL_FREE_FROM_CENTS } from "@/lib/shipping";
import { shippingFaq } from "@/data/faq";
import { locations, site } from "@/data/site";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Faq } from "@/components/ui/Faq";
import { buildMetadata } from "@/lib/seo";
import { formatEUR } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Livraison CBD France 24/48 h, colis discret — port offert dès 60 €",
  description:
    "Expédition de votre CBD partout en France : Lettre suivie, Colissimo 48 h offert dès 60 €, Chronopost 24 h. Colis neutre, sachets hermétiques. Retrait gratuit à Damprichard & Le Russey.",
  path: "/livraison",
  keywords: ["livraison cbd", "cbd livraison 24h", "cbd colis discret", "frais de port cbd", "retrait cbd haut-doubs"],
});

const steps = [
  { icon: Lock, t: "Vous commandez", d: "Votre panier nous arrive sur WhatsApp en un clic. Nous confirmons la disponibilité et vous envoyons la facture avec un lien de paiement sécurisé (CB) ou un RIB." },
  { icon: Package, t: "Nous préparons", d: "Pesée précise, sachet hermétique inodore avec régulateur d'humidité, colis neutre sans aucune mention." },
  { icon: Zap, t: "Expédition le jour même", d: "Toute commande passée avant 13 h (jours ouvrés) part le jour même. Numéro de suivi envoyé par email." },
  { icon: Truck, t: "Vous recevez", d: "Chez vous en 24 h (Chronopost) ou 48 h (Colissimo), ou en boîte aux lettres (Lettre suivie)." },
];

export default function LivraisonPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12 py-10 sm:py-14">
      <Breadcrumbs items={[{ name: "Livraison & retrait", path: "/livraison" }]} className="mb-8" />
      <SectionHeading as="h1" kicker="Livraison & retrait" title="Partout en France," italic="en 24 à 48 h, en toute discrétion." className="mb-12">
        Port Colissimo offert dès {formatEUR(FREE_SHIPPING_FROM_CENTS)} d'achat. Et dans le Haut-Doubs : retrait gratuit, livraison à domicile par nos soins et distributeurs 24/7.
      </SectionHeading>

      {/* Étapes */}
      <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-16">
        {steps.map(({ icon: Icon, t, d }, i) => (
          <li key={t} className="rounded-2xl border border-foreground/10 bg-card/50 p-6">
            <div className="flex items-center justify-between mb-5">
              <Icon className="text-gold" size={24} />
              <span className="font-mono text-[10px] text-foreground/40">0{i + 1}</span>
            </div>
            <h2 className="font-serif text-2xl mb-2">{t}</h2>
            <p className="text-sm text-foreground/65 leading-relaxed">{d}</p>
          </li>
        ))}
      </ol>

      {/* Tarifs */}
      <section className="mb-16">
        <h2 className="font-serif text-3xl sm:text-4xl mb-6">Modes, délais et tarifs</h2>
        <div className="overflow-hidden rounded-3xl border border-foreground/10">
          <table className="w-full text-sm">
            <thead className="bg-card/60">
              <tr className="text-left font-mono text-[10px] uppercase tracking-[0.15em] text-gold">
                <th className="px-5 py-4">Mode</th>
                <th className="px-5 py-4 hidden sm:table-cell">Détail</th>
                <th className="px-5 py-4">Délai</th>
                <th className="px-5 py-4 text-right">Tarif</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/10">
              {shippingMethods.map((m) => (
                <tr key={m.id} className="align-top">
                  <td className="px-5 py-4 font-medium">
                    {m.name}
                    <span className="block sm:hidden text-xs text-foreground/55 font-normal mt-1">{m.description}</span>
                  </td>
                  <td className="px-5 py-4 text-foreground/65 hidden sm:table-cell">{m.description}</td>
                  <td className="px-5 py-4 text-foreground/80 whitespace-nowrap">{m.delay}</td>
                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <span className="text-gold font-medium">{m.priceCents === 0 ? "Gratuit" : formatEUR(m.priceCents)}</span>
                    {m.freeFromCents !== null && m.freeFromCents > 0 && <span className="block text-[11px] text-foreground/50">offert dès {formatEUR(m.freeFromCents)}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-foreground/50">
          Livraison en France métropolitaine uniquement. Délais indicatifs hors jours fériés et aléas transporteur. Livraison locale : rayon de 30 km autour du Russey et 10 km autour de Damprichard, offerte dès {formatEUR(LOCAL_FREE_FROM_CENTS)}.
        </p>
      </section>

      {/* Local */}
      <section className="mb-16 grid lg:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-gold/25 bg-gradient-to-br from-card to-card-2/40 p-7 sm:p-9">
          <MapPin className="text-gold mb-4" size={26} />
          <h2 className="font-serif text-3xl mb-3">Retrait gratuit dans le Haut-Doubs</h2>
          <p className="text-sm text-foreground/70 leading-relaxed mb-5">
            Choisissez « Retrait gratuit » à la commande. Nous convenons ensemble d'un rendez-vous par WhatsApp, généralement dès le lendemain. Paiement par lien sécurisé ou sur place.
          </p>
          <ul className="space-y-2 text-sm">
            {locations.pickupPoints.map((pp) => (
              <li key={pp.id} className="flex items-start gap-2"><MapPin size={14} className="text-gold mt-1 shrink-0" /> <span><strong>{pp.name}</strong> ({pp.postalCode}) — {pp.description}</span></li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-foreground/10 bg-card/50 p-7 sm:p-9">
          <Clock className="text-gold mb-4" size={26} />
          <h2 className="font-serif text-3xl mb-3">Distributeurs 24 h/24</h2>
          <p className="text-sm text-foreground/70 leading-relaxed mb-5">
            Besoin tout de suite ? Nos distributeurs automatiques de Charquemont et du Russey sont accessibles jour et nuit, paiement par carte, produits conservés à 20 °C.
          </p>
          <Link href="/distributeurs" className="btn-outline inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm">
            Voir les distributeurs <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="grid lg:grid-cols-12 gap-10 mb-16">
        <div className="lg:col-span-5">
          <SectionHeading kicker="Questions fréquentes" title="Livraison :" italic="vos questions." />
        </div>
        <div className="lg:col-span-7">
          <Faq items={shippingFaq} />
        </div>
      </section>

      <div className="rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/10 via-card/40 to-transparent p-8 sm:p-10 text-center">
        <Mail className="mx-auto text-gold mb-4" size={28} />
        <h2 className="font-serif text-3xl mb-3">Une question sur votre adresse ou votre colis ?</h2>
        <p className="text-foreground/70 mb-6 max-w-xl mx-auto">Écrivez-nous sur WhatsApp au {site.phoneDisplay} ou via le formulaire : nous vérifions ensemble la meilleure option pour vous.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/boutique" className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold">Commander <ArrowRight size={14} /></Link>
          <Link href="/contact" className="btn-outline inline-flex rounded-full px-6 py-3 text-sm">Nous contacter</Link>
        </div>
      </div>
    </div>
  );
}
