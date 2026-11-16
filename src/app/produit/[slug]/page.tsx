import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, FlaskConical, Truck, Lock, Leaf, ShieldAlert, Package } from "lucide-react";
import { getProduct, visibleProducts, categories, forceLabels, formatPrice, maxForce } from "@/data/products";
import { guides } from "@/data/guides";
import { coas } from "@/data/coa";
import { AddToCart } from "@/components/product/AddToCart";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductMedia } from "@/components/product/ProductMedia";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ForceBadge } from "@/components/ui/ForceBadge";
import { Faq } from "@/components/ui/Faq";
import { JsonLd } from "@/components/JsonLd";
import { buildMetadata, productJsonLd } from "@/lib/seo";
import { getAvailabilityMap } from "@/lib/stock";
import { categoryFaq } from "@/data/category-faq";

export const dynamicParams = false;

export function generateStaticParams() {
  return visibleProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  const cat = categories[p.category];
  const min = formatPrice(Math.min(...p.variants.map((v) => v.priceCents)));
  const title = `${p.name} — ${cat.name} dès ${min}${p.variants.some((v) => v.format === "1 g") ? "/g" : ""}`;
  return buildMetadata({
    title,
    description: `${p.short} ${p.origin ? `${p.origin}. ` : ""}THC < 0,3 %, analyse labo. Livraison France 24/48 h, port offert dès 60 €.`.slice(0, 160),
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
    <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 py-8 sm:py-12">
      <JsonLd data={productJsonLd(p, { available: anyAvailable })} />
      <Breadcrumbs
        items={[
          { name: "Boutique", path: "/boutique" },
          { name: cat.name, path: `/${cat.slug}` },
          { name: p.name, path: `/produit/${p.slug}` },
        ]}
        className="mb-6"
      />

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-14">
        {/* Média */}
        <div className="lg:col-span-6">
          <ProductMedia product={p} />
          <ul className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-foreground/60">
            <li className="rounded-xl border border-foreground/10 bg-card/40 px-3 py-2.5 flex items-center gap-2"><FlaskConical size={13} className="text-gold" /> THC &lt; 0,3 %</li>
            <li className="rounded-xl border border-foreground/10 bg-card/40 px-3 py-2.5 flex items-center gap-2"><Truck size={13} className="text-gold" /> Expédié sous 24 h</li>
            <li className="rounded-xl border border-foreground/10 bg-card/40 px-3 py-2.5 flex items-center gap-2"><Package size={13} className="text-gold" /> Colis neutre</li>
            <li className="rounded-xl border border-foreground/10 bg-card/40 px-3 py-2.5 flex items-center gap-2"><Lock size={13} className="text-gold" /> Paiement sécurisé</li>
          </ul>
        </div>

        {/* Infos & achat */}
        <div className="lg:col-span-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Link href={`/${cat.slug}`} className="kicker hover:underline">{cat.name}</Link>
            {p.origin && <span className="text-foreground/30">·</span>}
            {p.origin && <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/55">{p.origin}</span>}
            {p.badge && <span className="ml-auto rounded-full border border-gold/40 bg-gold/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-gold">{p.badge}</span>}
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[0.95] mb-4">
            <span className="text-gradient-gold">{p.name}</span>
          </h1>
          <p className="text-base sm:text-lg text-foreground/85 leading-relaxed mb-5">{p.short}</p>
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {Array.from(new Set(p.variants.map((v) => v.force))).map((f) => (
              <ForceBadge key={String(f)} force={f} />
            ))}
          </div>

          <AddToCart product={p} availability={availability} />

          <dl className="mt-8 grid gap-5">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold mb-1.5">Arômes</dt>
              <dd className="text-sm text-foreground/75 leading-relaxed">{p.aromas}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold mb-1.5">Profil</dt>
              <dd className="text-sm text-foreground/75 leading-relaxed">{p.profile}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold mb-1.5">Utilisation</dt>
              <dd className="text-sm text-foreground/75 leading-relaxed">{p.usage}</dd>
            </div>
          </dl>

          {coa && (
            <Link href="/analyses-laboratoires" className="mt-6 flex items-center gap-4 rounded-2xl border border-foreground/10 bg-card/40 p-4 hover:border-gold/40 transition-colors">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold"><FlaskConical size={18} /></span>
              <span className="flex-1 text-sm">
                <span className="block font-medium">Analyse de laboratoire disponible</span>
                <span className="block text-foreground/60 text-xs mt-0.5">
                  {coa.name} · CBD {coa.cbd} · THC {coa.thc} · {coa.lab} ({coa.date})
                </span>
              </span>
              <ArrowRight size={16} className="text-gold" />
            </Link>
          )}
        </div>
      </div>

      {/* Description longue + tableau prix (SEO) */}
      <section className="mt-16 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 prose-cbd">
          <h2>{p.name} : la fiche complète</h2>
          {p.description.map((para) => (
            <p key={para}>{para}</p>
          ))}
          <div className="not-prose mt-6 rounded-2xl border border-red-400/30 bg-red-400/5 p-5 flex gap-3">
            <ShieldAlert size={18} className="text-red-300 shrink-0 mt-0.5" />
            <p className="text-xs text-foreground/70 leading-relaxed">
              Produit réservé aux adultes. Ne pas conduire ni utiliser de machines après usage. Déconseillé aux femmes enceintes ou allaitantes et aux personnes sous traitement sans avis médical. {forceLabels[strongest].label} : {forceLabels[strongest].description} Ce produit n'est pas un médicament. <Link href="/conseils-prudence" className="underline">Conseils & prudence</Link>.
            </p>
          </div>
        </div>
        <aside className="lg:col-span-5">
          <h2 className="font-serif text-2xl mb-4">Formats & tarifs</h2>
          <div className="overflow-hidden rounded-2xl border border-foreground/10">
            <table className="w-full text-sm">
              <thead className="bg-card/60">
                <tr className="text-left font-mono text-[10px] uppercase tracking-[0.15em] text-gold">
                  <th className="px-4 py-3">Force</th>
                  <th className="px-4 py-3">Format</th>
                  <th className="px-4 py-3 text-right">Prix</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/10">
                {p.variants.map((v) => (
                  <tr key={v.sku} className={availability[v.sku] === false ? "opacity-50" : ""}>
                    <td className="px-4 py-3">
                      <span className="block">{v.tierLabel}</span>
                      <span className="block text-[11px] text-foreground/50">{v.cbdInfo}</span>
                    </td>
                    <td className="px-4 py-3">{v.format}{availability[v.sku] === false && <span className="ml-2 text-[10px] text-foreground/50">épuisé</span>}</td>
                    <td className="px-4 py-3 text-right text-gold font-medium whitespace-nowrap">
                      {formatPrice(v.priceCents)}
                      {v.grams > 1 && /g$/.test(v.format) && <span className="block text-[10px] text-foreground/45 font-normal">{formatPrice(Math.round(v.priceCents / v.grams))}/g</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-5 rounded-2xl border border-foreground/10 bg-card/40 p-5 text-sm text-foreground/70 space-y-2">
            <p className="flex items-center gap-2"><Truck size={14} className="text-gold" /> Port Colissimo offert dès 60 € · Chronopost 24 h disponible</p>
            <p className="flex items-center gap-2"><Leaf size={14} className="text-gold" /> Retrait gratuit à Damprichard & Le Russey</p>
            <p className="flex items-center gap-2"><Lock size={14} className="text-gold" /> Commande par WhatsApp, paiement par lien sécurisé CB ou virement</p>
          </div>
        </aside>
      </section>

      {/* FAQ catégorie */}
      <section className="mt-16 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <h2 className="font-serif text-3xl sm:text-4xl">Questions fréquentes<br /><span className="font-serif-italic text-foreground/55">sur nos {cat.name.charAt(0).toLowerCase() + cat.name.slice(1)}.</span></h2>
        </div>
        <div className="lg:col-span-7">
          <Faq items={categoryFaq[p.category]} withJsonLd={false} />
        </div>
      </section>

      {relatedGuides.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-3xl mb-6">Nos guides pour bien choisir</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {relatedGuides.map((g) => (
              <Link key={g.slug} href={`/guides/${g.slug}`} className="lift group rounded-2xl border border-foreground/10 bg-card/50 p-6 hover:border-gold/40 transition-colors">
                <p className="kicker mb-2">{g.category}</p>
                <h3 className="font-serif text-xl leading-tight group-hover:text-gold transition-colors">{g.title}</h3>
                <p className="text-sm text-foreground/60 mt-2 line-clamp-2">{g.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-16">
          <div className="flex items-end justify-between gap-4 mb-6">
            <h2 className="font-serif text-3xl">À découvrir aussi</h2>
            <Link href={`/${cat.slug}`} className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold hover:underline">Toute la catégorie →</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {related.map((r) => (
              <ProductCard key={r.slug} product={r} available={r.variants.some((v) => availability[v.sku] !== false)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
