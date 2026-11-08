import { forceLabels, type Force } from "@/data/products";
import { cn } from "@/lib/utils";

const styles: Record<Force, string> = {
  1: "text-leaf-light border-leaf-light/40 bg-leaf-light/10",
  2: "text-gold border-gold/50 bg-gold/10",
  3: "text-orange-300 border-orange-400/40 bg-orange-400/10",
  maxi: "text-red-300 border-red-400/50 bg-red-400/15",
};

export function ForceBadge({ force, size = "sm", className }: { force: Force; size?: "xs" | "sm"; className?: string }) {
  const meta = forceLabels[force];
  return (
    <span
      title={meta.description}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-mono uppercase tracking-[0.15em]",
        size === "xs" ? "px-2 py-0.5 text-[9px]" : "px-2.5 py-1 text-[10px]",
        styles[force],
        className,
      )}
    >
      <span className="flex gap-0.5" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={cn("h-1.5 w-1.5 rounded-full", i < meta.dots ? "bg-current" : "bg-current/25")} />
        ))}
      </span>
      {meta.label}
    </span>
  );
}
