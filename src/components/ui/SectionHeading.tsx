import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  kicker,
  title,
  italic,
  children,
  align = "left",
  as: Tag = "h2",
  className,
}: {
  kicker?: string;
  title: ReactNode;
  italic?: ReactNode;
  children?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "text-center mx-auto", className)}>
      {kicker && <p className="kicker mb-3">— {kicker}</p>}
      <Tag className={cn("font-serif leading-[0.95]", Tag === "h1" ? "text-4xl sm:text-6xl lg:text-7xl" : "text-3xl sm:text-5xl lg:text-6xl")}>
        {title}
        {italic && (
          <>
            <br />
            <span className="font-serif-italic text-foreground/55">{italic}</span>
          </>
        )}
      </Tag>
      {children && <div className={cn("mt-5 text-base sm:text-lg text-foreground/70 leading-relaxed", align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl")}>{children}</div>}
    </div>
  );
}
