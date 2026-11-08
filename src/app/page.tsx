import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowUpRight, ArrowRight, Truck, ShieldCheck, Clock, FlaskConical, Lock, Package, MessageCircle, Sparkles, Leaf, MapPin } from "lucide-react";
import { site, locations } from "@/data/site";
import { categories, categoryOrder, featuredProducts, visibleProducts, getProductsByCategory } from "@/data/products";
import { homeFaq } from "@/data/faq";
import { guides } from "@/data/guides";
import { ProductCard } from "@/components/product/ProductCard";
import { Faq } from "@/components/ui/Faq";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/JsonLd";
import { itemListJsonLd, buildMetadata } from "@/lib/seo";
import { getAvailabilityMap } from "@/lib/stock";

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: "CBDoux — CBD premium du Haut-Doubs, livraison France 24/48 h",
  description:
    "Fleurs, résines, huiles et vape CBD premium testés en laboratoire (THC < 0,3 %). Expédition discrète partout en France, port offert dès 60 €. Retrait à Damprichard & Le Russey, distributeurs 24/7.",
  path: "/",
  keywords: ["cbd", "boutique cbd en ligne", "fleur cbd", "résine cbd", "cbd haut-doubs", "cbd livraison france", "cbd doubs"],
});

const marqueeWords = ["Super Lemon Haze", "Amnesia Hydro", "Critical Berry", "Snow White", "Orangello", "3X Filtré", "Olivette Gold", "Cali Fruit", "Bubble Gum", "Beldia", "Piatella", "Full Spectrum"];

