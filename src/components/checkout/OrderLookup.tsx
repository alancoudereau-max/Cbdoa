"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { OrderStatusView } from "@/components/checkout/OrderStatusView";

export function OrderLookup({ initialNumber, initialEmail }: { initialNumber?: string; initialEmail?: string }) {
  const [number, setNumber] = useState(initialNumber ?? "");
  const [email, setEmail] = useState(initialEmail ?? "");
  const [query, setQuery] = useState<{ number: string; email: string } | null>(initialNumber && initialEmail ? { number: initialNumber, email: initialEmail } : null);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setQuery({ number: number.trim().toUpperCase(), email: email.trim() });
        }}
        className="grid sm:grid-cols-[1fr_1fr_auto] gap-3 rounded-3xl border border-foreground/10 bg-card/40 p-5"
      >
        <label className="block">
          <span className="block text-sm font-medium mb-1.5">Numéro de commande</span>
          <input className="input-dark uppercase" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="CBD-261108-ABCD" required />
        </label>
        <label className="block">
          <span className="block text-sm font-medium mb-1.5">Email</span>
          <input type="email" className="input-dark" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.fr" required />
        </label>
        <button type="submit" className="btn-gold self-end inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold">
          <Search size={16} /> Rechercher
        </button>
      </form>
      {query && <OrderStatusView key={`${query.number}-${query.email}`} number={query.number} email={query.email} mode="suivi" />}
    </div>
  );
}
