import type { NextConfig } from "next";

/**
 * Adresse publique du site, résolue AU MOMENT DU BUILD (URLs canoniques, sitemap, Open Graph, JSON-LD).
 * Ordre de priorité :
 *  1. NEXT_PUBLIC_SITE_URL si vous la définissez vous-même ;
 *  2. URL — fournie automatiquement par Netlify : le domaine principal du site
 *     (votre domaine personnalisé dès qu'il est branché, sinon xxx.netlify.app) ;
 *  3. VERCEL_PROJECT_PRODUCTION_URL — fournie automatiquement par Vercel ;
 *  4. http://localhost:3000 en développement.
 * → Sur Netlify il n'y a donc rien à configurer : après avoir branché ou changé le domaine,
 *   relancez simplement un déploiement pour que toutes les adresses soient à jour.
 */
const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
  "http://localhost:3000"
).replace(/\/$/, "");

if (process.env.NODE_ENV === "production" && siteUrl.includes("localhost") && (process.env.CI || process.env.NETLIFY || process.env.VERCEL)) {
  console.warn("\n⚠️  Adresse du site introuvable : définissez NEXT_PUBLIC_SITE_URL (ex. https://www.votre-domaine.fr), sinon les URLs canoniques pointeront vers localhost.\n");
}

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // HSTS limité au site lui-même : pas de « includeSubDomains », le domaine sert aussi à d'autres usages (emails, webmail…)
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  env: { NEXT_PUBLIC_SITE_URL: siteUrl },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1536],
    imageSizes: [64, 96, 128, 256, 384, 512],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      // Anciennes URLs du site Lovable → nouvelles URLs (301, conserve le référencement acquis)
      { source: "/en-stock", destination: "/boutique", permanent: true },
      { source: "/livraison-retrait", destination: "/livraison", permanent: true },
      { source: "/produit/recharge", destination: "/produit/recharge-pods", permanent: true },
      { source: "/produit/pods-delta-9-rechargeable", destination: "/produit/pods-cbd-rechargeables", permanent: true },
      // Guide renommé le 16/11/2026 (plus de présentation « infusion »)
      { source: "/guides/vaporiser-ou-infuser-cbd", destination: "/guides/vaporiser-cbd-guide-pratique", permanent: true },
    ];
  },
};

export default nextConfig;
