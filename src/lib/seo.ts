import type { Metadata } from "next";
import { site, company, locations, SITE_URL } from "@/data/site";
import { categories, type Product, minPriceCents, maxPriceCents } from "@/data/products";
import { absoluteUrl } from "@/lib/utils";

/** Construit un objet Metadata complet (title, description, canonical, OpenGraph, Twitter). */
export function buildMetadata(opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article" | "product";
  noIndex?: boolean;
  keywords?: string[];
  publishedTime?: string;
  modifiedTime?: string;
}): Metadata {
  const url = absoluteUrl(opts.path);
  const image = absoluteUrl(opts.image ?? site.ogImage);
  return {
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords,
    alternates: { canonical: url, languages: { "fr-FR": url } },
    robots: opts.noIndex ? { index: false, follow: false } : { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: site.name,
      locale: site.locale,
      type: opts.type === "product" ? "website" : (opts.type ?? "website"),
      images: [{ url: image, width: 1200, height: 630, alt: opts.title }],
      ...(opts.type === "article" && opts.publishedTime
        ? { publishedTime: opts.publishedTime, modifiedTime: opts.modifiedTime ?? opts.publishedTime, authors: [site.name] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: [image],
    },
  };
}

// ───────────────────────────── JSON-LD ─────────────────────────────

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: site.name,
    legalName: company.legalName,
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: absoluteUrl(site.logo) },
    image: absoluteUrl(site.ogImage),
    description: site.shortDescription,
    email: site.email,
    telephone: site.phoneE164,
    foundingDate: String(site.foundingYear),
    vatID: company.vat,
    address: {
      "@type": "PostalAddress",
      streetAddress: company.address.street,
      postalCode: company.address.postalCode,
      addressLocality: company.address.city,
      addressCountry: "FR",
    },
    areaServed: { "@type": "Country", name: "France" },
    sameAs: [site.facebook, site.googleMaps].filter(Boolean),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: site.phoneE164,
        email: site.email,
        availableLanguage: ["French"],
        areaServed: "FR",
      },
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: site.name,
    description: site.shortDescription,
    inLanguage: "fr-FR",
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/boutique?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

/** Boutique en ligne + points de vente physiques (distributeurs) */
export function storeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    "@id": `${SITE_URL}/#store`,
    name: site.name,
    url: SITE_URL,
    image: absoluteUrl(site.ogImage),
    logo: absoluteUrl(site.logo),
    telephone: site.phoneE164,
    email: site.email,
    priceRange: "€€",
    currenciesAccepted: "EUR",
    paymentAccepted: "Carte bancaire, Apple Pay, Google Pay, Virement",
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
    areaServed: { "@type": "Country", name: "France" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Catalogue CBDoux",
      itemListElement: Object.values(categories).map((c) => ({
        "@type": "OfferCatalog",
        name: c.name,
        url: absoluteUrl(`/${c.slug}`),
      })),
    },
    department: locations.vendingMachines.map((m) => vendingMachineJsonLd(m, false)),
  };
}

export function vendingMachineJsonLd(m: (typeof locations.vendingMachines)[number], withContext = true) {
  return {
    ...(withContext ? { "@context": "https://schema.org" } : {}),
    "@type": "Store",
    "@id": `${SITE_URL}/distributeurs#${m.id}`,
    name: `Distributeur CBDoux 24/7 — ${m.city}`,
    description: `${m.place}. ${m.details}`,
    image: absoluteUrl(m.image),
    url: absoluteUrl("/distributeurs"),
    telephone: site.phoneE164,
    priceRange: "€€",
    paymentAccepted: m.payment,
    address: {
      "@type": "PostalAddress",
      streetAddress: m.place,
      postalCode: m.postalCode,
      addressLocality: m.city,
      addressRegion: "Doubs",
      addressCountry: "FR",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    ...(m.mapsUrl ? { hasMap: m.mapsUrl } : {}),
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function productJsonLd(p: Product, opts: { available: boolean }) {
  const cat = categories[p.category];
  const low = minPriceCents(p) / 100;
  const high = maxPriceCents(p) / 100;
  const url = absoluteUrl(`/produit/${p.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: p.name,
    description: p.short + " " + p.description[0],
    image: [absoluteUrl(p.image)],
    url,
    sku: p.variants[0]?.sku,
    brand: { "@type": "Brand", name: site.name },
    category: cat.name,
    additionalProperty: [
      { "@type": "PropertyValue", name: "THC", value: "< 0,3 %" },
      ...(p.origin ? [{ "@type": "PropertyValue", name: "Origine / culture", value: p.origin }] : []),
      { "@type": "PropertyValue", name: "Arômes", value: p.aromas },
    ],
    audience: { "@type": "PeopleAudience", suggestedMinAge: 18 },
    offers: {
      "@type": "AggregateOffer",
      url,
      priceCurrency: "EUR",
      lowPrice: low.toFixed(2),
      highPrice: high.toFixed(2),
      offerCount: p.variants.length,
      availability: opts.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": `${SITE_URL}/#organization` },
      eligibleRegion: { "@type": "Country", name: "FR" },
      offers: p.variants.map((v) => ({
        "@type": "Offer",
        sku: v.sku,
        name: `${p.name} — ${v.tierLabel} · ${v.format}`,
        price: (v.priceCents / 100).toFixed(2),
        priceCurrency: "EUR",
        availability: opts.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        url,
        shippingDetails: {
          "@type": "OfferShippingDetails",
          shippingDestination: { "@type": "DefinedRegion", addressCountry: "FR" },
          shippingRate: { "@type": "MonetaryAmount", value: "5.90", currency: "EUR" },
          deliveryTime: {
            "@type": "ShippingDeliveryTime",
            handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
            transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 3, unitCode: "DAY" },
          },
        },
      })),
    },
  };
}

export function faqJsonLd(items: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

export function articleJsonLd(a: { title: string; description: string; path: string; image?: string; publishedAt: string; updatedAt?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    image: [absoluteUrl(a.image ?? site.ogImage)],
    datePublished: a.publishedAt,
    dateModified: a.updatedAt ?? a.publishedAt,
    author: { "@type": "Organization", name: site.name, url: SITE_URL },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: absoluteUrl(a.path),
    inLanguage: "fr-FR",
  };
}

export function itemListJsonLd(name: string, items: Array<{ name: string; path: string; image?: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: absoluteUrl(it.path),
      ...(it.image ? { image: absoluteUrl(it.image) } : {}),
    })),
  };
}
