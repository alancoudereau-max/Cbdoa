import { useId, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { BRAND_GOLD, LOGO, ROSETTE } from "./logo-data";

/**
 * Identité CBDoux, en tracés vectoriels (voir scripts/build-brand.py) :
 * - <Logo />     « CBD » + la rosace à la place du « o » + « ux » en italique ;
 * - <Rosette />  la rosace seule (puces, filigranes, icônes) ;
 * - <Ornament /> filet doré centré sur une rosace ;
 * - <HexOrnament /> frise d'alvéoles inspirée des visuels de la marque.
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

/** Filet doré centré sur une petite rosace : sépare ou couronne un bloc. */
export function Ornament({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("ornament flex items-center justify-center gap-3", className)}>
      <span className="h-px w-14 sm:w-24 bg-gradient-to-r from-transparent to-gold/70" />
      <span className="h-1.5 w-1.5 rotate-45 bg-gold/80" />
      <Rosette className="h-5 w-5 rosette-spin" />
      <span className="h-1.5 w-1.5 rotate-45 bg-gold/80" />
      <span className="h-px w-14 sm:w-24 bg-gradient-to-l from-transparent to-gold/70" />
    </span>
  );
}

/** Frise d'alvéoles (clin d'œil aux visuels de la marque). Couleur = couleur du texte. */
export function HexOrnament({ className, flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 280 62" className={cn("hex-ornament", className)} style={flip ? { transform: "scaleY(-1)" } : undefined}>
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round">
        <path d="M115.8 26L127.9 33L127.9 47L115.8 54L103.6 47L103.6 33ZM140 26L152.1 33L152.1 47L140 54L127.9 47L127.9 33ZM164.2 26L176.4 33L176.4 47L164.2 54L152.1 47L152.1 33Z" />
        <path d="M107.9 34.5L114.9 30.4M124.5 36L124.5 44M114.9 49.6L107.9 45.5M165.1 30.4L172.1 34.5M172.1 45.5L165.1 49.6M155.5 44L155.5 36" opacity="0.7" />
        <path d="M103.6 47L91.5 54H40M176.4 47L188.5 54H240M140 26V12.5" />
        <circle cx="140" cy="8.5" r="4" />
      </g>
      <g fill="currentColor">
        <circle cx="127.9" cy="33" r="2.3" />
        <circle cx="127.9" cy="47" r="2.3" />
        <circle cx="152.1" cy="33" r="2.3" />
        <circle cx="152.1" cy="47" r="2.3" />
        <circle cx="140" cy="26" r="2.3" />
        <circle cx="91.5" cy="54" r="2.3" />
        <circle cx="188.5" cy="54" r="2.3" />
        <path d="M34 54l4 -4l4 4l-4 4zM238 54l4 -4l4 4l-4 4z" />
      </g>
    </svg>
  );
}
