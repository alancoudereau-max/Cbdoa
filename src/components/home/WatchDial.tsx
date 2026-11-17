"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Logo, Rosette } from "@/components/brand/Logo";
import { useParisTime, formatClock } from "@/components/motion/ParisTime";

const C = 300; // centre (repère 600 × 600)

/** Les index appliqués (à 3 heures, le guichet de date les remplace ; à 12 heures, la rosace de la marque). */
const HOURS = [1, 2, 4, 5, 6, 7, 8, 9, 10, 11];

/** Chemin de fer des minutes : un trait par minute, absent là où tombe un index. */
const MINUTES = Array.from({ length: 60 }, (_, i) => i).filter((i) => i % 5 !== 0);

/** Aiguilles « feuille », dessinées pointe en haut, pivot au centre. */
const HOUR_HAND = "M300 328C296 319 292.5 306 291.5 296C289.5 280 289 268 290 258C292 232 297.5 198 300 172C302.5 198 308 232 310 258C311 268 310.5 280 308.5 296C307.5 306 304 319 300 328Z";
const MINUTE_HAND = "M300 332C296.8 321 294 306 293.4 294C292.3 276 292.3 262 293 250C294.8 200 298.3 150 300 100C301.7 150 305.2 200 307 250C307.7 262 307.7 276 306.6 294C306 306 303.2 321 300 332Z";

/** Heure d'exposition des montres en vitrine : 10 h 10. C'est ce que montre la page avant de se régler. */
const REST = { hour: 305, minute: 60 };

/** Guichet « jour et nuit » : une demi-lune ouverte au-dessus de 6 heures. */
const WINDOW = { cx: 300, cy: 429, r: 55 };
const WINDOW_PATH = `M${WINDOW.cx - WINDOW.r} ${WINDOW.cy}A${WINDOW.r} ${WINDOW.r} 0 0 1 ${WINDOW.cx + WINDOW.r} ${WINDOW.cy}Z`;
const STARS: [number, number, number][] = [
  [-31, 23, 1.7],
  [26, 16, 1.3],
  [-14, 40, 1.1],
  [36, 35, 1.5],
  [5, 13, 1],
  [-41, 9, 1.1],
  [17, 44, 0.9],
];

function Hand({ d, ridgeTo, id }: { d: string; ridgeTo: number; id: string }) {
  return (
    <>
      <path d={d} transform="translate(3 5)" fill="#000" opacity="0.32" />
      <path d={d} fill={`url(#${id})`} stroke="#6e5417" strokeWidth="0.6" />
      <path d={`M300 300V${ridgeTo}`} stroke="#fffbe6" strokeWidth="2.2" strokeLinecap="round" opacity="0.85" />
    </>
  );
}

/**
 * La montre CBDoux : un cadran 12 heures original (rosace de la marque à midi, index appliqués, aiguilles
 * « feuille », guichet de date, guichet jour et nuit) qui donne l'heure exacte du Haut-Doubs. Le pays est
 * horloger, les distributeurs ne ferment jamais : « Du bon CBD. À la bonne heure. »
 *
 *  - Sans JavaScript, elle affiche 10 h 10, comme en vitrine. Une fois la page active, les aiguilles rejoignent
 *    l'heure réelle, puis la trotteuse tourne sans à-coup (animation gérée par la carte graphique).
 *  - Le guichet du bas montre le soleil le jour et la lune la nuit : les distributeurs sont ouverts sous les deux.
 *  - La lumière du cadran tourne quand on fait défiler la page ; sur ordinateur, la montre s'incline vers le pointeur.
 *  - Un clic ou un appui « remonte » la montre : les aiguilles font un tour et reviennent à l'heure.
 *  - Avec « réduire les animations », tout est immobile, à la bonne heure.
 */
