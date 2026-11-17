import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { cities, getCity, inCity } from "@/data/cities";
import { featuredProducts } from "@/data/products";
import { locations, site } from "@/data/site";
import { ProductCard } from "@/components/product/ProductCard";
import { PageHero } from "@/components/ui/PageHero";
import { HautDoubsMap } from "@/components/content/HautDoubsMap";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/JsonLd";
import { LiveTime } from "@/components/motion/ParisTime";
import { buildMetadata, vendingMachineJsonLd } from "@/lib/seo";
import { getAvailabilityMap } from "@/lib/stock";
import { fr } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return cities.map((c) => ({ ville: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ ville: string }> }): Promise<Metadata> {
  const { ville } = await params;
  const c = getCity(ville);
  if (!c) return {};
  return buildMetadata({ title: c.title, description: c.description, path: `/cbd/${c.slug}`, keywords: [`cbd ${c.name.toLowerCase()}`, `acheter cbd ${c.name.toLowerCase()}`, `livraison cbd ${c.name.toLowerCase()}`, "cbd doubs"] });
}

const modeCards = {
  distributeur: { title: "Distributeur ouvert 24 h/24", text: "Servez-vous à toute heure, paiement par carte, produits conservés à 20 °C.", href: "/distributeurs", cta: "Voir les distributeurs" },
  retrait: { title: "Retrait gratuit", text: "Commandez en ligne, retirez sur rendez-vous. Paiement par lien sécurisé ou sur place.", href: "/livraison", cta: "Comment ça marche" },
  "livraison-locale": { title: "Livraison à domicile", text: "Par nos soins, sous 24 à 48 h, remise en main propre. 10 €, offerte dès 100 €.", href: "/livraison", cta: "Zone et tarifs" },
  expedition: { title: "Expédition en 24/48 h", text: "Colissimo 48 h offert dès 60 €, Chronopost le lendemain, colis neutre.", href: "/livraison", cta: "Délais et tarifs" },
} as const;

