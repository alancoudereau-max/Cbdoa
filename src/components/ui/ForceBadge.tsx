import { forceLabels, type Force } from "@/data/products";
import { cn } from "@/lib/utils";

/**
 * Force d'un produit : son nom et quatre points, dont autant de pleins que la force.
 * `label` remplace le nom de la force quand il ne convient pas au produit (« Concentré de CBD »).
 */
export function ForceBadge({ force, className, label }: { force: Force; size?: "xs" | "sm"; className?: string; label?: string }) {
  const meta = forceLabels[force];
  return (
    <span title={label ? undefined : meta.description} className={cn("pips", className)}>
      <span aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <i key={i} data-on={i < meta.dots ? "" : undefined} />
        ))}
      </span>
      {label ?? meta.label}
    </span>
  );
}
