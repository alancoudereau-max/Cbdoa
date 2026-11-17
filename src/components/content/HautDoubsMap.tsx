import type { CSSProperties } from "react";
import Link from "next/link";
import carte from "@/data/carte-haut-doubs.json";
import { cn } from "@/lib/utils";

type Ville = { nom: string; slug: string; x: number; y: number; role: string; cote: string };

/**
 * Carte du Haut-Doubs : les deux distributeurs, les points de retrait et la zone de livraison à domicile.
 * Les positions viennent de coordonnées officielles (scripts/build-carte.py → src/data/carte-haut-doubs.json).
 * Le fond (contour du Doubs, zones, cercles de distance) est un dessin vectoriel ; les communes sont de vrais
 * liens posés par-dessus, pour rester lisibles à toutes les tailles. Ces liens ne sont pas préchargés : douze pages
 * de ville d'un coup, ce serait du poids pour rien sur un téléphone.
 */
export function HautDoubsMap({ className, focus }: { className?: string; /** Commune mise en avant (page d'une ville) */ focus?: string }) {
  const villes = carte.villes as Ville[];
  const [zoneRussey, zoneDamprichard] = carte.zones;
  const ici = (slug: string) => (slug === focus ? " carte-ici" : "");
  return (
    <figure className={cn("carte", className)} data-reveal="scale">
      <p className="sr-only">
        Carte du Haut-Doubs. Distributeurs CBDoux ouverts 24 h/24 à Charquemont et au Russey. Retrait gratuit à Damprichard et au Russey. Livraison à domicile dans un rayon de{" "}
        {zoneRussey.rayonKm} km autour du Russey et de {zoneDamprichard.rayonKm} km autour de Damprichard, côté français. Expédition partout en France.
      </p>
      <div className="carte-cadre" style={{ aspectRatio: `1000 / ${carte.hauteur}` }}>
        <svg viewBox={`0 0 1000 ${carte.hauteur}`} aria-hidden className="carte-fond">
          <defs>
            <clipPath id="carte-doubs">
              <path d={carte.contour} />
            </clipPath>
          </defs>
          <path d={carte.contour} className="carte-terre" />
          <g clipPath="url(#carte-doubs)">
            {carte.zones.map((z) => (
              <circle key={z.centre} cx={z.cx} cy={z.cy} r={z.r} className="carte-zone" />
            ))}
            {carte.reperes.map((r) => (
              <circle key={r.km} cx={r.cx} cy={r.cy} r={r.r} className="carte-repere" />
            ))}
            {carte.zones.map((z) => (
              <circle key={z.centre} cx={z.cx} cy={z.cy} r={z.r} className="carte-zone-bord" />
            ))}
          </g>
          <path d={carte.contour} className="carte-frontiere" />
        </svg>

        <span aria-hidden className="carte-pays" style={{ left: "77%", top: "74%" }}>
          Suisse
        </span>
        <span aria-hidden className="carte-pays" style={{ left: "17%", top: "24%" }}>
          Doubs
        </span>

        {villes.map((v, n) => (
          <Link
            key={v.slug}
            href={`/cbd/${v.slug}`}
            prefetch={false}
            aria-current={v.slug === focus ? "page" : undefined}
            className={`carte-ville carte-${v.role} carte-cote-${v.cote}${ici(v.slug)}`}
            style={{ left: `${v.x}%`, top: `${v.y}%`, "--n": n } as CSSProperties}
          >
            <span aria-hidden className="carte-point" />
            <span className="carte-nom">{v.nom}</span>
          </Link>
        ))}

        {/* Villes hors cadre : expédition */}
        <Link href="/cbd/besancon" prefetch={false} aria-current={focus === "besancon" ? "page" : undefined} className={`carte-cap carte-cap-ouest${ici("besancon")}`} style={{ top: `${carte.horsCadre[0].y}%` }}>
          <svg aria-hidden viewBox="0 0 8 12" width="6" height="9" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6.5 1L1.5 6l5 5" />
          </svg>
          Besançon
        </Link>
        <Link href="/cbd/belfort" prefetch={false} aria-current={focus === "belfort" ? "page" : undefined} className={`carte-cap carte-cap-nord${ici("belfort")}`} style={{ left: "80%" }}>
          <svg aria-hidden viewBox="0 0 12 8" width="9" height="6" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 6.5L6 1.5l5 5" />
          </svg>
          Belfort
        </Link>

        <span aria-hidden className="carte-echelle" style={{ width: `${carte.echelle10km}%` }}>
          10 km
        </span>
      </div>

      <figcaption className="carte-legende">
        <span>
          <i aria-hidden className="carte-point carte-point-distributeur" />
          Distributeur 24 h/24
        </span>
        <span>
          <i aria-hidden className="carte-point carte-point-retrait" />
          Retrait gratuit
        </span>
        <span>
          <i aria-hidden className="carte-trait" />
          Livraison à domicile
        </span>
      </figcaption>
    </figure>
  );
}
