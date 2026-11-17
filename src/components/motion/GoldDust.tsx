import type { CSSProperties } from "react";

/** Tirage reproductible : les mêmes grains côté serveur et côté navigateur. */
function seeded(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

const rnd = seeded(20261117);
const MOTES = Array.from({ length: 30 }, () => {
  const a = 0.3 + rnd() * 0.5;
  return {
    "--x": `${(rnd() * 100).toFixed(1)}%`,
    "--y": `${(10 + rnd() * 90).toFixed(1)}%`,
    "--s": `${(5 + rnd() * 12).toFixed(1)}px`,
    "--d": `${(15 + rnd() * 20).toFixed(1)}s`,
    "--delay": `${(rnd() * 34).toFixed(1)}s`,
    "--rise": `${Math.round(130 + rnd() * 260)}px`,
    "--sway": `${Math.round((rnd() - 0.5) * 64)}px`,
    "--a": a.toFixed(2),
    "--a2": (a * 0.32).toFixed(2),
  } as CSSProperties;
});

/**
 * Poussière d'or en suspension derrière le premier écran.
 * Trente grains (seize sur téléphone) qui montent, oscillent et scintillent : uniquement des déplacements et de
 * l'opacité, animés par la carte graphique. Aucun script : la page reste disponible pour le défilement.
 * Immobile si le visiteur a demandé moins d'animations.
 */
export function GoldDust({ className }: { className?: string }) {
  return (
    <div aria-hidden className={`dust ${className ?? ""}`}>
      {MOTES.map((style, n) => (
        <i key={n} style={style} />
      ))}
    </div>
  );
}
