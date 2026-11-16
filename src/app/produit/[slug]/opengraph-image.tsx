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

/** Satori ne charge que la police par défaut : on remplace les caractères hors Latin-1 (→, µ…) */
function ogSafe(text: string): string {
  return text
    .replace(/→/g, "-")
    .replace(/œ/g, "oe")
    .replace(/Œ/g, "Oe")
    .replace(/\s[—–]\s/g, " · ")
    .replace(/µ|μ/g, "u")
    .replace(/[^\u0000-\u00FF€’‘“”…]/g, "");
}

async function readPublicImage(rel: string): Promise<string | null> {
  try {
    const file = path.join(process.cwd(), "public", rel);
    const buf = await fs.readFile(file);
    const ext = path.extname(file).slice(1).toLowerCase();
    const mime = ext === "jpg" ? "jpeg" : ext;
    return `data:image/${mime};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return new ImageResponse(<div style={{ width: "100%", height: "100%", background: "#0d0c0a" }} />, size);
  const img = await readPublicImage(p.image);
  const logo = await readPublicImage("/images/brand/cbdoux-logo.png");
  const min = formatPrice(Math.min(...p.variants.map((v) => v.priceCents)));
  const perGram = p.variants.some((v) => v.format === "1 g");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #0d0c0a 0%, #17150f 60%, #0d0c0a 100%)",
          color: "#f4efe3",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", right: -120, top: -120, width: 520, height: 520, borderRadius: 9999, background: "radial-gradient(circle, rgba(201,168,76,0.35), transparent 70%)", display: "flex" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, width: 700 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} alt="" width={244} height={51} style={{ objectFit: "contain" }} />
            ) : (
              <div style={{ fontSize: 40, color: "#d9b85c", display: "flex" }}>CBDoux</div>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 20, letterSpacing: 6, textTransform: "uppercase", color: "#d9b85c", display: "flex" }}>{ogSafe(`${categories[p.category].name}${p.origin ? ` · ${p.origin}` : ""}`)}</div>
            <div style={{ fontSize: 64, lineHeight: 1.02, marginTop: 14, display: "flex", fontWeight: 700 }}>{ogSafe(p.name)}</div>
            <div style={{ fontSize: 26, color: "rgba(244,239,227,0.75)", marginTop: 20, display: "flex", lineHeight: 1.3 }}>{ogSafe(p.short.slice(0, 110))}{p.short.length > 110 ? "…" : ""}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ display: "flex", background: "linear-gradient(135deg,#9c7a2e,#f0d78c,#d9b85c)", color: "#0d0c0a", padding: "14px 26px", borderRadius: 999, fontSize: 28, fontWeight: 700 }}>
              dès {min}{perGram ? "/g" : ""}
            </div>
            <div style={{ fontSize: 20, color: "rgba(244,239,227,0.6)", display: "flex" }}>THC &lt; 0,3 % · Livraison France 24/48 h</div>
          </div>
        </div>
        <div style={{ display: "flex", flex: 1, padding: "40px 48px 40px 0", alignItems: "center", justifyContent: "center" }}>
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img} alt="" width={440} height={550} style={{ objectFit: "cover", borderRadius: 36, border: "2px solid rgba(201,168,76,0.4)" }} />
          ) : (
            <div style={{ width: 440, height: 550, borderRadius: 36, border: "2px solid rgba(201,168,76,0.4)", display: "flex" }} />
          )}
        </div>
      </div>
    ),
    size,
  );
}
