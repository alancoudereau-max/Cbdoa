import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowUpRight } from "lucide-react";
import { cities } from "@/data/cities";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "CBD près de chez vous : Haut-Doubs, Doubs et toute la France",
  description: "Où acheter du CBD CBDoux : distributeurs 24h/24 à Charquemont et au Russey, retrait à Damprichard, livraison locale (Maîche, Morteau…) et expédition 24/48 h à Pontarlier, Besançon, Montbéliard, Belfort et partout en France.",
  path: "/cbd",
  keywords: ["cbd doubs", "cbd haut-doubs", "cbd près de chez moi", "acheter cbd franche-comté"],
});

const modeLabel: Record<string, string> = {
  distributeur: "Distributeur 24/7",
  retrait: "Retrait gratuit",
  "livraison-locale": "Livraison à domicile",
  expedition: "Expédition 24/48 h",
};

export default function CbdIndexPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12 py-10 sm:py-14">
      <Breadcrumbs items={[{ name: "CBD près de chez vous", path: "/cbd" }]} className="mb-8" />
      <SectionHeading as="h1" kicker="Haut-Doubs · Doubs · France" title="Du CBD premium," italic="près de chez vous." className="mb-12">
        Distributeurs 24/7, retrait gratuit, livraison à domicile dans le Haut-Doubs et expédition partout en France en 24/48 h.
      </SectionHeading>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cities.map((c) => (
          <Link key={c.slug} href={`/cbd/${c.slug}`} className="lift group rounded-2xl border border-foreground/10 bg-card/50 p-6 hover:border-gold/40 transition-colors">
            <div className="flex items-center gap-2 text-gold mb-3"><MapPin size={16} /><span className="font-mono text-[10px] uppercase tracking-[0.18em]">{c.postalCode} · {c.department}</span></div>
            <h2 className="font-serif text-3xl leading-tight mb-3 group-hover:text-gold transition-colors">CBD à {c.name}</h2>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {c.modes.map((m) => (
                <span key={m} className="rounded-full border border-foreground/15 px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.15em] text-foreground/65">{modeLabel[m]}</span>
              ))}
            </div>
            <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50 group-hover:text-gold">Voir <ArrowUpRight size={12} className="group-hover:rotate-45 transition-transform" /></span>
          </Link>
        ))}
      </div>
      <p className="mt-10 text-sm text-foreground/60 max-w-2xl">
        Votre ville n'est pas listée ? Nous expédions partout en France métropolitaine : <Link href="/livraison" className="text-gold underline underline-offset-2">voir les modes et tarifs de livraison</Link>.
      </p>
    </div>
  );
}
