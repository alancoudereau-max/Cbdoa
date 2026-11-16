import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Thermometer, CreditCard, MessageCircle, ArrowRight, ExternalLink, Video, ShieldCheck, Phone, Star } from "lucide-react";
import { locations, site, vendingSupervision } from "@/data/site";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata, vendingMachineJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Distributeur CBD 24h/24 : Charquemont & Le Russey",
  description:
    "Deux distributeurs automatiques de CBD ouverts 24 h/24 dans le Doubs, à Charquemont et au Russey. Chaque vente est validée en direct par caméra et interphone.",
  path: "/distributeurs",
  image: "/images/brand/distributeur-charquemont.jpg",
  keywords: ["distributeur cbd", "distributeur automatique cbd", "distributeur cbd 24h", "distributeur cbd doubs", "cbd charquemont", "cbd le russey"],
});

const faq = [
  {
    q: "Comment fonctionne un distributeur automatique de CBD ?",
    a: "Vous vous présentez devant la caméra du distributeur. Un membre de l'équipe vous répond par l'interphone, vérifie que vous êtes majeur, vous conseille si besoin, puis vous communique le code qui déverrouille l'achat. Vous choisissez votre produit, payez par carte bancaire et récupérez votre sachet.",
  },
  {
    q: "Le distributeur est-il vraiment ouvert 24 h/24 ?",
    a: "Oui, 7 j/7, jours fériés compris. La validation par caméra et interphone fonctionne de jour comme de nuit.",
  },
  {
    q: "Un mineur peut-il acheter au distributeur ?",
    a: "Non. La vente de CBD est interdite aux mineurs et la machine reste verrouillée tant qu'un membre de l'équipe n'a pas vérifié, par caméra, que le client est majeur. Sans le code communiqué par l'interphone, aucune vente n'est possible.",
  },
  { q: "Quels moyens de paiement sont acceptés ?", a: "La carte bancaire, sans contact ou avec code." },
  { q: "Les produits sont-ils les mêmes qu'en ligne ?", a: "Oui : mêmes lots, mêmes analyses de laboratoire. La sélection du distributeur est plus restreinte (références phares) et réassortie régulièrement." },
  { q: "Comment les produits sont-ils conservés ?", a: "À 20 °C grâce à un thermostat, dans des sachets hermétiques équipés d'un régulateur d'humidité biphase. Les arômes et la fraîcheur sont préservés été comme hiver." },
  { q: "Un produit n'est plus disponible dans le distributeur ?", a: "Écrivez-nous sur WhatsApp : nous vous indiquons la date de réassort ou vous proposons un retrait ou une livraison." },
];

