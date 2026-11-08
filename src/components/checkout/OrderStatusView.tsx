"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Clock, XCircle, Truck, Package, MessageCircle, Loader2, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { site } from "@/data/site";
import { formatEUR, formatDateFR } from "@/lib/utils";

export type PublicOrder = {
  number: string;
  status: string;
  statusLabel: string;
  createdAt: string;
  paidAt: string | null;
  shippedAt: string | null;
  shippingMethod: string;
  trackingNumber: string | null;
  trackingUrl: string | null;
  pickupPoint: string | null;
  totalCents: number;
  shippingCents: number;
  discountCents: number;
  subtotalCents: number;
  items: Array<{ name: string; variantLabel: string; quantity: number; totalCents: number }>;
};

const PENDING = ["pending"];
const OK = ["paid", "preparing", "shipped", "ready_for_pickup", "delivered", "awaiting_pickup_payment"];
const KO = ["failed", "cancelled", "expired", "refunded"];

export function OrderStatusView({ number, email, mode }: { number: string; email: string; mode: "confirmation" | "suivi" }) {
  const [order, setOrder] = useState<PublicOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tries, setTries] = useState(0);
  const clear = useCart((s) => s.clear);
  const cleared = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/order-lookup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ number, email }) });
        const data = (await res.json()) as { order?: PublicOrder; error?: string };
        if (cancelled) return;
        if (data.order) setOrder(data.order);
        else setError(data.error ?? "Commande introuvable.");
      } catch {
        if (!cancelled) setError("Connexion impossible.");
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [number, email, tries]);

  // Le webhook Mollie peut arriver quelques secondes après la redirection : on re-vérifie
  useEffect(() => {
    if (!order || !PENDING.includes(order.status) || tries >= 10) return;
    const t = setTimeout(() => setTries((n) => n + 1), 3000);
    return () => clearTimeout(t);
  }, [order, tries]);

  // Paiement confirmé → on vide le panier (une seule fois)
  useEffect(() => {
    if (mode === "confirmation" && order && OK.includes(order.status) && !cleared.current) {
      cleared.current = true;
      clear();
    }
  }, [order, mode, clear]);

  if (error) {
    return (
      <div className="mx-auto max-w-xl px-5 py-20 text-center">
        <XCircle size={40} className="mx-auto text-red-300 mb-4" />
        <h1 className="font-serif text-3xl mb-3">{error}</h1>
        <p className="text-foreground/60 mb-6">Vérifiez le numéro de commande et l'email saisis, ou contactez-nous.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/suivi" className="btn-outline rounded-full px-6 py-3 text-sm">Réessayer</Link>
          <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"><MessageCircle size={16} /> WhatsApp</a>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-xl px-5 py-20 text-center text-foreground/60">
        <Loader2 size={32} className="mx-auto animate-spin text-gold mb-4" /> Vérification de votre commande…
      </div>
    );
  }

  const pending = PENDING.includes(order.status);
  const ok = OK.includes(order.status);
  const ko = KO.includes(order.status);

  return (
    <div className="mx-auto max-w-[800px] px-5 sm:px-8 py-12 sm:py-16">
      <div className="text-center mb-10">
        {ok && <CheckCircle2 size={48} className="mx-auto text-gold mb-4" />}
        {pending && <Clock size={48} className="mx-auto text-gold mb-4 animate-pulse" />}
        {ko && <XCircle size={48} className="mx-auto text-red-300 mb-4" />}
        <p className="kicker mb-3">Commande {order.number}</p>
        <h1 className="font-serif text-4xl sm:text-5xl mb-4">
          {ok && mode === "confirmation" && (order.status === "awaiting_pickup_payment" ? "Commande enregistrée !" : "Merci, votre commande est confirmée !")}
          {ok && mode === "suivi" && order.statusLabel}
          {pending && "Paiement en cours de confirmation…"}
          {ko && (order.status === "refunded" ? "Commande remboursée" : "Le paiement n'a pas abouti")}
        </h1>
        <p className="text-foreground/65 max-w-lg mx-auto">
          {ok && mode === "confirmation" && "Un email de confirmation vient de vous être envoyé. " }
          {ok && order.shippingMethod.toLowerCase().includes("retrait") && "Nous vous contactons sur WhatsApp pour convenir d'un rendez-vous de retrait."}
          {ok && order.shippingMethod.toLowerCase().includes("zone locale") && "Nous vous contactons sur WhatsApp pour convenir d'un créneau de livraison."}
          {ok && !order.shippingMethod.toLowerCase().includes("retrait") && !order.shippingMethod.toLowerCase().includes("zone locale") && (order.status === "shipped" || order.status === "delivered" ? "Votre colis a été expédié dans un emballage neutre." : "Votre colis sera préparé et expédié sous 24 h ouvrées dans un emballage neutre. Vous recevrez le numéro de suivi par email.")}
          {pending && "Votre banque confirme le paiement : cela prend généralement quelques secondes. Cette page se met à jour automatiquement."}
          {ko && order.status !== "refunded" && "Aucun montant n'a été débité. Vous pouvez relancer la commande depuis votre panier (il est conservé)."}
        </p>
        {pending && tries >= 10 && (
          <p className="mt-4 text-sm text-gold">La confirmation prend plus de temps que prévu. Vous recevrez un email dès validation ; en cas de doute, contactez-nous sur WhatsApp.</p>
        )}
      </div>

      {/* Suivi */}
      {(order.trackingNumber || order.trackingUrl) && (
        <div className="mb-6 rounded-2xl border border-gold/40 bg-gold/10 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <Truck size={24} className="text-gold shrink-0" />
          <div className="flex-1">
            <p className="font-medium">Colis expédié — {order.shippingMethod}</p>
            {order.trackingNumber && <p className="text-sm text-foreground/70">N° de suivi : <span className="font-mono text-gold">{order.trackingNumber}</span></p>}
          </div>
          {order.trackingUrl && (
            <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="btn-gold inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold">
              Suivre le colis <ArrowRight size={14} />
            </a>
          )}
        </div>
      )}

      {/* Détail */}
      <div className="rounded-3xl border border-foreground/10 bg-card/50 p-6 sm:p-8">
        <div className="grid sm:grid-cols-3 gap-4 text-sm mb-6">
          <div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50 mb-1">Statut</p><p className={ok ? "text-gold" : ko ? "text-red-300" : ""}>{order.statusLabel}</p></div>
          <div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50 mb-1">Date</p><p>{formatDateFR(order.createdAt, true)}</p></div>
          <div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50 mb-1">{order.pickupPoint ? "Retrait" : "Livraison"}</p><p>{order.pickupPoint ?? order.shippingMethod}</p></div>
        </div>
        <ul className="divide-y divide-foreground/10">
          {order.items.map((it, i) => (
            <li key={i} className="flex justify-between gap-4 py-3 text-sm">
              <span>
                {it.name}
                <span className="block text-[11px] text-foreground/55">{it.variantLabel} × {it.quantity}</span>
              </span>
              <span>{formatEUR(it.totalCents)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-1.5 text-sm border-t border-foreground/10 pt-4">
          <div className="flex justify-between"><dt className="text-foreground/60">Sous-total</dt><dd>{formatEUR(order.subtotalCents)}</dd></div>
          {order.discountCents > 0 && <div className="flex justify-between text-gold"><dt>Remise</dt><dd>− {formatEUR(order.discountCents)}</dd></div>}
          <div className="flex justify-between"><dt className="text-foreground/60">Livraison</dt><dd>{order.shippingCents === 0 ? "Offerte" : formatEUR(order.shippingCents)}</dd></div>
          <div className="flex justify-between items-baseline pt-2"><dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/60">Total TTC</dt><dd className="font-serif text-2xl text-gradient-gold">{formatEUR(order.totalCents)}</dd></div>
        </dl>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {ko && order.status !== "refunded" && (
          <Link href="/commande" className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold">Réessayer le paiement <ArrowRight size={14} /></Link>
        )}
        <Link href="/boutique" className="btn-outline inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm"><Package size={14} /> Continuer mes achats</Link>
        <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-outline inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm"><MessageCircle size={14} /> Une question ? WhatsApp</a>
      </div>
    </div>
  );
}
