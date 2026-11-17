import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import { locations, site, vendingSupervision } from "@/data/site";
import { HautDoubsMap } from "@/components/content/HautDoubsMap";
import { PageHero } from "@/components/ui/PageHero";
import { WatchDial } from "@/components/home/WatchDial";
import { LiveTime } from "@/components/motion/ParisTime";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata, vendingMachineJsonLd } from "@/lib/seo";
import { fr } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Distributeur CBD 24h/24 : Charquemont & Le Russey",
  description:
    "Deux distributeurs automatiques de CBD ouverts 24 h/24 dans le Doubs, à Charquemont et au Russey. Chaque vente est validée en direct par caméra connectée.",
  path: "/distributeurs",
  image: "/images/distributeurs/le-russey-chalet.jpg",
  keywords: ["distributeur cbd", "distributeur automatique cbd", "distributeur cbd 24h", "distributeur cbd doubs", "cbd charquemont", "cbd le russey"],
});

const faq = [
  {
    q: "Comment fonctionne un distributeur automatique de CBD ?",
    a: "Vous vous présentez devant la caméra connectée du distributeur. Un membre de l'équipe vous voit, vous répond par son haut-parleur intégré, vérifie que vous êtes majeur, vous conseille si besoin, puis vous communique le code qui déverrouille l'achat. Vous choisissez votre produit, payez par carte bancaire et récupérez votre sachet.",
  },
  {
    q: "Le distributeur est-il vraiment ouvert 24 h/24 ?",
    a: "Oui, 7 j/7, jours fériés compris. La validation par caméra connectée fonctionne de jour comme de nuit.",
  },
  {
    q: "Un mineur peut-il acheter au distributeur ?",
    a: "Non. La vente de CBD est interdite aux mineurs et la machine reste verrouillée tant qu'un membre de l'équipe n'a pas vérifié, par caméra, que le client est majeur : une pièce d'identité peut vous être demandée. Sans le code que nous vous communiquons par le haut-parleur de la caméra, aucune vente n'est possible.",
  },
  { q: "Quels moyens de paiement sont acceptés ?", a: "La carte bancaire, sans contact ou avec code." },
  { q: "Les produits sont-ils les mêmes qu'en ligne ?", a: "Oui : mêmes lots, mêmes analyses de laboratoire. La sélection du distributeur est plus restreinte (références phares) et réassortie régulièrement." },
  { q: "Comment les produits sont-ils conservés ?", a: "À 20 °C grâce à un thermostat, dans des sachets hermétiques équipés d'un régulateur d'humidité biphase. Les arômes et la fraîcheur sont préservés été comme hiver." },
  { q: "Un produit n'est plus disponible dans le distributeur ?", a: "Écrivez-nous sur WhatsApp : nous vous indiquons la date de réassort ou vous proposons un retrait ou une livraison." },
];

