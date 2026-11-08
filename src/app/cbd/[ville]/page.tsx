import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Clock, Truck, Package, ArrowRight, MessageCircle } from "lucide-react";
import { cities, getCity } from "@/data/cities";
import { featuredProducts } from "@/data/products";
import { locations, site } from "@/data/site";
import { ProductCard } from "@/components/product/ProductCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata, vendingMachineJsonLd } from "@/lib/seo";
import { getAvailabilityMap } from "@/lib/supabase";

export const dynamicParams = false;
export const revalidate = 3600;

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
  distributeur: { icon: Clock, title: "Distributeur 24 h/24", text: "Servez-vous à toute heure, paiement par carte, produits conservés à 20 °C.", href: "/distributeurs", cta: "Voir les distributeurs" },
  retrait: { icon: MapPin, title: "Retrait gratuit", text: "Commandez en ligne, retirez sur rendez-vous. Paiement en ligne ou sur place.", href: "/livraison", cta: "Comment ça marche" },
  "livraison-locale": { icon: Truck, title: "Livraison à domicile", text: "Par nos soins, sous 24 à 48 h, remise en main propre. 10 €, offerte dès 100 €.", href: "/livraison", cta: "Zone et tarifs" },
  expedition: { icon: Package, title: "Expédition 24/48 h", text: "Colissimo 48 h offert dès 60 €, Chronopost le lendemain, colis neutre.", href: "/livraison", cta: "Délais et tarifs" },
} as const;

export default async function CityPage({ params }: { params: Promise<{ ville: string }> }) {
  const { ville } = await params;
  const c = getCity(ville);
  if (!c) notFound();
  const availability = await getAvailabilityMap();
  const machine = locations.vendingMachines.find((m) => m.id === c.slug);
  const nearby = c.nearby.map(getCity).filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12 py-10 sm:py-14">
      {machine && <JsonLd data={vendingMachineJsonLd(machine)} />}
      <Breadcrumbs items={[{ name: "CBD près de chez vous", path: "/cbd" }, { name: c.name, path: `/cbd/${c.slug}` }]} className="mb-8" />

      <header className="max-w-3xl mb-12">
        <p className="kicker mb-3">{c.postalCode} · {c.department}</p>
        <h1 className="font-serif text-4xl sm:text-6xl leading-[0.95] mb-6">
          CBD à <span className="text-gradient-gold">{c.name}</span>
        </h1>
        <p className="text-lg text-foreground/75 leading-relaxed">{c.intro}</p>
      </header>

      <div className="grid sm:grid-cols-2 gap-4 mb-12">
        {c.modes.map((m) => {
          const card = modeCards[m];
          const Icon = card.icon;
          return (
            <div key={m} className="rounded-2xl border border-gold/25 bg-card/50 p-6">
              <Icon className="text-gold mb-4" size={24} />
              <h2 className="font-serif text-2xl mb-2">{card.title}</h2>
              <p className="text-sm text-foreground/70 mb-4">{card.text}</p>
              <Link href={card.href} className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-gold hover:underline">{card.cta} <ArrowRight size={12} /></Link>
            </div>
          );
        })}
      </div>

      <div className="prose-cbd max-w-3xl mb-12">
        {c.body.map((para) => (
          <p key={para}>{para}</p>
        ))}
        <p>
          Tous nos produits respectent la réglementation française (THC &lt; 0,3 %), sont réservés aux adultes et accompagnés d'analyses de laboratoire. Consultez nos <Link href="/conseils-prudence">conseils de prudence</Link> avant utilisation.
        </p>
      </div>

      <section className="mb-12">
        <div className="flex items-end justify-between gap-4 mb-6">
          <h2 className="font-serif text-3xl">Notre sélection</h2>
          <Link href="/boutique" className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold hover:underline">Tout le catalogue →</Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {featuredProducts.slice(0, 4).map((p) => (
            <ProductCard key={p.slug} product={p} available={p.variants.some((v) => availability[v.sku] !== false)} />
          ))}
        </div>
      </section>

      <section className="grid lg:grid-cols-12 gap-10 mb-12">
        <div className="lg:col-span-5">
          <h2 className="font-serif text-3xl">Questions fréquentes<br /><span className="font-serif-italic text-foreground/55">à {c.name}.</span></h2>
        </div>
        <div className="lg:col-span-7"><Faq items={c.faq} /></div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/10 via-card/40 to-transparent p-7">
        <div>
          <p className="font-serif text-2xl">Un conseil avant de commander ?</p>
          <p className="text-sm text-foreground/65">WhatsApp 7 j/7 · {site.phoneDisplay}</p>
        </div>
        <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"><MessageCircle size={16} /> Écrire sur WhatsApp</a>
      </div>

      {nearby.length > 0 && (
        <nav aria-label="Villes voisines" className="mt-10 flex flex-wrap gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50 self-center mr-2">À proximité :</span>
          {nearby.map((n) => (
            <Link key={n.slug} href={`/cbd/${n.slug}`} className="btn-outline rounded-full px-4 py-2 text-xs">CBD à {n.name}</Link>
          ))}
        </nav>
      )}
    </div>
  );
}
