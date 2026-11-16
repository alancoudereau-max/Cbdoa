"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { AutoVideo } from "@/components/motion/AutoVideo";
import { useParisTime, formatClock } from "@/components/motion/ParisTime";

const C = 300; // centre du cadran (repère 600 × 600)
const R_OUT = 274; // bord extérieur de la couronne des heures
const R_IN = 204; // bord intérieur
const polar = (r: number, deg: number): [number, number] => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [C + r * Math.cos(a), C + r * Math.sin(a)];
};
const f = (n: number) => n.toFixed(1);

/** Graduations : une par demi-heure, plus longues aux heures (sauf sous les quatre chiffres). */
const ticks = Array.from({ length: 48 }, (_, i) => {
  const hour = i % 2 === 0;
  const h = i / 2;
  if (hour && h % 6 === 0) return null;
  const [x1, y1] = polar(R_OUT, i * 7.5);
  const [x2, y2] = polar(hour ? R_OUT - (h % 2 === 0 ? 20 : 13) : R_OUT - 7, i * 7.5);
  return { key: i, d: `M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}`, hour };
}).filter((t): t is { key: number; d: string; hour: boolean } => t !== null);

const numerals = [
  { label: "24", deg: 0 },
  { label: "6", deg: 90 },
  { label: "12", deg: 180 },
  { label: "18", deg: 270 },
];

/**
 * Le cadran de l'accueil : une vidéo du produit au centre, une couronne de 24 heures autour
 * (moitié haute sombre : la nuit ; moitié basse claire : le jour) et un index doré qui indique
 * l'heure qu'il est réellement dans le Haut-Doubs. Nos distributeurs sont ouverts sur tout le tour.
 */