export default function DistributeursPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12 py-10 sm:py-14">
      <JsonLd data={locations.vendingMachines.map((m) => vendingMachineJsonLd(m))} />
      <Breadcrumbs items={[{ name: "Distributeurs 24/7", path: "/distributeurs" }]} className="mb-8" />
      <SectionHeading as="h1" kicker="Jour et nuit · Haut-Doubs" title="Distributeurs de CBD" italic="ouverts 24 h/24, validés en direct." className="mb-8">
        Deux distributeurs automatiques CBDoux dans le Doubs, à Charquemont et au Russey. Vous êtes servi à toute heure, et jamais seul : chaque vente est validée en direct par un membre de l'équipe.
      </SectionHeading>

      <ul className="mb-12 grid gap-3 sm:grid-cols-3 text-sm">
        <li className="flex items-center gap-3 rounded-2xl border border-gold/25 bg-card/50 px-5 py-4"><Clock size={18} className="text-gold shrink-0" /> Ouverts 24 h/24, 7 j/7</li>
        <li className="flex items-center gap-3 rounded-2xl border border-gold/25 bg-card/50 px-5 py-4"><Video size={18} className="text-gold shrink-0" /> Caméra et interphone en direct</li>
        <li className="flex items-center gap-3 rounded-2xl border border-gold/25 bg-card/50 px-5 py-4"><ShieldCheck size={18} className="text-gold shrink-0" /> Majorité vérifiée à chaque vente</li>
      </ul>

      {/* Localisateur : une fiche par distributeur */}
      <div className="space-y-8">
        {locations.vendingMachines.map((m, i) => (
          <section key={m.id} id={m.id} className="rounded-3xl border border-gold/25 bg-gradient-to-br from-card via-card-2/40 to-card p-6 sm:p-10 shadow-deep scroll-mt-28">
            <div className={`grid gap-8 lg:grid-cols-2 items-center ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-gold mb-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" /> Opérationnel
                </div>
                <h2 className="font-serif text-4xl sm:text-5xl text-gradient-gold mb-3">Distributeur CBD {m.city.startsWith("Le ") ? `du ${m.city.slice(3)}` : `de ${m.city}`}</h2>
                <p className="text-sm sm:text-base text-foreground/70 mb-6 leading-relaxed">{m.details}</p>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <MapPin size={18} className="text-gold mt-0.5 shrink-0" />
                    <address className="not-italic">
                      {m.place}
                      <br />
                      {m.street ? `${m.street}, ` : ""}
                      {m.postalCode} {m.city}
                    </address>
                  </li>
                  <li className="flex items-start gap-3"><Clock size={18} className="text-gold mt-0.5 shrink-0" /> Ouvert {m.hours}</li>
                  <li className="flex items-start gap-3"><Video size={18} className="text-gold mt-0.5 shrink-0" /> Vente validée en direct par caméra et interphone</li>
                  <li className="flex items-start gap-3"><CreditCard size={18} className="text-gold mt-0.5 shrink-0" /> Paiement par {m.payment.toLowerCase()}</li>
                  <li className="flex items-start gap-3"><Thermometer size={18} className="text-gold mt-0.5 shrink-0" /> Produits conservés à 20 °C, sachets biphase</li>
                  <li className="flex items-start gap-3">
                    <Phone size={18} className="text-gold mt-0.5 shrink-0" />
                    <span>
                      Assistance : <a href={`tel:${site.phoneE164}`} className="text-gold underline underline-offset-2">{site.phoneDisplay}</a> (appel ou WhatsApp, 7 j/7)
                    </span>
                  </li>
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
                  {m.reviewUrl && (
                    <a href={m.reviewUrl} target="_blank" rel="noopener noreferrer" className="btn-outline inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm">
                      <Star size={14} /> Donner mon avis sur Google
                    </a>
                  )}
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-gold/30 via-transparent to-gold/10 blur-2xl" />
                <Image src={m.image} alt={`Distributeur automatique de CBD CBDoux à ${m.city}, ouvert 24 h/24`} width={989} height={1400} sizes="(max-width: 1024px) 100vw, 480px" className="relative w-full max-w-sm mx-auto rounded-2xl border border-gold/30" priority={i === 0} />
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Fonctionnement : validation en direct */}
      <section className="mt-16" id="fonctionnement">
        <SectionHeading kicker="Comment ça marche" title={vendingSupervision.title + ","} italic="de jour comme de nuit." className="mb-8">
          La vente de CBD est interdite aux mineurs. Sur nos distributeurs, aucun achat n'est possible sans le code communiqué par l'équipe : c'est notre façon de garantir un service responsable, avec le conseil en plus.
        </SectionHeading>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {vendingSupervision.steps.map((s, i) => (
            <li key={s.title} className="rounded-2xl border border-foreground/10 bg-card/50 p-6">
              <p className="font-serif text-4xl text-gold mb-3">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="font-serif text-xl leading-tight mb-2">{s.title}</h3>
              <p className="text-sm text-foreground/65 leading-relaxed">{s.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-sm text-foreground/60">{vendingSupervision.support}</p>
      </section>

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
        <div className="lg:col-span-5"><SectionHeading kicker="Questions fréquentes" title="Distributeurs :" italic="vos questions." /></div>
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
