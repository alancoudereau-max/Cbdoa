import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { guides, getGuide } from "@/data/guides";
import { getProduct } from "@/data/products";
import { Blocks } from "@/components/content/Blocks";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Faq } from "@/components/ui/Faq";
import { ProductCard } from "@/components/product/ProductCard";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata, articleJsonLd } from "@/lib/seo";
import { formatDateFR } from "@/lib/utils";
import { getAvailabilityMap } from "@/lib/stock";

export const dynamicParams = false;

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  return buildMetadata({ title: g.title, description: g.description, path: `/guides/${g.slug}`, type: "article", publishedTime: g.publishedAt, keywords: g.keywords });
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();
  const availability = getAvailabilityMap();
  const products = g.relatedProducts.map(getProduct).filter((p): p is NonNullable<typeof p> => Boolean(p));
  const related = g.relatedGuides.map(getGuide).filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <article className="mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-12 py-10 sm:py-14">
      <JsonLd data={articleJsonLd({ title: g.title, description: g.description, path: `/guides/${g.slug}`, publishedAt: g.publishedAt })} />
      <Breadcrumbs items={[{ name: "Guides", path: "/guides" }, { name: g.title, path: `/guides/${g.slug}` }]} className="mb-8" />

      <header className="max-w-3xl mb-12">
        <p className="kicker mb-4">{g.category}</p>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1] mb-6">{g.title}</h1>
        <p className="text-lg text-foreground/75 leading-relaxed">{g.intro}</p>
        <div className="mt-6 flex flex-wrap gap-5 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">
          <span className="inline-flex items-center gap-1.5"><Calendar size={12} /> {formatDateFR(g.publishedAt)}</span>
          <span className="inline-flex items-center gap-1.5"><Clock size={12} /> {g.readingMinutes} min de lecture</span>
          <span>Par l'équipe CBDoux</span>
        </div>
      </header>

      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <nav aria-label="Sommaire" className="mb-10 rounded-2xl border border-foreground/10 bg-card/40 p-5">
            <p className="kicker mb-3">Sommaire</p>
            <ol className="space-y-1.5 text-sm">
              {g.sections.map((s, i) => (
                <li key={s.heading}>
                  <a href={`#s${i + 1}`} className="text-foreground/75 hover:text-gold">{i + 1}. {s.heading}</a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="prose-cbd">
            {g.sections.map((s, i) => (
              <section key={s.heading} id={`s${i + 1}`} className="scroll-mt-28">
                <h2>{s.heading}</h2>
                <Blocks blocks={s.blocks} />
              </section>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-gold/20 bg-gold/5 p-5 text-xs text-foreground/60 leading-relaxed">
            Informations à caractère général, non médicales. Produits réservés aux adultes, THC &lt; 0,3 %. Ne pas conduire après usage. En cas de traitement médical, demandez l'avis d'un professionnel de santé.
          </div>

          <section className="mt-12">
            <h2 className="font-serif text-3xl mb-5">Questions fréquentes</h2>
            <Faq items={g.faq} />
          </section>
        </div>

        <aside className="lg:col-span-4 space-y-8">
          {products.length > 0 && (
            <div>
              <p className="kicker mb-4">Produits liés</p>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                {products.map((pr) => (
                  <ProductCard key={pr.slug} product={pr} available={pr.variants.some((v) => availability[v.sku] !== false)} />
                ))}
              </div>
            </div>
          )}
          {related.length > 0 && (
            <div>
              <p className="kicker mb-4">À lire aussi</p>
              <ul className="space-y-3">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/guides/${r.slug}`} className="group flex items-start gap-3 rounded-xl border border-foreground/10 bg-card/40 p-4 hover:border-gold/40 transition-colors">
                      <span className="flex-1">
                        <span className="block font-serif text-lg leading-tight group-hover:text-gold">{r.title}</span>
                        <span className="block text-xs text-foreground/50 mt-1">{r.readingMinutes} min</span>
                      </span>
                      <ArrowRight size={16} className="text-gold mt-1 shrink-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/10 to-transparent p-5">
            <p className="font-serif text-2xl mb-2">Un doute ? Demandez conseil.</p>
            <p className="text-sm text-foreground/65 mb-4">Nous répondons sur WhatsApp 7 j/7 avant votre achat.</p>
            <Link href="/contact" className="btn-gold inline-flex rounded-full px-5 py-2.5 text-sm font-semibold">Nous contacter</Link>
          </div>
        </aside>
      </div>
    </article>
  );
}
