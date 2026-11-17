import type { Metadata } from "next";
import Link from "next/link";
import { shippingMethods, FREE_SHIPPING_FROM_CENTS, LOCAL_FREE_FROM_CENTS } from "@/lib/shipping";
import { shippingFaq } from "@/data/faq";
import { locations, site } from "@/data/site";
import { HautDoubsMap } from "@/components/content/HautDoubsMap";
import { PageHero } from "@/components/ui/PageHero";
import { Faq } from "@/components/ui/Faq";
import { buildMetadata } from "@/lib/seo";
import { formatEUR, fr } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Livraison CBD 24/48 h en France, offerte dès 60 €",
  description:
    "Votre CBD expédié partout en France : Lettre suivie, Colissimo 48 h offert dès 60 €, Chronopost 24 h. Colis neutre. Retrait gratuit à Damprichard et au Russey.",
  path: "/livraison",
  keywords: ["livraison cbd", "cbd livraison 24h", "cbd colis discret", "frais de port cbd", "retrait cbd haut-doubs"],
});

const steps = [
  { t: "Vous commandez", d: "Votre panier nous arrive sur WhatsApp en un geste. Nous confirmons la disponibilité et vous envoyons la facture avec un lien de paiement sécurisé (carte) ou un RIB." },
  { t: "Nous préparons", d: "Pesée précise, sachet hermétique inodore avec régulateur d'humidité, colis neutre sans aucune mention." },
  { t: "Expédition le jour même", d: "Toute commande passée avant 13 h (jours ouvrés) part le jour même. Numéro de suivi envoyé par email." },
  { t: "Vous recevez", d: "Chez vous en 24 h (Chronopost) ou 48 h (Colissimo), ou en boîte aux lettres (Lettre suivie)." },
];

