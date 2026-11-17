import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { site, locations, vendingSupervision } from "@/data/site";
import { categories, categoryOrder, featuredProducts, visibleProducts, getProductsByCategory, getProduct, forceLabels, startingPriceLabel, minPriceCents, formatPrice, type Category, type Force } from "@/data/products";
import { homeFaq } from "@/data/faq";
import { guides } from "@/data/guides";
import { ProductCard } from "@/components/product/ProductCard";
import { GuideRows } from "@/components/content/GuideRows";
import { Faq } from "@/components/ui/Faq";
import { Fleuron } from "@/components/ui/Fleuron";
import { CopyCode } from "@/components/ui/CopyCode";
import { JsonLd } from "@/components/JsonLd";
import { AutoVideo } from "@/components/motion/AutoVideo";
import { LiveTime } from "@/components/motion/ParisTime";
import { WatchDial } from "@/components/home/WatchDial";
import { GoldDust } from "@/components/motion/GoldDust";
import { HautDoubsMap } from "@/components/content/HautDoubsMap";
import { ForceGauge, type ForceOption } from "@/components/home/ForceGauge";
import { Rosette } from "@/components/brand/Logo";
import { itemListJsonLd, buildMetadata } from "@/lib/seo";
import { getAvailabilityMap } from "@/lib/stock";
import { shippingMethods, LOCAL_FREE_FROM_CENTS } from "@/lib/shipping";
import { formatEUR, fr } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "CBDoux — CBD premium du Haut-Doubs, livraison France 24/48 h",
  description: "Fleurs, résines, huiles cutanées et vape CBD testés en laboratoire (THC < 0,3 %). Livraison France 24/48 h offerte dès 60 €, distributeurs 24 h/24 dans le Doubs.",
  path: "/",
  keywords: ["cbd", "boutique cbd en ligne", "fleur cbd", "résine cbd", "cbd haut-doubs", "cbd livraison france", "cbd doubs"],
});

/** Rang d'apparition (variable CSS --i) dans la séquence d'ouverture. */
const i = (n: number) => ({ "--i": n }) as CSSProperties;

/** Prix d'appel d'un rayon : au gramme quand il existe, sinon le premier prix. */
function categoryFrom(key: Category): string {
  const list = getProductsByCategory(key);
  const perGram = list.flatMap((p) => p.variants.filter((v) => v.format === "1 g").map((v) => v.priceCents));
  if (perGram.length) return `dès ${formatPrice(Math.min(...perGram))} le gramme`;
  return `dès ${formatPrice(Math.min(...list.map(minPriceCents)))}`;
}

/** Vidéos tournées par CBDoux (boucles allégées dans /public/videos/loops) */
const reels = [
  { slug: "californienne-indoor-small-buds", loop: "small-buds", title: "Californienne Small Buds", note: "Petites têtes denses et givrées" },
  { slug: "piatella", loop: "piatella", title: "Piatella", note: "Un cœur finement granuleux" },
  { slug: "beldia", loop: "beldia", title: "Beldia", note: "La résine de caractère" },
];

const forceLinks: Record<string, { href: string; cta: string }> = {
  "1": { href: "/boutique?force=doux", cta: "Voir les références Classique" },
  "2": { href: "/fleurs-cbd", cta: "Voir les fleurs" },
  "3": { href: "/cbd-puissant", cta: "Voir le CBD puissant" },
  maxi: { href: "/boutique?force=maxi", cta: "Voir la Force Maxi" },
};

/** Chiffres clés : la partie numérique s'anime en comptant (attribut data-count), le texte reste lisible sans script. */
const stats = [
  { count: visibleProducts.length, before: "", after: "", label: "références analysées", note: "Les certificats sont publiés.", href: "/analyses-laboratoires" },
  { count: null, before: "<\u00a00,3\u00a0%", after: "", label: "de THC, pour chaque lot", note: "Conforme à la loi française." },
  { count: 60, before: "", after: "\u00a0€", label: "d'achat, et le port est offert", note: "Colis neutre, parti le jour même." },
  { count: 24, before: "", after: "\u00a0h/24", label: "distributeurs ouverts", note: "À Charquemont et au Russey." },
];

/** Disposition des quatre rayons : une grande carte, deux moyennes, une large. */
const tileLayout = ["col-span-2 aspect-[5/4] lg:row-span-2 lg:aspect-auto lg:min-h-[38rem]", "aspect-[4/5] lg:aspect-auto lg:min-h-[18.25rem]", "aspect-[4/5] lg:aspect-auto lg:min-h-[18.25rem]", "col-span-2 aspect-[16/9] lg:aspect-auto lg:min-h-[18.25rem]"];

