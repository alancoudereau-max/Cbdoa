import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { FileCheck, ShieldCheck, FlaskConical, ArrowRight, ExternalLink } from "lucide-react";
import { coas } from "@/data/coa";
import { getProduct } from "@/data/products";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Analyses laboratoires CBD (COA) : taux CBD & THC vérifiés",
  description:
    "Tous nos certificats d'analyse : taux de CBD et de THC par lot, méthodes HPLC et GC-MS, laboratoires indépendants. Conformité française THC < 0,3 %. Transparence totale.",
  path: "/analyses-laboratoires",
  keywords: ["analyse laboratoire cbd", "coa cbd", "certificat analyse cbd", "taux thc cbd", "cbd testé"],
});

export default function AnalysesPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12 py-10 sm:py-14">
      <Breadcrumbs items={[{ name: "Analyses laboratoires", path: "/analyses-laboratoires" }]} className="mb-8" />
      <SectionHeading as="h1" kicker="Transparence" title="Analyses" italic="de laboratoire." className="mb-10">
        Chaque lot est analysé par un laboratoire indépendant. Taux de CBD, THC et méthode d'analyse sont consultables ci-dessous — cliquez sur un rapport pour l'ouvrir en haute résolution.
      </SectionHeading>

      <div className="grid sm:grid-cols-3 gap-4 mb-12">
        {[
          { icon: ShieldCheck, t: "Conformité française", d: "THC strictement inférieur à 0,3 %, variétés autorisées, traçabilité du lot à la mise en vente." },
          { icon: FlaskConical, t: "Laboratoires indépendants", d: "Méthodes HPLC (chromatographie liquide) et GC-MS / GC-FID. Rapports datés et identifiables." },
          { icon: FileCheck, t: "Rapports publics", d: "Les analyses sont publiées telles quelles. Un lot précis ? Demandez-nous le rapport correspondant." },
        ].map(({ icon: Icon, t, d }) => (
          <div key={t} className="rounded-2xl border border-gold/25 bg-card/60 p-6">
            <Icon className="text-gold mb-3" size={24} />
            <h2 className="font-serif text-xl mb-2">{t}</h2>
            <p className="text-sm text-foreground/70">{d}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {coas.map((coa) => {
          const linked = coa.productSlugs.map(getProduct).filter((p): p is NonNullable<typeof p> => Boolean(p));
          return (
            <article key={coa.id} className="rounded-2xl border border-gold/25 bg-card/60 overflow-hidden flex flex-col">
              <div className="px-5 py-4 border-b border-gold/15 bg-card-2/40 flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold mb-1">{coa.type}</p>
                  <h3 className="font-serif text-2xl text-gradient-gold leading-tight">{coa.name}</h3>
                </div>
                <FlaskConical className="text-gold/70 shrink-0 mt-1" size={20} />
              </div>
              <div className="grid grid-cols-2 gap-px bg-foreground/10">
                <div className="bg-card px-4 py-3">
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/55 mb-1">CBD total</p>
                  <p className="font-serif text-xl">{coa.cbd}</p>
                </div>
                <div className="bg-card px-4 py-3">
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/55 mb-1">Δ9-THC total</p>
                  <p className="font-serif text-xl">{coa.thc}</p>
                </div>
              </div>
              <div className="px-5 py-3 border-y border-foreground/10 text-xs text-foreground/65 flex flex-wrap gap-x-4 gap-y-1">
                <span><span className="text-foreground/45">Méthode :</span> {coa.method}</span>
                <span><span className="text-foreground/45">Date :</span> {coa.date}</span>
                <span><span className="text-foreground/45">Labo :</span> {coa.lab}</span>
              </div>
              <div className="p-3 flex flex-col gap-2 flex-1">
                {coa.images.map((src, i) => (
                  <a key={src} href={src} target="_blank" rel="noopener noreferrer" className="group relative block overflow-hidden rounded-lg border border-foreground/10 bg-white" aria-label={`Ouvrir le rapport d'analyse ${coa.name}${coa.images.length > 1 ? ` — page ${i + 1}` : ""}`}>
                    <Image src={src} alt={`Certificat d'analyse ${coa.name}${coa.images.length > 1 ? ` — page ${i + 1}` : ""}`} width={800} height={1000} sizes="(max-width: 768px) 100vw, 400px" className="w-full h-auto block group-hover:opacity-90 transition-opacity" />
                    <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded bg-black/70 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-gold"><ExternalLink size={10} /> Agrandir</span>
                  </a>
                ))}
              </div>
              {linked.length > 0 && (
                <div className="px-5 py-3 border-t border-foreground/10 text-xs">
                  <span className="text-foreground/45">Produit : </span>
                  {linked.map((p, i) => (
                    <span key={p.slug}>
                      {i > 0 && ", "}
                      <Link href={`/produit/${p.slug}`} className="text-gold hover:underline">{p.name}</Link>
                    </span>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>

      <div className="mt-12 grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-foreground/10 bg-card/40 p-7">
          <h2 className="font-serif text-2xl mb-3">Comment lire ces rapports ?</h2>
          <p className="text-sm text-foreground/70 leading-relaxed mb-4">
            « CBD total » et « THC total » intègrent les formes acides (CBDA, THCA) converties. Le critère légal est le THC total, qui doit rester sous 0,3 %. Le taux de CBD mesuré sur la fleur brute correspond à la force Classique ; les forces 2, 3 et Maxi sont renforcées avec un extrait dont l'analyse figure ci-dessus (Distillat CSA).
          </p>
          <Link href="/guides/lire-analyse-laboratoire-coa" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-gold hover:underline">
            Le guide complet <ArrowRight size={14} />
          </Link>
        </div>
        <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/10 via-card/40 to-transparent p-7 text-center">
          <h2 className="font-serif text-2xl mb-2">Une analyse spécifique ?</h2>
          <p className="text-sm text-foreground/75 mb-5">Vous souhaitez le rapport d'un lot précis ? Indiquez le produit et la date d'achat, nous vous l'envoyons.</p>
          <Link href="/contact" className="btn-gold inline-flex rounded-full px-6 py-3 text-sm font-semibold">Demander une analyse</Link>
        </div>
      </div>

      <p className="mt-8 text-xs text-foreground/50 text-center">Nos produits ne sont pas destinés à un usage médical. Réservés aux personnes majeures (18+).</p>
    </div>
  );
}
