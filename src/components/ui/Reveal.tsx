import type { CSSProperties, ReactNode } from "react";

/**
 * Apparition douce au défilement. Simple balise marquée `data-reveal` : l'animation est pilotée par
 * <MotionRoot /> (voir src/components/motion). Sans JavaScript, le contenu reste visible.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  variant = "up",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  /** Décalage en millisecondes (ajouté à l'échelonnement automatique) */
  delay?: number;
  variant?: "up" | "left" | "right" | "scale" | "blur";
  as?: "div" | "section" | "article" | "li";
}) {
  return (
    <Tag data-reveal={variant} className={className} style={delay ? ({ "--rv-extra": `${delay}ms` } as CSSProperties) : undefined}>
      {children}
    </Tag>
  );
}
