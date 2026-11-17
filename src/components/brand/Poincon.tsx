import { ROSETTE } from "./logo-data";
import { cn } from "@/lib/utils";

/**
 * Le poinçon de la maison : la rosace au centre, « CBDoux » en haut, « Haut-Doubs » en bas, dans une
 * couronne graduée comme la minuterie d'un cadran. C'est la signature posée au pied de chaque page.
 * Là où le navigateur le permet, la couronne tourne d'un cran pendant que la page défile (CSS seul).
 */
export function Poincon({ className }: { className?: string }) {
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const a = (i * 6 * Math.PI) / 180;
    const r1 = i % 5 === 0 ? 51.5 : 53.5;
    return `M${(60 + r1 * Math.sin(a)).toFixed(2)} ${(60 - r1 * Math.cos(a)).toFixed(2)}L${(60 + 56 * Math.sin(a)).toFixed(2)} ${(60 - 56 * Math.cos(a)).toFixed(2)}`;
  }).join("");
  const [ring, petal, centre] = ROSETTE.strokes.fine;
  return (
    <svg viewBox="0 0 120 120" role="img" aria-label="CBDoux, Haut-Doubs" className={cn("poincon", className)}>
      <defs>
        <path id="poincon-haut" d="M19 60A41 41 0 0 1 101 60" />
        <path id="poincon-bas" d="M12.5 60A47.5 47.5 0 0 0 107.5 60" />
      </defs>
      <g fill="none" stroke="currentColor">
        <circle cx="60" cy="60" r="58.5" strokeWidth="0.9" />
        <path className="poincon-couronne" d={ticks} strokeWidth="0.7" opacity="0.75" />
        <circle cx="60" cy="60" r="49.5" strokeWidth="0.5" opacity="0.6" />
        <circle cx="60" cy="60" r="27" strokeWidth="0.5" opacity="0.6" />
        {/* la rosace de l'enseigne, dans son repère 100 × 100 ramené au centre */}
        <g transform="translate(40.5 40.5) scale(0.39)" strokeLinejoin="round">
          <circle cx="50" cy="50" r={ROSETTE.ringRadius} strokeWidth={ring} />
          <path d={ROSETTE.petals} strokeWidth={petal} />
          <circle cx="50" cy="50" r={ROSETTE.centreRadius} strokeWidth={centre} />
        </g>
        {/* deux losanges entre les deux inscriptions */}
        <path d="M15.2 60l2.4-2.4 2.4 2.4-2.4 2.4zM100 60l2.4-2.4 2.4 2.4-2.4 2.4z" fill="currentColor" stroke="none" />
      </g>
      <g fill="currentColor" fontSize="9.6" style={{ fontFamily: "var(--font-sans)", fontWeight: 600, letterSpacing: "0.26em" }}>
        <text textAnchor="middle">
          <textPath href="#poincon-haut" startOffset="50%">
            CBDOUX
          </textPath>
        </text>
        <text textAnchor="middle">
          <textPath href="#poincon-bas" startOffset="50%">
            HAUT-DOUBS
          </textPath>
        </text>
      </g>
    </svg>
  );
}
