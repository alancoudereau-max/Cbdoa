"use client";

import Link from "next/link";
import Image from "next/image";
import { labelImage } from "@/lib/etiquettes";
import { useEffect, useRef } from "react";
import { X, Minus, Plus } from "lucide-react";
import { useCart, type CartCatalog } from "@/lib/cart-store";
import { priceCart, QUOTE_FROM_GRAMS } from "@/lib/pricing";
import { FREE_SHIPPING_FROM_CENTS } from "@/lib/shipping";
import { site } from "@/data/site";
import { formatEUR, commas, fr } from "@/lib/utils";
import type { CartSuggestion } from "@/lib/suggestions";

/** En dessous de ce reste à atteindre, le panier propose un petit format pour gagner le port offert. */
const SUGGEST_WITHIN_CENTS = 1200;

/** Une idée d'ajout : vignette, nom, format et prix, bouton « Ajouter ». */
function Idea({ s, onAdd, focusable }: { s: CartSuggestion; onAdd: () => void; focusable: boolean }) {
  return (
    <li className="flex items-center gap-3 rounded-[3px] border border-foreground/20 p-2">
      <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-[2px] bg-[#e9dfc6]">
        <Image src={labelImage(s.image)} alt="" fill sizes="44px" className="object-cover" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[0.9375rem] font-medium leading-tight">{s.name}</span>
        <span className="t-num mt-0.5 block text-[0.8125rem] text-foreground/70">
          {fr(s.format)}, {formatEUR(s.unitPriceCents)}
        </span>
      </span>
      <button type="button" onClick={onAdd} aria-label={`Ajouter ${s.name}, ${s.format}, au panier`} className="btn btn-ghost btn-sm shrink-0" tabIndex={focusable ? 0 : -1}>
        Ajouter
      </button>
    </li>
  );
}

export function CartDrawer({ suggestions = [], catalog }: { suggestions?: CartSuggestion[]; catalog?: CartCatalog }) {
  const { lines, isOpen, setOpen, setQuantity, remove, add, lastAdded, hydrated, sync } = useCart();
  const list = useRef<HTMLUListElement>(null);
  // Tarif dégressif compris : les lignes d'une même référence en force Maxi s'additionnent.
  const cart = priceCart(lines);
  const subtotal = cart.subtotalCents;
  const remaining = Math.max(0, FREE_SHIPPING_FROM_CENTS - subtotal);
  // Deux idées au plus, parmi ce qui n'est pas déjà au panier : de préférence celles qui suffisent à elles seules
  // (les moins chères d'abord), sinon les premières du catalogue.
  const candidates = remaining > 0 && remaining <= SUGGEST_WITHIN_CENTS ? suggestions.filter((s) => !lines.some((l) => l.slug === s.slug)) : [];
  const enough = candidates.filter((s) => s.unitPriceCents >= remaining).sort((x, y) => x.unitPriceCents - y.unitPriceCents);
  const oneIsEnough = enough.length > 0;
  const picks = (oneIsEnough ? enough : candidates).slice(0, 2);
  const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_FROM_CENTS) * 100));
  // Panier vide : les trois premiers petits formats du catalogue, pour ne pas laisser le panneau nu.
  const starters = lines.length === 0 ? suggestions.slice(0, 3) : [];

  // Un panier resté dans le navigateur reprend les prix du jour ; un format retiré de la vente en sort.
  useEffect(() => {
    if (hydrated && catalog) sync(catalog);
  }, [hydrated, catalog, sync]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, setOpen]);

  // L'article qu'on vient d'ajouter : amené à l'écran s'il est plus bas dans la liste, et souligné d'un reflet doré.
  useEffect(() => {
    if (!lastAdded) return;
    const line = Array.from(list.current?.children ?? []).find((li) => (li as HTMLElement).dataset.sku === lastAdded.sku) as HTMLElement | undefined;
    if (!line) return;
    line.scrollIntoView({ block: "nearest" });
    line.removeAttribute("data-fresh");
    void line.offsetWidth; // relance l'animation si le même article est ajouté deux fois de suite
    line.setAttribute("data-fresh", "");
    const t = setTimeout(() => line.removeAttribute("data-fresh"), 2000);
    return () => clearTimeout(t);
  }, [lastAdded]);

  return (
    <div className={isOpen ? "fixed inset-0 z-[90]" : "pointer-events-none fixed inset-0 z-[90]"} aria-hidden={!isOpen}>
      <div onClick={() => setOpen(false)} className={`absolute inset-0 bg-nuit/75 transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0"}`} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Votre panier"
        className={`nuit absolute right-0 top-0 flex h-full w-full flex-col shadow-deep transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:max-w-[27rem] ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
          <div>
            <h2 className="t-h3">Votre panier</h2>
            <p className="t-fine mt-1">{lines.length === 0 ? "Vide pour le moment" : `${lines.length} référence${lines.length > 1 ? "s" : ""}`}</p>
          </div>
          <button type="button" onClick={() => setOpen(false)} aria-label="Fermer le panier" className="btn-round" tabIndex={isOpen ? 0 : -1}>
            <X aria-hidden size={18} strokeWidth={1.5} />
          </button>
        </div>
        <div aria-hidden className="rule-double" />

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col overflow-y-auto px-5 pb-6 sm:px-6">
            <div className="flex flex-1 flex-col items-start justify-center py-10">
              <p className="t-h3">Votre panier est vide.</p>
              <p className="mt-3 text-foreground/75">Fleurs, résines, huiles, vape : découvrez la sélection CBDoux.</p>
              <Link href="/boutique" onClick={() => setOpen(false)} className="btn btn-primary mt-7" tabIndex={isOpen ? 0 : -1}>
                Voir la boutique
              </Link>
            </div>
            {starters.length > 0 && (
              <div className="border-t border-foreground/20 pt-5">
                <p className="t-fine">Pour commencer, un gramme en force Classique :</p>
                <ul className="cart-starters mt-2.5 grid gap-2">
                  {starters.map((s) => (
                    <Idea key={s.sku} s={s} onAdd={() => add(s)} focusable={isOpen} />
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Port offert */}
            <div className="px-5 py-4 sm:px-6">
              <p className="text-[0.875rem]">
                {remaining > 0 ? (
                  <>
                    Plus que <strong className="t-num">{formatEUR(remaining)}</strong> pour le port offert.
                  </>
                ) : (
                  <strong>Port Colissimo offert.</strong>
                )}
              </p>
              <div className="jauge mt-3" data-full={remaining === 0} role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Progression vers le port offert">
                <span style={{ width: `${progress}%` }} />
              </div>
              {picks.length > 0 && (
                <div className="mt-4">
                  <p className="t-fine">{oneIsEnough ? "Un gramme de plus, et le port est offert :" : "Une idée pour vous en approcher :"}</p>
                  <ul className="cart-ideas mt-2 grid gap-2">
                    {picks.map((s) => (
                      <Idea key={s.sku} s={s} onAdd={() => add(s)} focusable={isOpen} />
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <ul ref={list} className="flex-1 overflow-y-auto px-5 sm:px-6">
              {cart.lines.map((l) => (
                <li key={l.sku} data-sku={l.sku} className="cart-line flex gap-4 border-t border-foreground/20 py-4">
                  <Link href={`/produit/${l.slug}`} onClick={() => setOpen(false)} className="relative h-[4.75rem] w-[4.75rem] shrink-0 overflow-hidden rounded-[3px] bg-[#e9dfc6]" tabIndex={isOpen ? 0 : -1}>
                    <Image src={labelImage(l.image)} alt={l.name} fill sizes="76px" className="object-cover" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="font-serif text-[1.125rem] leading-snug">{l.name}</p>
                      <p className="t-num whitespace-nowrap font-medium">{formatEUR(l.totalCents)}</p>
                    </div>
                    <p className="t-fine mt-0.5">{commas(l.variantLabel)}</p>
                    {l.bulkPercent > 0 && <p className="t-fine t-num text-or">{fr(`Prix dégressif : −${l.bulkPercent} %`)}</p>}
                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-foreground/30">
                        <button type="button" onClick={() => setQuantity(l.sku, l.quantity - 1)} aria-label="Diminuer la quantité" className="flex h-9 w-9 items-center justify-center" tabIndex={isOpen ? 0 : -1}>
                          <Minus aria-hidden size={13} />
                        </button>
                        <span className="t-num w-6 text-center text-[0.9375rem]" aria-live="polite">
                          {l.quantity}
                        </span>
                        <button type="button" onClick={() => setQuantity(l.sku, l.quantity + 1)} aria-label="Augmenter la quantité" className="flex h-9 w-9 items-center justify-center" tabIndex={isOpen ? 0 : -1}>
                          <Plus aria-hidden size={13} />
                        </button>
                      </div>
                      <button type="button" onClick={() => remove(l.sku)} className="link text-[0.875rem]" tabIndex={isOpen ? 0 : -1}>
                        Retirer
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div aria-hidden className="rule-double" />
            <div className="space-y-4 p-5 sm:p-6">
              {cart.quotes.map((q) => {
                const name = lines.find((l) => l.slug === q.slug)?.name ?? "";
                return (
                  <p key={q.slug} className="rounded-[3px] border border-or/50 px-3.5 py-3 text-[0.875rem] leading-snug">
                    {fr(`${q.grams} g de ${name} : à partir de ${QUOTE_FROM_GRAMS} g, le prix se négocie.`)}{" "}
                    <a href={`${site.whatsapp}?text=${encodeURIComponent(`Bonjour CBDoux, je souhaite un prix pour ${q.grams} g de ${name.replace(/\s+[—–-]\s+/g, " ")}.`)}`} target="_blank" rel="noopener noreferrer" className="link" tabIndex={isOpen ? 0 : -1}>
                      Nous écrire sur WhatsApp
                    </a>
                  </p>
                );
              })}
              <div className="flex items-baseline justify-between">
                <span>Sous-total</span>
                <span className="t-num font-serif text-[2rem] font-light leading-none tracking-[-0.02em]">{formatEUR(subtotal)}</span>
              </div>
              <p className="t-fine">Frais de port indiqués à l'étape suivante. Votre récapitulatif nous est envoyé sur WhatsApp ; paiement par lien sécurisé après confirmation.</p>
              <Link href="/commande" onClick={() => setOpen(false)} className="btn btn-primary w-full" tabIndex={isOpen ? 0 : -1}>
                Finaliser ma commande
              </Link>
              <Link href="/panier" onClick={() => setOpen(false)} className="link drawer-detail text-[0.9375rem]" tabIndex={isOpen ? 0 : -1}>
                Voir le panier détaillé
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
