import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { cn } from "@/lib/utils";

/**
 * En-tête de page : fil d'Ariane, grand titre, chapeau, puis un emplacement libre (boutons, recherche…).
 * Le guilloché « grain d'orge » dépasse à droite, comme le bord d'un cadran.
 */
export function PageHero({
  crumbs,
  title,
  lead,
  children,
  aside,
  className,
  titleClassName,
  guilloche = true,
}: {
  crumbs: Crumb[];
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
  /** Bloc placé à droite du titre sur grand écran (image, recherche…) */
  aside?: ReactNode;
  className?: string;
  titleClassName?: string;
  guilloche?: boolean;
}) {
  return (
    <section className={cn("relative overflow-hidden", className)}>
      {guilloche && <div aria-hidden className="guilloche guilloche-orge opacity-[0.2] w-[120vw] sm:w-[860px] -right-[72vw] sm:-right-[470px] -top-[34vw] sm:-top-[250px]" />}
      <div className="relative wrap pt-7 sm:pt-9 pb-12 sm:pb-16 lg:pb-20">
        <Breadcrumbs items={crumbs} />
        <div className={cn("mt-9 sm:mt-12", Boolean(aside) && "grid gap-10 lg:grid-cols-12 lg:items-end")}>
          <div className={aside ? "lg:col-span-7" : undefined}>
            <h1 className={cn("t-h1 max-w-[16ch]", titleClassName)}>{title}</h1>
            {lead && <p className="t-lead mt-6 measure-wide">{lead}</p>}
            {children && <div className="mt-8">{children}</div>}
          </div>
          {aside && <div className="lg:col-span-5">{aside}</div>}
        </div>
      </div>
    </section>
  );
}
