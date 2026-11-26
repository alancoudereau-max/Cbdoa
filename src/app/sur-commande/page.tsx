import type { Metadata } from "next";
import Link from "next/link";
import { visibleOnOrderProducts, formatPrice, lowestPerGramCents } from "@/data/products";
import { onOrderGroups } from "@/data/sur-commande";
import { onOrderFaq } from "@/data/category-faq";
import { site } from "@/data/site";
import { ProductCard } from "@/components/product/ProductCard";
import { PageHero } from "@/components/ui/PageHero";
import { Faq } from "@/components/ui/Faq";
import { Fleuron } from "@/components/ui/Fleuron";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata, itemListJsonLd } from "@/lib/seo";
import { getAvailabilityMap } from "@/lib/stock";
import { ON_ORDER_DELAY, ON_ORDER_MIN_GRAMS, ON_ORDER_QUOTE_FROM_GRAMS, ON_ORDER_STEPS, gramsLabel } from "@/lib/pricing";
import { fr } from "@/lib/utils";

const COUNT = visibleOnOrderProducts.length;
/** Fleurs, résines et rocks : les références vendues au poids. */
const WEIGHED = visibleOnOrderProducts.filter((p) => !p.objet).length;
const OBJECTS = COUNT - WEIGHED;
const FROM = formatPrice(lowestPerGramCents(visibleOnOrderProducts) ?? 0);

export const metadata: Metadata = buildMetadata({
  title: "CBD sur commande : fleurs et résines au prix de gros",
  description: `${WEIGHED} fleurs et résines de CBD, cosmétiques et accessoires sur commande, livrées sous ${ON_ORDER_DELAY} partout en France. Dès ${ON_ORDER_MIN_GRAMS} g, prix de gros dès ${ON_ORDER_STEPS[0]} g et ${ON_ORDER_STEPS[1]} g, dès ${FROM}/g. THC < 0,3 %.`,
  path: "/sur-commande",
  keywords: ["cbd sur commande", "cbd prix de gros", "fleur cbd 100 g", "résine cbd 100 g", "cbd en gros particulier", "fleur cbd 500 g", "small buds cbd pas cher", "pollen cbd prix de gros"],
});

const steps = [
  { t: "Vous choisissez", d: `Ajoutez vos références au panier, par ${ON_ORDER_MIN_GRAMS} g, 100 g ou 500 g. Votre récapitulatif nous arrive sur WhatsApp en un geste.` },
  { t: "Nous confirmons", d: "Nous vérifions la disponibilité et le délai, puis nous vous envoyons votre facture avec un lien de paiement sécurisé." },
  { t: "Nous commandons", d: "Votre lot est commandé dès réception du paiement, puis pesé et mis en sachet hermétique chez nous." },
  { t: "Vous recevez", d: `Le colis, neutre et suivi, arrive chez vous sous ${ON_ORDER_DELAY} environ, partout en France métropolitaine.` },
];

