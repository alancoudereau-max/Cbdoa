import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { ArrowUpRight, ArrowRight, Truck, ShieldCheck, Clock, FlaskConical, Lock, Package, MessageCircle, Sparkles, Leaf, MapPin, Video, PlayCircle, CreditCard, ShoppingBag } from "lucide-react";
import { site, locations, vendingSupervision } from "@/data/site";
import { categories, categoryOrder, featuredProducts, visibleProducts, getProductsByCategory, getProduct, forceLabels, startingPriceLabel, type Force } from "@/data/products";
import { homeFaq } from "@/data/faq";
import { guides } from "@/data/guides";
import { ProductCard } from "@/components/product/ProductCard";
import { Faq } from "@/components/ui/Faq";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/JsonLd";
import { GoldDust } from "@/components/motion/GoldDust";
import { AutoVideo } from "@/components/motion/AutoVideo";
import { ForcePicker, type ForceOption } from "@/components/home/ForcePicker";
import { Ornament, Rosette } from "@/components/brand/Logo";
import { itemListJsonLd, buildMetadata } from "@/lib/seo";
import { getAvailabilityMap } from "@/lib/stock";

export const metadata: Metadata = buildMetadata({
  title: "CBDoux — CBD premium du Haut-Doubs, livraison France 24/48 h",
  description:
    "Fleurs, résines, huiles cutanées et vape CBD testés en laboratoire (THC < 0,3 %). Livraison France 24/48 h offerte dès 60 €, distributeurs 24 h/24 dans le Doubs.",
  path: "/",
  keywords: ["cbd", "boutique cbd en ligne", "fleur cbd", "résine cbd", "cbd haut-doubs", "cbd livraison france", "cbd doubs"],
});

/** Rang d'apparition (variable CSS --i) pour les animations d'entrée de l'en-tête de page. */
const i = (n: number) => ({ "--i": n }) as CSSProperties;

const marqueeWords = ["Super Lemon Haze", "Amnesia Hydro", "Critical Berry", "Snow White", "Orangello", "3X Filtré", "Olivette Gold", "Cali Fruit", "Bubble Gum", "Beldia", "Piatella", "Full Spectrum"];
const marqueeValues = ["THC < 0,3 %", "Analyses de laboratoire", "Colis neutre", "Expédié en 24/48 h", "Port offert dès 60 €", "Distributeurs 24 h/24", "Conseil WhatsApp 7 j/7", "Haut-Doubs"];

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

const bento = [
  "col-span-2 lg:col-span-6 lg:row-span-2 aspect-[16/11] lg:aspect-auto",
  "lg:col-span-6 aspect-[4/5] lg:aspect-auto",
  "lg:col-span-3 aspect-[4/5] lg:aspect-auto",
  "col-span-2 lg:col-span-3 aspect-[16/8] lg:aspect-auto",
];

