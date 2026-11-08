"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck } from "lucide-react";
import { useCart, cartSubtotalCents } from "@/lib/cart-store";
import { FREE_SHIPPING_FROM_CENTS } from "@/lib/shipping";
import { formatEUR } from "@/lib/utils";

export function CartDrawer() {
  const { lines, isOpen, setOpen, setQuantity, remove } = useCart();
  const subtotal = cartSubtotalCents(lines);
  const remaining = Math.max(0, FREE_SHIPPING_FROM_CENTS - subtotal);
  const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_FROM_CENTS) * 100));

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

  return (
    <div className={isOpen ? "fixed inset-0 z-[90]" : "pointer-events-none fixed inset-0 z-[90]"} aria-hidden={!isOpen}>
      <div
        onClick={() => setOpen(false)}
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Votre panier"
        className={`absolute right-0 top-0 h-full w-full sm:max-w-md bg-background border-l border-foreground/10 flex flex-col shadow-deep transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-foreground/10">
          <div>
            <h2 className="font-serif text-2xl">Votre panier</h2>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/55 mt-0.5">
              {lines.length === 0 ? "Vide pour le moment" : `${lines.length} référence${lines.length > 1 ? "s" : ""}`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fermer le panier"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15 hover:border-gold hover:text-gold"
          >
            <X size={18} />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
            <ShoppingBag size={36} className="text-gold/50 mb-4" />
            <p className="text-foreground/75 mb-1">Votre panier est vide.</p>
            <p className="text-sm text-foreground/50 mb-6">Fleurs, résines, huiles, vape : découvrez la sélection CBDoux.</p>
            <Link href="/boutique" onClick={() => setOpen(false)} className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold">
              Voir la boutique <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <>
            {/* Barre port offert */}
            <div className="px-5 py-3 border-b border-foreground/10 bg-card/40">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="inline-flex items-center gap-1.5 text-foreground/75">
                  <Truck size={13} className="text-gold" />
                  {remaining > 0 ? (
                    <>
                      Plus que <strong className="text-gold">{formatEUR(remaining)}</strong> pour le port offert
                    </>
                  ) : (
                    <strong className="text-gold">Port offert (Colissimo) 🎉</strong>
                  )}
                </span>
                <span className="font-mono text-[10px] text-foreground/45">{progress}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-foreground/10 overflow-hidden">
                <div className="h-full bg-gradient-gold transition-[width] duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <ul className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {lines.map((l) => (
                <li key={l.sku} className="flex gap-3 rounded-xl border border-foreground/10 bg-card/50 p-3">
                  <Link href={`/produit/${l.slug}`} onClick={() => setOpen(false)} className="relative h-18 w-18 shrink-0 overflow-hidden rounded-lg bg-black/40" style={{ width: 72, height: 72 }}>
                    <Image src={l.image} alt={l.name} fill sizes="72px" className="object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-base leading-tight truncate">{l.name}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-gold mt-0.5">{l.variantLabel}</p>
                    <p className="text-sm text-foreground/75 mt-1">{formatEUR(l.unitPriceCents)}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-foreground/15">
                        <button type="button" onClick={() => setQuantity(l.sku, l.quantity - 1)} aria-label="Diminuer la quantité" className="h-8 w-8 flex items-center justify-center hover:text-gold">
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center text-sm font-mono" aria-live="polite">{l.quantity}</span>
                        <button type="button" onClick={() => setQuantity(l.sku, l.quantity + 1)} aria-label="Augmenter la quantité" className="h-8 w-8 flex items-center justify-center hover:text-gold">
                          <Plus size={12} />
                        </button>
                      </div>
                      <button type="button" onClick={() => remove(l.sku)} aria-label="Retirer du panier" className="text-foreground/50 hover:text-danger p-1">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="font-serif text-lg text-gold whitespace-nowrap">{formatEUR(l.unitPriceCents * l.quantity)}</div>
                </li>
              ))}
            </ul>

            <div className="border-t border-foreground/10 p-5 space-y-3 bg-background">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/60">Sous-total</span>
                <span className="font-serif text-3xl text-gradient-gold">{formatEUR(subtotal)}</span>
              </div>
              <p className="text-[11px] text-foreground/50">Frais de port calculés à l'étape suivante. Paiement sécurisé par carte, Apple Pay ou Google Pay.</p>
              <Link
                href="/commande"
                onClick={() => setOpen(false)}
                className="btn-gold w-full inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold"
              >
                Commander <ArrowRight size={16} />
              </Link>
              <Link href="/panier" onClick={() => setOpen(false)} className="block text-center text-xs text-foreground/60 hover:text-gold py-1">
                Voir le panier détaillé
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
