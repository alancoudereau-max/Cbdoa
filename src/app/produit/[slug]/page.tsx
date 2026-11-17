import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, visibleProducts, categories, forceLabels, formatPrice, maxForce } from "@/data/products";
import { guides } from "@/data/guides";
import { coas } from "@/data/coa";
import { AddToCart } from "@/components/product/AddToCart";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductMedia } from "@/components/product/ProductMedia";
import { Reassurance } from "@/components/product/Reassurance";
import { ShareButton } from "@/components/product/ShareButton";
import { labelImage, photoSize } from "@/lib/etiquettes";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata, productJsonLd, productSeoTitle } from "@/lib/seo";
import { getAvailabilityMap } from "@/lib/stock";
import { commas, fr } from "@/lib/utils";
import { categoryFaq } from "@/data/category-faq";

export const dynamicParams = false;

export function generateStaticParams() {
  return visibleProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return buildMetadata({
    title: productSeoTitle(p),
    description: `${p.short} THC < 0,3 %, analyse labo. Livraison 24/48 h, port offert dès 60 €.`,
    path: `/produit/${p.slug}`,
    image: `/produit/${p.slug}/opengraph-image`,
    type: "product",
    keywords: p.keywords,
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  const cat = categories[p.category];
  const availability = getAvailabilityMap();
  const anyAvailable = p.variants.some((v) => availability[v.sku] !== false);
  const related = visibleProducts.filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, 4);
  const relatedGuides = guides.filter((g) => g.relatedProducts.includes(p.slug)).slice(0, 3);
  const coa = coas.find((c) => c.productSlugs.includes(p.slug));
  const strongest = maxForce(p);

  return (
    <div>
      <JsonLd data={productJsonLd(p, { available: anyAvailable })} />

      <section className="wrap pb-16 pt-7 sm:pt-9 lg:pb-24">
        <Breadcrumbs
          items={[
            { name: "Boutique", path: "/boutique" },
            { name: cat.name, path: `/${cat.slug}` },
            { name: p.name, path: `/produit/${p.slug}` },
          ]}
        />

        <div className="mt-7 grid gap-9 sm:mt-10 lg:grid-cols-12 lg:gap-10">
          {/* Média */}
          <div className="lg:col-span-6">
            <div className="lg:sticky lg:top-28">
              <ProductMedia product={p} src={labelImage(p.image)} natural={photoSize(p.image)} />
              <Reassurance className="mt-5 hidden lg:grid" />
            </div>
          </div>

          {/* Infos & achat */}
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.9375rem] text-foreground/75">
              <Link href={`/${cat.slug}`} className="link">
                {cat.name}
              </Link>
              {p.origin && <span>{commas(p.origin)}</span>}
              {p.badge && <span className="pastille ml-auto">{p.badge}</span>}
            </p>
            <h1 className="mt-4 font-serif text-[clamp(2.3rem,5.6vw,4rem)] font-light leading-[1] tracking-[-0.03em]">{fr(p.name)}</h1>
            <p className="t-lead mt-5">{fr(p.short)}</p>

            <div className="mt-8" data-wa-topic={p.name}>
              <AddToCart product={p} availability={availability} />
            </div>
            {/* Sur téléphone, les engagements viennent après le choix, pas entre la photo et le titre */}
            <Reassurance className="mt-6 lg:hidden" />

            <dl className="mt-9">
              {[
                ["Arômes", p.aromas],
                ["Profil", p.profile],
                ["Utilisation", p.usage],
              ].map(([term, text]) => (
                <div key={term} className="grid gap-x-6 gap-y-1 border-t border-foreground/15 py-4 last:border-b sm:grid-cols-[7.5rem_1fr]">
                  <dt className="font-medium">{term}</dt>
                  <dd className="text-[0.9688rem] leading-relaxed text-foreground/80">{fr(text)}</dd>
                </div>
              ))}
              {(p.category === "fleurs" || p.category === "resines") && (
                <div className="grid gap-x-6 gap-y-1 border-t border-foreground/15 py-4 last:border-b sm:grid-cols-[7.5rem_1fr]">
                  <dt className="font-medium">Conservation</dt>
                  <dd className="text-[0.9688rem] leading-relaxed text-foreground/80">
                    {fr("Dans son sachet hermétique d'origine, refermé après chaque utilisation, à l'abri de la lumière et autour de 20 °C.")}{" "}
                    <Link href="/guides/conserver-fleurs-resines-cbd" className="link">
                      Les bons gestes
                    </Link>
                  </dd>
                </div>
              )}
            </dl>

            {coa && (
              <p className="mt-6 text-[0.9375rem]">
                <Link href="/analyses-laboratoires" className="link font-medium">
                  Voir l'analyse de laboratoire
                </Link>
                <span className="t-fine mt-1.5 block">
                  {fr(`${coa.name}, CBD ${coa.cbd}, THC ${coa.thc}. ${coa.lab}, ${coa.date}.`)}
                </span>
              </p>
            )}
            <ShareButton title={`${p.name}, CBDoux`} text={p.short} className="share-link mt-6" />
          </div>
        </div>
      </section>

      {/* La notice : description longue et tarifs, sur papier */}
      <section className="wrap">
        <div className="panel sheet grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="prose-cbd lg:col-span-7">
            <h2>{fr(`${p.name} : la fiche complète`)}</h2>
            {p.description.map((para) => (
              <p key={para}>{fr(para)}</p>
            ))}
            <p className="mt-7 flex items-start gap-3 rounded-[3px] bg-danger-soft px-4 py-3.5 text-[0.875rem] leading-relaxed text-foreground">
              <span>
                Produit réservé aux adultes. Ne pas conduire ni utiliser de machines après usage. Déconseillé aux femmes enceintes ou allaitantes et aux personnes sous traitement sans avis médical. {forceLabels[strongest].label} : {fr(forceLabels[strongest].description.replace(/^./, (c) => c.toLowerCase()))} Ce produit n'est pas un médicament. <Link href="/conseils-prudence">Conseils et prudence</Link>.
              </span>
            </p>
          </div>
          <aside className="lg:col-span-5">
            <h2 className="t-h3">Formats et tarifs</h2>
            <table className="mt-5 w-full text-[0.9375rem]">
              <thead>
                <tr className="border-b border-foreground/50 text-left text-[0.875rem]">
                  <th className="py-2.5 pr-2 font-semibold sm:pr-3">Force</th>
                  <th className="py-2.5 pr-2 font-semibold sm:pr-3">Format</th>
                  <th className="py-2.5 text-right font-semibold">Prix</th>
                </tr>
              </thead>
              <tbody>
                {p.variants.map((v) => (
                  <tr key={v.sku} className={`border-b border-foreground/20 align-top ${availability[v.sku] === false ? "opacity-50" : ""}`}>
                    <td className="py-3 pr-2 sm:pr-3">
                      <span className="block">{fr(v.tierLabel)}</span>
                      <span className="block text-[0.8125rem] text-foreground/65">{fr(v.cbdInfo)}</span>
                    </td>
                    <td className="py-3 pr-2 sm:pr-3">
                      {fr(v.format)}
                      {availability[v.sku] === false && <span className="block text-[0.8125rem] text-foreground/65">épuisé</span>}
                    </td>
                    <td className="whitespace-nowrap py-3 text-right font-medium">
                      {formatPrice(v.priceCents)}
                      {v.grams > 1 && /g$/.test(v.format) && (
                        <span className="block text-[0.8125rem] font-normal text-foreground/65">
                          {formatPrice(Math.round(v.priceCents / v.grams))}
                          {/* sur un très petit écran, l'unité s'abrège pour que le tableau tienne dans son cadre */}
                          <span className="max-[359px]:hidden"> le gramme</span>
                          <span className="hidden max-[359px]:inline">/g</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ul className="mt-6 space-y-2 text-[0.9375rem] text-foreground/85">
              <li>Port Colissimo offert dès 60 €, Chronopost 24 h disponible.</li>
              <li>Retrait gratuit à Damprichard et au Russey.</li>
              <li>Commande par WhatsApp, paiement par lien sécurisé (carte) ou virement.</li>
            </ul>
          </aside>
        </div>
      </section>

      {/* FAQ catégorie */}
      <section className="wrap section grid gap-10 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <h2 className="t-h2">Questions fréquentes sur nos {cat.name.charAt(0).toLowerCase() + cat.name.slice(1)}</h2>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <Faq items={categoryFaq[p.category]} withJsonLd={false} />
        </div>
      </section>

      {relatedGuides.length > 0 && (
        <section className="wrap section border-t border-foreground/15 grid gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <h2 className="t-h2">Nos guides pour bien choisir</h2>
          </div>
          <ul className="lg:col-span-7 lg:col-start-6">
            {relatedGuides.map((g) => (
              <li key={g.slug} className="border-t border-foreground/15 last:border-b">
                <Link href={`/guides/${g.slug}`} className="group block py-5">
                  <p className="t-fine">{g.category}</p>
                  <h3 className="softens t-title mt-1.5">{fr(g.title)}</h3>
                  <p className="mt-2 text-[0.9375rem] text-foreground/75 line-clamp-2">{fr(g.description)}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <section className="wrap section border-t border-foreground/15">
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
            <h2 className="t-h2">À découvrir aussi</h2>
            <Link href={`/${cat.slug}`} className="link">
              Toute la catégorie
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {related.map((r) => (
              <ProductCard key={r.slug} product={r} available={r.variants.some((v) => availability[v.sku] !== false)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
