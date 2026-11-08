import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export type Crumb = { name: string; path: string };

export function Breadcrumbs({ items, className = "" }: { items: Crumb[]; className?: string }) {
  const all: Crumb[] = [{ name: "Accueil", path: "/" }, ...items];
  return (
    <nav aria-label="Fil d'Ariane" className={`text-xs text-foreground/55 ${className}`}>
      <JsonLd data={breadcrumbJsonLd(all)} />
      <ol className="flex flex-wrap items-center gap-1.5">
        {all.map((c, i) => {
          const last = i === all.length - 1;
          return (
            <li key={c.path} className="inline-flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className="text-foreground/80 truncate max-w-[60vw]">
                  {c.name}
                </span>
              ) : (
                <Link href={c.path} className="hover:text-gold transition-colors">
                  {c.name}
                </Link>
              )}
              {!last && <ChevronRight size={12} className="text-foreground/30" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