export default async function HomePage() {
  const availability = getAvailabilityMap();
  const featured = featuredProducts.slice(0, 4);
  const latestGuides = guides.slice(0, 3);

  return (
    <div className="overflow-hidden">
      <JsonLd
        data={itemListJsonLd(
          "Sélection CBDoux",
          featured.map((p) => ({ name: p.name, path: `/produit/${p.slug}`, image: p.image })),
        )}
      />

      {/* ───────────── HERO ───────────── */}
      <section className="relative grain min-h-[88vh] flex items-center border-b border-foreground/10">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="orb orb-gold w-[520px] h-[520px] -top-32 -left-24 animate-float" />
          <div className="orb orb-leaf w-[460px] h-[460px] top-1/3 -right-20 animate-float-slow" />
          <div className="orb orb-gold w-[300px] h-[300px] bottom-0 left-1/3 opacity-30 animate-float" />
        </div>

        <div className="relative w-full mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 py-14 sm:py-20 lg:py-24">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-7">
              <p className="kicker mb-5">CBD premium · Haut-Doubs · Livraison France entière</p>
              <h1 className="font-serif leading-[0.9] tracking-[-0.03em] max-w-4xl">
                <span className="block text-[15vw] sm:text-[10vw] lg:text-[7.5rem] xl:text-[8.5rem] text-foreground">Du CBD</span>
                <span className="block mt-1 text-[11vw] sm:text-[7vw] lg:text-[5.8rem] xl:text-[6.5rem] font-serif-italic gold-shimmer">qui tient ses promesses.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg sm:text-xl lg:text-2xl leading-snug text-foreground/78">
                Fleurs, résines, huiles et vape CBD testés en laboratoire. Expédiés en 24/48 h partout en France dans un colis neutre, ou à retirer dans le Haut-Doubs.
              </p>

              <div className="mt-9 flex flex-col sm:flex-row gap-3 sm:max-w-xl">
                <Link href="/boutique" className="group btn-gold inline-flex flex-1 items-center justify-between gap-2 rounded-full px-6 py-4 text-sm font-semibold">
                  <span>Découvrir la boutique</span>
                  <ArrowUpRight size={18} className="group-hover:rotate-45 transition-transform" />
                </Link>
                <Link href="/livraison" className="btn-outline inline-flex flex-1 items-center justify-between gap-2 rounded-full bg-card/35 px-6 py-4 text-sm font-medium">
                  <span>Livraison & retrait</span>
                  <Truck size={16} />
                </Link>
              </div>

              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-foreground/60">
                <li className="inline-flex items-center gap-1.5"><Truck size={13} className="text-gold" /> Port offert dès 60 €</li>
                <li className="inline-flex items-center gap-1.5"><Package size={13} className="text-gold" /> Colis 100 % neutre</li>
                <li className="inline-flex items-center gap-1.5"><Lock size={13} className="text-gold" /> Paiement sécurisé</li>
                <li className="inline-flex items-center gap-1.5"><FlaskConical size={13} className="text-gold" /> THC &lt; 0,3 % · analyses labo</li>
              </ul>
            </div>

            <div className="lg:col-span-5 lg:pl-4">
              <div className="luxe-panel relative overflow-hidden rounded-[2rem] p-3 sm:p-4">
                <div className="overflow-hidden rounded-[1.55rem] border border-gold/20 bg-card-2/40">
                  <Image
                    src="/images/brand/banner-wide.png"
                    alt="CBDoux — CBD premium dans le Haut-Doubs"
                    width={1200}
                    height={520}
                    priority
                    sizes="(max-width: 1024px) 100vw, 520px"
                    className="block w-full h-auto object-contain bg-card-2/40 p-3"
                  />
                </div>
                <div className="mt-3 sm:mt-4 rounded-[1.55rem] border border-foreground/10 bg-background/60 px-5 py-5 sm:px-6">
                  <p className="kicker mb-3">Analyses & conformité</p>
                  <p className="text-sm sm:text-base leading-relaxed text-foreground/80">
                    Chaque lot est analysé par un laboratoire indépendant : taux de CBD vérifié, THC sous 0,3 %, résultats consultables en ligne.
                  </p>
                  <Link href="/analyses-laboratoires" className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-gold hover:underline">
                    Voir les analyses <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-14 sm:mt-18 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-8 border-t border-foreground/10 pt-8 sm:pt-10">
            {[
              { v: String(visibleProducts.length), l: "références en stock" },
              { v: "24/48 h", l: "expédition France" },
              { v: "<0,3 %", l: "THC · conformité FR" },
              { v: "24/7", l: "distributeurs Haut-Doubs" },
            ].map((s) => (
              <div key={s.l}>
                <p className="font-serif text-4xl sm:text-5xl text-gradient-gold leading-none">{s.v}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55 mt-2">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── MARQUEE ───────────── */}
      <section aria-hidden className="border-b border-foreground/10 bg-card/30 py-5">
        <div className="marquee">
          {[0, 1].map((dup) => (
            <div className="marquee-track" key={dup}>
              {marqueeWords.map((w) => (
                <span key={`${dup}-${w}`} className="font-serif-italic text-3xl sm:text-4xl text-foreground/70 flex items-center gap-12 whitespace-nowrap">
                  {w}
                  <span className="text-gold">✺</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ───────────── CATÉGORIES ───────────── */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 py-20 sm:py-28">
        <SectionHeading kicker="La boutique" title="Quatre univers," italic="une seule exigence." className="mb-12">
          Fleurs indoor et hydroponie, résines filtrées, huiles Full Spectrum et vape : tout notre catalogue est sélectionné, goûté et analysé avant d'arriver chez vous.
        </SectionHeading>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {categoryOrder.map((key, i) => {
            const c = categories[key];
            const count = getProductsByCategory(key).length;
            return (
              <Reveal key={key} delay={i * 80}>
                <Link href={`/${c.slug}`} className="lift group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-foreground/10 bg-card">
                  <Image src={c.image} alt={c.name} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold mb-1">{count} référence{count > 1 ? "s" : ""}</p>
                    <h3 className="font-serif text-2xl sm:text-3xl leading-none">{c.name}</h3>
                    <span className="mt-3 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/60 group-hover:text-gold transition-colors">
                      Découvrir <ArrowUpRight size={12} className="group-hover:rotate-45 transition-transform" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ───────────── PRODUITS PHARES ───────────── */}
      <section className="border-y border-foreground/10 bg-card/30">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 py-20 sm:py-28">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <SectionHeading kicker="Notre sélection" title="Les pièces" italic="maîtresses du moment." />
            <Link href="/boutique" className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-gold border-b border-gold/40 pb-1 self-start sm:self-end">
              Tout le catalogue <ArrowUpRight size={14} className="group-hover:rotate-45 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {featured.map((p, i) => (
              <ProductCard key={p.slug} product={p} priority={i < 2} available={p.variants.some((v) => availability[v.sku] !== false)} />
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/10 via-card/40 to-transparent px-5 py-4 sm:px-6 sm:py-5 flex items-start gap-4">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/50 bg-background text-gold font-serif text-lg">!</span>
            <div className="text-sm text-foreground/75 leading-relaxed">
              <p className="kicker mb-1">Prudence d'utilisation</p>
              La puissance dépend de la force choisie : Classique, Force 2, Force 3 ou Maxi (concentration maximale, réservée aux adultes habitués). Commencez par de très petites quantités, attendez les effets et ne conduisez pas après consommation.{" "}
              <Link href="/conseils-prudence" className="text-gold underline underline-offset-2">Lire les conseils complets</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── LIVRAISON FRANCE ───────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-gold w-[500px] h-[500px] -top-32 -right-32 opacity-30 animate-float" />
        </div>
        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 py-20 sm:py-28 grid lg:grid-cols-12 gap-10 items-center">
          <Reveal className="lg:col-span-7">
            <SectionHeading kicker="Partout en France" title="Expédié en 24/48 h," italic="en toute discrétion.">
              Commandez avant 13 h, votre colis part le jour même. Sachets hermétiques inodores, colis neutre, suivi en temps réel. Port Colissimo offert dès 60 € d'achat.
            </SectionHeading>
            <div className="mt-8 grid grid-cols-3 gap-4 sm:gap-6 max-w-2xl">
              {[
                { k: "24 h", v: "Chronopost Express" },
                { k: "48 h", v: "Colissimo · offert dès 60 €" },
                { k: "100 %", v: "Colis neutre & discret" },
              ].map((s) => (
                <div key={s.k} className="border-l-2 border-gold/60 pl-4">
                  <p className="font-serif text-2xl sm:text-3xl text-gradient-gold leading-none">{s.k}</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/60 mt-2">{s.v}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/boutique" className="btn-gold inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-semibold">
                Commander maintenant <ArrowRight size={16} />
              </Link>
              <Link href="/livraison" className="btn-outline inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-mono uppercase tracking-[0.18em]">
                Tarifs & délais
              </Link>
            </div>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-5">
            <div className="relative rounded-3xl border border-gold/40 bg-card/60 backdrop-blur p-8 sm:p-10 shadow-deep">
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
          </Reveal>
        </div>
      </section>

      {/* ───────────── DISTRIBUTEURS ───────────── */}
      <section className="relative grain border-y border-foreground/10 bg-card/20">
        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 py-20 sm:py-28 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <SectionHeading kicker="Haut-Doubs · 24 h/24" title="Servez-vous," italic="à toute heure du jour et de la nuit.">
              Deux distributeurs automatiques CBDoux, à Charquemont et au Russey. Produits conservés à 20 °C dans des sachets biphase, paiement par carte, discrétion totale.
            </SectionHeading>
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {locations.vendingMachines.map((m) => (
                <div key={m.id} className="rounded-2xl border border-foreground/10 bg-background/60 p-5">
                  <p className="font-serif text-2xl text-gold">{m.city}</p>
                  <p className="text-sm text-foreground/70 mt-1 flex items-start gap-2"><MapPin size={14} className="text-gold mt-0.5 shrink-0" /> {m.place}</p>
                  <p className="text-xs text-foreground/50 mt-2 flex items-center gap-2"><Clock size={12} className="text-gold" /> {m.hours} · {m.payment}</p>
                </div>
              ))}
            </div>
            <Link href="/distributeurs" className="group mt-8 inline-flex items-center gap-3 text-sm font-mono uppercase tracking-[0.2em] text-foreground border-b border-foreground/30 pb-2 hover:text-gold hover:border-gold transition-colors">
              Itinéraires & infos <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform" />
            </Link>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-8 bg-gradient-to-br from-gold/25 via-transparent to-transparent blur-3xl" />
            <Image
              src="/images/brand/distributeur-charquemont.jpg"
              alt="Distributeur automatique CBD CBDoux à Charquemont, ouvert 24h/24"
              width={900}
              height={1200}
              sizes="(max-width: 1024px) 100vw, 480px"
              className="relative w-full rounded-2xl border border-gold/30 shadow-deep"
            />
          </div>
        </div>
      </section>

      {/* ───────────── ENGAGEMENTS ───────────── */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 py-20 sm:py-28">
        <SectionHeading kicker="Nos engagements" title="Une exigence," italic="trois promesses tenues." className="mb-12" />
        <div className="grid gap-px bg-foreground/10 rounded-2xl overflow-hidden border border-foreground/10 sm:grid-cols-3">
          {[
            { icon: Sparkles, t: "Sélection stricte", d: "Indoor, hydroponie, triple filtration : chaque variété est goûtée et validée par nos soins avant d'être proposée." },
            { icon: ShieldCheck, t: "Conformité totale", d: "THC < 0,3 %, variétés autorisées, analyses de laboratoire indépendantes consultables pour chaque lot." },
            { icon: MessageCircle, t: "Service humain", d: "Conseil personnalisé sur WhatsApp 7 j/7, préparation soignée, expédition le jour même avant 13 h." },
          ].map(({ icon: Icon, t, d }, i) => (
            <Reveal key={t} delay={i * 100} className="bg-background p-8 lg:p-10 hover:bg-card transition-colors">
              <Icon className="text-gold mb-6" size={28} />
              <h3 className="font-serif text-3xl mb-3">{t}</h3>
              <p className="text-sm text-foreground/65 leading-relaxed">{d}</p>
            </Reveal>
          ))}
        </div>

        {/* Offre de bienvenue */}
        <div className="mt-8 relative overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-card via-card-2/40 to-card p-7 sm:p-10 shadow-deep grid lg:grid-cols-12 gap-8 items-center">
          <div className="absolute -top-20 -right-20 orb orb-gold w-[420px] h-[420px] opacity-25" />
          <div className="relative lg:col-span-8">
            <p className="kicker mb-3">Offre de bienvenue</p>
            <h3 className="font-serif text-3xl sm:text-5xl leading-[0.95] mb-4">
              10 € offerts<br />
              <span className="font-serif-italic gold-shimmer">sur votre première commande.</span>
            </h3>
            <p className="text-foreground/75 text-base sm:text-lg leading-relaxed max-w-xl">
              Dès 100 € d'achat avec le code <strong className="font-mono text-gold">BIENVENUE10</strong>, à saisir dans le panier. Cumulable avec le port offert dès 60 €.
            </p>
          </div>
          <div className="relative lg:col-span-4 flex lg:justify-end">
            <Link href="/boutique" className="btn-gold inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm font-semibold">
              Profiter de l'offre <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────── GUIDES ───────────── */}
      <section className="border-y border-foreground/10 bg-card/30">
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 py-20 sm:py-28">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <SectionHeading kicker="Guides & conseils" title="Comprendre le CBD," italic="choisir en connaissance de cause." />
            <Link href="/guides" className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-gold border-b border-gold/40 pb-1 self-start sm:self-end">
              Tous les guides <ArrowUpRight size={14} className="group-hover:rotate-45 transition-transform" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {latestGuides.map((g, i) => (
              <Reveal key={g.slug} delay={i * 80}>
                <Link href={`/guides/${g.slug}`} className="lift group block h-full rounded-2xl border border-foreground/10 bg-background p-7 hover:border-gold/40 transition-colors">
                  <p className="kicker mb-3">{g.category}</p>
                  <h3 className="font-serif text-2xl leading-tight mb-3 group-hover:text-gold transition-colors">{g.title}</h3>
                  <p className="text-sm text-foreground/65 line-clamp-3">{g.description}</p>
                  <span className="mt-5 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50 group-hover:text-gold">
                    Lire <ArrowUpRight size={12} className="group-hover:rotate-45 transition-transform" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── FAQ ───────────── */}
      <section className="mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-12 py-20 sm:py-28">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <SectionHeading kicker="Questions fréquentes" title="Tout ce qu'il" italic="faut savoir." className="lg:sticky lg:top-28" />
          </div>
          <div className="lg:col-span-7">
            <Faq items={homeFaq} />
            <Link href="/faq" className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-gold hover:underline">
              Voir toute la FAQ <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────── CTA FINAL ───────────── */}
      <section className="relative grain border-t border-foreground/10">
        <div className="absolute inset-0 overflow-hidden">
          <div className="orb orb-gold w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float" />
        </div>
        <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 py-24 sm:py-32 text-center">
          <p className="kicker mb-5">On reste joignable</p>
          <h2 className="font-serif text-5xl sm:text-7xl leading-[0.9] mb-8 tracking-[-0.03em]">
            Une question, un conseil ?<br />
            <span className="font-serif-italic gold-shimmer">On vous répond 7 j/7.</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="group btn-gold inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm font-semibold">
              <MessageCircle size={18} /> WhatsApp · {site.phoneDisplay}
              <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform" />
            </a>
            <Link href="/contact" className="btn-outline inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-medium">
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
