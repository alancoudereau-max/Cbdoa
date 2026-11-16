import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { site, SITE_URL } from "@/data/site";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { AgeGate } from "@/components/AgeGate";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { JsonLd } from "@/components/JsonLd";
import { MotionRoot } from "@/components/motion/MotionRoot";
import { organizationJsonLd, websiteJsonLd, storeJsonLd } from "@/lib/seo";

const inter = localFont({
  src: [
    { path: "../fonts/inter-latin-wght-normal.woff2", style: "normal" },
    { path: "../fonts/inter-latin-ext-wght-normal.woff2", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});

const instrument = localFont({
  src: [
    { path: "../fonts/instrument-serif-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/instrument-serif-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/instrument-serif-latin-ext-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/instrument-serif-latin-ext-400-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-instrument",
  display: "swap",
});

const jetbrains = localFont({
  src: [{ path: "../fonts/jetbrains-mono-latin-wght-normal.woff2", style: "normal" }],
  variable: "--font-jetbrains",
  display: "swap",
  weight: "100 800",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CBDoux — CBD premium du Haut-Doubs, livraison France 24/48 h",
    template: "%s | CBDoux",
  },
  description: site.shortDescription,
  applicationName: site.name,
  authors: [{ name: site.name, url: SITE_URL }],
  creator: site.name,
  publisher: "SMART VEND",
  category: "shopping",
  formatDetection: { telephone: true, email: true, address: true },
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    url: SITE_URL,
    title: "CBDoux — CBD premium du Haut-Doubs",
    description: site.shortDescription,
    images: [{ url: site.ogImage, width: 1200, height: 630, alt: "CBDoux — CBD premium" }],
  },
  twitter: { card: "summary_large_image", title: "CBDoux — CBD premium du Haut-Doubs", description: site.shortDescription, images: [site.ogImage] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  // Codes de validation des outils pour webmasters (variables d'environnement Netlify, voir DEPLOIEMENT.md)
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } : {}),
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } } : {}),
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.webmanifest",
  other: { "theme-color": "#0d0c0a" },
};

export const viewport: Viewport = {
  themeColor: "#0d0c0a",
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} ${instrument.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <JsonLd data={[organizationJsonLd(), websiteJsonLd(), storeJsonLd()]} />
        <MotionRoot />
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-background"
        >
          Aller au contenu
        </a>
        <SiteHeader />
        <main id="contenu" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <CartDrawer />
        <AgeGate />
        <WhatsAppFab />
      </body>
    </html>
  );
}