export function WatchDial({ className, caption = true }: { className?: string; caption?: boolean }) {
  const now = useParisTime();
  const [live, setLive] = useState<{ s0: number; day: number } | null>(null);
  const [, setWound] = useState(0);
  const turns = useRef({ hour: REST.hour, minute: REST.minute });
  const body = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const d = new Date();
    const day = Number(new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", day: "numeric" }).format(d));
    setLive({ s0: d.getSeconds() + d.getMilliseconds() / 1000, day });
  }, []);

  // Lumière qui tourne avec le défilement ; inclinaison vers le pointeur (souris uniquement).
  useEffect(() => {
    const el = body.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let pointer = 0;
    const paint = () => {
      raf = 0;
      el.style.setProperty("--light", `${((window.scrollY * 0.16 + pointer) % 360).toFixed(1)}deg`);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const dx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / 520));
      const dy = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / 520));
      el.style.setProperty("--ry", `${(dx * 9).toFixed(2)}deg`);
      el.style.setProperty("--rx", `${(-dy * 9).toFixed(2)}deg`);
      pointer = dx * 34;
      schedule();
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  // Les aiguilles n'avancent que dans le sens des aiguilles d'une montre, même au passage de midi.
  if (now) {
    const forward = (target: number, current: number) => current + ((((target - current) % 360) + 360) % 360);
    turns.current = {
      hour: forward(((now.h % 12) + now.m / 60) * 30, turns.current.hour),
      minute: forward(now.m * 6, turns.current.minute),
    };
  }
  const { hour, minute } = turns.current;
  // Guichet jour et nuit : soleil au zénith à midi, lune au zénith à minuit.
  const sky = now ? (now.h + now.m / 60 - 12) * 15 : -30;

  const wind = () => {
    turns.current = { hour: turns.current.hour + 360, minute: turns.current.minute + 720 };
    setWound((n) => n + 1);
  };

  // À l'entrée sur le site (vérification d'âge validée), la montre se remonte : les aiguilles font un tour.
  const windRef = useRef(wind);
  windRef.current = wind;
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    const onEnter = () => {
      timer = window.setTimeout(() => windRef.current(), 420);
    };
    window.addEventListener("cbdoux:enter", onEnter);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("cbdoux:enter", onEnter);
    };
  }, []);

  return (
    <figure className={className}>
      <div className="watch seq-watch">
        <div aria-hidden className="watch-shadow" />
        <div ref={body} className="watch-body" onClick={wind}>
          {/* Boîtier : couronne et lunette en or poli */}
          <svg viewBox="0 0 600 600" aria-hidden className="watch-layer">
            <defs>
              <linearGradient id="wd-gold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#fff3c9" />
                <stop offset="0.2" stopColor="#d7b565" />
                <stop offset="0.44" stopColor="#8a6a1f" />
                <stop offset="0.62" stopColor="#f3e0a6" />
                <stop offset="0.82" stopColor="#b8943f" />
                <stop offset="1" stopColor="#6e5417" />
              </linearGradient>
              <linearGradient id="wd-gold-in" x1="1" y1="1" x2="0" y2="0">
                <stop offset="0" stopColor="#f6e6b0" />
                <stop offset="0.5" stopColor="#8a6a1f" />
                <stop offset="1" stopColor="#4d3a0e" />
              </linearGradient>
            </defs>
            <rect x="566" y="282" width="30" height="36" rx="5" fill="url(#wd-gold)" stroke="#5c4410" strokeWidth="1" />
            {[288, 294, 300, 306, 312].map((y) => (
              <path key={y} d={`M572 ${y}H593`} stroke="#5c4410" strokeWidth="1" opacity="0.6" />
            ))}
            <circle cx={C} cy={C} r="261" fill="none" stroke="url(#wd-gold)" strokeWidth="32" />
            <circle cx={C} cy={C} r="277.5" fill="none" stroke="#5c4410" strokeWidth="1.2" opacity="0.8" />
            <circle cx={C} cy={C} r="264" fill="none" stroke="#5c4410" strokeWidth="0.9" opacity="0.45" />
            <circle cx={C} cy={C} r="246.5" fill="none" stroke="url(#wd-gold-in)" strokeWidth="5" />
          </svg>

          <div aria-hidden className="watch-face" />

          {/* Habillage du cadran */}
          <svg viewBox="0 0 600 600" className="watch-layer" role="img" aria-label={now ? `Montre CBDoux : il est ${formatClock(now)} dans le Haut-Doubs` : "Montre CBDoux, cadran vert et or"}>
            <defs>
              <linearGradient id="wd-index" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#fff3c9" />
                <stop offset="0.5" stopColor="#d7b565" />
                <stop offset="1" stopColor="#8a6a1f" />
              </linearGradient>
              <linearGradient id="wd-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#56bd9a" />
                <stop offset="0.5" stopColor="#1f7259" />
                <stop offset="0.5" stopColor="#072019" />
                <stop offset="1" stopColor="#020a08" />
              </linearGradient>
              <clipPath id="wd-window">
                <path d={WINDOW_PATH} />
              </clipPath>
            </defs>
            {/* rosace gravée ton sur ton, au centre */}
            <g fill="none" stroke="#f2ead6" strokeWidth="0.8" opacity="0.1">
              {Array.from({ length: 16 }, (_, i) => (
                <ellipse key={i} cx={C} cy={C - 58} rx="26" ry="58" transform={`rotate(${i * 22.5} ${C} ${C})`} />
              ))}
              <circle cx={C} cy={C} r="118" />
            </g>
            {/* chemin de fer des minutes */}
            <g stroke="#f2ead6" strokeWidth="1.5" opacity="0.72" strokeLinecap="round">
              {MINUTES.map((i) => (
                <path key={i} d={`M${C} ${C - 237}V${C - 230}`} transform={`rotate(${i * 6} ${C} ${C})`} />
              ))}
            </g>
            {/* index appliqués */}
            {HOURS.map((h, k) => (
              <g key={h} transform={`rotate(${h * 30} ${C} ${C})`}>
                <g className="watch-index" style={{ "--k": k } as CSSProperties}>
                  <path d={`M${C - 5.5} ${C - 224}H${C + 5.5}L${C + 3.6} ${C - 187}H${C - 3.6}Z`} fill="url(#wd-index)" stroke="#5c4410" strokeWidth="0.7" />
                  <path d={`M${C} ${C - 222}V${C - 189}`} stroke="#fff8dc" strokeWidth="0.9" opacity="0.7" />
                </g>
              </g>
            ))}
            {/* guichet de date, à 3 heures */}
            <g className="watch-index" style={{ "--k": 10 } as CSSProperties}>
              <rect x="473" y="284" width="44" height="32" rx="3.5" fill="#f2ead6" stroke="url(#wd-index)" strokeWidth="2.4" />
              <path d="M475 286.5H515" stroke="#000" strokeWidth="1.4" opacity="0.22" />
              <text x="495" y="308" textAnchor="middle" fill="#17231d" style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 21, fontVariantNumeric: "tabular-nums" }}>
                {live ? live.day : ""}
              </text>
            </g>
            {/* guichet jour et nuit : le disque tourne avec l'heure, soleil le jour, lune et étoiles la nuit */}
            <g className="watch-index" style={{ "--k": 12 } as CSSProperties}>
              <g clipPath="url(#wd-window)">
                <g style={{ transform: `rotate(${sky.toFixed(1)}deg)`, transformOrigin: `${WINDOW.cx}px ${WINDOW.cy}px`, transition: "transform 2.4s cubic-bezier(0.3, 0, 0.1, 1)" }}>
                  <circle cx={WINDOW.cx} cy={WINDOW.cy} r={WINDOW.r + 2} fill="url(#wd-sky)" />
                  {/* le soleil, côté jour */}
                  <g transform={`translate(${WINDOW.cx} ${WINDOW.cy - 30})`}>
                    {Array.from({ length: 12 }, (_, i) => (
                      <path key={i} d="M0 -13V-17.5" stroke="#fbf0c8" strokeWidth="1.6" strokeLinecap="round" transform={`rotate(${i * 30})`} />
                    ))}
                    <circle r="9.4" fill="url(#wd-index)" stroke="#fbf0c8" strokeWidth="0.6" />
                  </g>
                  {/* la lune et les étoiles, côté nuit */}
                  <path d="M-4 -10.4A11 11 0 1 0 10.4 4A9 9 0 0 1 -4 -10.4Z" fill="#f6e6b0" transform={`translate(${WINDOW.cx} ${WINDOW.cy + 30}) rotate(180)`} />
                  <g fill="#f6e6b0">
                    {STARS.map(([x, y, r]) => (
                      <circle key={`${x}-${y}`} cx={WINDOW.cx + x} cy={WINDOW.cy + y} r={r} />
                    ))}
                  </g>
                </g>
              </g>
              <path d={WINDOW_PATH} fill="none" stroke="url(#wd-index)" strokeWidth="2.2" strokeLinejoin="round" />
              <path d={`M${WINDOW.cx - WINDOW.r + 3.5} ${WINDOW.cy - 2}A${WINDOW.r - 3.5} ${WINDOW.r - 3.5} 0 0 1 ${WINDOW.cx + WINDOW.r - 3.5} ${WINDOW.cy - 2}`} fill="none" stroke="#000" strokeWidth="1.6" opacity="0.28" />
            </g>
            {/* inscriptions */}
            <text x={C} y="455" textAnchor="middle" fill="#ecd9a0" style={{ fontFamily: "var(--font-fraunces-italic), var(--font-serif)", fontStyle: "italic", fontWeight: 300, fontSize: 20 }}>
              Ouvert jour et nuit
            </text>
            <text x={C} y="472" textAnchor="middle" fill="#f2ead6" opacity="0.72" style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 10, letterSpacing: "0.32em" }}>
              HAUT-DOUBS
            </text>
          </svg>

          {/* à midi, la rosace de la marque ; dessous, la signature */}
          <Rosette className="watch-index pointer-events-none absolute left-1/2 top-[12.4%] w-[9.4%] -translate-x-1/2" style={{ "--k": 11 } as CSSProperties} />
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-[27.5%] w-[31%] -translate-x-1/2">
            <Logo className="!h-auto w-full" />
          </div>

          {/* aiguilles */}
          <svg viewBox="0 0 600 600" aria-hidden className="watch-layer watch-hand watch-hand-slow" style={{ transform: `rotate(${hour.toFixed(2)}deg)` }}>
            <Hand d={HOUR_HAND} ridgeTo={190} id="wd-gold" />
          </svg>
          <svg viewBox="0 0 600 600" aria-hidden className="watch-layer watch-hand watch-hand-slow" style={{ transform: `rotate(${minute.toFixed(2)}deg)` }}>
            <Hand d={MINUTE_HAND} ridgeTo={118} id="wd-gold" />
          </svg>
          <svg viewBox="0 0 600 600" aria-hidden className={`watch-layer watch-hand transition-opacity duration-700 ${live ? "watch-seconds opacity-100" : "opacity-0"}`} style={live ? ({ "--s0": live.s0.toFixed(2) } as CSSProperties) : undefined}>
            <path d="M300 337V88" stroke="#000" strokeWidth="1.8" opacity="0.3" transform="translate(2.5 4)" />
            <path d="M300 337V88" stroke="#f6e6b0" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="300" cy="346" r="8.5" fill="none" stroke="#f6e6b0" strokeWidth="2" />
          </svg>
          <svg viewBox="0 0 600 600" aria-hidden className="watch-layer">
            <circle cx={C} cy={C} r="10.5" fill="url(#wd-gold)" stroke="#5c4410" strokeWidth="0.8" />
            <circle cx={C} cy={C} r="3.4" fill="#17130b" />
          </svg>

          <div aria-hidden className="watch-glass" />
        </div>
      </div>

      {caption && (
        <figcaption className="seq-in relative mt-6 text-center sm:mt-8" style={{ "--i": 7 } as CSSProperties}>
          <span className="t-num block font-serif text-[1.65rem] font-light leading-none tracking-[-0.02em] sm:text-[2rem]">{now ? `Il est ${formatClock(now)}.` : "Jour et nuit."}</span>
          <span className="mt-2.5 block text-[0.9688rem] text-foreground/75">Nos deux distributeurs sont ouverts.</span>
        </figcaption>
      )}
    </figure>
  );
}
