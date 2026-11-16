"use client";

import { useEffect, useState } from "react";

export type Clock = { h: number; m: number };

/**
 * Heure qu'il est dans le Haut-Doubs (fuseau Europe/Paris), quel que soit le fuseau du visiteur.
 * `null` tant que la page n'est pas « réveillée » dans le navigateur : le HTML livré ne contient donc
 * jamais une heure figée, seulement la phrase de repli.
 */
export function useParisTime(): Clock | null {
  const [now, setNow] = useState<Clock | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
    const tick = () => {
      const parts = fmt.formatToParts(new Date());
      const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0) % 24;
      const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
      setNow((prev) => (prev && prev.h === h && prev.m === m ? prev : { h, m }));
    };
    tick();
    const id = window.setInterval(tick, 10_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

/** « 19 h 48 », avec des espaces insécables. */
export function formatClock(c: Clock): string {
  return `${c.h} h ${String(c.m).padStart(2, "0")}`;
}

/**
 * Phrase qui cite l'heure réelle : `template` contient « {heure} », remplacé une fois la page active.
 * Avant cela (et sans JavaScript), c'est `fallback` qui s'affiche.
 */
export function LiveTime({ template, fallback, className }: { template: string; fallback: string; className?: string }) {
  const now = useParisTime();
  return <span className={className}>{now ? template.replace("{heure}", formatClock(now)) : fallback}</span>;
}
