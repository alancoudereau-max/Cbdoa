import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";
import { fr } from "@/lib/utils";

export type Crumb = { name: string; path: string };

export function Breadcrumbs({ items, className = "" }: { items: Crumb[]; className?: string }) {
  const all: Crumb[] = [{ name: "Accueil", path: "/" }, ...items];
  return (
    <nav aria-label="Fil d'Ariane" className={`text-[0.8125rem] text-foreground/65 ${className}`}>
      <JsonLd data={breadcrumbJsonLd(all)} />
      {/* une seule ligne : c'est le nom de la page en cours, en bout de fil, qui s'abrège si la place manque */}
      <ol className="flex items-center gap-x-2">
        {all.map((c, i) => {
          const last = i === all.length - 1;
          return (
            <li key={c.path} className={last ? "min-w-0" : "inline-flex shrink-0 items-center gap-2"}>
              {last ? (
                <span aria-current="page" className="block truncate text-foreground/90">
                  {fr(c.name)}
                </span>
              ) : (
                <>
                  <Link href={c.path} className="transition-colors hover:text-foreground">
                    {fr(c.name)}
                  </Link>
                  <span aria-hidden className="crumb-sep" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
