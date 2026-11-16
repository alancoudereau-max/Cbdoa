"use client";

import { Fragment, Suspense, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

/** Données minimales d'un produit pour filtrer côté navigateur (la carte elle-même est rendue par le serveur). */
export type CatalogEntry = { slug: string; category: string; text: string; hasMaxi: boolean; hasDoux: boolean; minPrice: number };
export type CatalogGroup = { key: string; slug: string; name: string; slugs: string[] };

type Params = { q: string; categorie: string; force: string; tri: string };
const EMPTY: Params = { q: "", categorie: "", force: "", tri: "" };

/**
 * Lit les paramètres d'URL (?q=, ?force=, ?tri=, ?categorie=) sans rendre la page dynamique :
 * ce composant est le seul à dépendre de l'URL, le catalogue reste une page statique complète
 * (tous les produits sont dans le HTML livré aux moteurs de recherche).
 */
function ParamsReader({ onChange }: { onChange: (p: Params) => void }) {
  const sp = useSearchParams();
  const key = sp.toString();
  useEffect(() => {
    const u = new URLSearchParams(key);
    onChange({ q: u.get("q") ?? "", categorie: u.get("categorie") ?? "", force: u.get("force") ?? "", tri: u.get("tri") ?? "" });
  }, [key, onChange]);
  return null;
}

export function BoutiqueCatalog({
  heading,
  entries,
  groups,
  cards,
}: {
  /** Titre de la page (rendu serveur) affiché à gauche du champ de recherche */
  heading: ReactNode;
  entries: CatalogEntry[];
  groups: CatalogGroup[];
  /** Cartes produit déjà rendues par le serveur, indexées par identifiant */
  cards: Record<string, ReactNode>;
}) {
  const router = useRouter();
  const [params, setParams] = useState<Params>(EMPTY);
  const [query, setQuery] = useState("");

  // L'URL fait foi : quand elle change (lien, retour arrière), le champ de recherche suit.
  useEffect(() => setQuery(params.q), [params.q]);

  const q = query.trim().toLowerCase();
  const cat = groups.find((g) => g.key === params.categorie)?.key;
  let list = entries;
  if (cat) list = list.filter((e) => e.category === cat);
  if (q) list = list.filter((e) => e.text.includes(q));
  if (params.force === "maxi") list = list.filter((e) => e.hasMaxi);
  if (params.force === "doux") list = list.filter((e) => e.hasDoux);
  if (params.tri === "prix-asc") list = [...list].sort((a, b) => a.minPrice - b.minPrice);
  if (params.tri === "prix-desc") list = [...list].sort((a, b) => b.minPrice - a.minPrice);
  const filtered = Boolean(cat || q || params.force || params.tri);

  return (
    <>
      <Suspense fallback={null}>
        <ParamsReader onChange={setParams} />
      </Suspense>

      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-10">
        {heading}
        <form
          action="/boutique"
          className="relative w-full lg:max-w-sm"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            const value = query.trim();
            router.push(value ? `/boutique?q=${encodeURIComponent(value)}` : "/boutique");
          }}
        >
          <input
            type="search"
            name="q"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une variété, un arôme…"
            aria-label="Rechercher dans la boutique"
            className="input-dark pl-11"
          />
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/45" />
        </form>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-10" aria-label="Filtrer le catalogue">
        <FilterChip href="/boutique" active={!filtered}>Tout</FilterChip>
        {groups.map((g) => (
          <FilterChip key={g.key} href={`/${g.slug}`} active={cat === g.key}>
            {g.name}
          </FilterChip>
        ))}
        <span className="hidden sm:block w-px bg-foreground/10 mx-1" />
        <FilterChip href="/boutique?force=doux" active={params.force === "doux"}>Douceur · Classique</FilterChip>
        <FilterChip href="/boutique?force=maxi" active={params.force === "maxi"}>Force Maxi</FilterChip>
        <FilterChip href="/cbd-puissant">CBD puissant</FilterChip>
        <FilterChip href="/cbd-pas-cher">Petits prix</FilterChip>
        <FilterChip href="/nouveautes">Nouveautés</FilterChip>
      </div>

      {!filtered ? (
        groups.map((g) => (
          <section key={g.key} className="mb-16" id={g.slug}>
            <div className="flex items-end justify-between gap-4 mb-6">
              <h2 className="font-serif text-3xl sm:text-4xl flex items-center gap-4">
                <span className="text-gradient-gold">{g.name}</span>
                <span className="hidden sm:block h-px w-24 bg-gradient-to-r from-gold/40 to-transparent" />
              </h2>
              <Link href={`/${g.slug}`} className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold hover:underline whitespace-nowrap">
                Voir la catégorie →
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {g.slugs.map((slug) => (
                <Fragment key={slug}>{cards[slug]}</Fragment>
              ))}
            </div>
          </section>
        ))
      ) : list.length === 0 ? (
        <div className="rounded-2xl border border-foreground/10 bg-card/40 p-10 text-center mb-16">
          <p className="font-serif text-2xl mb-2">Aucun produit ne correspond{q ? ` à « ${query.trim()} »` : " à ces filtres"}.</p>
          <p className="text-sm text-foreground/60 mb-6">Essayez « citron », « résine », « huile », « hydro »… ou parcourez tout le catalogue.</p>
          <Link href="/boutique" className="btn-gold inline-flex rounded-full px-6 py-3 text-sm font-semibold">
            Voir tout le catalogue
          </Link>
        </div>
      ) : (
        <div className="mb-16">
          <p className="text-sm text-foreground/55 mb-6" aria-live="polite">
            {list.length} produit{list.length > 1 ? "s" : ""}
            {q ? ` pour « ${query.trim()} »` : ""}
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {list.map((e) => (
              <Fragment key={e.slug}>{cards[e.slug]}</Fragment>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function FilterChip({ href, active, children }: { href: string; active?: boolean; children: ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors",
        active ? "border-gold bg-gold/10 text-gold" : "border-foreground/15 text-foreground/70 hover:border-gold/50 hover:text-gold",
      )}
    >
      {children}
    </Link>
  );
}
