"use client";

import Link from "next/link";
import { useState } from "react";
import { fr } from "@/lib/utils";

export type ForceOption = { key: string; label: string; short: string; description: string; dots: number; href: string; cta: string };

const CX = 200;
const CY = 200;
const R = 168;
const point = (deg: number, r = R): string => `${(CX + r * Math.cos((deg * Math.PI) / 180)).toFixed(1)} ${(CY - r * Math.sin((deg * Math.PI) / 180)).toFixed(1)}`;
/** Quatre segments de 45° (de gauche à droite), séparés par un petit vide. */
const segments = [0, 1, 2, 3].map((i) => {
  const from = 180 - i * 45 - 2.2;
  const to = 180 - (i + 1) * 45 + 2.2;
  return `M${point(from)}A${R} ${R} 0 0 1 ${point(to)}`;
});

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
      <svg viewBox="0 0 400 226" className="mx-auto block w-full max-w-[26rem]" role="img" aria-label={`Jauge des forces : ${current.label}, niveau ${current.dots} sur 4`}>
        <g fill="none" strokeWidth="13" strokeLinecap="butt">
          {segments.map((d, i) => (
            <path key={d} d={d} stroke="#d7b565" opacity={i <= active ? 1 : 0.18} style={{ transition: "opacity 0.5s" }} />
          ))}
        </g>
        <g fill="none" stroke="#d7b565" strokeWidth="1">
          <path d={`M${point(180, R + 16)}A${R + 16} ${R + 16} 0 0 1 ${point(0, R + 16)}`} opacity="0.7" />
          <path d={`M${point(180, R - 16)}A${R - 16} ${R - 16} 0 0 1 ${point(0, R - 16)}`} opacity="0.45" />
        </g>
        <g fill="#f2ead6" opacity="0.8" fontSize="13" style={{ fontFamily: "var(--font-sans)" }}>
          <text x={CX - R - 16} y={CY + 22} textAnchor="start">
            Doux
          </text>
          <text x={CX + R + 16} y={CY + 22} textAnchor="end">
            Intense
          </text>
        </g>
        <g style={{ transform: `rotate(${needle}deg)`, transformOrigin: `${CX}px ${CY}px`, transition: "transform 0.95s cubic-bezier(0.3, 1.45, 0.45, 1)" }}>
          <path d={`M${CX - 3.2} ${CY}L${CX} ${CY - R + 26}L${CX + 3.2} ${CY}Z`} fill="#f2ead6" />
        </g>
        <circle cx={CX} cy={CY} r="9" fill="#f2ead6" />
        <circle cx={CX} cy={CY} r="3" fill="#8a6a1f" />
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
