import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { site, locations, vendingSupervision } from "@/data/site";
import { categories, categoryOrder, featuredProducts, getProductsByCategory, getProduct, forceLabels, startingPriceLabel, minPriceCents, formatPrice, type Category, type Force } from "@/data/products";
import { homeFaq } from "@/data/faq";
import { categoryVisual } from "@/data/category-visuals";
import { guides } from "@/data/guides";
import { ProductCard } from "@/components/product/ProductCard";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/JsonLd";
import { AutoVideo } from "@/components/motion/AutoVideo";
import { LiveTime } from "@/components/motion/ParisTime";
import { HeroDial } from "@/components/home/HeroDial";
import { ForceGauge, type ForceOption } from "@/components/home/ForceGauge";
import { Rosette } from "@/components/brand/Logo";
import { itemListJsonLd, buildMetadata } from "@/lib/seo";
import { getAvailabilityMap } from "@/lib/stock";
import { fr } from "@/lib/utils";

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

const facts = [
  { t: "THC inférieur à 0,3 %", d: "Conforme à la loi française, pour chaque lot." },
  { t: "Analysé en laboratoire", d: "Les certificats sont publiés sur le site.", href: "/analyses-laboratoires" },
  { t: "Colis neutre", d: "Aucune mention de CBD à l'extérieur." },
  { t: "Port offert dès 60 €", d: "Expédié le jour même avant 13 h." },
];

