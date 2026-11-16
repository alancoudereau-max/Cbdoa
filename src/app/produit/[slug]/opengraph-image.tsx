import { ImageResponse } from "next/og";
import { promises as fs } from "fs";
import path from "path";
import { getProduct, visibleProducts, categories, formatPrice } from "@/data/products";

export const alt = "CBDoux — fiche produit";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamicParams = false;

export function generateStaticParams() {
  return visibleProducts.map((p) => ({ slug: p.slug }));
}

const SAPIN = "#12372a";
const PAPIER = "#f2ead6";
const OR = "#d7b565";

/** Les polices fournies ne couvrent que le latin : on remplace les caractères qui en sortent (→, µ…). */
function ogSafe(text: string): string {
  return text
    .replace(/→/g, "-")
    .replace(/\s·\s/g, ", ")
    .replace(/\s[—–]\s/g, ", ")
    .replace(/µ|μ/g, "u")
    .replace(/[^\u0000-ÿœŒ€’‘“”…]/g, "");
}

async function readFile(rel: string): Promise<Buffer | null> {
  try {
    return await fs.readFile(path.join(process.cwd(), rel));
  } catch {
    return null;
  }
}

async function readPublicImage(rel: string): Promise<string | null> {
  const buf = await readFile(path.join("public", rel));
  if (!buf) return null;
  const ext = path.extname(rel).slice(1).toLowerCase();
  return `data:image/${ext === "jpg" ? "jpeg" : ext};base64,${buf.toString("base64")}`;
}

/** Image de partage d'une fiche produit : le nom en Fraunces, le prix d'appel, la photo dans le verre du cadran. */
export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return new ImageResponse(<div style={{ width: "100%", height: "100%", background: SAPIN }} />, size);
  const [img, logo, fraunces, hanken, hankenBold] = await Promise.all([
    readPublicImage(p.image),
    readPublicImage("/images/brand/cbdoux-logo.png"),
    readFile("src/fonts/og/fraunces-300.ttf"),
    readFile("src/fonts/og/hanken-400.ttf"),
    readFile("src/fonts/og/hanken-600.ttf"),
  ]);
  const min = formatPrice(Math.min(...p.variants.map((v) => v.priceCents)));
  const perGram = p.variants.some((v) => v.format === "1 g");
  const name = ogSafe(p.name);
  const fonts = [
    ...(fraunces ? [{ name: "Fraunces", data: fraunces, weight: 300 as const, style: "normal" as const }] : []),
    ...(hanken ? [{ name: "Hanken", data: hanken, weight: 400 as const, style: "normal" as const }] : []),
    ...(hankenBold ? [{ name: "Hanken", data: hankenBold, weight: 600 as const, style: "normal" as const }] : []),
  ];

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "radial-gradient(circle at 78% 50%, #241f15 0%, #0c0b09 58%)", color: PAPIER, fontFamily: "Hanken, sans-serif", position: "relative" }}>
        {/* le double filet doré de l'enseigne, en haut et en bas */}
        {[34, 592].map((top) => (
          <div key={top} style={{ position: "absolute", left: 0, right: 0, top, height: 4, borderTop: "1px solid rgba(215,181,101,0.85)", borderBottom: "1px solid rgba(215,181,101,0.4)", display: "flex" }} />
        ))}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "92px 0 78px 78px", width: 690 }}>
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt="" width={316} height={66} style={{ objectFit: "contain" }} />
          ) : (
            <div style={{ fontSize: 44, color: OR, display: "flex" }}>CBDoux</div>
          )}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 24, color: "rgba(242,234,214,0.78)", display: "flex" }}>{ogSafe(`${categories[p.category].name}${p.origin ? `, ${p.origin}` : ""}`)}</div>
            <div style={{ fontFamily: "Fraunces, serif", fontWeight: 300, fontSize: name.length > 26 ? 66 : 80, lineHeight: 0.98, letterSpacing: -2.4, marginTop: 14, display: "flex" }}>{name}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
            <div style={{ display: "flex", background: PAPIER, color: SAPIN, padding: "12px 28px", borderRadius: 999, fontSize: 30, fontWeight: 600, whiteSpace: "nowrap" }}>{`dès ${min}${perGram ? " le gramme" : ""}`}</div>
            <div style={{ fontSize: 22, color: "rgba(242,234,214,0.78)", display: "flex", whiteSpace: "nowrap" }}>THC &lt; 0,3 %, livré en 24/48 h</div>
          </div>
        </div>
        <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", paddingRight: 30 }}>
          <div style={{ display: "flex", width: 404, height: 404, borderRadius: 999, border: `1px solid rgba(215,181,101,0.6)`, alignItems: "center", justifyContent: "center" }}>
            <div style={{ display: "flex", width: 384, height: 384, borderRadius: 999, border: `2px solid ${OR}`, overflow: "hidden", background: "#e9dfc6" }}>
              {img && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img} alt="" width={380} height={380} style={{ objectFit: "cover" }} />
              )}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