export function HeroDial({ poster, video, alt, position }: { poster: string; video?: string; alt: string; /** cadrage de la photo dans le verre (object-position) */ position?: string }) {
  const now = useParisTime();
  const angle = now ? (now.h + now.m / 60) * 15 : 0;

  return (
    <figure className="relative mx-auto w-full max-w-[34rem]">
      <div className="relative aspect-square">
        {/* Guilloché : deux gravures « grain d'orge » qui tournent très lentement en sens inverse.
            Comme sur un cadran de montre, la gravure s'interrompt sous l'inscription (le cartouche, fixe) ;
            sur petit écran, elle s'efface aussi vers l'extérieur pour ne jamais passer sous le texte courant. */}
        <div aria-hidden className="dial-engraving absolute left-1/2 top-1/2 aspect-square w-[212%] -translate-x-1/2 -translate-y-1/2">
          <div className="dial-cartouche absolute inset-0">
            <div className="guilloche guilloche-orge spin-slow opacity-[0.34] left-[2.83%] top-[2.83%] w-[94.34%] will-change-transform" />
            <div className="guilloche guilloche-orge spin-slow-back opacity-[0.16] left-0 top-0 w-full will-change-transform" />
          </div>
        </div>

        <div className="seq-dial absolute inset-0">
          {/* La vidéo, dans le verre du cadran */}
          <div className="loop absolute inset-[18%] rounded-full">
            <Image src={poster} alt={alt} fill priority fetchPriority="high" sizes="(max-width: 640px) 60vw, 350px" style={position ? { objectPosition: position } : undefined} />
            {video && <AutoVideo src={video} label={alt} />}
          </div>

          <svg viewBox="0 0 600 600" className="absolute inset-0 h-full w-full" role="img" aria-label="Cadran de 24 heures : nos distributeurs sont ouverts jour et nuit">
            {/* couronne des heures : nuit en haut (18 h → 6 h), jour en bas */}
            <path d={`M${C - R_OUT} ${C}A${R_OUT} ${R_OUT} 0 0 1 ${C + R_OUT} ${C}L${C + R_IN} ${C}A${R_IN} ${R_IN} 0 0 0 ${C - R_IN} ${C}Z`} fill="#0a2219" />
            <path d={`M${C + R_OUT} ${C}A${R_OUT} ${R_OUT} 0 0 1 ${C - R_OUT} ${C}L${C - R_IN} ${C}A${R_IN} ${R_IN} 0 0 0 ${C + R_IN} ${C}Z`} fill="#1f5140" />
            <g fill="none" stroke="#d7b565">
              <circle cx={C} cy={C} r={R_OUT + 4} strokeWidth="1" opacity="0.75" />
              <circle cx={C} cy={C} r={R_IN - 4} strokeWidth="1.4" />
              <circle cx={C} cy={C} r={R_IN - 11} strokeWidth="0.8" opacity="0.55" />
            </g>
            <g stroke="#f2ead6" strokeLinecap="round">
              {ticks.map((t) => (
                <path key={t.key} d={t.d} strokeWidth={t.hour ? 1.6 : 1} opacity={t.hour ? 0.8 : 0.4} />
              ))}
            </g>
            <g fill="#f2ead6" textAnchor="middle" dominantBaseline="central" style={{ fontFamily: "var(--font-serif)", fontVariationSettings: '"SOFT" 100', fontWeight: 300, fontSize: 40, letterSpacing: "-0.02em" }}>
              {numerals.map((n) => {
                const [x, y] = polar((R_OUT + R_IN) / 2, n.deg);
                return (
                  <text key={n.label} x={f(x)} y={f(y)}>
                    {n.label}
                  </text>
                );
              })}
            </g>
            {/* « nuit » en haut à gauche (vers 21 h), « jour » en bas à droite (vers 9 h) */}
            <defs>
              <path id="arc-nuit" d={`M${C - 231} ${C}A231 231 0 0 1 ${C + 231} ${C}`} />
              <path id="arc-jour" d={`M${C - 247} ${C}A247 247 0 0 0 ${C + 247} ${C}`} />
            </defs>
            <g fill="#f2ead6" opacity="0.72" textAnchor="middle" style={{ fontFamily: "var(--font-fraunces-italic), var(--font-serif)", fontStyle: "italic", fontWeight: 300, fontSize: 21, letterSpacing: "0.04em" }}>
              <text>
                <textPath href="#arc-nuit" startOffset="25%">
                  nuit
                </textPath>
              </text>
              <text>
                <textPath href="#arc-jour" startOffset="75%">
                  jour
                </textPath>
              </text>
            </g>
          </svg>

          {/* L'index : il part de minuit et rejoint l'heure réelle. Il a son propre calque, pour que sa course
              soit une simple rotation gérée par la carte graphique (dans le cadran, elle le redessinait à chaque image). */}
          <svg viewBox="0 0 600 600" aria-hidden className="absolute inset-0 h-full w-full will-change-transform" style={{ transform: `rotate(${angle.toFixed(2)}deg)`, transition: "transform 2.4s cubic-bezier(0.3, 0, 0.1, 1) 0.9s" }}>
            <path d={`M${C} ${C - R_IN + 4}V${C - R_OUT - 4}`} stroke="#ecd9a0" strokeWidth="2.2" strokeLinecap="round" />
            <path d={`M${C} ${C - R_OUT - 2}l-9 -19h18z`} fill="#ecd9a0" />
          </svg>
        </div>
      </div>

      <figcaption className="seq-in relative mt-7 text-center sm:mt-9" style={{ "--i": 7 } as CSSProperties}>
        <span className="t-num block font-serif text-[1.65rem] font-light leading-none tracking-[-0.02em] sm:text-[2rem]" style={{ fontVariationSettings: '"SOFT" 100' }}>
          {now ? `Il est ${formatClock(now)}.` : "Jour et nuit."}
        </span>
        <span className="mt-2.5 block text-[0.9688rem] text-foreground/75">Nos deux distributeurs sont ouverts.</span>
      </figcaption>
    </figure>
  );
}