export default function LivraisonPage() {
  return (
    <div>
      <PageHero
        crumbs={[{ name: "Livraison & retrait", path: "/livraison" }]}
        title="Partout en France, en 24 à 48 h, en toute discrétion"
        titleClassName="max-w-[17ch]"
        lead={fr(`Port Colissimo offert dès ${formatEUR(FREE_SHIPPING_FROM_CENTS)} d'achat. Et dans le Haut-Doubs : retrait gratuit, livraison à domicile par nos soins et distributeurs ouverts jour et nuit.`)}
      >
        <Link href="/boutique" className="btn btn-primary">
          Voir la boutique
        </Link>
      </PageHero>

      {/* Étapes */}
      <section className="nuit section-tight">
        <ol className="wrap grid sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ t, d }, n) => (
            <li key={t} className={`border-t border-foreground/15 py-6 sm:pr-7 lg:border-b ${n ? "lg:border-l lg:pl-7" : ""} ${n % 2 ? "sm:border-l sm:pl-7" : ""}`}>
              <p className="t-num font-serif text-[2.5rem] font-light leading-none text-or">{n + 1}</p>
              <h2 className="t-title mt-4">{t}</h2>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-foreground/75">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Tarifs, sur papier */}
      <section className="wrap section">
        <div className="panel sheet">
          <h2 className="t-h2">Modes, délais et tarifs</h2>
          {/* Un vrai tableau sur grand écran ; sur téléphone, chaque mode devient une fiche :
              le nom et le tarif en tête, le délai dessous, puis le détail sur toute la largeur. */}
          <table role="table" className="mt-8 block w-full text-[0.9688rem] md:table">
            <thead role="rowgroup" className="sr-only md:not-sr-only">
              <tr role="row" className="border-b border-foreground/50 text-left text-[0.875rem]">
                <th role="columnheader" scope="col" className="py-3 pr-4 font-semibold">
                  Mode
                </th>
                <th role="columnheader" scope="col" className="py-3 pr-4 font-semibold">
                  Détail
                </th>
                <th role="columnheader" scope="col" className="py-3 pr-4 font-semibold">
                  Délai
                </th>
                <th role="columnheader" scope="col" className="py-3 text-right font-semibold">
                  Tarif
                </th>
              </tr>
            </thead>
            <tbody role="rowgroup" className="block border-t border-foreground/50 md:table-row-group md:border-t-0">
              {shippingMethods.map((m) => (
                <tr role="row" key={m.id} className="grid grid-cols-[1fr_auto] gap-x-5 border-b border-foreground/20 py-5 align-top md:table-row md:py-0">
                  <th role="rowheader" scope="row" className="block text-left text-[1.0625rem] font-medium leading-snug md:table-cell md:py-4 md:pr-4 md:text-[0.9688rem] md:leading-[inherit]">
                    {m.name}
                  </th>
                  <td role="cell" className="col-span-2 row-start-3 block pt-2.5 text-[0.9063rem] leading-relaxed text-foreground/75 md:table-cell md:py-4 md:pr-4 md:text-[0.9688rem] md:text-foreground/80">
                    {fr(m.description)}
                  </td>
                  <td role="cell" className="col-start-1 row-start-2 block pt-0.5 text-foreground/80 md:table-cell md:whitespace-nowrap md:py-4 md:pr-4 md:text-foreground">
                    {fr(m.delay)}
                  </td>
                  <td role="cell" className="col-start-2 row-span-2 row-start-1 block whitespace-nowrap text-right md:table-cell md:py-4">
                    <span className="text-[1.0625rem] font-semibold md:text-[0.9688rem]">{m.priceCents === 0 ? "Gratuit" : formatEUR(m.priceCents)}</span>
                    {m.freeFromCents !== null && m.freeFromCents > 0 && <span className="block text-[0.8125rem] text-foreground/70">offert dès {formatEUR(m.freeFromCents)}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="t-fine mt-5 measure-wide">
            Livraison en France métropolitaine uniquement. Délais indicatifs hors jours fériés et aléas transporteur. Livraison locale : rayon de 30 km autour du Russey et 10 km autour de Damprichard, offerte dès {formatEUR(LOCAL_FREE_FROM_CENTS)}.
          </p>
        </div>
      </section>

      {/* Sur place */}
      <section className="wrap grid gap-12 pb-20 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <HautDoubsMap />
        </div>
        <div className="grid content-start gap-12 lg:col-span-6 lg:col-start-7">
          <div className="border-t border-foreground/15 pt-8">
            <h2 className="t-h3">Retrait gratuit dans le Haut-Doubs</h2>
            <p className="mt-4 text-foreground/80">
              Choisissez « Retrait gratuit » à la commande. Nous convenons ensemble d'un rendez-vous par WhatsApp, généralement dès le lendemain. Paiement par lien sécurisé ou sur place.
            </p>
            <ul className="mt-5 space-y-2 text-[0.9688rem] text-foreground/85">
              {locations.pickupPoints.map((pp) => (
                <li key={pp.id}>
                  <strong className="font-medium text-foreground">
                    {pp.name} ({pp.postalCode})
                  </strong>{" "}
                  : {pp.description.charAt(0).toLowerCase() + pp.description.slice(1)}
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-foreground/15 pt-8">
            <h2 className="t-h3">Distributeurs ouverts 24 h/24</h2>
            <p className="mt-4 text-foreground/80">
              Besoin tout de suite ? Nos distributeurs automatiques de Charquemont et du Russey sont accessibles jour et nuit, paiement par carte, produits conservés à 20 °C.
            </p>
            <Link href="/distributeurs" className="btn btn-ghost mt-6">
              Voir les distributeurs
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="nuit section">
        <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <h2 className="t-h2">Livraison : vos questions</h2>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <Faq items={shippingFaq} />
            <div className="mt-12 border-t border-foreground/25 pt-8">
              <h2 className="t-h3">Une question sur votre adresse ou votre colis ?</h2>
              <p className="mt-3 text-foreground/80">Écrivez-nous sur WhatsApp au {site.phoneDisplay} ou via le formulaire : nous vérifions ensemble la meilleure option pour vous.</p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <Link href="/boutique" className="btn btn-primary">
                  Commander
                </Link>
                <Link href="/contact" className="btn btn-ghost">
                  Nous contacter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
