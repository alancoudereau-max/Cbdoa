"use client";

import { ShoppingBag } from "lucide-react";
import { useCart, cartCount } from "@/lib/cart-store";

export function CartButton() {
  const lines = useCart((s) => s.lines);
  const hydrated = useCart((s) => s.hydrated);
  const setOpen = useCart((s) => s.setOpen);
  const count = hydrated ? cartCount(lines) : 0;
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={`Ouvrir le panier (${count} article${count > 1 ? "s" : ""})`}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-foreground/20 hover:border-gold hover:text-gold transition-colors"
    >
      <ShoppingBag size={16} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-gold text-background text-[10px] font-mono font-bold flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
}
