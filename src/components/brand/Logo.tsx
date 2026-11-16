import { useId, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { BRAND_GOLD, LOGO, ROSETTE } from "./logo-data";

/**
 * Identité CBDoux, en tracés vectoriels (voir scripts/build-brand.py) :
 * - <Logo />     « CBD » + la rosace à la place du « o » + « ux » en italique ;
 * - <Rosette />  la rosace seule (icônes, repères).
 * Tout est net à n'importe quelle taille et se pose sur n'importe quel fond.
 */

type Weight = keyof typeof ROSETTE.strokes;

function useSvgId(prefix: string): string {
  return prefix + useId().replace(/[^a-zA-Z0-9_-]/g, "");
}

function GoldStops() {
  return (
    <>
      <stop offset="0" stopColor={BRAND_GOLD.dark} />
      <stop offset="0.45" stopColor={BRAND_GOLD.light} />
      <stop offset="1" stopColor={BRAND_GOLD.base} />
    </>
  );
}

/** Les trois éléments de la rosace dans son repère 100 × 100. */
function RosetteShapes({ weight }: { weight: Weight }) {
  const [ring, petal, centre] = ROSETTE.strokes[weight];
  return (
    <>
      <circle cx="50" cy="50" r={ROSETTE.ringRadius} strokeWidth={ring} />
      <path d={ROSETTE.petals} strokeWidth={petal} />
      <circle cx="50" cy="50" r={ROSETTE.centreRadius} strokeWidth={centre} />
    </>
  );
}

export function Rosette({
  className,
  weight = "bold",
  flat = false,
  style,
}: {
  className?: string;
  weight?: Weight;
  /** Trait dans la couleur du texte (currentColor) au lieu du dégradé or */
  flat?: boolean;
  style?: CSSProperties;
}) {
  const id = useSvgId("ro");
  return (
    <svg aria-hidden viewBox="0 0 100 100" className={cn("rosette", className)} style={style}>
      {!flat && (
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <GoldStops />
          </linearGradient>
        </defs>
      )}
      <g fill="none" stroke={flat ? "currentColor" : `url(#${id})`} strokeLinejoin="round">
        <RosetteShapes weight={weight} />
      </g>
    </svg>
  );
}

export function Logo({
  className,
  weight = "bold",
  outline = false,
}: {
  className?: string;
  /** « bold » : traits de rosace renforcés pour les petites tailles (en-tête) ; « fine » pour les grands formats */
  weight?: Weight;
  /** Version filaire (grand filigrane de pied de page) */
  outline?: boolean;
}) {
  const id = useSvgId("lg");
  const { x, y, width, height } = LOGO.box;
  const { cx, cy, diameter } = LOGO.rosette;
  const ring = ROSETTE.strokes[weight][0];
  const k = diameter / (2 * (ROSETTE.ringRadius + ring / 2));
  const tx = cx - 50 * k;
  const ty = cy - 50 * k;
  const paint = `url(#${id})`;
  return (
    <svg
      viewBox={LOGO.viewBox}
      role="img"
      aria-label="CBDoux"
      className={cn("logo", outline && "logo-outline", className)}
    >
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={x} y1={y} x2={x + width} y2={y + height}>
          <GoldStops />
        </linearGradient>
        {/* même dégradé, exprimé dans le repère de la rosace : la lumière reste continue d'une lettre à l'autre */}
        <linearGradient id={`${id}r`} gradientUnits="userSpaceOnUse" x1={(x - tx) / k} y1={(y - ty) / k} x2={(x + width - tx) / k} y2={(y + height - ty) / k}>
          <GoldStops />
        </linearGradient>
      </defs>
      <path className="logo-letters" d={LOGO.cbd} fill={outline ? "none" : paint} stroke={outline ? paint : undefined} />
      <g transform={`translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${k.toFixed(4)})`}>
        <g className="logo-rosette" fill="none" stroke={`url(#${id}r)`} strokeLinejoin="round">
          <RosetteShapes weight={weight} />
        </g>
      </g>
      <path className="logo-letters" d={LOGO.ux} fill={outline ? "none" : paint} stroke={outline ? paint : undefined} />
    </svg>
  );
}