export default async function CityPage({ params }: { params: Promise<{ ville: string }> }) {
  const { ville } = await params;
  const c = getCity(ville);
  if (!c) notFound();
  const availability = getAvailabilityMap();
  const machine = locations.vendingMachines.find((m) => m.id === c.slug);
  const nearby = c.nearby.map(getCity).filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <div>
      {machine && <JsonLd data={vendingMachineJsonLd(machine)} />}
      <PageHero
        crumbs={[
          { name: "CBD près de chez vous", path: "/cbd" },
          { name: c.name, path: `/cbd/${c.slug}` },
        ]}
        title={
          <>
            CBD <em>{inCity(c.name)}</em>
          </>
        }
        lead={fr(c.intro)}
      >
        <p className="t-num text-[0.9688rem] text-foreground/75">
          {c.postalCode}, {c.department}
        </p>
      </PageHero>

      <section className="wrap">
        <ul className="grid sm:grid-cols-2">
          {c.modes.map((m, n) => {
            // Sans distributeur dans la commune même, la carte dit où sont les plus proches.
            const card = m === "distributeur" && !machine ? { ...modeCards[m], title: "Distributeurs 24 h/24 à proximité", text: "À Charquemont et au Russey : servez-vous à toute heure, paiement par carte, produits conservés à 20 °C." } : modeCards[m];
            return (
              <li key={m} className={`border-t border-foreground/15 py-7 sm:pr-8 ${n % 2 ? "sm:border-l sm:pl-8" : ""} ${n >= c.modes.length - (c.modes.length % 2 === 0 ? 2 : 1) ? "sm:border-b" : ""}`}>
                <h2 className="t-h3">{fr(card.title)}</h2>
                <p className="mt-3 text-foreground/80">{fr(card.text)}</p>
                <Link href={card.href} className="link mt-4 inline-block">
                  {card.cta}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* La commune a son distributeur : sa fiche (photo, adresse, itinéraire), comme sur la page Distributeurs */}
      {machine && (
        <section className="nuit section mt-16 sm:mt-20">
          <div className="wrap grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-10">
            <div className="lg:col-span-5">
              <figure data-reveal="left" className="paper postcard mx-auto w-[80%] max-w-[23rem]" style={{ "--tilt": "-1.6deg", "--drift": "12px" } as CSSProperties}>
                <div className="overflow-hidden">
                  <Image src={machine.image} alt={machine.imageAlt} width={machine.imageSize[0]} height={machine.imageSize[1]} sizes="(max-width: 1024px) 80vw, 370px" className="block h-auto w-full" />
                </div>
                <figcaption>
                  <span className="t-note text-[1.1875rem] leading-tight">{machine.city}</span>
                  <span className="text-[0.8125rem] text-foreground/70">{machine.id === "charquemont" ? "La cabine" : "Le chalet"}</span>
                </figcaption>
              </figure>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <p className="flex items-center gap-3 text-[0.9688rem]">
                <span aria-hidden className="live-dot" />
                <LiveTime template="Il est {heure} : ouvert." fallback="Ouvert 24 h/24." />
              </p>
              <h2 className="t-h2 mt-4">
                Le distributeur <em>{c.name.startsWith("Le ") ? `du ${c.name.slice(3)}` : `de ${c.name}`}</em>
              </h2>
              <dl className="mt-7 text-[0.9688rem]">
                {[
                  [
                    "Adresse",
                    <address key="a" className="not-italic">
                      {machine.place}
                      <br />
                      {machine.street ? `${machine.street}, ` : ""}
                      {machine.postalCode} {machine.city}
                    </address>,
                  ],
                  ["Horaires", fr(`Ouvert ${machine.hours.replace(" — ", ", ")}`)],
                  ["Vente", "Validée en direct par caméra connectée"],
                  ["Paiement", machine.payment],
                ].map(([term, value]) => (
                  <div key={String(term)} className="grid grid-cols-[7rem_1fr] gap-x-4 border-t border-foreground/15 py-3 last:border-b">
                    <dt className="text-foreground/65">{term}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8 flex flex-wrap gap-2.5">
                {machine.mapsUrl && (
                  <a href={machine.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    Itinéraire
                  </a>
                )}
                <Link href={`/distributeurs#${machine.id}`} className="btn btn-ghost">
                  Comment ça marche
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="wrap section grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-10">
        <div className="lg:col-span-7">
          <div className="panel sheet prose-cbd">
            {c.body.map((para) => (
              <p key={para}>{fr(para)}</p>
            ))}
            <p>
              Tous nos produits respectent la réglementation française (THC &lt; 0,3 %), sont réservés aux adultes et accompagnés d'analyses de laboratoire. Consultez nos <Link href="/conseils-prudence">conseils de prudence</Link> avant utilisation.
            </p>
          </div>
        </div>
        <HautDoubsMap focus={c.slug} className="lg:col-span-5" />
      </section>

      <section className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <h2 className="t-h2">Notre sélection</h2>
          <Link href="/boutique" className="link">
            Tout le catalogue
          </Link>
        </div>
        <div className="product-grid mt-10">
          {featuredProducts.slice(0, 4).map((p) => (
            <ProductCard key={p.slug} product={p} available={p.variants.some((v) => availability[v.sku] !== false)} />
          ))}
        </div>
      </section>

      <section className="wrap section grid gap-10 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <h2 className="t-h2">Questions fréquentes {inCity(c.name)}</h2>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <Faq items={c.faq} />
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Demander conseil sur WhatsApp
            </a>
            <p className="t-num text-foreground/75">{site.phoneDisplay}, 7 jours sur 7</p>
          </div>
        </div>
      </section>

      {nearby.length > 0 && (
        <nav aria-label="Villes voisines" className="wrap flex flex-wrap items-center gap-2.5 pb-20">
          <span className="mr-2 text-foreground/70">À proximité</span>
          {nearby.map((n) => (
            <Link key={n.slug} href={`/cbd/${n.slug}`} className="btn btn-ghost btn-sm">
              CBD {inCity(n.name)}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