const journey = [
  { when: "Avant 13 h", what: "Vous commandez" },
  { when: "Le jour même", what: "Votre colis part" },
  { when: "Le lendemain", what: "Chronopost 24 h" },
  { when: "Sous 48 h", what: "Colissimo, offert dès 60 €" },
];

const localDelivery = shippingMethods.find((m) => m.id === "livraison-locale")!;
const nearby = [
  { t: "Distributeurs 24 h/24", d: "À Charquemont et au Russey, jour et nuit, paiement par carte." },
  { t: "Retrait gratuit", d: "À Damprichard ou au Russey, sur rendez-vous convenu par WhatsApp." },
  { t: "Livraison à domicile", d: `30 km autour du Russey, 10 km autour de Damprichard : ${formatEUR(localDelivery.priceCents)}, offerte dès ${formatEUR(LOCAL_FREE_FROM_CENTS)}.` },
];

const orderSteps = [
  { t: "Composez votre panier", d: "Choisissez vos produits, votre force et votre mode de livraison ou de retrait." },
  { t: "Envoyez le récapitulatif", d: "En un geste, votre commande nous arrive sur WhatsApp. Nous confirmons la disponibilité." },
  { t: "Payez par lien sécurisé", d: "Vous recevez votre facture et un lien de paiement par carte, ou un RIB. Votre colis part dans la foulée." },
];

