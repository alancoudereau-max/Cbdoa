"use client";

import { Fragment, Suspense, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

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
  crumbs,
  heading,
  entries,
  groups,
  cards,
}: {
  /** Fil d'Ariane (rendu serveur) */
  crumbs: ReactNode;
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

      <section className="relative overflow-hidden">
        <div aria-hidden className="guilloche guilloche-orge opacity-[0.2] w-[120vw] sm:w-[860px] -right-[72vw] sm:-right-[470px] -top-[34vw] sm:-top-[250px]" />
        <div className="relative wrap pb-10 pt-7 sm:pb-12 sm:pt-9">
          {crumbs}
          <div className="mt-9 grid gap-8 sm:mt-12 lg:grid-cols-12 lg:items-end lg:gap-10">
            <div className="lg:col-span-7">{heading}</div>
            <form
              action="/boutique"
              className="relative lg:col-span-4 lg:col-start-9"
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                const value = query.trim();
                router.push(value ? `/boutique?q=${encodeURIComponent(value)}` : "/boutique");
              }}
            >
              <label htmlFor="recherche-boutique" className="field-label">
                Rechercher
              </label>
              <input id="recherche-boutique" type="search" name="q" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Une variété, un arôme…" className="field" />
            </form>
          </div>

          {/* Filtres */}
          <nav aria-label="Filtrer le catalogue" className="chip-rail mt-9">
            <FilterChip href="/boutique" active={!filtered}>
              Tout
            </FilterChip>
            {groups.map((g) => (
              <FilterChip key={g.key} href={`/${g.slug}`} active={cat === g.key}>
                {g.name}
              </FilterChip>
            ))}
            <FilterChip href="/boutique?force=doux" active={params.force === "doux"}>
              Force Classique
            </FilterChip>
            <FilterChip href="/boutique?force=maxi" active={params.force === "maxi"}>
              Force Maxi
            </FilterChip>
            <FilterChip href="/cbd-puissant">CBD puissant</FilterChip>
            <FilterChip href="/cbd-pas-cher">Petits prix</FilterChip>
            <FilterChip href="/nouveautes">Nouveautés</FilterChip>
          </nav>
        </div>
      </section>

      <div className="wrap pb-6">
        {!filtered ? (
          groups.map((g) => (
            <section key={g.key} className="border-t border-foreground/15 py-12 sm:py-16" id={g.slug}>
              <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-3">
                <h2 className="t-h2">{g.name}</h2>
                <Link href={`/${g.slug}`} className="link whitespace-nowrap">
                  Voir tout le rayon
                </Link>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 lg:grid-cols-4 lg:gap-6">
                {g.slugs.map((slug) => (
                  <Fragment key={slug}>{cards[slug]}</Fragment>
                ))}
              </div>
            </section>
          ))
        ) : list.length === 0 ? (
          <div className="border-t border-foreground/15 py-16">
            <p className="t-h3">Aucun produit ne correspond{q ? ` à « ${query.trim()} »` : " à ces filtres"}.</p>
            <p className="mt-3 text-foreground/75">Essayez « citron », « résine », « huile » ou « hydro », ou parcourez tout le catalogue.</p>
            <Link href="/boutique" className="btn btn-primary mt-7">
              Voir tout le catalogue
            </Link>
          </div>
        ) : (
          <div className="border-t border-foreground/15 py-12 sm:py-16">
            <p className="text-foreground/75" aria-live="polite">
              {list.length} produit{list.length > 1 ? "s" : ""}
              {q ? ` pour « ${query.trim()} »` : ""}
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
              {list.map((e) => (
                <Fragment key={e.slug}>{cards[e.slug]}</Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function FilterChip({ href, active, children }: { href: string; active?: boolean; children: ReactNode }) {
  return (
    <Link href={href} data-active={active ? "true" : undefined} className="choice choice-pill px-4 py-2 text-[0.9375rem]">
      {children}
    </Link>
  );
}
