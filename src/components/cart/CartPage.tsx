"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Minus, Plus, Trash2, ShoppingBag, Truck, Lock, Package } from "lucide-react";
import { useCart, cartSubtotalCents } from "@/lib/cart-store";
import { FREE_SHIPPING_FROM_CENTS } from "@/lib/shipping";
import { formatEUR } from "@/lib/utils";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export function CartPage() {
  const { lines, hydrated, setQuantity, remove } = useCart();
  const subtotal = cartSubtotalCents(lines);
  const remaining = Math.max(0, FREE_SHIPPING_FROM_CENTS - subtotal);

  return (
    <div className="mx-auto max-w-[1100px] px-5 sm:px-8 py-10 sm:py-14">
      <Breadcrumbs items={[{ name: "Panier", path: "/panier" }]} className="mb-8" />
      <h1 className="font-serif text-4xl sm:text-6xl mb-10">
        Votre <span className="font-serif-italic text-gradient-gold">panier</span>
      </h1>

      {!hydrated ? (
        <p className="text-foreground/50">Chargement…</p>
      ) : lines.length === 0 ? (
        <div className="rounded-3xl border border-foreground/10 bg-card/40 p-12 text-center">
          <ShoppingBag size={40} className="mx-auto text-gold/50 mb-4" />
          <p className="font-serif text-2xl mb-2">Votre panier est vide.</p>
          <p className="text-sm text-foreground/60 mb-6">Fleurs, résines, huiles, vape : découvrez la sélection CBDoux.</p>
          <Link href="/boutique" className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold">
            Voir la boutique <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-8">
          <ul className="lg:col-span-8 space-y-3">
            {lines.map((l) => (
              <li key={l.sku} className="flex gap-4 rounded-2xl border border-foreground/10 bg-card/50 p-4">
                <Link href={`/produit/${l.slug}`} className="relative shrink-0 overflow-hidden rounded-xl bg-black/40" style={{ width: 96, height: 96 }}>
                  <Image src={l.image} alt={l.name} fill sizes="96px" className="object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/produit/${l.slug}`} className="font-serif text-xl leading-tight hover:text-gold">{l.name}</Link>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-gold mt-1">{l.variantLabel}</p>
                  <p className="text-sm text-foreground/70 mt-1">{formatEUR(l.unitPriceCents)} l'unité</p>
                  <div className="mt-3 flex items-center gap-4">
                    <div className="inline-flex items-center rounded-full border border-foreground/15">
                      <button type="button" onClick={() => setQuantity(l.sku, l.quantity - 1)} aria-label="Diminuer" className="h-9 w-9 flex items-center justify-center hover:text-gold"><Minus size={13} /></button>
                      <span className="w-7 text-center text-sm font-mono">{l.quantity}</span>
                      <button type="button" onClick={() => setQuantity(l.sku, l.quantity + 1)} aria-label="Augmenter" className="h-9 w-9 flex items-center justify-center hover:text-gold"><Plus size={13} /></button>
                    </div>
                    <button type="button" onClick={() => remove(l.sku)} className="inline-flex items-center gap-1.5 text-xs text-foreground/50 hover:text-danger">
                      <Trash2 size={13} /> Retirer
                    </button>
                  </div>
                </div>
                <p className="font-serif text-xl text-gold whitespace-nowrap">{formatEUR(l.unitPriceCents * l.quantity)}</p>
              </li>
            ))}
          </ul>

          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28 rounded-3xl border border-gold/25 bg-card/60 p-6">
              <h2 className="font-serif text-2xl mb-5">Récapitulatif</h2>
              <div className="flex items-baseline justify-between text-sm mb-2">
                <span className="text-foreground/65">Sous-total</span>
                <span>{formatEUR(subtotal)}</span>
              </div>
              <div className="flex items-baseline justify-between text-sm mb-4">
                <span className="text-foreground/65">Livraison</span>
                <span className="text-foreground/65">{remaining === 0 ? <span className="text-gold">Colissimo offert</span> : "calculée à l'étape suivante"}</span>
              </div>
              {remaining > 0 && (
                <p className="rounded-xl bg-gold/10 border border-gold/30 px-3 py-2 text-xs text-foreground/80 mb-4 flex items-center gap-2">
                  <Truck size={14} className="text-gold shrink-0" /> Plus que <strong className="text-gold">{formatEUR(remaining)}</strong> pour le port Colissimo offert.
                </p>
              )}
              <div className="flex items-baseline justify-between border-t border-foreground/10 pt-4 mb-5">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/60">Total estimé</span>
                <span className="font-serif text-3xl text-gradient-gold">{formatEUR(subtotal)}</span>
              </div>
              <Link href="/commande" className="btn-gold w-full inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold">
                Finaliser ma commande <ArrowRight size={16} />
              </Link>
              <ul className="mt-5 space-y-2 text-[11px] text-foreground/55">
                <li className="flex items-center gap-2"><Lock size={12} className="text-gold" /> Commande envoyée sur WhatsApp, paiement par lien sécurisé CB</li>
                <li className="flex items-center gap-2"><Package size={12} className="text-gold" /> Colis neutre, expédié sous 24 h ouvrées</li>
                <li className="flex items-center gap-2"><Truck size={12} className="text-gold" /> Code BIENVENUE10 : 10 € offerts dès 100 €</li>
              </ul>
              <Link href="/boutique" className="mt-4 block text-center text-xs text-foreground/60 hover:text-gold">
                ← Continuer mes achats
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
