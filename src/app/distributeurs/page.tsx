import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Thermometer, Package, CreditCard, MessageCircle, ArrowRight, ExternalLink } from "lucide-react";
import { locations, site } from "@/data/site";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata, vendingMachineJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Distributeurs CBD 24h/24 à Charquemont et au Russey (Doubs)",
  description:
    "Deux distributeurs automatiques CBDoux ouverts 24 h/24, 7 j/7 : Charquemont (Station Lavage Central) et Le Russey (Hôtel du Commerce, face à la mairie). Paiement CB, produits conservés à 20 °C.",
  path: "/distributeurs",
  image: "/images/brand/distributeur-charquemont.jpg",
  keywords: ["distributeur cbd", "distributeur cbd 24h", "cbd charquemont", "cbd le russey", "distributeur automatique cbd doubs", "cbd maîche"],
});

const faq = [
  { q: "Comment fonctionne le distributeur ?", a: "Choisissez votre produit sur l'écran, payez par carte bancaire (sans contact ou code), récupérez votre sachet. Le distributeur fonctionne 24 h/24, 7 j/7, même les jours fériés." },
  { q: "Les produits sont-ils les mêmes qu'en ligne ?", a: "Oui : mêmes lots, mêmes analyses de laboratoire. La sélection du distributeur est plus restreinte (références phares) et réassortie régulièrement." },
  { q: "Comment les produits sont-ils conservés ?", a: "À 20 °C grâce à un thermostat, dans des sachets hermétiques équipés d'un régulateur d'humidité biphase. Les arômes et la fraîcheur sont préservés été comme hiver." },
  { q: "Le distributeur vérifie-t-il l'âge ?", a: "Les distributeurs sont réservés aux adultes et placés dans des lieux surveillés. La vente de CBD aux mineurs est interdite : merci de respecter cette règle." },
  { q: "Un produit n'est plus disponible dans le distributeur ?", a: "Écrivez-nous sur WhatsApp : nous vous indiquons la date de réassort ou vous proposons un retrait / une livraison." },
];

export default function DistributeursPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12 py-10 sm:py-14">
      <JsonLd data={locations.vendingMachines.map((m) => vendingMachineJsonLd(m))} />
      <Breadcrumbs items={[{ name: "Distributeurs 24/7", path: "/distributeurs" }]} className="mb-8" />
      <SectionHeading as="h1" kicker="Jour et nuit · Haut-Doubs" title="Nos distributeurs" italic="automatiques 24 h/24." className="mb-12">
        Deux distributeurs CBDoux opérationnels en permanence à Charquemont et au Russey. Servez-vous quand vous voulez, en toute discrétion.
      </SectionHeading>

      <div className="space-y-8">
        {locations.vendingMachines.map((m, i) => (
          <section key={m.id} id={m.id} className="rounded-3xl border border-gold/25 bg-gradient-to-br from-card via-card-2/40 to-card p-6 sm:p-10 shadow-deep scroll-mt-28">
            <div className={`grid gap-8 lg:grid-cols-2 items-center ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-gold mb-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" /> Opérationnel
                </div>
                <h2 className="font-serif text-4xl sm:text-5xl text-gradient-gold mb-3">{m.city}</h2>
                <p className="text-sm sm:text-base text-foreground/70 mb-6 leading-relaxed">{m.details}</p>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3"><MapPin size={18} className="text-gold mt-0.5 shrink-0" /> {m.place} · {m.postalCode} {m.city}</li>
                  <li className="flex items-start gap-3"><Clock size={18} className="text-gold mt-0.5 shrink-0" /> Ouvert {m.hours}</li>
                  <li className="flex items-start gap-3"><CreditCard size={18} className="text-gold mt-0.5 shrink-0" /> Paiement par {m.payment.toLowerCase()}</li>
                  <li className="flex items-start gap-3"><Thermometer size={18} className="text-gold mt-0.5 shrink-0" /> Température régulée à 20 °C</li>
                  <li className="flex items-start gap-3"><Package size={18} className="text-gold mt-0.5 shrink-0" /> Sachets de conservation biphase</li>
                </ul>
                <div className="mt-6 flex flex-wrap gap-3">
                  {m.mapsUrl && (
                    <a href={m.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-gold inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold">
                      Itinéraire <ExternalLink size={14} />
                    </a>
                  )}
                  <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-outline inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm">
                    <MessageCircle size={14} /> Une question ?
                  </a>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-gold/30 via-transparent to-gold/10 blur-2xl" />
                <Image src={m.image} alt={`Distributeur automatique CBD CBDoux à ${m.city} — ouvert 24h/24`} width={989} height={1400} sizes="(max-width: 1024px) 100vw, 480px" className="relative w-full max-w-sm mx-auto rounded-2xl border border-gold/30" priority={i === 0} />
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Points de retrait */}
      <section className="mt-16">
        <h2 className="font-serif text-3xl sm:text-4xl mb-6 text-center">Points de retrait & livraison locale</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {locations.pickupPoints.map((pp) => (
            <div key={pp.id} className="rounded-2xl border border-gold/25 bg-card/60 p-7">
              <div className="flex items-center gap-2 text-gold mb-3"><MapPin size={18} /><span className="font-mono text-[10px] uppercase tracking-widest">Retrait gratuit</span></div>
              <h3 className="font-serif text-3xl text-gradient-gold mb-2">{pp.name}</h3>
              <p className="text-sm text-foreground/70">{pp.description}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-foreground/60">
          Livraison à domicile par nos soins dans un rayon de 30 km autour du Russey et 10 km autour de Damprichard (10 €, offerte dès 100 €).{" "}
          <Link href="/livraison" className="text-gold underline underline-offset-2">Tous les détails</Link>
        </p>
      </section>

      <section className="mt-16 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5"><SectionHeading kicker="Questions fréquentes" title="Distributeurs :" italic="comment ça marche." /></div>
        <div className="lg:col-span-7"><Faq items={faq} /></div>
      </section>

      <div className="mt-16 text-center">
        <Link href="/boutique" className="btn-gold inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-semibold">
          Commander en ligne, livré partout en France <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
