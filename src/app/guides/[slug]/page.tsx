import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { guides, getGuide } from "@/data/guides";
import { getProduct } from "@/data/products";
import { Blocks } from "@/components/content/Blocks";
import { PageHero } from "@/components/ui/PageHero";
import { Faq } from "@/components/ui/Faq";
import { ProductCard } from "@/components/product/ProductCard";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata, articleJsonLd } from "@/lib/seo";
import { formatDateFR, fr } from "@/lib/utils";
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
    <article>
      <JsonLd data={articleJsonLd({ title: g.title, description: g.description, path: `/guides/${g.slug}`, publishedAt: g.publishedAt })} />

      <PageHero
        crumbs={[
          { name: "Guides", path: "/guides" },
          { name: g.title, path: `/guides/${g.slug}` },
        ]}
        title={fr(g.title)}
        titleClassName="max-w-[20ch] text-[clamp(2.3rem,5.4vw,4.4rem)]"
        lead={fr(g.intro)}
      >
        <p className="t-fine">
          {g.category}. Publié le {formatDateFR(g.publishedAt)}, {g.readingMinutes} min de lecture, par l'équipe CBDoux.
        </p>
      </PageHero>

      <div className="wrap grid gap-12 pb-24 lg:grid-cols-12 lg:gap-10">
        <div className="panel sheet min-w-0 lg:col-span-8">
          <nav aria-label="Sommaire" className="mb-10 border-b border-foreground/25 pb-8">
            <p className="font-medium">Sommaire</p>
            <ol className="mt-3 space-y-1.5 text-[0.9688rem]">
              {g.sections.map((s, i) => (
                <li key={s.heading} className="grid grid-cols-[1.6rem_1fr]">
                  <span className="t-num text-foreground/60">{i + 1}</span>
                  <a href={`#s${i + 1}`} className="link">
                    {fr(s.heading)}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="prose-cbd">
            {g.sections.map((s, i) => (
              <section key={s.heading} id={`s${i + 1}`} className="scroll-mt-28">
                <h2>{fr(s.heading)}</h2>
                <Blocks blocks={s.blocks} />
              </section>
            ))}
          </div>

          <p className="t-fine mt-10 border-t border-foreground/25 pt-6">
            Informations à caractère général, non médicales. Produits réservés aux adultes, THC &lt; 0,3 %. Ne pas conduire après usage. En cas de traitement médical, demandez l'avis d'un professionnel de santé.
          </p>

          <section className="mt-12">
            <h2 className="t-h3">Questions fréquentes</h2>
            <Faq items={g.faq} className="mt-5" />
          </section>
        </div>

        <aside className="space-y-12 lg:col-span-4">
          {products.length > 0 && (
            <div>
              <h2 className="t-title">Produits liés</h2>
              <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-1 lg:gap-5">
                {products.map((pr) => (
                  <ProductCard key={pr.slug} product={pr} available={pr.variants.some((v) => availability[v.sku] !== false)} />
                ))}
              </div>
            </div>
          )}
          {related.length > 0 && (
            <div>
              <h2 className="t-title">À lire aussi</h2>
              <ul className="mt-4">
                {related.map((r) => (
                  <li key={r.slug} className="border-t border-foreground/15 last:border-b">
                    <Link href={`/guides/${r.slug}`} className="group block py-4">
                      <span className="softens block font-serif text-[1.1875rem] leading-snug">{fr(r.title)}</span>
                      <span className="t-fine mt-1 block">{r.readingMinutes} min de lecture</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="border-t border-foreground/15 pt-6">
            <p className="t-title">Un doute ? Demandez conseil.</p>
            <p className="mt-2 text-[0.9375rem] text-foreground/75">Nous répondons sur WhatsApp 7 jours sur 7, avant votre achat.</p>
            <Link href="/contact" className="btn btn-primary btn-sm mt-5">
              Nous contacter
            </Link>
          </div>
        </aside>
      </div>
    </article>
  );
}
