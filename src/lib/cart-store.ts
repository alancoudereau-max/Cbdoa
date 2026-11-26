"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { onOrderEntry, priceCart } from "@/lib/pricing";

export type CartLine = {
  sku: string;
  slug: string;
  name: string;
  variantLabel: string; // « Force 2 · 10 g »
  format: string;
  grams: number;
  /** Prix catalogue du format. Le prix payé peut être plus bas : tarif dégressif, calculé par `priceCart`. */
  unitPriceCents: number;
  /** Prix de base au gramme des références au tarif dégressif (force Maxi) */
  perGramCents?: number;
  image: string;
  quantity: number;
  force: 1 | 2 | 3 | "maxi";
};

/** Prix du jour de chaque format, envoyé par le serveur : [prix catalogue, prix de base au gramme ou 0]. */
export type CartCatalog = Record<string, [number, number]>;

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  promoCode: string | null;
  hydrated: boolean;
  /** Dernier article ajouté (non conservé) : le panier le met en évidence à l'ouverture. */
  lastAdded: { sku: string; at: number } | null;
  add: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  remove: (sku: string) => void;
  setQuantity: (sku: string, quantity: number) => void;
  /** Remet un panier enregistré d'accord avec le catalogue : prix du jour, formats retirés de la vente écartés. */
  sync: (catalog: CartCatalog) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
  setPromoCode: (code: string | null) => void;
  setHydrated: (v: boolean) => void;
};

export const MAX_QTY_PER_LINE = 20;

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      isOpen: false,
      promoCode: null,
      hydrated: false,
      lastAdded: null,
      add: (line, quantity = 1) =>
        set((state) => {
          const existing = state.lines.find((l) => l.sku === line.sku);
          const lines = existing
            ? state.lines.map((l) =>
                l.sku === line.sku ? { ...l, quantity: Math.min(MAX_QTY_PER_LINE, l.quantity + quantity) } : l,
              )
            : [...state.lines, { ...line, quantity: Math.min(MAX_QTY_PER_LINE, quantity) }];
          return { lines, isOpen: true, lastAdded: { sku: line.sku, at: Date.now() } };
        }),
      remove: (sku) => set((state) => ({ lines: state.lines.filter((l) => l.sku !== sku) })),
      setQuantity: (sku, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((l) => l.sku !== sku)
              : state.lines.map((l) => (l.sku === sku ? { ...l, quantity: Math.min(MAX_QTY_PER_LINE, quantity) } : l)),
        })),
      sync: (catalog) =>
        set((state) => {
          let changed = false;
          const lines = state.lines.flatMap((l) => {
            // Les références sur commande ne sont pas dans la liste du serveur : leur prix se relit dans la table des tarifs.
            const ref = catalog[l.sku] ?? onOrderEntry(l.sku);
            if (!ref) {
              changed = true;
              return [];
            }
            const [unitPriceCents, perGram] = ref;
            const perGramCents = perGram || undefined;
            if (l.unitPriceCents === unitPriceCents && l.perGramCents === perGramCents) return [l];
            changed = true;
            return [{ ...l, unitPriceCents, perGramCents }];
          });
          return changed ? { lines } : state;
        }),
      clear: () => set({ lines: [], promoCode: null }),
      setOpen: (isOpen) => set({ isOpen }),
      setPromoCode: (promoCode) => set({ promoCode }),
      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: "cbdoux-cart-v2",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ lines: s.lines, promoCode: s.promoCode }),
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    },
  ),
);

/** Sous-total du panier, tarif dégressif compris. */
export function cartSubtotalCents(lines: CartLine[]): number {
  return priceCart(lines).subtotalCents;
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((s, l) => s + l.quantity, 0);
}
