"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartLine = {
  sku: string;
  slug: string;
  name: string;
  variantLabel: string; // « Force 2 · 10 g »
  format: string;
  grams: number;
  unitPriceCents: number;
  image: string;
  quantity: number;
  force: 1 | 2 | 3 | "maxi";
};

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  promoCode: string | null;
  hydrated: boolean;
  add: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  remove: (sku: string) => void;
  setQuantity: (sku: string, quantity: number) => void;
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
      add: (line, quantity = 1) =>
        set((state) => {
          const existing = state.lines.find((l) => l.sku === line.sku);
          const lines = existing
            ? state.lines.map((l) =>
                l.sku === line.sku ? { ...l, quantity: Math.min(MAX_QTY_PER_LINE, l.quantity + quantity) } : l,
              )
            : [...state.lines, { ...line, quantity: Math.min(MAX_QTY_PER_LINE, quantity) }];
          return { lines, isOpen: true };
        }),
      remove: (sku) => set((state) => ({ lines: state.lines.filter((l) => l.sku !== sku) })),
      setQuantity: (sku, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((l) => l.sku !== sku)
              : state.lines.map((l) => (l.sku === sku ? { ...l, quantity: Math.min(MAX_QTY_PER_LINE, quantity) } : l)),
        })),
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

export function cartSubtotalCents(lines: CartLine[]): number {
  return lines.reduce((s, l) => s + l.unitPriceCents * l.quantity, 0);
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((s, l) => s + l.quantity, 0);
}
