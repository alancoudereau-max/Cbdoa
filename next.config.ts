import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
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
    ];
  },
};

export default nextConfig;
