import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";
import { allVisibleProducts, categories, categoryOrder } from "@/data/products";
import { guides } from "@/data/guides";
import { cities } from "@/data/cities";
import { legalDocs } from "@/data/legal";
import { collections } from "@/data/collections";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (p: string) => `${SITE_URL}${p}`;

  const statics: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: url("/boutique"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: url("/nouveautes"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: url("/sur-commande"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: url("/livraison"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: url("/distributeurs"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/analyses-laboratoires"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: url("/conseils-prudence"), lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: url("/a-propos"), lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: url("/faq"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: url("/contact"), lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: url("/guides"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: url("/cbd"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const cats: MetadataRoute.Sitemap = categoryOrder.map((c) => ({ url: url(`/${categories[c].slug}`), lastModified: now, changeFrequency: "weekly", priority: 0.9 }));
  const products: MetadataRoute.Sitemap = allVisibleProducts.map((p) => ({ url: url(`/produit/${p.slug}`), lastModified: now, changeFrequency: "weekly", priority: p.onOrder ? 0.6 : 0.8, images: [url(p.image)] }));
  const guidesList: MetadataRoute.Sitemap = guides.map((g) => ({ url: url(`/guides/${g.slug}`), lastModified: new Date(g.publishedAt), changeFrequency: "monthly", priority: 0.6 }));
  const cityList: MetadataRoute.Sitemap = cities.map((c) => ({ url: url(`/cbd/${c.slug}`), lastModified: now, changeFrequency: "monthly", priority: 0.6 }));
  const legal: MetadataRoute.Sitemap = legalDocs.map((d) => ({ url: url(`/${d.slug}`), lastModified: new Date(d.updatedAt), changeFrequency: "yearly", priority: 0.2 }));

  const selections: MetadataRoute.Sitemap = collections.map((c) => ({ url: url(`/${c.slug}`), lastModified: now, changeFrequency: "weekly", priority: 0.8 }));

  return [...statics, ...cats, ...selections, ...products, ...guidesList, ...cityList, ...legal];
}
