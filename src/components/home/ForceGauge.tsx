"use client";

import Link from "next/link";
import { useState } from "react";
import { fr } from "@/lib/utils";

export type ForceOption = { key: string; label: string; short: string; description: string; dots: number; href: string; cta: string };

const CX = 200;
const CY = 204;
const R = 150; // rayon de l'arc des quatre segments
const NEEDLE = 94; // longueur de l'aiguille
const LABELS = 124; // rayon des noms des forces
const rad = (deg: number) => (deg * Math.PI) / 180;
const point = (deg: number, r = R): string => `${(CX + r * Math.cos(rad(deg))).toFixed(1)} ${(CY - r * Math.sin(rad(deg))).toFixed(1)}`;
const arc = (r: number, from = 180, to = 0): string => `M${point(from, r)}A${r} ${r} 0 0 1 ${point(to, r)}`;
/** Quatre segments de 45° (de gauche à droite), séparés par un petit vide. */
const segments = [0, 1, 2, 3].map((i) => arc(R, 180 - i * 45 - 1.8, 180 - (i + 1) * 45 + 1.8));
/** Graduation : un repère tous les 3°, un grand tous les 15° (comme la minuterie d'un cadran). */
const ticks = Array.from({ length: 61 }, (_, i) => {
  const deg = 180 - i * 3;
  const long = i % 5 === 0;
  return { d: `M${point(deg, long ? 163 : 167)}L${point(deg, 173)}`, long };
});
/** Nom court de chaque force, posé sous son segment. */
const segmentLabel = (label: string) => label.replace(/^Force\s+/, "");

/**
 * Les quatre forces, lues sur une jauge à aiguille (comme une réserve de marche) :
 * on choisit une force, l'aiguille s'y rend, le conseil et le lien changent.
 */
export function ForceGauge({ options }: { options: ForceOption[] }) {
  const [active, setActive] = useState(0);
  const current = options[active];
  const needle = -67.5 + active * 45;

  return (
    <div data-reveal="scale" className="panel sheet">
      <svg viewBox="0 0 400 236" className="mx-auto block w-full max-w-[27rem]" role="img" aria-label={`Jauge des forces : ${current.label}, niveau ${current.dots} sur 4`}>
        <defs>
          <linearGradient id="fg-or" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#b8943f" />
            <stop offset="0.5" stopColor="#f6e9b8" />
            <stop offset="1" stopColor="#c8a24a" />
          </linearGradient>
          <radialGradient id="fg-fond" cx={CX} cy={CY} r="184" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#d7b565" stopOpacity="0.16" />
            <stop offset="0.55" stopColor="#d7b565" stopOpacity="0.05" />
            <stop offset="1" stopColor="#d7b565" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="fg-axe" cx="0.38" cy="0.32" r="0.8">
            <stop offset="0" stopColor="#fff6d8" />
            <stop offset="0.55" stopColor="#d7b565" />
            <stop offset="1" stopColor="#7a5c1a" />
          </radialGradient>
        </defs>

        {/* le fond du compteur et sa lunette : deux filets */}
        <path d={`${arc(184)}Z`} fill="url(#fg-fond)" />
        <g fill="none" stroke="#d7b565">
          <path d={arc(184)} strokeWidth="1.2" opacity="0.8" />
          <path d={arc(179)} strokeWidth="0.6" opacity="0.4" />
          <path d={arc(R - 13)} strokeWidth="0.6" opacity="0.32" />
          <path d={`M${CX - 184} ${CY}L${CX + 184} ${CY}`} strokeWidth="0.6" opacity="0.3" />
        </g>

        {/* la graduation */}
        <g fill="none" stroke="#ecd9a0" strokeLinecap="round">
          {ticks.map((t) => (
            <path key={t.d} d={t.d} strokeWidth={t.long ? 1.3 : 0.7} opacity={t.long ? 0.9 : 0.45} />
          ))}
        </g>

        {/* les quatre forces : les segments se remplissent d'or jusqu'à la force choisie */}
        <g fill="none" strokeWidth="9">
          {segments.map((d, i) => (
            <path key={d} d={d} stroke={i <= active ? "url(#fg-or)" : "#d7b565"} opacity={i <= active ? 1 : 0.16} style={{ transition: "opacity 0.5s" }} />
          ))}
        </g>
        <g textAnchor="middle" fontSize="11.5" style={{ fontFamily: "var(--font-sans)" }}>
          {options.map((o, i) => {
            const deg = 157.5 - i * 45;
            const [x, y] = point(deg, LABELS).split(" ");
            return (
              <text key={o.key} x={x} y={Number(y) + 4} fill={i === active ? "#f6e9b8" : "#f2ead6"} opacity={i === active ? 1 : 0.5} fontWeight={i === active ? 600 : 400} style={{ transition: "opacity 0.4s" }}>
                {segmentLabel(o.label)}
              </text>
            );
          })}
        </g>
        <g fill="#f2ead6" opacity="0.72" fontSize="14" style={{ fontFamily: "var(--font-fraunces-italic), var(--font-serif)", fontStyle: "italic" }}>
          <text x={CX - 184} y={CY + 24} textAnchor="start">
            doux
          </text>
          <text x={CX + 184} y={CY + 24} textAnchor="end">
            intense
          </text>
        </g>

        {/* l'aiguille : effilée, avec son contrepoids, posée sur un axe bombé */}
        <g style={{ transform: `rotate(${needle}deg)`, transformOrigin: `${CX}px ${CY}px`, transition: "transform 0.95s cubic-bezier(0.3, 1.45, 0.45, 1)" }}>
          {/* elle s'arrête avant les noms des forces, pour ne jamais les barrer */}
          <path d={`M${CX - 3.6} ${CY + 4}L${CX - 1.2} ${CY + 28}L${CX + 1.2} ${CY + 28}L${CX + 3.6} ${CY + 4}L${CX + 0.8} ${CY - NEEDLE}L${CX - 0.8} ${CY - NEEDLE}Z`} fill="url(#fg-or)" />
          <path d={`M${CX} ${CY}L${CX} ${CY - NEEDLE + 3}`} stroke="#fffbe9" strokeWidth="0.6" opacity="0.7" />
        </g>
        <circle cx={CX} cy={CY} r="15" fill="none" stroke="#d7b565" strokeWidth="0.7" opacity="0.5" />
        <circle cx={CX} cy={CY} r="10.5" fill="url(#fg-axe)" />
        <circle cx={CX} cy={CY} r="3.2" fill="#14110a" />
      </svg>

      <div role="radiogroup" aria-label="Choisir une force" className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {options.map((o, i) => (
          <button
            key={o.key}
            type="button"
            role="radio"
            aria-checked={i === active}
            onClick={() => setActive(i)}
            className="choice choice-pill px-3 py-2.5 text-center text-[0.9375rem] font-medium"
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-12 sm:gap-8" aria-live="polite">
        <div className="sm:col-span-5">
          <p className="t-h3">{current.label}</p>
          <p className="mt-2 text-[0.9375rem] text-foreground/70">{current.short.replace(" · ", ", ")}</p>
        </div>
        <div className="sm:col-span-7">
          <p className="text-[1.0625rem] leading-relaxed text-foreground/85">{fr(current.description)}</p>
          <Link href={current.href} className="link mt-4 inline-block font-medium">
            {current.cta}
          </Link>
        </div>
      </div>
    </div>
  );
}