export default function HomePage() {
  const availability = getAvailabilityMap();
  const featured = featuredProducts.slice(0, 4);
  const latestGuides = guides.slice(0, 3);
  const forceOptions: ForceOption[] = ([1, 2, 3, "maxi"] as Force[]).map((f) => ({ key: String(f), ...forceLabels[f], ...forceLinks[String(f)] }));
  const [charquemont, russey] = locations.vendingMachines;

  return (
    <div>
      <JsonLd
        data={itemListJsonLd(
          "Sélection CBDoux",
          featured.map((p) => ({ name: p.name, path: `/produit/${p.slug}`, image: p.image })),
        )}
      />

      {/* ───────────── Ouverture : la montre ───────────── */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="glow" />
        <GoldDust />
        {/* Sur téléphone : le titre, les boutons, la montre, puis le texte ; sur ordinateur : le texte à gauche, la montre à droite. */}
        <div className="relative wrap grid gap-y-7 pb-14 pt-8 sm:pt-12 lg:min-h-[min(52rem,calc(100svh-7.25rem))] lg:grid-cols-12 lg:content-center lg:gap-x-10 lg:gap-y-0 lg:pb-20 lg:pt-12">
          <h1 className="t-hero relative z-10 lg:col-span-7 lg:row-start-1">
            <span className="seq-line">
              <span style={i(0)}>Du CBD</span>
            </span>{" "}
            <span className="seq-line">
              <span style={i(1)}>de qualité</span>
            </span>{" "}
            <em className="block">
              <span className="seq-line">
                <span style={i(2)}>
                  <span className="gold-text">
                    à toute heure.
                    <span aria-hidden className="gold-sheen">
                      <span data-text="à toute heure." />
                    </span>
                  </span>
                </span>
              </span>
            </em>
          </h1>
          <p className="t-lead seq-in measure relative z-10 order-4 lg:order-none lg:col-span-7 lg:row-start-2 lg:mt-9" style={i(3)}>
            Fleurs, résines, huiles et vape analysés en laboratoire. Expédiés en 24/48&nbsp;h partout en France, ou servis jour et nuit par nos distributeurs du Haut-Doubs.
          </p>
          <div className="seq-in relative z-10 order-2 flex gap-2.5 sm:gap-3 lg:order-none lg:col-span-7 lg:row-start-3 lg:mt-9" style={i(4)}>
            <Link href="/boutique" className="btn btn-primary btn-shine max-sm:flex-1 max-sm:px-3 max-sm:text-[0.9063rem]">
              Voir la boutique
            </Link>
            <Link href="/distributeurs" className="btn btn-ghost max-sm:flex-[1.3] max-sm:whitespace-nowrap max-sm:px-3 max-sm:text-[0.9063rem]">
              Distributeurs 24&nbsp;h/24
            </Link>
          </div>

          <WatchDial className="order-3 mx-auto mt-2 w-[min(100%,20.5rem)] sm:w-[25rem] lg:order-none lg:col-span-5 lg:col-start-8 lg:row-span-3 lg:row-start-1 lg:mt-0 lg:w-full lg:max-w-[30rem] lg:self-center" />
        </div>

        {/* Chiffres clés */}
        <div className="relative border-t border-foreground/15">
          <ul className="wrap grid grid-cols-2 lg:grid-cols-4">
            {stats.map((st, n) => (
              <li key={st.label} className={`py-7 pr-4 sm:py-9 ${n % 2 ? "border-l border-foreground/15 pl-4 sm:pl-7" : ""} ${n >= 2 ? "border-t border-foreground/15 lg:border-t-0" : ""} ${n === 2 ? "lg:border-l lg:pl-7" : ""}`}>
                <span aria-hidden className="stat-index" />
                <p className="stat-num">
                  {st.before}
                  {st.count !== null && <span data-count={st.count}>{st.count}</span>}
                  {st.after}
                </p>
                <p className="mt-3 font-medium leading-snug">{st.label}</p>
                <p className="t-fine mt-1">
                  {st.href ? (
                    <Link href={st.href} className="link">
                      {st.note}
                    </Link>
                  ) : (
                    st.note
                  )}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────────── Bandeau défilant : le catalogue, aux couleurs de l'enseigne ───────────── */}
      <div aria-hidden className="band band-rules marquee py-4 sm:py-5">
        <ul className="marquee-track">
          {[...visibleProducts, ...visibleProducts].map((p, n) => (
            <li key={`${p.slug}-${n}`} className="flex items-center gap-11 whitespace-nowrap">
              <span className="t-note text-[1.5rem] leading-none sm:text-[1.875rem]">{fr(p.name.split(/\s+[—–]\s+/)[0])}</span>
              <Rosette className="h-5 w-5 sm:h-6 sm:w-6" />
            </li>
          ))}
        </ul>
      </div>

      {/* ───────────── Les rayons ───────────── */}
      <section className="nuit section minuterie">
        <div className="wrap">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
            <h2 className="t-h2 lg:col-span-7">
              Peu de références, <em>toutes choisies.</em>
            </h2>
            <p className="t-lead lg:col-span-5">{fr("Fleurs, résines, huiles et vape. Avant d'entrer au catalogue, chaque variété est choisie par nos soins, puis analysée en laboratoire : son taux de THC reste sous 0,3 %.")}</p>
          </div>

          <ul className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-5 lg:grid-cols-4">
            {categoryOrder.map((key, n) => {
              const c = categories[key];
              const count = getProductsByCategory(key).length;
              return (
                <li key={key} data-reveal="scale" className={tileLayout[n]}>
                  <Link href={`/${c.slug}`} className="tile coins group h-full w-full">
                    <Image src={c.image} alt="" fill sizes={n === 0 || n === 3 ? "(max-width: 1024px) 100vw, 660px" : "(max-width: 1024px) 50vw, 330px"} />
                    <span className="tile-body">
                      <span className={`softens block font-serif font-light leading-[1] tracking-[-0.03em] ${n === 0 ? "text-[clamp(2.4rem,9vw,4.75rem)]" : "text-[clamp(1.5rem,5.4vw,2.6rem)]"}`}>{c.name}</span>
                      <span className="t-num mt-2 block text-[0.8125rem] leading-snug text-foreground/80 sm:text-[0.9375rem]">
                        {count} référence{count > 1 ? "s" : ""}, {categoryFrom(key)}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 flex flex-wrap gap-2.5">
            <Link href="/cbd-puissant" className="btn btn-ghost btn-sm">
              CBD puissant
            </Link>
            <Link href="/cbd-pas-cher" className="btn btn-ghost btn-sm">
              Petits prix
            </Link>
            <Link href="/nouveautes" className="btn btn-ghost btn-sm">
              Nouveautés
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────── La sélection ───────────── */}
      <section className="section">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
            <h2 className="t-h2">
              La sélection <em>du moment</em>
            </h2>
            <Link href="/boutique" className="link">
              Tout le catalogue
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} available={p.variants.some((v) => availability[v.sku] !== false)} />
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── Vu de près ───────────── */}
      <section className="section pt-0">
        <div className="wrap">
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
            <h2 className="t-h2 lg:col-span-6">
              Regardez <em>avant de choisir.</em>
            </h2>
            <p className="t-lead lg:col-span-5 lg:col-start-8 lg:self-end">Texture, densité, couleur : nous filmons nos produits tels qu'ils sont, sans retouche. Ce que vous voyez est ce que vous recevez.</p>
          </div>
          <ul className="-mx-[var(--gutter)] mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-2 [scrollbar-width:none] sm:mt-14 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
            {reels.map((r, n) => {
              const p = getProduct(r.slug);
              return (
                <li key={r.slug} data-reveal="up" className={`w-[70vw] max-w-[20rem] shrink-0 snap-center lg:w-auto lg:max-w-none ${n === 1 ? "lg:mt-16" : n === 2 ? "lg:mt-32" : ""}`}>
                  <Link href={`/produit/${r.slug}`} className="group block">
                    <div className="loop aspect-[9/14] rounded-[4px] ring-1 ring-or/25">
                      <Image src={`/images/reels/${r.loop}.jpg`} alt={`${r.title}, filmé de près`} fill sizes="(max-width: 1024px) 70vw, 400px" />
                      <AutoVideo src={`/videos/loops/${r.loop}.mp4`} label={`${r.title} en vidéo`} />
                      <span className="chip absolute left-3 top-3 z-10">
                        <span aria-hidden className="live-dot" /> Filmé chez nous
                      </span>
                    </div>
                    <div className="mt-4 flex items-baseline justify-between gap-4">
                      <h3 className="softens t-title">{r.title}</h3>
                      <p className="t-num whitespace-nowrap text-[0.9375rem] text-foreground/75">{p ? startingPriceLabel(p) : ""}</p>
                    </div>
                    <p className="t-fine mt-1">{r.note}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ───────────── Les forces ───────────── */}
      <Fleuron className="wrap" />
      <section className="section">
        <div className="wrap grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="lg:col-span-5">
            <h2 className="t-h2">
              Quatre forces, <em>de la plus douce à la plus intense.</em>
            </h2>
            <p className="t-lead mt-6 measure">La force indique le niveau d'enrichissement en cannabinoïdes : en Classique, la fleur est au naturel. Commencez toujours par la plus douce : la bonne quantité est la plus petite qui vous convient.</p>
            <p className="t-fine mt-6 measure">
              Produits réservés aux adultes. Ne conduisez pas après usage.{" "}
              <Link href="/conseils-prudence" className="link">
                Lire les conseils de prudence
              </Link>
            </p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <ForceGauge options={forceOptions} />
          </div>
        </div>
      </section>

      {/* ───────────── Jour et nuit : les distributeurs ───────────── */}
      <section className="nuit section minuterie relative overflow-hidden">
        <div aria-hidden className="guilloche guilloche-orge spin-slow opacity-[0.16] w-[150vw] sm:w-[1100px] -left-[80vw] sm:-left-[620px] -bottom-[70vw] sm:-bottom-[560px]" />
        <div className="relative wrap grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <h2 className="t-h2">
              Ouverts quand <em>tout est fermé.</em>
            </h2>
            <p className="t-lead mt-6 measure">
              Deux distributeurs CBDoux, à{" "}
              <Link href="/cbd/charquemont" className="link">
                Charquemont
              </Link>{" "}
              et au{" "}
              <Link href="/cbd/le-russey" className="link">
                Russey
              </Link>
              . {fr(vendingSupervision.short)}
            </p>
            <p className="mt-6 flex items-center gap-3 text-[0.9688rem]">
              <span aria-hidden className="live-dot" />
              <LiveTime template="Il est {heure} dans le Haut-Doubs : les deux sont ouverts." fallback="Ouverts 24 h/24, 7 jours sur 7." />
            </p>

            <ol className="steps mt-10">
              {vendingSupervision.steps.map((s, n) => (
                <li key={s.title}>
                  <span aria-hidden className="step-num">
                    {n + 1}
                  </span>
                  <span>
                    <span className="step-title">{s.title}</span>
                    <span className="step-text">{fr(s.text)}</span>
                  </span>
                </li>
              ))}
            </ol>
            <Link href="/distributeurs" className="btn btn-ghost mt-9">
              Adresses et fonctionnement
            </Link>
          </div>

          <div className="relative lg:col-span-5 lg:col-start-8 lg:pt-4">
            <figure data-reveal="left" className="paper postcard relative z-[2] w-[47%] max-w-[15.5rem]" style={{ "--tilt": "-2.6deg", "--drift": "30px" } as CSSProperties}>
              <div className="overflow-hidden">
                <Image src={charquemont.image} alt={charquemont.imageAlt} width={charquemont.imageSize[0]} height={charquemont.imageSize[1]} sizes="250px" className="block h-auto w-full" />
              </div>
              <figcaption>
                <span className="t-note text-[1.125rem] leading-tight">Charquemont</span>
                <span className="text-[0.75rem] text-foreground/70">La cabine</span>
              </figcaption>
            </figure>
            <figure data-reveal="right" className="paper postcard relative z-[1] -mt-[24%] ml-auto w-[80%] max-w-[27rem]" style={{ "--tilt": "1.5deg", "--drift": "8px" } as CSSProperties}>
              <div className="overflow-hidden">
                <Image src={russey.image} alt={russey.imageAlt} width={russey.imageSize[0]} height={russey.imageSize[1]} sizes="(max-width: 1024px) 80vw, 430px" className="block h-auto w-full" />
              </div>
              <figcaption>
                <span className="t-note text-[1.1875rem] leading-tight">Le Russey</span>
                <span className="text-[0.8125rem] text-foreground/70">Le chalet, face à la mairie</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ───────────── Livraison ───────────── */}
      <section className="section">
        <div className="wrap">
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
            <h2 className="t-h2 lg:col-span-7">
              <span className="inline-block">Commandé avant 13&nbsp;h,</span> <em>parti le jour même.</em>
            </h2>
            <div className="lg:col-span-4 lg:col-start-9 lg:self-end">
              <p className="t-lead">Sachets hermétiques inodores, colis neutre, numéro de suivi. Le port Colissimo est offert dès 60&nbsp;€ d'achat.</p>
              <Link href="/livraison" className="link mt-5 inline-block">
                Délais et tarifs
              </Link>
            </div>
          </div>

          {/* Le trajet du colis, sur une règle de temps */}
          <ol data-reveal="up" className="relative mt-14 grid gap-y-8 sm:mt-20 sm:grid-cols-4 sm:gap-x-6">
            <svg aria-hidden className="pointer-events-none absolute left-[0.4rem] top-0 h-full w-px sm:left-0 sm:top-[0.4rem] sm:h-px sm:w-full" preserveAspectRatio="none">
              <line x1="0" y1="0" x2="100%" y2="100%" stroke="#d7b565" strokeWidth="2" className="draws" style={{ strokeDasharray: 2000, "--len": 2000 } as CSSProperties} />
            </svg>
            {journey.map((j) => (
              <li key={j.when} className="relative pl-8 sm:pl-0 sm:pt-9">
                <span aria-hidden className="journey-node absolute left-[-0.1rem] top-[0.25rem] sm:left-0 sm:top-[-0.1rem]" />
                <p className="t-h3">{j.when}</p>
                <p className="mt-1.5 text-foreground/75">{j.what}</p>
              </li>
            ))}
          </ol>

          {/* Sur place : la carte du Haut-Doubs */}
          <div className="mt-16 grid gap-10 border-t border-foreground/15 pt-12 sm:mt-24 sm:pt-16 lg:grid-cols-12 lg:items-center lg:gap-10">
            <HautDoubsMap className="lg:col-span-5" />
            <div className="lg:col-span-6 lg:col-start-7">
              <h3 className="t-h3">Dans le Haut-Doubs, encore plus près.</h3>
              <dl className="mt-7">
                {nearby.map((n) => (
                  <div key={n.t} className="grid gap-x-8 gap-y-1 border-t border-foreground/15 py-4 last:border-b sm:grid-cols-[13rem_1fr]">
                    <dt className="font-medium">{n.t}</dt>
                    <dd className="text-foreground/75">{fr(n.d)}</dd>
                  </div>
                ))}
              </dl>
              <Link href="/cbd" className="btn btn-ghost mt-8">
                Trouver votre commune
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── Commander par WhatsApp ───────────── */}
      <Fleuron className="wrap" />
      <section className="section">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="lg:col-span-6">
            <h2 className="t-h2">
              Trois étapes, <em>un seul interlocuteur.</em>
            </h2>
            <p className="t-lead mt-6 measure">Pas de formulaire de paiement à rallonge : vous validez votre panier, nous nous occupons du reste avec vous, sur WhatsApp.</p>
            <ol className="steps mt-10">
              {orderSteps.map((s, n) => (
                <li key={s.t}>
                  <span aria-hidden className="step-num">
                    {n + 1}
                  </span>
                  <span>
                    <span className="step-title">{s.t}</span>
                    <span className="step-text">{s.d}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="flex justify-center lg:col-span-5 lg:col-start-8">
            <div data-reveal="scale" className="chat phone w-[19rem] max-w-full">
              <div className="flex items-center gap-3 bg-sapin px-4 py-3.5 text-etiquette">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-or/60">
                  <Rosette className="h-5 w-5" />
                </span>
                <div className="leading-tight">
                  <p className="text-[0.9375rem] font-medium">CBDoux</p>
                  <p className="text-[0.75rem] text-etiquette/70">répond 7 jours sur 7</p>
                </div>
              </div>
              <div className="min-h-[21rem] space-y-2.5 px-3.5 py-5" aria-label="Exemple d'échange lors d'une commande">
                <p className="bubble me" style={i(0)}>
                  Bonjour, voici ma commande <strong>CBD-261116-K7Q2</strong> : 10 g de Super Lemon Haze, 1 g de Piatella. En Colissimo.
                </p>
                <p className="bubble them" style={i(1)}>
                  Bonjour ! Tout est disponible. Voici votre facture et votre lien de paiement sécurisé.
                </p>
                <p className="bubble me" style={i(2)}>
                  C'est payé, merci.
                </p>
                <p className="bubble them" style={i(3)}>
                  Merci à vous. Votre colis part aujourd'hui, voici le numéro de suivi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── Le bon de bienvenue ───────────── */}
      <section className="section-tight pt-0">
        <div className="wrap">
          <div data-reveal="scale" className="ticket">
            <span aria-hidden className="ticket-gravure" />
            <div className="ticket-main">
              <div>
                <p className="font-medium">Bon de bienvenue</p>
                <p className="t-num mt-2 font-serif text-[clamp(5rem,13vw,9rem)] font-light leading-[0.85] tracking-[-0.045em]" style={{ fontVariationSettings: '"SOFT" 100' }}>
                  10&nbsp;€
                </p>
              </div>
              <div>
                <p className="t-h3">Offerts sur votre première commande, dès 100&nbsp;€ d'achat.</p>
                <p className="mt-4 text-foreground/80">À saisir dans le panier. Cumulable avec le port offert dès 60&nbsp;€.</p>
              </div>
            </div>
            <div className="ticket-stub">
              <p className="t-fine">Votre code</p>
              <CopyCode code="BIENVENUE10" className="mt-2" />
              <Link href="/boutique" className="btn btn-primary mt-5 w-full">
                Choisir mes produits
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── À lire : guides et questions ───────────── */}
      <Fleuron className="wrap" />
      <section className="section">
        <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-10">
          {/* la colonne du titre est assez large pour que « avant de choisir. » tienne sur une ligne ; sinon il passe à la ligne, jamais hors cadre */}
          <div className="lg:col-span-5">
            <h2 className="t-h2">
              Comprendre <em>avant de choisir.</em>
            </h2>
            <Link href="/guides" className="link mt-6 inline-block">
              Tous les guides
            </Link>
          </div>
          <GuideRows guides={latestGuides} className="lg:col-span-7 lg:col-start-6" />
        </div>

        <div className="wrap mt-24 grid gap-10 sm:mt-32 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <h2 className="t-h2 lg:sticky lg:top-32">
              Questions <em>fréquentes</em>
            </h2>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <Faq items={homeFaq} />
            <Link href="/faq" className="link mt-7 inline-block">
              Toutes les questions
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────── Nous écrire ───────────── */}
      <section className="nuit section minuterie relative overflow-hidden">
        <div aria-hidden className="glow glow-soft" />
        <div aria-hidden className="guilloche guilloche-rosace opacity-[0.14] w-[140vw] sm:w-[980px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="relative wrap text-center">
          <h2 className="t-h1 mx-auto max-w-[14ch]">
            Une question&nbsp;? <em>On vous répond.</em>
          </h2>
          <p className="t-lead mx-auto mt-6 max-w-xl">Conseil sur une force, suivi de colis, commande : une vraie personne vous répond sur WhatsApp, 7 jours sur 7.</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Écrire sur WhatsApp, {site.phoneDisplay}
            </a>
            <Link href="/contact" className="btn btn-ghost">
              Formulaire de contact
            </Link>
          </div>
          <p className="t-fine mt-9">Damprichard, Le Russey, Charquemont, Maîche, et toute la France par colis.</p>
        </div>
      </section>
    </div>
  );
}