export default function HomePage() {
  const availability = getAvailabilityMap();
  const featured = featuredProducts.slice(0, 4);
  const hero = featured[0];
  const latestGuides = guides.slice(0, 3);
  const forceOptions: ForceOption[] = ([1, 2, 3, "maxi"] as Force[]).map((f) => ({ key: String(f), ...forceLabels[f], ...forceLinks[String(f)] }));
  const [charquemont, russey] = locations.vendingMachines;

  return (
    <div className="overflow-hidden">
      <JsonLd data={itemListJsonLd("Sélection CBDoux", featured.map((p) => ({ name: p.name, path: `/produit/${p.slug}`, image: p.image })))} />

      {/* ───────────── HERO ───────────── */}
      <section className="relative overflow-hidden border-b border-foreground/10">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="aurora" />
          <GoldDust className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_35%,var(--color-background)_100%)]" />
        </div>

        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 pt-12 pb-14 sm:pt-16 lg:pt-20 lg:pb-20">
          <div className="grid lg:grid-cols-12 gap-14 lg:gap-10 items-center">
            <div className="lg:col-span-7">
              <p className="hero-in kicker mb-5 flex items-center gap-2.5" style={i(0)}>
                <span className="live-dot gold" /> CBD premium · Haut-Doubs · Livraison France entière
              </p>
              <h1 className="kinetic font-serif leading-[0.9] tracking-[-0.03em]">
                <span className="line">
                  <span style={i(0)} className="text-[17vw] sm:text-[11vw] lg:text-[clamp(5.4rem,8.6vw,8rem)]">Du CBD</span>
                </span>
                <span className="line">
                  <span style={i(1)} className="text-[10.2vw] sm:text-[7.4vw] lg:text-[clamp(3.6rem,6.1vw,5.6rem)] whitespace-nowrap">
                    <em className="font-serif-italic gold-shimmer">qui tient ses promesses.</em>
                  </span>
                </span>
              </h1>
              <p className="hero-in mt-6 max-w-2xl text-lg sm:text-xl lg:text-2xl leading-snug text-foreground/78" style={i(1)}>
                Fleurs, résines, huiles et vape CBD testés en laboratoire. Expédiés en 24/48 h partout en France dans un colis neutre, ou à retirer dans le Haut-Doubs.
              </p>

              <div className="hero-in mt-9 flex flex-col sm:flex-row gap-3 sm:max-w-xl" style={i(2)}>
                <Link href="/boutique" className="group btn-gold inline-flex flex-1 items-center justify-between gap-2 rounded-full px-6 py-4 text-sm font-semibold">
                  <span>Découvrir la boutique</span>
                  <ArrowUpRight size={18} className="group-hover:rotate-45 transition-transform" />
                </Link>
                <Link href="/distributeurs" className="btn-outline glass inline-flex flex-1 items-center justify-between gap-2 rounded-full px-6 py-4 text-sm font-medium">
                  <span>Distributeurs 24 h/24</span>
                  <Clock size={16} />
                </Link>
              </div>

              <ul className="hero-in mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-foreground/60" style={i(3)}>
                <li className="inline-flex items-center gap-1.5"><Truck size={13} className="text-gold" /> Port offert dès 60 €</li>
                <li className="inline-flex items-center gap-1.5"><Package size={13} className="text-gold" /> Colis 100 % neutre</li>
                <li className="inline-flex items-center gap-1.5"><Lock size={13} className="text-gold" /> Paiement sécurisé</li>
                <li className="inline-flex items-center gap-1.5"><FlaskConical size={13} className="text-gold" /> THC &lt; 0,3 % · analyses labo</li>
              </ul>
            </div>

            {/* Visuel : vidéo du moment + cartes flottantes */}
            <div className="lg:col-span-5">
              <div className="hero-in relative mx-auto w-[min(72vw,320px)] lg:w-[340px]" style={i(3)}>
                <div className="absolute -inset-10 rounded-full bg-gold/20 blur-3xl" aria-hidden />
                <div className="reel" data-parallax="0.05">
                  <Image src="/images/reels/small-buds.jpg" alt="Small buds de CBD CBDoux, filmées dans notre atelier" fill priority sizes="340px" />
                  <AutoVideo src="/videos/loops/small-buds.mp4" label="Small buds de CBD CBDoux en vidéo" />
                  <div className="absolute inset-x-0 bottom-0 z-10 p-5">
                    <p className="kicker mb-1.5 flex items-center gap-2"><PlayCircle size={13} /> Filmé chez nous</p>
                    <p className="font-serif text-2xl leading-tight">Californienne Indoor Small Buds</p>
                    <Link href="/produit/californienne-indoor-small-buds" className="mt-2 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-gold hover:underline">
                      Voir la fiche <ArrowUpRight size={12} />
                    </Link>
                  </div>
                </div>

                {hero && (
                  <Link href={`/produit/${hero.slug}`} className="glass bob absolute -left-7 sm:-left-16 top-10 z-20 flex items-center gap-3 rounded-2xl p-2.5 pr-4 shadow-deep" style={{ "--tilt": "-4deg" } as CSSProperties}>
                    <Image src={hero.image} alt="" width={96} height={96} className="h-12 w-12 rounded-xl object-cover" />
                    <span className="leading-tight">
                      <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-gold">Best-seller</span>
                      <span className="block text-sm font-medium">Super Lemon Haze</span>
                      <span className="block text-xs text-foreground/60">{startingPriceLabel(hero)}</span>
                    </span>
                  </Link>
                )}
                <div className="glass bob-slow absolute -right-6 sm:-right-12 top-[38%] z-20 rounded-2xl px-4 py-3 shadow-deep" style={{ "--tilt": "3deg" } as CSSProperties}>
                  <p className="flex items-center gap-2 text-sm font-medium"><FlaskConical size={15} className="text-gold" /> Analyse labo</p>
                  <p className="mt-0.5 text-xs text-foreground/60">THC &lt; 0,3 % · lots vérifiés</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chiffres clés */}
          <dl className="mt-14 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-8 border-t border-foreground/10 pt-8 sm:pt-10">
            {[
              { count: visibleProducts.length, label: "références analysées" },
              { text: "24/48 h", label: "expédition France" },
              { count: 60, suffix: " €", label: "port offert dès" },
              { text: "24 h/24", label: "distributeurs validés en direct" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col-reverse">
                <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55 mt-2">{s.label}</dt>
                <dd className="font-serif text-4xl sm:text-5xl text-gradient-gold leading-none">
                  {s.count !== undefined ? <span data-count={s.count} data-suffix={s.suffix ?? ""}>{s.count}{s.suffix ?? ""}</span> : s.text}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ───────────── BANDEAUX DÉFILANTS ───────────── */}
      <div aria-hidden className="band-green band-rules py-6 space-y-3">
        <div className="marquee">
          {[0, 1].map((dup) => (
            <div className="marquee-track" key={dup}>
              {marqueeWords.map((w) => (
                <span key={`${dup}-${w}`} className="font-serif-italic text-3xl sm:text-4xl text-foreground/85 flex items-center gap-12 whitespace-nowrap">
                  {w}
                  <span className="rosette-mark h-6 w-6 shrink-0" />
                </span>
              ))}
            </div>
          ))}
        </div>
        <div className="marquee">
          {[0, 1].map((dup) => (
            <div className="marquee-track reverse" key={dup}>
              {marqueeValues.map((w) => (
                <span key={`${dup}-${w}`} className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold-light/80 flex items-center gap-12 whitespace-nowrap">
                  {w}
                  <span className="h-1 w-1 rounded-full bg-gold/60" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ───────────── CATÉGORIES ───────────── */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 py-20 sm:py-28">
        <SectionHeading kicker="La boutique" title="Quatre univers," italic="une seule exigence." className="mb-12">
          Fleurs indoor et hydroponie, résines filtrées, huiles Full Spectrum et vape : tout notre catalogue est sélectionné, goûté et analysé avant d'arriver chez vous.
        </SectionHeading>
        <div className="grid grid-cols-2 lg:grid-cols-12 lg:grid-rows-[270px_270px] gap-3 sm:gap-4">
          {categoryOrder.map((key, n) => {
            const c = categories[key];
            const count = getProductsByCategory(key).length;
            return (
              <Link key={key} href={`/${c.slug}`} data-reveal="scale" className={`lift spotlight group relative block overflow-hidden rounded-3xl border border-foreground/10 bg-card ${bento[n] ?? ""}`}>
                <Image src={c.image} alt={c.name} fill sizes={n === 0 ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 1024px) 50vw, 25vw"} className="object-cover opacity-80 transition-transform duration-[1200ms] ease-out group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/35 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold mb-1">{count} référence{count > 1 ? "s" : ""}</p>
                  <h3 className={`font-serif leading-none ${n === 0 ? "text-4xl sm:text-6xl" : "text-2xl sm:text-3xl"}`}>{c.name}</h3>
                  <span className="mt-3 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/60 group-hover:text-gold transition-colors">
                    Découvrir <ArrowUpRight size={12} className="group-hover:rotate-45 transition-transform" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-5 flex flex-wrap gap-3" data-reveal="up">
          <Link href="/cbd-puissant" className="btn-outline rounded-full px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em]">CBD puissant →</Link>
          <Link href="/cbd-pas-cher" className="btn-outline rounded-full px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em]">Petits prix →</Link>
          <Link href="/nouveautes" className="btn-outline rounded-full px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em]">Nouveautés →</Link>
        </div>
      </section>

      {/* ───────────── EN VIDÉO ───────────── */}
      <section className="relative border-y border-foreground/10 bg-card/30 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="orb orb-leaf w-[520px] h-[520px] -top-40 -left-32 opacity-40" />
        </div>
        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 py-20 sm:py-28">
          <SectionHeading kicker="En vidéo" title="Regardez avant" italic="de choisir." className="mb-10">
            Texture, densité, couleur : nous filmons nos produits tels qu'ils sont, sans retouche. Ce que vous voyez est ce que vous recevez.
          </SectionHeading>
          <div className="snap-row -mx-5 px-5 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible">
            {reels.map((r, n) => {
              const p = getProduct(r.slug);
              return (
                <Link key={r.slug} href={`/produit/${r.slug}`} data-reveal="up" className={`reel lift group block w-[68vw] max-w-[320px] lg:w-auto lg:max-w-none ${n === 1 ? "lg:-translate-y-8" : ""}`}>
                  <Image src={`/images/reels/${r.loop}.jpg`} alt={`${r.title} — résine ou fleur CBD CBDoux filmée de près`} fill sizes="(max-width: 1024px) 68vw, 400px" />
                  <AutoVideo src={`/videos/loops/${r.loop}.mp4`} label={`${r.title} en vidéo`} />
                  <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-gold">
                    <PlayCircle size={12} /> Vidéo
                  </span>
                  <span className="absolute inset-x-0 bottom-0 z-10 block p-5">
                    <span className="block font-serif text-3xl leading-none">{r.title}</span>
                    <span className="mt-1.5 block text-sm text-foreground/70">{r.note}</span>
                    <span className="mt-3 flex items-center justify-between border-t border-foreground/15 pt-3">
                      <span className="font-serif text-lg text-gold">{p ? startingPriceLabel(p) : ""}</span>
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/70 group-hover:text-gold transition-colors">Voir <ArrowUpRight size={12} /></span>
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────── SÉLECTION ───────────── */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 py-20 sm:py-28">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <SectionHeading kicker="Notre sélection" title="Les pièces" italic="maîtresses du moment." />
          <Link href="/boutique" className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-gold border-b border-gold/40 pb-1 self-start sm:self-end">
            Tout le catalogue <ArrowUpRight size={14} className="group-hover:rotate-45 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} available={p.variants.some((v) => availability[v.sku] !== false)} />
          ))}
        </div>
      </section>

      {/* ───────────── FORCES ───────────── */}
      <section className="border-y border-foreground/10 bg-card/30">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 py-20 sm:py-28 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <SectionHeading kicker="Quatre forces" title="Trouvez" italic="la vôtre.">
              La force indique la concentration en CBD. Commencez toujours par la plus douce : la bonne quantité est la plus petite qui vous convient.
            </SectionHeading>
            <p className="mt-6 text-sm text-foreground/60" data-reveal="up">
              Produits réservés aux adultes. Ne conduisez pas après usage.{" "}
              <Link href="/conseils-prudence" className="text-gold underline underline-offset-2">Lire les conseils complets</Link>
            </p>
          </div>
          <div className="lg:col-span-7" data-reveal="left">
            <ForcePicker options={forceOptions} />
          </div>
        </div>
      </section>

      {/* ───────────── DISTRIBUTEURS ───────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="orb orb-gold w-[520px] h-[520px] top-10 -right-40 opacity-25 animate-float" />
        </div>
        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 py-20 sm:py-28 grid lg:grid-cols-12 gap-14 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <SectionHeading kicker="Haut-Doubs · 24 h/24" title="Servez-vous à toute heure," italic="jamais seul.">
              Deux distributeurs CBDoux, à Charquemont et au Russey. {vendingSupervision.short}
            </SectionHeading>
            <ol className="mt-8 grid sm:grid-cols-2 gap-3">
              {vendingSupervision.steps.map((s, n) => (
                <li key={s.title} data-reveal="up" className="rounded-2xl border border-foreground/10 bg-card/50 p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold mb-2">Étape {n + 1}</p>
                  <p className="font-serif text-xl leading-tight">{s.title}</p>
                </li>
              ))}
            </ol>
            <div className="mt-6 grid sm:grid-cols-2 gap-3" data-reveal="up">
              {[charquemont, russey].map((m) => (
                <Link key={m.id} href={`/distributeurs#${m.id}`} className="group rounded-2xl border border-gold/25 bg-background/60 p-5 hover:border-gold/60 transition-colors">
                  <p className="font-serif text-2xl text-gold flex items-center justify-between">{m.city} <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform" /></p>
                  <p className="text-sm text-foreground/70 mt-1 flex items-start gap-2"><MapPin size={14} className="text-gold mt-0.5 shrink-0" /> {m.place}{m.street ? `, ${m.street}` : ""}</p>
                  <p className="text-xs text-foreground/50 mt-2 flex items-center gap-2"><Clock size={12} className="text-gold" /> {m.hours} · {m.payment}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="relative mx-auto max-w-[520px] mb-12 lg:mb-0">
              <div className="absolute -inset-8 bg-gradient-to-br from-gold/25 via-transparent to-transparent blur-3xl" aria-hidden />
              <div data-reveal="scale" className="relative overflow-hidden rounded-3xl border border-gold/30 shadow-deep">
                <Image src={russey.image} alt={russey.imageAlt} width={russey.imageSize[0]} height={russey.imageSize[1]} sizes="(max-width: 1024px) 100vw, 520px" className="block w-full h-auto" />
                <div className="scanline" aria-hidden />
                <p className="glass absolute left-4 top-4 inline-flex items-center gap-2 rounded-full px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.18em]">
                  <span className="live-dot" /> <Video size={13} className="text-gold" /> Validé en direct
                </p>
                <p className="absolute left-4 bottom-4 font-serif text-2xl drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">Le Russey</p>
              </div>
              <div data-reveal="right" data-parallax="-0.06" className="absolute -bottom-10 -right-3 sm:-right-8 w-[42%] overflow-hidden rounded-2xl border border-gold/30 shadow-deep">
                <Image src={charquemont.image} alt={charquemont.imageAlt} width={charquemont.imageSize[0]} height={charquemont.imageSize[1]} sizes="220px" className="block w-full h-auto" />
                <p className="absolute left-3 bottom-2.5 font-serif text-lg drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">Charquemont</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── LIVRAISON ───────────── */}
      <section className="relative overflow-hidden border-y border-foreground/10 bg-card/30">
        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 py-20 sm:py-28 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <SectionHeading kicker="Partout en France" title="Expédié en 24/48 h," italic="en toute discrétion.">
              Commandez avant 13 h, votre colis part le jour même. Sachets hermétiques inodores, colis neutre, suivi en temps réel. Port Colissimo offert dès 60 € d'achat.
            </SectionHeading>
            <div className="mt-8 grid grid-cols-3 gap-4 sm:gap-6 max-w-2xl" data-reveal="up">
              {[
                { count: 24, suffix: " h", v: "Chronopost Express" },
                { count: 48, suffix: " h", v: "Colissimo · offert dès 60 €" },
                { count: 100, suffix: " %", v: "Colis neutre & discret" },
              ].map((s) => (
                <div key={s.v} className="border-l-2 border-gold/60 pl-4">
                  <p className="font-serif text-2xl sm:text-3xl text-gradient-gold leading-none"><span data-count={s.count} data-suffix={s.suffix}>{s.count}{s.suffix}</span></p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/60 mt-2">{s.v}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3" data-reveal="up">
              <Link href="/boutique" className="btn-gold inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-semibold">
                Commander maintenant <ArrowRight size={16} />
              </Link>
              <Link href="/livraison" className="btn-outline inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-mono uppercase tracking-[0.18em]">
                Tarifs & délais
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5" data-reveal="left">
            <div className="glass relative rounded-3xl p-8 sm:p-10 shadow-deep">
              <p className="kicker mb-5">Ce que vous recevez</p>
              <ul className="space-y-4">
                {[
                  { icon: Package, t: "Un colis neutre", d: "Aucune mention de CBD ni de CBDoux à l'extérieur. Libellé bancaire neutre." },
                  { icon: Leaf, t: "Des sachets hermétiques", d: "Fraîcheur et arômes préservés, zéro odeur pendant le transport." },
                  { icon: FlaskConical, t: "Des produits analysés", d: "Taux de CBD vérifié, THC < 0,3 %, certificats consultables en ligne." },
                  { icon: MessageCircle, t: "Un suivi humain", d: "Une question ? Nous répondons sur WhatsApp 7 j/7." },
                ].map(({ icon: Icon, t, d }) => (
                  <li key={t} className="flex gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold"><Icon size={18} /></span>
                    <div>
                      <p className="font-medium">{t}</p>
                      <p className="text-sm text-foreground/60">{d}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── COMMANDER PAR WHATSAPP ───────────── */}
      <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 py-20 sm:py-28 grid lg:grid-cols-12 gap-14 items-center">
          <div className="lg:col-span-5 flex justify-center">
            <div data-reveal="scale" className="chat phone w-[290px] max-w-full">
              <div className="flex items-center gap-3 border-b border-foreground/10 bg-background/60 px-4 py-3.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 bg-[oklch(0.23_0.045_162)]"><Rosette className="h-6 w-6" /></span>
                <div className="leading-tight">
                  <p className="text-sm font-medium">CBDoux</p>
                  <p className="flex items-center gap-1.5 text-[11px] text-foreground/55"><span className="live-dot" /> répond 7 j/7</p>
                </div>
              </div>
              <div className="space-y-2.5 px-3.5 py-5 min-h-[330px]" aria-label="Exemple d'échange lors d'une commande">
                <p className="bubble me" style={i(0)}>Bonjour, voici ma commande <strong>CBD-261116-K7Q2</strong> : 10 g Super Lemon Haze, 1 g Piatella. Colissimo.</p>
                <p className="bubble them" style={i(1)}>Bonjour ! Tout est disponible. Voici votre facture et votre lien de paiement sécurisé.</p>
                <p className="bubble me" style={i(2)}>C'est payé ✓</p>
                <p className="bubble them" style={i(3)}>Merci ! Votre colis part aujourd'hui, voici le numéro de suivi.</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7">
            <SectionHeading kicker="Commander" title="Trois étapes," italic="un interlocuteur.">
              Pas de formulaire de paiement à rallonge : vous validez votre panier, nous nous occupons du reste avec vous, sur WhatsApp.
            </SectionHeading>
            <ol className="mt-8 space-y-4">
              {[
                { icon: ShoppingBag, t: "Composez votre panier", d: "Choisissez vos produits, votre force et votre mode de livraison ou de retrait." },
                { icon: MessageCircle, t: "Envoyez le récapitulatif", d: "En un clic, votre commande nous arrive sur WhatsApp. Nous confirmons la disponibilité." },
                { icon: CreditCard, t: "Payez par lien sécurisé", d: "Vous recevez votre facture et un lien de paiement par carte (ou un RIB). Votre colis part dans la foulée." },
              ].map(({ icon: Icon, t, d }, n) => (
                <li key={t} data-reveal="left" className="flex gap-5 rounded-2xl border border-foreground/10 bg-card/40 p-5 sm:p-6">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold"><Icon size={20} /></span>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold mb-1">Étape {n + 1}</p>
                    <p className="font-serif text-2xl leading-tight">{t}</p>
                    <p className="text-sm text-foreground/65 mt-1.5 leading-relaxed">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ───────────── ENGAGEMENTS ───────────── */}
      <section className="border-y border-foreground/10 bg-card/30">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 py-20 sm:py-28">
          <SectionHeading kicker="Nos engagements" title="Une exigence," italic="trois promesses tenues." className="mb-12" />
          <div className="grid gap-px bg-foreground/10 rounded-3xl overflow-hidden border border-foreground/10 sm:grid-cols-3">
            {[
              { icon: Sparkles, t: "Sélection stricte", d: "Indoor, hydroponie, triple filtration : chaque variété est goûtée et validée par nos soins avant d'être proposée." },
              { icon: ShieldCheck, t: "Conformité totale", d: "THC < 0,3 %, variétés autorisées, analyses de laboratoire indépendantes consultables pour chaque lot." },
              { icon: MessageCircle, t: "Service humain", d: "Conseil personnalisé sur WhatsApp 7 j/7, préparation soignée, expédition le jour même avant 13 h." },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} data-reveal="up" className="spotlight bg-background p-8 lg:p-10 hover:bg-card transition-colors">
                <Icon className="text-gold mb-6" size={28} />
                <h3 className="font-serif text-3xl mb-3">{t}</h3>
                <p className="text-sm text-foreground/65 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>

          {/* Offre de bienvenue */}
          <div data-reveal="scale" className="card-emerald mt-8 relative overflow-hidden rounded-3xl p-7 sm:p-10 lg:p-12 shadow-deep grid lg:grid-cols-12 gap-10 items-center">
            <div aria-hidden className="hex-lines" style={{ "--hex-x": "100%", "--hex-y": "50%" } as CSSProperties} />
            <div className="relative lg:col-span-7">
              <p className="kicker mb-3">Offre de bienvenue</p>
              <h3 className="font-serif text-3xl sm:text-5xl leading-[0.95] mb-4">
                10 € offerts<br />
                <span className="font-serif-italic gold-shimmer">sur votre première commande.</span>
              </h3>
              <p className="text-foreground/75 text-base sm:text-lg leading-relaxed max-w-xl">
                Dès 100 € d'achat avec le code <strong className="font-mono text-gold">BIENVENUE10</strong>, à saisir dans le panier. Cumulable avec le port offert dès 60 €.
              </p>
              <Link href="/boutique" className="btn-gold mt-7 inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm font-semibold">
                Profiter de l'offre <ArrowUpRight size={14} />
              </Link>
            </div>
            {/* Le bon de bienvenue, façon billet doré */}
            <div aria-hidden className="relative lg:col-span-5 flex justify-center lg:justify-end">
              <div className="coupon bob-slow" style={{ "--tilt": "-4deg" } as CSSProperties}>
                <Rosette className="absolute -right-7 -top-7 h-24 w-24 opacity-25 rosette-spin" weight="fine" flat />
                <p className="font-mono text-[10px] uppercase tracking-[0.3em]">Bon de bienvenue</p>
                <p className="mt-3 font-serif text-[5.5rem] sm:text-[7rem] leading-[0.85] tracking-[-0.04em]">10&nbsp;€</p>
                <p className="mt-3 border-t border-dashed border-background/40 pt-3 font-mono text-xs sm:text-sm font-semibold tracking-[0.22em]">BIENVENUE10</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── GUIDES ───────────── */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 py-20 sm:py-28">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <SectionHeading kicker="Guides & conseils" title="Comprendre le CBD," italic="choisir en connaissance de cause." />
          <Link href="/guides" className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-gold border-b border-gold/40 pb-1 self-start sm:self-end">
            Tous les guides <ArrowUpRight size={14} className="group-hover:rotate-45 transition-transform" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {latestGuides.map((g) => (
            <Link key={g.slug} href={`/guides/${g.slug}`} data-reveal="up" className="lift spotlight group block h-full rounded-2xl border border-foreground/10 bg-card/50 p-7 hover:border-gold/40 transition-colors">
              <p className="kicker mb-3">{g.category}</p>
              <h3 className="font-serif text-2xl leading-tight mb-3 group-hover:text-gold transition-colors">{g.title}</h3>
              <p className="text-sm text-foreground/65 line-clamp-3">{g.description}</p>
              <span className="mt-5 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50 group-hover:text-gold">
                Lire <ArrowUpRight size={12} className="group-hover:rotate-45 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ───────────── FAQ ───────────── */}
      <section className="border-t border-foreground/10 bg-card/30">
        <div className="mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-12 py-20 sm:py-28 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <SectionHeading kicker="Questions fréquentes" title="Tout ce qu'il" italic="faut savoir." className="lg:sticky lg:top-28" />
          </div>
          <div className="lg:col-span-7" data-reveal="up">
            <Faq items={homeFaq} />
            <Link href="/faq" className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-gold hover:underline">
              Voir toute la FAQ <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────── CTA FINAL ───────────── */}
      <section className="relative overflow-hidden border-t border-foreground/10">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="aurora" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--color-background)_100%)]" />
        </div>
        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 py-24 sm:py-32 text-center">
          <Ornament className="mb-6" />
          <p className="kicker mb-5" data-reveal="up">On reste joignable</p>
          <h2 className="font-serif text-5xl sm:text-7xl leading-[0.9] mb-8 tracking-[-0.03em]" data-reveal="blur">
            Une question, un conseil ?<br />
            <span className="font-serif-italic gold-shimmer">On vous répond 7 j/7.</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-3" data-reveal="up">
            <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="group btn-gold inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm font-semibold">
              <MessageCircle size={18} /> WhatsApp · {site.phoneDisplay}
              <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform" />
            </a>
            <Link href="/contact" className="btn-outline glass inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-medium">
              Formulaire de contact <ArrowRight size={16} />
            </Link>
          </div>
          <p className="mt-10 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/40">
            <MapPin size={12} /> Damprichard · Le Russey · Charquemont · Maîche · France entière
          </p>
        </div>
      </section>
    </div>
  );
}
