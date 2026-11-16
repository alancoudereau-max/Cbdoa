"use client";

import { useCart, cartCount } from "@/lib/cart-store";

export function CartButton() {
  const lines = useCart((s) => s.lines);
  const hydrated = useCart((s) => s.hydrated);
  const setOpen = useCart((s) => s.setOpen);
  const count = hydrated ? cartCount(lines) : 0;
  return (
    <button type="button" onClick={() => setOpen(true)} aria-label={`Ouvrir le panier (${count} article${count > 1 ? "s" : ""})`} className="btn-round relative">
      <svg aria-hidden width="17" height="18" viewBox="0 0 17 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round">
        <path d="M1.5 5.5h14l-1 11h-12zM5.5 5.5v-1a3 3 0 0 1 6 0v1" />
      </svg>
      {count > 0 && (
        <span className="t-num absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-or px-1 text-[0.6875rem] font-semibold leading-none text-nuit">{count}</span>
      )}
    </button>
  );
}
