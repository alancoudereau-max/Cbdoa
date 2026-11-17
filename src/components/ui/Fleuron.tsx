import { Rosette } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

/**
 * Fleuron : la rosace de l'enseigne entre deux filets dorés qui s'effilent, flanquée de deux petits losanges.
 * Il sépare deux sections posées sur le même fond, là où un simple trait ferait « formulaire ».
 * `motif="losange"` remplace la rosace par un losange ajouré : à utiliser quand le logo (qui porte déjà la rosace)
 * se trouve juste à côté.
 */
export function Fleuron({ className, motif = "rosace" }: { className?: string; motif?: "rosace" | "losange" }) {
  return (
    <div aria-hidden className={cn("fleuron", className)}>
      <i />
      {motif === "rosace" ? <Rosette weight="fine" /> : <b />}
      <i />
    </div>
  );
}