const journey = [
  { when: "Avant 13 h", what: "Vous commandez" },
  { when: "Le jour même", what: "Votre colis part" },
  { when: "Le lendemain", what: "Chronopost 24 h" },
  { when: "Sous 48 h", what: "Colissimo, offert dès 60 €" },
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

      {/* ───────────── Ouverture : le cadran ───────────── */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(70%_46%_at_50%_58%,#1d4d3b_0%,transparent_72%)] lg:bg-[radial-gradient(46%_64%_at_77%_48%,#1d4d3b_0%,transparent_72%)]" />
        {/* la gravure du cadran s'arrête net au filet de la notice : elle ne passe pas sous les quatre faits */}
        <div className="relative overflow-hidden">
          <div className="relative wrap grid gap-y-9 pb-16 pt-9 sm:pt-12 lg:min-h-[min(53rem,calc(100svh-7.25rem))] lg:grid-cols-12 lg:grid-rows-[auto_auto] lg:content-center lg:gap-x-10 lg:gap-y-0 lg:pb-20 lg:pt-12">
            <h1 className="t-hero seq-soften relative z-10 lg:col-span-7 lg:self-end">
              {["Du bon CBD.", "À la bonne", "heure."].map((line, n) => (
                <span key={line} className="seq-line">
                  <span style={i(n)}>{line}</span>{" "}
                </span>
              ))}
            </h1>

            <div className="mx-auto w-[min(100%,21.5rem)] sm:w-[26rem] lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:w-full lg:self-center">
              <HeroDial poster="/images/reels/small-buds.jpg" video="/videos/loops/small-buds.mp4" alt="Petites têtes de fleurs de CBD CBDoux, filmées de près" />
            </div>

            <div className="relative z-10 lg:col-span-7 lg:self-start lg:pt-9">
              <p className="t-lead seq-in measure" style={i(4)}>
                Fleurs, résines, huiles et vape analysés en laboratoire. Expédiés en 24/48&nbsp;h partout en France, ou servis jour et nuit par nos distributeurs du Haut-Doubs.
              </p>
              <div className="seq-in mt-8 flex flex-wrap items-center gap-x-7 gap-y-4" style={i(5)}>
                <Link href="/boutique" className="btn btn-primary">
                  Voir la boutique
                </Link>
                <Link href="/distributeurs" className="link">
                  Trouver un distributeur
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* La notice : quatre faits, imprimés comme sur une étiquette */}
        <div className="relative border-t border-foreground/15">
          <ul className="wrap grid grid-cols-2 lg:grid-cols-4">
            {facts.map((fact, n) => (
              <li key={fact.t} className={`py-6 sm:py-7 pr-4 ${n % 2 ? "pl-4 border-l border-foreground/15 sm:pl-7" : ""} ${n >= 2 ? "border-t border-foreground/15 lg:border-t-0" : ""} ${n === 2 ? "lg:border-l lg:pl-7" : ""}`}>
                <p className="font-medium leading-snug">{fact.t}</p>
                <p className="t-fine mt-1.5">
                  {fact.href ? (
                    <Link href={fact.href} className="link">
                      {fact.d}
                    </Link>
                  ) : (
                    fact.d
                  )}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────────── Les rayons ───────────── */}
      <section className="nuit section">
        <div className="wrap">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
            <h2 className="t-h2 lg:col-span-7">Peu de références, toutes choisies.</h2>
            <p className="t-lead lg:col-span-5">Chaque variété est sélectionnée, vérifiée et analysée avant d'entrer au catalogue. Quatre rayons, une seule exigence.</p>
          </div>

          <ul className="mt-12 sm:mt-16">
            {categoryOrder.map((key) => {
              const c = categories[key];
              const count = getProductsByCategory(key).length;
              const visual = categoryVisual[key];
              return (
                <li key={key} className="border-t border-foreground/15 last:border-b">
                  <Link href={`/${c.slug}`} className="group grid grid-cols-[4.25rem_1fr] items-center gap-x-4 py-5 sm:grid-cols-[7.5rem_1fr_auto] sm:gap-x-8 sm:py-7 lg:grid-cols-[9.5rem_1fr_auto]">
                    <span className={`relative block aspect-square overflow-hidden rounded-full ${visual.blend ? "bg-[#e9dfc6]" : "bg-sapin"}`}>
                      <Image src={visual.src} alt="" fill sizes="(max-width: 640px) 68px, 152px" className={`object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-110 ${visual.blend ? "on-paper" : ""}`} />
                    </span>
                    <span className="min-w-0">
                      <span className="softens block font-serif font-light text-[clamp(1.9rem,7.6vw,5.25rem)] leading-[1] tracking-[-0.03em]">{c.name}</span>
                      <span className="t-num mt-2 block text-[0.9375rem] text-foreground/70 sm:hidden">
                        {count} référence{count > 1 ? "s" : ""}, {categoryFrom(key)}
                      </span>
                    </span>
                    <span className="t-num hidden text-right text-[0.9688rem] leading-relaxed text-foreground/75 sm:block">
                      {count} référence{count > 1 ? "s" : ""}
                      <br />
                      {categoryFrom(key)}
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
            <h2 className="t-h2">La sélection du moment</h2>
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
            <h2 className="t-h2 lg:col-span-6">Regardez avant de choisir.</h2>
            <p className="t-lead lg:col-span-5 lg:col-start-8 lg:self-end">Texture, densité, couleur : nous filmons nos produits tels qu'ils sont, sans retouche. Ce que vous voyez est ce que vous recevez.</p>
          </div>
          <ul className="-mx-[var(--gutter)] mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-2 [scrollbar-width:none] sm:mt-14 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
            {reels.map((r, n) => {
              const p = getProduct(r.slug);
              return (
                <li key={r.slug} className={`w-[70vw] max-w-[20rem] shrink-0 snap-center lg:w-auto lg:max-w-none ${n === 1 ? "lg:mt-16" : n === 2 ? "lg:mt-32" : ""}`}>
                  <Link href={`/produit/${r.slug}`} className="group block">
                    <div className="loop unveil aspect-[9/14] rounded-[3px]">
                      <Image src={`/images/reels/${r.loop}.jpg`} alt={`${r.title}, filmé de près`} fill sizes="(max-width: 1024px) 70vw, 400px" />
                      <AutoVideo src={`/videos/loops/${r.loop}.mp4`} label={`${r.title} en vidéo`} />
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
      <section className="section border-t border-foreground/15">
        <div className="wrap grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="lg:col-span-5">
            <h2 className="t-h2">Quatre forces, de la plus douce à la plus intense.</h2>
            <p className="t-lead mt-6 measure">La force indique la concentration en CBD. Commencez toujours par la plus douce : la bonne quantité est la plus petite qui vous convient.</p>
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
      <section className="nuit section relative overflow-hidden">
        <div aria-hidden className="guilloche guilloche-orge opacity-[0.14] w-[150vw] sm:w-[1100px] -left-[80vw] sm:-left-[620px] -bottom-[70vw] sm:-bottom-[560px]" />
        <div className="relative wrap grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <h2 className="t-h2">Ouverts quand tout est fermé.</h2>
            <p className="t-lead mt-6 measure">Deux distributeurs CBDoux, à Charquemont et au Russey. {fr(vendingSupervision.short)}</p>
            <p className="mt-6 flex items-center gap-3 text-[0.9688rem]">
              <span aria-hidden className="live-dot" />
              <LiveTime template="Il est {heure} dans le Haut-Doubs : les deux sont ouverts." fallback="Ouverts 24 h/24, 7 jours sur 7." />
            </p>

            <ol className="mt-10">
              {vendingSupervision.steps.map((s, n) => (
                <li key={s.title} className="grid grid-cols-[2.25rem_1fr] gap-x-3 border-t border-foreground/15 py-4 last:border-b sm:grid-cols-[3rem_1fr]">
                  <span className="t-num font-serif text-[1.375rem] font-light leading-[1.15] text-or">{n + 1}</span>
                  <span>
                    <span className="block font-medium leading-snug">{s.title}</span>
                    <span className="t-fine mt-1 block">{fr(s.text)}</span>
                  </span>
                </li>
              ))}
            </ol>
            <Link href="/distributeurs" className="btn btn-ghost mt-9">
              Adresses et fonctionnement
            </Link>
          </div>

          <div className="relative lg:col-span-5 lg:col-start-8 lg:pt-4">
            <figure className="paper postcard relative z-[2] w-[47%] max-w-[15.5rem]" style={{ "--tilt": "-2.6deg" } as CSSProperties} data-parallax="-0.04">
              <div className="unveil overflow-hidden">
                <Image src={charquemont.image} alt={charquemont.imageAlt} width={charquemont.imageSize[0]} height={charquemont.imageSize[1]} sizes="250px" className="block h-auto w-full" />
              </div>
              <figcaption>
                <span className="t-note text-[1.125rem] leading-tight">Charquemont</span>
                <span className="text-[0.75rem] text-foreground/70">La cabine</span>
              </figcaption>
            </figure>
            <figure className="paper postcard relative z-[1] -mt-[24%] ml-auto w-[80%] max-w-[27rem]" style={{ "--tilt": "1.5deg" } as CSSProperties} data-parallax="0.03">
              <div className="unveil overflow-hidden">
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
            <h2 className="t-h2 lg:col-span-7">Commandé avant 13&nbsp;h, parti le jour même.</h2>
            <div className="lg:col-span-4 lg:col-start-9 lg:self-end">
              <p className="t-lead">Sachets hermétiques inodores, colis neutre, numéro de suivi. Le port Colissimo est offert dès 60&nbsp;€ d'achat.</p>
              <Link href="/livraison" className="link mt-5 inline-block">
                Délais et tarifs
              </Link>
            </div>
          </div>

          {/* Le trajet du colis, sur une règle de temps */}
          <ol data-inview className="relative mt-14 grid gap-y-8 sm:mt-20 sm:grid-cols-4 sm:gap-x-6">
            <svg aria-hidden className="pointer-events-none absolute left-[0.4rem] top-0 h-full w-px sm:left-0 sm:top-[0.4rem] sm:h-px sm:w-full" preserveAspectRatio="none">
              <line x1="0" y1="0" x2="100%" y2="100%" stroke="#d7b565" strokeWidth="2" className="draws" style={{ strokeDasharray: 2000, "--len": 2000 } as CSSProperties} />
            </svg>
            {journey.map((j) => (
              <li key={j.when} className="relative pl-8 sm:pl-0 sm:pt-9">
                <span aria-hidden className="absolute left-0 top-[0.35rem] h-[0.85rem] w-[0.85rem] rounded-full border border-or bg-sapin sm:top-0" />
                <p className="t-h3">{j.when}</p>
                <p className="mt-1.5 text-foreground/75">{j.what}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ───────────── Commander par WhatsApp ───────────── */}
      <section className="section border-t border-foreground/15">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="lg:col-span-6">
            <h2 className="t-h2">Trois étapes, un seul interlocuteur.</h2>
            <p className="t-lead mt-6 measure">Pas de formulaire de paiement à rallonge : vous validez votre panier, nous nous occupons du reste avec vous, sur WhatsApp.</p>
            <ol className="mt-10">
              {orderSteps.map((s, n) => (
                <li key={s.t} className="grid grid-cols-[2.25rem_1fr] gap-x-3 border-t border-foreground/15 py-5 last:border-b sm:grid-cols-[3rem_1fr]">
                  <span className="t-num font-serif text-[1.375rem] font-light leading-[1.15] text-or">{n + 1}</span>
                  <span>
                    <span className="t-title block">{s.t}</span>
                    <span className="mt-1.5 block text-[0.9688rem] text-foreground/75">{s.d}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="flex justify-center lg:col-span-5 lg:col-start-8">
            <div data-inview className="chat phone w-[19rem] max-w-full">
              <div className="flex items-center gap-3 bg-sapin px-4 py-3.5 text-etiquette">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-or/60">
                  <Rosette className="h-5 w-5" />
                </span>
                <div className="leading-tight">
                  <p className="text-[0.9375rem] font-medium">CBDoux</p>
                  <p className="text-[0.75rem] text-etiquette/70">répond 7 jours sur 7</p>
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
          <div className="paper ticket grid gap-8 px-8 py-10 sm:px-14 sm:py-12 lg:grid-cols-12 lg:items-center lg:gap-10">
            <div className="lg:col-span-4">
              <p className="font-medium">Bon de bienvenue</p>
              <p className="t-num mt-2 font-serif text-[clamp(5rem,13vw,9rem)] font-light leading-[0.85] tracking-[-0.045em]" style={{ fontVariationSettings: '"SOFT" 100' }}>
                10&nbsp;€
              </p>
            </div>
            <div className="lg:col-span-5">
              <p className="t-h3">Offerts sur votre première commande, dès 100&nbsp;€ d'achat.</p>
              <p className="mt-4 text-foreground/80">À saisir dans le panier. Cumulable avec le port offert dès 60&nbsp;€.</p>
            </div>
            <div className="lg:col-span-3 lg:border-l lg:border-dashed lg:border-foreground/35 lg:pl-10">
              <p className="t-fine">Votre code</p>
              <p className="mt-1 text-[1.375rem] font-semibold tracking-[0.08em]">BIENVENUE10</p>
              <Link href="/boutique" className="btn btn-primary mt-5 w-full">
                Choisir mes produits
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── À lire : guides et questions, sur papier ───────────── */}
      <section className="paper section">
        <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <h2 className="t-h2">Comprendre avant de choisir.</h2>
            <Link href="/guides" className="link mt-6 inline-block">
              Tous les guides
            </Link>
          </div>
          <ul className="lg:col-span-7 lg:col-start-6">
            {latestGuides.map((g) => (
              <li key={g.slug} className="border-t border-foreground/25 last:border-b">
                <Link href={`/guides/${g.slug}`} className="group block py-6">
                  <p className="t-fine">
                    {g.category}, {g.readingMinutes} min de lecture
                  </p>
                  <h3 className="softens t-h3 mt-2">{fr(g.title)}</h3>
                  <p className="mt-2.5 measure-wide text-[0.9688rem] text-foreground/80 line-clamp-2">{fr(g.description)}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="wrap mt-24 grid gap-10 sm:mt-32 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <h2 className="t-h2 lg:sticky lg:top-32">Questions fréquentes</h2>
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
      <section className="nuit section relative overflow-hidden">
        <div aria-hidden className="guilloche guilloche-rosace opacity-[0.12] w-[140vw] sm:w-[980px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="relative wrap text-center">
          <h2 className="t-h1 mx-auto max-w-[14ch]">Une question&nbsp;? On vous répond.</h2>
          <p className="t-lead mx-auto mt-6 max-w-xl">Conseil sur une force, suivi de colis, commande : une vraie personne vous répond sur WhatsApp, 7 jours sur 7.</p>
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
