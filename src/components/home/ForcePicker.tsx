"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type ForceOption = { key: string; label: string; short: string; description: string; dots: number; href: string; cta: string };

/** Sélecteur interactif des forces (Classique → Maxi) : jauge animée + conseil + lien vers les produits. */
export function ForcePicker({ options }: { options: ForceOption[] }) {
  const [active, setActive] = useState(0);
  const current = options[active];

  return (
    <div className="rounded-3xl border border-gold/25 bg-gradient-to-br from-card via-card-2/40 to-card p-5 sm:p-8 shadow-deep">
      <div role="tablist" aria-label="Choisir une force" className="grid grid-cols-4 gap-1.5 rounded-2xl bg-background/70 p-1.5">
        {options.map((o, i) => (
          <button
            key={o.key}
            type="button"
            role="tab"
            id={`force-tab-${o.key}`}
            aria-selected={i === active}
            aria-controls="force-panel"
            onClick={() => setActive(i)}
            className={cn(
              "rounded-xl px-1 py-3 font-mono text-[9px] sm:text-[11px] uppercase tracking-[0.04em] sm:tracking-[0.14em] transition-all duration-300",
              i === active ? "bg-gradient-gold text-background shadow-gold" : "text-foreground/65 hover:text-gold",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div id="force-panel" role="tabpanel" aria-labelledby={`force-tab-${current.key}`} className="mt-7 grid gap-6 sm:grid-cols-12 sm:items-center">
        <div className="sm:col-span-5">
          <p className="kicker mb-3">{current.short}</p>
          <p key={current.key} className="font-serif text-5xl sm:text-6xl text-gradient-gold leading-none animate-fade-up">{current.label}</p>
          {/* Jauge : 4 segments qui se remplissent selon la force */}
          <div className="mt-5 flex gap-1.5" aria-hidden>
            {[1, 2, 3, 4].map((n) => (
              <span key={n} className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/10">
                <span
                  className="block h-full rounded-full bg-gradient-gold transition-transform duration-700 ease-out origin-left"
                  style={{ transform: `scaleX(${n <= current.dots ? 1 : 0})`, transitionDelay: `${n * 70}ms` }}
                />
              </span>
            ))}
          </div>
        </div>
        <div className="sm:col-span-7">
          <p key={current.key} className="text-base sm:text-lg text-foreground/80 leading-relaxed animate-fade-up">{current.description}</p>
          <Link href={current.href} className="group mt-5 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-gold border-b border-gold/40 pb-1">
            {current.cta} <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
