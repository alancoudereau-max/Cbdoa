"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, AlertTriangle, Check, ShieldAlert } from "lucide-react";
import { type Product, type Variant, forceLabels, type TierKey } from "@/data/products";
import { useCart } from "@/lib/cart-store";
import { formatEUR, cn } from "@/lib/utils";
import { ForceBadge } from "@/components/ui/ForceBadge";

const ACK_KEY = "cbdoux-prudence-ack";

export function AddToCart({ product, availability }: { product: Product; availability: Record<string, boolean> }) {
  const add = useCart((s) => s.add);
  const tiers = useMemo(() => {
    const seen = new Map<TierKey, Variant[]>();
    product.variants.forEach((v) => {
      seen.set(v.tier, [...(seen.get(v.tier) ?? []), v]);
    });
    return Array.from(seen.entries());
  }, [product]);

  const [tier, setTier] = useState<TierKey>(tiers[0][0]);
  const formats = tiers.find(([k]) => k === tier)?.[1] ?? [];
  const [sku, setSku] = useState<string>(formats[0]?.sku);
  const [qty, setQty] = useState(1);
  const [ack, setAck] = useState(false);
  const [ackLoaded, setAckLoaded] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    try {
      setAck(localStorage.getItem(ACK_KEY) === "1");
    } catch {
      /* ignore */
    }
    setAckLoaded(true);
  }, []);

  useEffect(() => {
    const first = tiers.find(([k]) => k === tier)?.[1][0];
    if (first && !formats.some((f) => f.sku === sku)) setSku(first.sku);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tier]);

  const variant = product.variants.find((v) => v.sku === sku) ?? product.variants[0];
  const available = availability[variant.sku] !== false;
  const strong = variant.force === 3 || variant.force === "maxi";
  const needsAck = strong && !ack;
  const perGram = variant.grams > 1 && /g$/.test(variant.format) ? variant.priceCents / variant.grams : null;

  const onAdd = () => {
    if (!available || needsAck) return;
    add(
      {
        sku: variant.sku,
        slug: product.slug,
        name: product.name,
        variantLabel: `${variant.tierLabel} · ${variant.format}`,
        format: variant.format,
        grams: variant.grams,
        unitPriceCents: variant.priceCents,
        image: product.image,
        force: variant.force,
      },
      qty,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const onAck = (checked: boolean) => {
    setAck(checked);
    try {
      if (checked) localStorage.setItem(ACK_KEY, "1");
      else localStorage.removeItem(ACK_KEY);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="rounded-2xl border border-gold/25 bg-card/60 overflow-hidden">
      {/* Choix de la force */}
      {tiers.length > 1 && (
        <div className="px-5 pt-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/55 mb-2.5">Force</p>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Force">
            {tiers.map(([key, vs]) => {
              const f = vs[0].force;
              const active = key === tier;
              return (
                <button
                  key={key}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setTier(key)}
                  className={cn(
                    "rounded-full border px-3.5 py-2 text-sm transition-colors",
                    active ? "border-gold bg-gold/10 text-gold" : "border-foreground/15 text-foreground/75 hover:border-foreground/40",
                  )}
                >
                  {forceLabels[f].label}
                  <span className="ml-1.5 text-[11px] text-foreground/45">{vs[0].cbdInfo}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Choix du format */}
      <div className="px-5 pt-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/55 mb-2.5">Format</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="radiogroup" aria-label="Format">
          {formats.map((v) => {
            const active = v.sku === sku;
            const ok = availability[v.sku] !== false;
            const pg = v.grams > 1 && /g$/.test(v.format) ? v.priceCents / v.grams : null;
            return (
              <button
                key={v.sku}
                type="button"
                role="radio"
                aria-checked={active}
                disabled={!ok}
                onClick={() => setSku(v.sku)}
                className={cn(
                  "rounded-xl border px-3 py-2.5 text-left transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
                  active ? "border-gold bg-gold/10" : "border-foreground/15 hover:border-foreground/40",
                )}
              >
                <span className="block text-sm font-medium">{v.format}</span>
                <span className="block text-sm text-gold">{formatEUR(v.priceCents)}</span>
                {pg !== null && <span className="block text-[10px] text-foreground/45">{formatEUR(Math.round(pg))}/g</span>}
                {!ok && <span className="block text-[10px] text-foreground/45">Épuisé</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Infos variante */}
      <div className="px-5 pt-4 flex flex-wrap items-center gap-2">
        <ForceBadge force={variant.force} size="xs" />
        <span className="text-xs text-foreground/55">{variant.cbdInfo}</span>
        <span className="text-xs text-foreground/55">· THC &lt; 0,3 %</span>
      </div>
      {variant.warning && (
        <p className="mx-5 mt-3 inline-flex items-start gap-2 rounded-lg bg-danger-soft px-3 py-2 text-xs text-red-200 leading-snug">
          <AlertTriangle size={14} className="shrink-0 mt-0.5" /> {variant.warning}
        </p>
      )}

      {/* Prudence (produits forts) */}
      {ackLoaded && strong && (
        <label className={cn("mx-5 mt-4 flex items-start gap-3 rounded-xl border px-3.5 py-3 cursor-pointer transition-colors", ack ? "border-gold/40 bg-gold/5" : "border-red-400/40 bg-red-400/10")}>
          <input type="checkbox" checked={ack} onChange={(e) => onAck(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[oklch(0.82_0.14_80)]" />
          <span className="text-xs leading-snug text-foreground/85 inline-flex items-start gap-1.5">
            <ShieldAlert size={14} className="text-gold shrink-0 mt-0.5" />
            <span>
              J'ai lu les{" "}
              <Link href="/conseils-prudence" className="underline decoration-gold/60 hover:text-gold">
                conseils de prudence
              </Link>{" "}
              : produit à concentration élevée, réservé aux adultes habitués, très petite quantité pour commencer, pas de conduite après usage.
            </span>
          </span>
        </label>
      )}

      {/* Prix + quantité + CTA */}
      <div className="mt-5 border-t border-gold/15 bg-background/40 px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">Total</p>
          <p className="font-serif text-3xl text-gradient-gold leading-none mt-1">{formatEUR(variant.priceCents * qty)}</p>
          {perGram !== null && <p className="text-[11px] text-foreground/45 mt-1">soit {formatEUR(Math.round(perGram))}/g</p>}
        </div>
        <div className="inline-flex items-center rounded-full border border-foreground/20 self-start sm:self-auto">
          <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Diminuer la quantité" className="h-11 w-11 flex items-center justify-center hover:text-gold">
            <Minus size={14} />
          </button>
          <span className="w-8 text-center font-mono text-sm" aria-live="polite">{qty}</span>
          <button type="button" onClick={() => setQty(Math.min(20, qty + 1))} aria-label="Augmenter la quantité" className="h-11 w-11 flex items-center justify-center hover:text-gold">
            <Plus size={14} />
          </button>
        </div>
        <button
          type="button"
          onClick={onAdd}
          disabled={!available || needsAck}
          className="btn-gold inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold min-w-[200px]"
        >
          {added ? (
            <>
              <Check size={16} /> Ajouté !
            </>
          ) : !available ? (
            "Épuisé"
          ) : needsAck ? (
            "Cochez la case ci-dessus"
          ) : (
            <>
              <ShoppingBag size={16} /> Ajouter au panier
            </>
          )}
        </button>
      </div>
    </div>
  );
}