export default function DistributeursPage() {
  const [, russey] = locations.vendingMachines;
  return (
    <div>
      <JsonLd data={locations.vendingMachines.map((m) => vendingMachineJsonLd(m))} />

      <PageHero
        crumbs={[{ name: "Distributeurs 24/7", path: "/distributeurs" }]}
        title={
          <>
            Distributeurs de CBD ouverts 24 h/24, <em>validés en direct</em>
          </>
        }
        titleClassName="max-w-[15ch]"
        lead="Deux distributeurs automatiques CBDoux dans le Doubs, à Charquemont et au Russey. Vous êtes servi à toute heure, et jamais seul : chaque vente est validée en direct par un membre de l'équipe."
        guilloche={false}
        aside={
          <div className="mx-auto w-[min(78vw,20rem)] lg:ml-auto lg:mr-4 lg:w-[23rem]">
            <WatchDial />
          </div>
        }
      >
        <ul className="points grid max-w-[44rem] text-[0.9688rem] sm:grid-cols-3">
          {["Ouverts 24 h/24, 7 jours sur 7", "Caméra connectée avec haut-parleur", "Majorité vérifiée à chaque vente"].map((t, n) => (
            <li key={t} className={`text-balance border-t border-foreground/15 py-3.5 sm:border-b sm:pr-4 ${n ? "sm:border-l sm:pl-9 sm:before:left-4" : ""} ${n === 2 ? "border-b" : ""}`}>
              {t}
            </li>
          ))}
        </ul>
      </PageHero>

      {/* Localisateur : une fiche par distributeur */}
      {locations.vendingMachines.map((m, i) => (
        <section key={m.id} id={m.id} className={`${i % 2 ? "" : "nuit"} section scroll-mt-24`}>
          <div className="wrap grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-10">
            <div className={`relative lg:col-span-6 ${i % 2 ? "lg:order-2 lg:col-start-7" : ""}`}>
              <figure className="paper postcard relative z-[1] mx-auto w-[88%] max-w-[30rem]" style={{ "--tilt": i % 2 ? "1.4deg" : "-1.4deg", "--drift": "8px" } as CSSProperties}>
                <div className="overflow-hidden">
                  <Image src={m.image} alt={m.imageAlt} width={m.imageSize[0]} height={m.imageSize[1]} sizes="(max-width: 1024px) 88vw, 480px" className="block h-auto w-full" priority={i === 0} />
                </div>
                <figcaption>
                  <span className="t-note text-[1.1875rem] leading-tight">{m.city}</span>
                  <span className="text-[0.8125rem] text-foreground/70">{m.id === "charquemont" ? "La cabine" : "Le chalet"}</span>
                </figcaption>
              </figure>
              {m.secondImage && (
                <figure className="paper postcard relative z-[2] -mt-[22%] ml-auto mr-0 w-[52%] max-w-[17rem] sm:mr-4" style={{ "--tilt": "-2.2deg", "--drift": "28px" } as CSSProperties}>
                  <div className="overflow-hidden">
                    <Image src={m.secondImage.src} alt={m.secondImage.alt} width={m.secondImage.size[0]} height={m.secondImage.size[1]} sizes="(max-width: 1024px) 52vw, 270px" className="block h-auto w-full" />
                  </div>
                  <figcaption>
                    <span className="t-note text-[1.0625rem] leading-tight">Face à la mairie</span>
                  </figcaption>
                </figure>
              )}
            </div>

            <div className={`lg:col-span-5 ${i % 2 ? "lg:order-1 lg:col-start-1" : "lg:col-start-8"}`}>
              <p className="flex items-center gap-3 text-[0.9688rem]">
                <span aria-hidden className="live-dot" />
                <LiveTime template="Il est {heure} : ouvert." fallback="Ouvert 24 h/24." />
              </p>
              <h2 className="t-h2 mt-4">Distributeur CBD {m.city.startsWith("Le ") ? `du ${m.city.slice(3)}` : `de ${m.city}`}</h2>
              <p className="mt-5 text-foreground/80">{fr(m.details)}</p>
              <dl className="mt-7 text-[0.9688rem]">
                {[
                  ["Adresse", <address key="a">{m.place}<br />{m.street ? `${m.street}, ` : ""}{m.postalCode} {m.city}</address>],
                  ["Horaires", fr(`Ouvert ${m.hours.replace(" — ", ", ")}`)],
                  ["Vente", "Validée en direct par caméra connectée"],
                  ["Paiement", m.payment],
                  ["Conservation", "À 20 °C, en sachets biphase"],
                  ["Assistance", <span key="p"><a href={`tel:${site.phoneE164}`} className="link t-num">{site.phoneDisplay}</a>, appel ou WhatsApp, 7 jours sur 7</span>],
                ].map(([term, value]) => (
                  <div key={String(term)} className="grid grid-cols-[7rem_1fr] gap-x-4 border-t border-foreground/15 py-3 last:border-b">
                    <dt className="text-foreground/65">{term}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8 flex flex-wrap gap-2.5">
                {m.mapsUrl && (
                  <a href={m.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    Itinéraire
                  </a>
                )}
                <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                  Poser une question
                </a>
                {m.reviewUrl && (
                  <a href={m.reviewUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                    Donner mon avis sur Google
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Fonctionnement : validation en direct */}
      <section className="nuit section" id="fonctionnement">
        <div className="wrap">
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
            <h2 className="t-h2 lg:col-span-6">{vendingSupervision.title}, de jour comme de nuit</h2>
            <p className="t-lead lg:col-span-5 lg:col-start-8 lg:self-end">
              La vente de CBD est interdite aux mineurs. Sur nos distributeurs, aucun achat n'est possible sans le code communiqué par l'équipe : c'est notre façon de garantir un service responsable, avec le conseil en plus.
            </p>
          </div>
          <ol className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4">
            {vendingSupervision.steps.map((s, n) => (
              <li key={s.title} className={`border-t border-foreground/15 py-6 sm:pr-7 lg:border-b ${n ? "lg:border-l lg:pl-7" : ""} ${n % 2 ? "sm:border-l sm:pl-7" : ""}`}>
                <span aria-hidden className="step-num step-num-lg">
                  {n + 1}
                </span>
                <h3 className="t-title mt-5">{s.title}</h3>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-foreground/75">{fr(s.text)}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-foreground/75">{fr(vendingSupervision.support)}</p>
        </div>
      </section>

      {/* Points de retrait */}
      <section className="wrap section">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <h2 className="t-h2">Points de retrait et livraison locale</h2>
            <HautDoubsMap className="mt-9" />
          </div>
          <div className="lg:col-span-6 lg:col-start-7 lg:self-center">
            {locations.pickupPoints.map((pp) => (
              <div key={pp.id} className="grid gap-x-8 gap-y-1 border-t border-foreground/15 py-5 sm:grid-cols-[15rem_1fr] lg:max-xl:grid-cols-1">
                <h3 className="t-h3">{pp.name}</h3>
                <p className="text-foreground/80 sm:pt-2">
                  <strong className="font-medium text-foreground">Retrait gratuit.</strong> {pp.description.replace("Retrait gratuit sur rendez-vous", "Sur rendez-vous")}
                </p>
              </div>
            ))}
            <p className="border-t border-foreground/15 pt-5 text-foreground/80">
              Livraison à domicile par nos soins dans un rayon de 30 km autour du Russey et 10 km autour de Damprichard (10 €, offerte dès 100 €).{" "}
              <Link href="/livraison" className="link">
                Tous les détails
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="nuit section">
        <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <h2 className="t-h2">Distributeurs : vos questions</h2>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <Faq items={faq} />
            <Link href="/boutique" className="btn btn-primary mt-10">
              Commander en ligne
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
