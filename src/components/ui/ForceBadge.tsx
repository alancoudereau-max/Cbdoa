import { forceLabels, type Force } from "@/data/products";
import { cn } from "@/lib/utils";

/** Force d'un produit : son nom et quatre points, dont autant de pleins que la force. */
export function ForceBadge({ force, className }: { force: Force; size?: "xs" | "sm"; className?: string }) {
  const meta = forceLabels[force];
  return (
    <span title={meta.description} className={cn("pips", className)}>
      <span aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <i key={i} data-on={i < meta.dots ? "" : undefined} />
        ))}
      </span>
      {meta.label}
    </span>
  );
}
