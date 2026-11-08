import { ImageResponse } from "next/og";
import { promises as fs } from "fs";
import path from "path";

export const alt = "CBDoux — CBD premium du Haut-Doubs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgDefault() {
  let logo: string | null = null;
  try {
    const buf = await fs.readFile(path.join(process.cwd(), "public", "images", "brand", "logo.png"));
    logo = `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    logo = null;
  }
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#0d0c0a 0%,#1a170f 55%,#0d0c0a 100%)", color: "#f4efe3", fontFamily: "sans-serif", position: "relative" }}>
        <div style={{ position: "absolute", left: -100, top: -140, width: 520, height: 520, borderRadius: 9999, background: "radial-gradient(circle, rgba(201,168,76,0.35), transparent 70%)", display: "flex" }} />
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt="" width={520} height={104} style={{ objectFit: "contain" }} />
        ) : (
          <div style={{ fontSize: 96, color: "#d9b85c", display: "flex" }}>CBDoux</div>
        )}
        <div style={{ marginTop: 36, fontSize: 40, display: "flex", color: "rgba(244,239,227,0.9)" }}>CBD premium du Haut-Doubs</div>
        <div style={{ marginTop: 18, fontSize: 24, display: "flex", color: "rgba(244,239,227,0.6)", letterSpacing: 4, textTransform: "uppercase" }}>Fleurs · Résines · Huiles · Vape</div>
        <div style={{ marginTop: 48, display: "flex", gap: 18 }}>
          {["Livraison France 24/48 h", "THC < 0,3 %", "Port offert dès 60 €"].map((t) => (
            <div key={t} style={{ display: "flex", border: "1px solid rgba(201,168,76,0.5)", borderRadius: 999, padding: "10px 22px", fontSize: 20, color: "#d9b85c" }}>{t}</div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
