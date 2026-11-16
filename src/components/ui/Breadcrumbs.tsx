import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export type Crumb = { name: string; path: string };

export function Breadcrumbs({ items, className = "" }: { items: Crumb[]; className?: string }) {
  const all: Crumb[] = [{ name: "Accueil", path: "/" }, ...items];
  return (
    <nav aria-label="Fil d'Ariane" className={`text-[0.8125rem] text-foreground/65 ${className}`}>
      <JsonLd data={breadcrumbJsonLd(all)} />
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {all.map((c, i) => {
          const last = i === all.length - 1;
          return (
            <li key={c.path} className="inline-flex min-w-0 items-center gap-2">
              {last ? (
                <span aria-current="page" className="max-w-[62vw] truncate text-foreground/90">
                  {c.name}
                </span>
              ) : (
                <Link href={c.path} className="transition-colors hover:text-foreground">
                  {c.name}
                </Link>
              )}
              {!last && <span aria-hidden className="text-foreground/35">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
