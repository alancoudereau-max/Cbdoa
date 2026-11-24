"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Minus, Plus, AlertTriangle } from "lucide-react";
import { type Product, type Variant, forceLabels, thcLabel, type TierKey } from "@/data/products";
import { site } from "@/data/site";
import { useCart } from "@/lib/cart-store";
import { bulkPercent, bulkPriceCents, bulkRuleText, quoteMessage, QUOTE_FROM_GRAMS } from "@/lib/pricing";
import { formatEUR, cn, fr } from "@/lib/utils";
import { ForceBadge } from "@/components/ui/ForceBadge";

const ACK_KEY = "cbdoux-prudence-ack";
/** Choix « 100 g et plus » des références au tarif dégressif : pas de prix affiché, la demande part sur WhatsApp. */
const QUOTE = "sur-devis";

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
  const panel = useRef<HTMLDivElement | null>(null);
  // Barre d'achat (téléphone) : « before » tant que le bloc d'achat n'a pas été atteint, « after » une fois dépassé.
  const [bar, setBar] = useState<"off" | "before" | "after">("off");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      setAck(localStorage.getItem(ACK_KEY) === "1");
    } catch {
      /* ignore */
    }
    setAckLoaded(true);
  }, []);

  // Sur téléphone, une barre d'achat reste en bas de l'écran tant que le bloc d'achat n'est pas à l'écran :
  // avant de l'atteindre, elle donne le prix et y conduit ; après, elle ajoute au panier le choix en cours.
  useEffect(() => {
    setMounted(true);
    const el = panel.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setBar(e.isIntersecting ? "off" : e.boundingClientRect.top > 0 ? "before" : "after"));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    const root = document.documentElement;
    root.toggleAttribute("data-buybar", bar !== "off");
    return () => root.removeAttribute("data-buybar");
  }, [bar]);

  useEffect(() => {
    const first = tiers.find(([k]) => k === tier)?.[1][0];
    if (first && !formats.some((f) => f.sku === sku)) setSku(first.sku);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tier]);

  const variant = product.variants.find((v) => v.sku === sku) ?? formats[0] ?? product.variants[0];
  const available = availability[variant.sku] !== false;
  const strong = variant.force === 3 || variant.force === "maxi";
  const needsAck = strong && !ack;
  // Tarif dégressif (force Maxi) : la remise dépend du poids choisi, format × quantité.
  const bulk = formats.some((f) => f.perGramCents !== undefined);
  const quote = bulk && sku === QUOTE;
  const percent = variant.perGramCents ? bulkPercent(variant.grams * qty) : 0;
  const unitCents = variant.perGramCents ? Math.min(variant.priceCents, bulkPriceCents(variant.perGramCents, variant.grams, percent)) : variant.priceCents;
  const totalCents = unitCents * qty;
  const perGram = /g$/.test(variant.format) && (variant.grams > 1 || percent > 0) ? unitCents / variant.grams : null;
  // Économie au gramme d'un grand format, par rapport au plus petit format de la même force (affichée dès 5 %).
  const smallest = formats.filter((f) => /g$/.test(f.format)).sort((a, b) => a.grams - b.grams)[0];
  const saving = (v: Variant) => {
    if (!smallest || !/g$/.test(v.format) || v.grams <= smallest.grams) return 0;
    const pct = Math.round((1 - v.priceCents / v.grams / (smallest.priceCents / smallest.grams)) * 100);
    return pct >= 5 ? pct : 0;
  };
  const variantSaving = variant.perGramCents ? percent : saving(variant);
  const quoteUrl = `${site.whatsapp}?text=${encodeURIComponent(quoteMessage(product.name, variant.tierLabel))}`;

  const onAdd = () => {
    if (quote || !available || needsAck) return;
    add(
      {
        sku: variant.sku,
        slug: product.slug,
        name: product.name,
        variantLabel: `${variant.tierLabel} · ${variant.format}`,
        format: variant.format,
        grams: variant.grams,
        unitPriceCents: variant.priceCents,
        perGramCents: variant.perGramCents,
        image: product.image,
        force: variant.force,
      },
      qty,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
    try {
      navigator.vibrate?.(12); // un léger tic sous le doigt, sur les téléphones qui le permettent
    } catch {
      /* ignore */
    }
  };

  const fromCents = Math.min(...product.variants.map((v) => v.priceCents));
  const several = product.variants.length > 1;
  // Ce que fait le bouton de la barre : conduire au choix tant qu'il reste à faire, sinon ajouter au panier.
  const barGoes = quote || !available || needsAck || (bar === "before" && several);
  // Avant le bloc d'achat, le bouton y conduit (« Choisir ») ; après, il dit ce qui manque ou ajoute au panier.
  const barLabel = added
    ? "Ajouté"
    : quote
      ? bar === "before"
        ? "Choisir"
        : "Demander un prix"
      : !available
        ? "Épuisé"
        : bar === "before"
          ? several || needsAck
            ? "Choisir"
            : "Ajouter au panier"
          : needsAck
            ? "Cocher la case"
            : "Ajouter au panier";
  const onBar = () => {
    // « 100 g et plus » : le bouton WhatsApp est en bas du bloc d'achat, on y descend.
    if (barGoes) panel.current?.scrollIntoView({ block: bar === "after" ? (quote ? "end" : needsAck ? "center" : "start") : "start", behavior: "smooth" });
    else onAdd();
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
    <div ref={panel} className="panel paper-object scroll-mt-28">
      <div className="space-y-6 p-5 sm:p-7">
        {/* Choix de la force */}
        {tiers.length > 1 && (
          <div>
            <p className="field-label">Force</p>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Force">
              {tiers.map(([key, vs]) => {
                const f = vs[0].force;
                const active = key === tier;
                return (
                  <button key={key} type="button" role="radio" aria-checked={active} onClick={() => setTier(key)} className="choice choice-pill px-4 py-2 text-[0.9375rem]">
                    <span className="font-medium">{forceLabels[f].label}</span>
                    <span className="ml-2 text-[0.8125rem] opacity-70">{fr(vs[0].cbdInfo)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Choix du format */}
        <div>
          <p className="field-label">Format</p>
          <div className={cn("grid grid-cols-2 gap-2", !bulk && "sm:grid-cols-3")} role="radiogroup" aria-label="Format">
            {formats.map((v) => {
              const active = v.sku === sku;
              const ok = availability[v.sku] !== false;
              const pg = v.grams > 1 && /g$/.test(v.format) ? v.priceCents / v.grams : null;
              const less = saving(v);
              return (
                <button key={v.sku} type="button" role="radio" aria-checked={active} disabled={!ok} onClick={() => setSku(v.sku)} className="choice t-num relative px-3.5 py-3">
                  <span className="block font-medium">{fr(v.format)}</span>
                  <span className="block">{formatEUR(v.priceCents)}</span>
                  {pg !== null && <span className="block text-[0.75rem] opacity-70">{formatEUR(Math.round(pg))} le gramme</span>}
                  {!ok && <span className="block text-[0.75rem] opacity-70">Épuisé</span>}
                  {less > 0 && (
                    <span className="save-chip">
                      <span aria-hidden>−{less}&nbsp;%</span>
                      <span className="sr-only">, {less} % de moins au gramme</span>
                    </span>
                  )}
                </button>
              );
            })}
            {/* À partir de 100 g d'une même référence, le prix se négocie : ce choix remplace l'ajout au panier par une demande WhatsApp. */}
            {bulk && (
              <button type="button" role="radio" aria-checked={quote} onClick={() => setSku(QUOTE)} className="choice t-num relative px-3.5 py-3">
                <span className="block font-medium">{fr(`${QUOTE_FROM_GRAMS} g et plus`)}</span>
                <span className="block">Prix à négocier</span>
                <span className="block text-[0.75rem] opacity-70">sur WhatsApp</span>
              </button>
            )}
          </div>
          {bulk && <p className="t-fine mt-3">{fr(`Prix dégressif : ${bulkRuleText()} de cette référence dans votre panier, tous formats additionnés.`)}</p>}
        </div>

        {/* Ce que contient la variante choisie */}
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.875rem] text-foreground/80">
          <ForceBadge force={variant.force} />
          <span>{fr(variant.cbdInfo)}</span>
          <span>{fr(thcLabel(product))}</span>
        </p>

        {variant.warning && (
          <p className="flex items-start gap-2.5 text-[0.875rem] leading-snug text-danger">
            <AlertTriangle aria-hidden size={16} className="mt-0.5 shrink-0" /> <span>{fr(variant.warning)}</span>
          </p>
        )}

        {/* Prudence (produits forts) */}
        {ackLoaded && strong && (
          <label className={cn("flex cursor-pointer items-start gap-3 rounded-[3px] border px-3.5 py-3 transition-colors", ack ? "border-foreground/30" : "border-danger bg-danger-soft")}>
            <input type="checkbox" checked={ack} onChange={(e) => onAck(e.target.checked)} className="mt-0.5 h-[1.125rem] w-[1.125rem] shrink-0 accent-[#d7b565]" />
            <span className="text-[0.875rem] leading-snug">
              J'ai lu les{" "}
              <Link href="/conseils-prudence" className="link">
                conseils de prudence
              </Link>
              &nbsp;: produit fortement enrichi en cannabinoïdes, réservé aux adultes habitués, très petite quantité pour commencer, pas de conduite après usage.
            </span>
          </label>
        )}
      </div>

      {/* Prix, quantité, ajout au panier */}
      <div aria-hidden className="rule-double" />
      {quote ? (
        <div className="p-5 sm:p-7">
          <p className="t-fine">{fr(`${QUOTE_FROM_GRAMS} g et plus`)}</p>
          <p className="price-tick mt-1 font-serif text-[1.875rem] font-light leading-none tracking-[-0.02em]">Prix à négocier</p>
          <p className="t-fine mt-2">{fr(`À partir de ${QUOTE_FROM_GRAMS} g d'une même référence, écrivez-nous : nous vous répondons avec un prix.`)}</p>
          <a href={quoteUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-5 w-full">
            Demander un prix sur WhatsApp
          </a>
        </div>
      ) : (
      <div className="p-5 sm:p-7">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="t-fine">Total</p>
            <p key={totalCents} className="price-tick t-num mt-0.5 font-serif text-[2.25rem] font-light leading-none tracking-[-0.02em]">
              {formatEUR(totalCents)}
            </p>
            {perGram !== null && (
              <p className="t-fine t-num mt-1.5">
                soit {formatEUR(Math.round(perGram))} le gramme{variantSaving > 0 && <>, {variantSaving}&nbsp;% de moins qu'au détail</>}
              </p>
            )}
          </div>
          <div className="inline-flex shrink-0 items-center rounded-full border border-foreground/35">
            <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Diminuer la quantité" className="flex h-12 w-11 items-center justify-center">
              <Minus aria-hidden size={15} />
            </button>
            <span className="t-num w-7 text-center font-medium" aria-live="polite">
              {qty}
            </span>
            <button type="button" onClick={() => setQty(Math.min(20, qty + 1))} aria-label="Augmenter la quantité" className="flex h-12 w-11 items-center justify-center">
              <Plus aria-hidden size={15} />
            </button>
          </div>
        </div>
        {/* Format × quantité atteint le seuil où le prix se négocie : on le dit, sans empêcher l'ajout au panier. */}
        {variant.perGramCents !== undefined && variant.grams * qty >= QUOTE_FROM_GRAMS && (
          <p className="t-fine mt-4">
            {fr(`${variant.grams * qty} g : à partir de ${QUOTE_FROM_GRAMS} g, le prix se négocie.`)}{" "}
            <a href={quoteUrl} target="_blank" rel="noopener noreferrer" className="link">
              Demander un prix sur WhatsApp
            </a>
          </p>
        )}
        <button type="button" onClick={onAdd} disabled={!available || needsAck} className="btn btn-primary mt-5 w-full">
          {added ? "Ajouté au panier" : !available ? "Épuisé" : needsAck ? "Cochez la case ci-dessus" : "Ajouter au panier"}
        </button>
      </div>
      )}

      {/* Barre d'achat qui suit, sur téléphone. Elle est rendue dans <body> : un parent animé la décrocherait de l'écran. */}
      {mounted &&
        createPortal(
          <div className="buybar lg:hidden" data-show={bar !== "off"} aria-hidden={bar === "off"}>
            <div className="buybar-row">
              <div className="buybar-text">
                <p className="truncate text-[0.9375rem] font-medium leading-tight">{fr(product.name)}</p>
                <p className="buybar-price t-num truncate text-[0.8125rem] leading-tight text-foreground/75">
                  {bar === "before" && several
                    ? `Dès ${formatEUR(fromCents)}`
                    : quote
                      ? fr(`${QUOTE_FROM_GRAMS} g et plus · à négocier`)
                      : fr(`${variant.tierLabel}, ${variant.format} · ${formatEUR(totalCents)}`)}
                </p>
              </div>
              <button type="button" tabIndex={bar === "off" ? -1 : 0} onClick={onBar} disabled={!quote && !available && bar === "after"} className="btn btn-primary btn-sm shrink-0">
                <span className="min-w-0 truncate">{barLabel}</span>
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
