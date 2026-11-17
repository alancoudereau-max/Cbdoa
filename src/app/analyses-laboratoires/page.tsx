import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { coas } from "@/data/coa";
import { getProduct } from "@/data/products";
import { PageHero } from "@/components/ui/PageHero";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Analyses laboratoires CBD (COA) : taux CBD & THC vérifiés",
  description:
    "Nos certificats d'analyse : taux de CBD et de THC par lot, méthodes HPLC et GC-MS, laboratoires indépendants. Conformité française : THC < 0,3 %.",
  path: "/analyses-laboratoires",
  keywords: ["analyse laboratoire cbd", "coa cbd", "certificat analyse cbd", "taux thc cbd", "cbd testé"],
});

const principles = [
  { t: "Conformité française", d: "THC strictement inférieur à 0,3 %, variétés autorisées, traçabilité du lot à la mise en vente." },
  { t: "Laboratoires indépendants", d: "Méthodes HPLC (chromatographie liquide) et GC-MS / GC-FID. Rapports datés et identifiables." },
  { t: "Rapports publics", d: "Les analyses sont publiées telles quelles. Un lot précis ? Demandez-nous le rapport correspondant." },
];

export default function AnalysesPage() {
  return (
    <div>
      <PageHero
        crumbs={[{ name: "Analyses laboratoires", path: "/analyses-laboratoires" }]}
        title={
          <>
            Analyses <em>de laboratoire</em>
          </>
        }
        lead="Chaque lot est analysé par un laboratoire indépendant. Taux de CBD, THC et méthode d'analyse sont consultables ci-dessous : touchez un rapport pour l'ouvrir en haute résolution."
      />

      <section className="wrap">
        <ul className="grid sm:grid-cols-3">
          {principles.map(({ t, d }, n) => (
            <li key={t} className={`border-t border-foreground/15 py-6 sm:border-b sm:pr-7 ${n ? "sm:border-l sm:pl-7" : ""}`}>
              <h2 className="t-title">{t}</h2>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-foreground/75">{d}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="wrap section">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {coas.map((coa) => {
            const linked = coa.productSlugs.map(getProduct).filter((p): p is NonNullable<typeof p> => Boolean(p));
            return (
              <article key={coa.id} className="paper paper-object flex flex-col">
                <div className="p-5 sm:p-6">
                  <p className="t-fine">{coa.type}</p>
                  <h3 className="t-h3 mt-1.5">{coa.name}</h3>
                  <dl className="mt-5 grid grid-cols-2 border-y border-foreground/25">
                    <div className="py-3 pr-3">
                      <dt className="t-fine">CBD total</dt>
                      <dd className="t-num mt-0.5 font-serif text-[1.5rem] leading-tight">{coa.cbd}</dd>
                    </div>
                    <div className="border-l border-foreground/25 py-3 pl-4">
                      <dt className="t-fine">Δ9-THC total</dt>
                      <dd className="t-num mt-0.5 font-serif text-[1.5rem] leading-tight">{coa.thc}</dd>
                    </div>
                  </dl>
                  <p className="t-fine mt-4">
                    {coa.method}. {coa.lab}, {coa.date}.
                  </p>
                </div>
                {/* Un seul feuillet : il est montré en grand. Plusieurs : une planche de pages. */}
                <div className={`grid flex-1 content-start gap-2 px-3 pb-3 ${coa.images.length > 1 ? "grid-cols-3" : ""}`}>
                  {coa.images.map((src, i) => {
                    const page = coa.images.length > 1 ? `, page ${i + 1}` : "";
                    return (
                      <a key={src} href={src} target="_blank" rel="noopener noreferrer" className="group relative block overflow-hidden rounded-[2px] border border-foreground/20 bg-white" aria-label={`Ouvrir le rapport d'analyse ${coa.name}${page}`}>
                        <Image
                          src={src}
                          alt={`Certificat d'analyse ${coa.name}${page}`}
                          width={800}
                          height={1000}
                          sizes={coa.images.length > 1 ? "(max-width: 768px) 33vw, 140px" : "(max-width: 768px) 100vw, 400px"}
                          className={`block w-full object-cover object-top transition-opacity group-hover:opacity-90 ${coa.images.length > 1 ? "aspect-[10/19]" : "aspect-[4/5]"}`}
                        />
                        <span className="absolute bottom-2 right-2 rounded-full bg-sapin px-3 py-1.5 text-[0.75rem] font-medium leading-none text-etiquette">{coa.images.length > 1 ? `Page ${i + 1}` : "Agrandir"}</span>
                      </a>
                    );
                  })}
                </div>
                {linked.length > 0 && (
                  <p className="border-t border-foreground/25 px-5 py-3.5 text-[0.875rem] sm:px-6">
                    <span className="text-foreground/65">Produit : </span>
                    {linked.map((p, i) => (
                      <span key={p.slug}>
                        {i > 0 && ", "}
                        <Link href={`/produit/${p.slug}`} className="link">
                          {p.name}
                        </Link>
                      </span>
                    ))}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="wrap grid gap-12 pb-24 lg:grid-cols-2 lg:gap-16">
        <div className="border-t border-foreground/15 pt-8">
          <h2 className="t-h3">Comment lire ces rapports ?</h2>
          <p className="mt-4 text-foreground/80">
            « CBD total » et « THC total » intègrent les formes acides (CBDA, THCA) converties. Le critère légal est le THC total, qui doit rester sous 0,3 %. Le taux de CBD mesuré sur la fleur brute correspond à la force Classique ; les forces 2, 3 et Maxi sont enrichies en cannabinoïdes avec un extrait dont l'analyse figure ci-dessus (Distillat CSA).
          </p>
          <Link href="/guides/lire-analyse-laboratoire-coa" className="link mt-5 inline-block">
            Le guide complet
          </Link>
        </div>
        <div className="border-t border-foreground/15 pt-8">
          <h2 className="t-h3">Une analyse spécifique ?</h2>
          <p className="mt-4 text-foreground/80">Vous souhaitez le rapport d'un lot précis ? Indiquez le produit et la date d'achat, nous vous l'envoyons.</p>
          <Link href="/contact" className="btn btn-primary mt-6">
            Demander une analyse
          </Link>
          <p className="t-fine mt-8">Nos produits ne sont pas destinés à un usage médical. Réservés aux personnes majeures.</p>
        </div>
      </section>
    </div>
  );
}