export default function SurCommandePage() {
  const availability = getAvailabilityMap();
  const groups = onOrderGroups.map((g) => ({ ...g, products: visibleOnOrderProducts.filter((p) => p.onOrder === g.key) })).filter((g) => g.products.length);
  const waUrl = `${site.whatsapp}?text=${encodeURIComponent("Bonjour CBDoux, j'ai une question sur une référence sur commande.")}`;

  return (
    <div>
      <JsonLd data={itemListJsonLd("CBD sur commande", visibleOnOrderProducts.map((p) => ({ name: p.name, path: `/produit/${p.slug}`, image: p.image })))} />

      <PageHero
        crumbs={[
          { name: "Boutique", path: "/boutique" },
          { name: "Sur commande", path: "/sur-commande" },
        ]}
        title={
          <>
            Sur commande, <em>livré sous 1&nbsp;semaine.</em>
          </>
        }
        titleClassName="max-w-[15ch]"
        lead={fr(`${WEIGHED} fleurs et résines de CBD de plus, et ${OBJECTS} cosmétiques et accessoires, que nous commandons pour vous. Fleurs et résines à partir de ${ON_ORDER_MIN_GRAMS} g par référence, avec un prix de gros dès ${ON_ORDER_STEPS[0]} g et dès ${ON_ORDER_STEPS[1]} g, et expédiées partout en France.`)}
      >
        <p className="t-num text-[0.9688rem] text-foreground/75">{fr(`${COUNT} références, dès ${FROM} le gramme, commande minimale de ${ON_ORDER_MIN_GRAMS} g, THC inférieur à 0,3 %`)}</p>
        <nav aria-label="Familles de produits sur commande" className="mt-6 flex flex-wrap gap-2.5">
          {groups.map((g) => (
            <a key={g.key} href={`#${g.key}`} className="btn btn-ghost btn-sm">
              {g.name}
            </a>
          ))}
        </nav>
      </PageHero>

      {/* Les quatre étapes */}
      <section className="nuit section-tight">
        <ol className="wrap grid sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ t, d }, n) => (
            <li key={t} className={`border-t border-foreground/15 py-6 sm:pr-7 lg:border-b ${n ? "lg:border-l lg:pl-7" : ""} ${n % 2 ? "sm:border-l sm:pl-7" : ""}`}>
              <span aria-hidden className="step-num step-num-lg">
                {n + 1}
              </span>
              <h2 className="t-title mt-5">{t}</h2>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-foreground/75">{fr(d)}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Les familles */}
      {groups.map((g, n) => (
        <section key={g.key} id={g.key} className="wrap scroll-mt-28 pt-16 sm:pt-20">
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
            <h2 className="t-h2">{g.title}</h2>
            <p className="t-num text-[0.9375rem] text-foreground/70">
              {g.products.length} référence{g.products.length > 1 ? "s" : ""}, dès {(() => { const perGram = lowestPerGramCents(g.products); return perGram ? `${formatPrice(perGram)}/g` : formatPrice(Math.min(...g.products.flatMap((p) => p.variants.map((v) => v.priceCents)))); })()}
            </p>
          </div>
          <p className="mt-4 measure-wide text-foreground/80">{fr(g.intro)}</p>
          <div className="product-grid mt-9">
            {g.products.map((p, i) => (
              <ProductCard key={p.slug} product={p} priority={n === 0 && i < 2} hideBadge available={p.variants.some((v) => availability[v.sku] !== false)} />
            ))}
          </div>
        </section>
      ))}

      <div className="wrap pt-16 sm:pt-20">
        <Fleuron />
      </div>

      {/* Les prix et les questions, sur papier */}
      <section className="wrap section pt-12 sm:pt-16">
        <div className="panel sheet grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="prose-cbd lg:col-span-7">
            <h2>Comment se calculent les prix</h2>
            <p>
              {fr(`Pour les fleurs et les résines, la commande minimale est de ${ON_ORDER_MIN_GRAMS} g par référence. Chacune a trois prix au gramme : le prix de base, un prix de gros à partir de ${ON_ORDER_STEPS[0]} g et un prix encore plus bas à partir de ${ON_ORDER_STEPS[1]} g. Le palier se calcule sur le poids total d'une même référence dans votre panier, tous formats additionnés : quatre sachets de 25 g sont au prix des 100 g.`)}
            </p>
            <p>{fr(`Le prix « dès » affiché sur chaque étiquette est le plus bas des trois, celui des ${ON_ORDER_STEPS[1]} g. À partir de ${gramsLabel(ON_ORDER_QUOTE_FROM_GRAMS)} d'une même référence, écrivez-nous sur WhatsApp : le prix se fixe sur demande.`)}</p>
            <h2>Ce que sont ces produits</h2>
            <p>
              Des fleurs, des petites têtes, du trim et des résines en CBD classique, la force la plus douce de notre gamme : aucune n'est enrichie en cannabinoïdes. Les fleurs enrobées (moon rocks et ice rocks) sont plus concentrées en CBD ; leur fiche le précise. Le taux de THC de chaque référence reste sous le plafond légal de 0,3&nbsp;%, et le certificat d'analyse du lot vous est transmis sur demande avant de commander.
            </p>
            <p>{fr("Les cosmétiques et les accessoires sont des produits de marque, neufs, vendus dans leur emballage d'origine et au prix public conseillé, à la pièce, au carnet ou à la boîte.")}</p>
            <p>
              Ces produits sont réservés aux personnes majeures et ne sont pas des médicaments. Ils sont destinés à la vaporisation, ni à la combustion ni à un usage alimentaire. Les photos sont celles de la référence : l'aspect et les arômes varient d'un lot à l'autre. Consultez nos <Link href="/conseils-prudence">conseils de prudence</Link>.
            </p>
            <p>
              <a href={waUrl} target="_blank" rel="noopener noreferrer">
                Une question, une variété que vous cherchez&nbsp;? Écrivez-nous sur WhatsApp
              </a>
              .
            </p>
          </div>
          <aside className="lg:col-span-5">
            <h2 className="t-h3">Questions fréquentes</h2>
            <Faq items={onOrderFaq} className="mt-5" />
          </aside>
        </div>
      </section>

      <nav aria-label="Autres rayons" className="wrap flex flex-wrap gap-2.5 pb-20">
        <Link href="/boutique" className="btn btn-ghost btn-sm">
          Les produits en stock
        </Link>
        <Link href="/livraison" className="btn btn-ghost btn-sm">
          Livraison et retrait
        </Link>
        <Link href="/analyses-laboratoires" className="btn btn-ghost btn-sm">
          Analyses de laboratoire
        </Link>
      </nav>
    </div>
  );
}
