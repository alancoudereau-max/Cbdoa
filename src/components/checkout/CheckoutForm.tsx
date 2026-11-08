"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Lock, Truck, Package, ShieldAlert, Tag, CheckCircle2, AlertCircle, Loader2, ChevronLeft } from "lucide-react";
import { useCart, cartSubtotalCents } from "@/lib/cart-store";
import { locations } from "@/data/site";
import { formatEUR, cn } from "@/lib/utils";

type Method = { id: string; name: string; description: string; delay: string; priceCents: number; free: boolean; requiresAddress: boolean; allowPayOnPickup: boolean };
type Quote = { subtotalCents: number; shippingCents: number; discountCents: number; totalCents: number; promoError?: string; promoCode?: string };

const EMPTY_QUOTE: Quote = { subtotalCents: 0, shippingCents: 0, discountCents: 0, totalCents: 0 };

export function CheckoutForm() {
  const sp = useSearchParams();
  const cancelled = sp.get("annule") === "1";
  const { lines, hydrated, promoCode, setPromoCode } = useCart();
  const subtotal = cartSubtotalCents(lines);

  const [form, setForm] = useState({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    line1: "",
    line2: "",
    postalCode: "",
    city: "",
    notes: "",
    pickupPoint: "damprichard" as "damprichard" | "le-russey",
    payOnPickup: false,
    ageConfirmed: false,
    prudenceAck: false,
    cgvAccepted: false,
  });
  const [shippingMethod, setShippingMethod] = useState<string>("colissimo");
  const [methods, setMethods] = useState<Method[]>([]);
  const [quote, setQuote] = useState<Quote>(EMPTY_QUOTE);
  const [quoteErrors, setQuoteErrors] = useState<string[]>([]);
  const [promoInput, setPromoInput] = useState(promoCode ?? "");
  const [appliedPromo, setAppliedPromo] = useState<string | undefined>(promoCode ?? undefined);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const quoteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const v = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
  };

  const selected = methods.find((m) => m.id === shippingMethod);
  const needsAddress = selected ? selected.requiresAddress : shippingMethod !== "retrait";

  // Devis serveur (prix, livraison disponible, remise) — recalculé à chaque changement pertinent
  const refreshQuote = useCallback(
    async (opts?: { promo?: string }) => {
      if (lines.length === 0) return;
      try {
        const res = await fetch("/api/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lines: lines.map((l) => ({ sku: l.sku, quantity: l.quantity })),
            shippingMethod,
            postalCode: form.postalCode.length === 5 ? form.postalCode : undefined,
            promoCode: opts?.promo ?? appliedPromo,
          }),
        });
        const data = (await res.json()) as { quote: Quote; methods: Method[]; errors: string[] };
        setMethods(data.methods);
        setQuote(data.quote);
        setQuoteErrors(data.errors ?? []);
        if (!data.methods.some((m) => m.id === shippingMethod) && data.methods.length) setShippingMethod(data.methods[0].id);
        if (opts?.promo !== undefined) {
          if (data.quote.promoError) {
            setFieldErrors((fe) => ({ ...fe, promoCode: data.quote.promoError! }));
            setAppliedPromo(undefined);
            setPromoCode(null);
          } else if (data.quote.promoCode) {
            setFieldErrors((fe) => {
              const { promoCode: _ignored, ...rest } = fe;
              void _ignored;
              return rest;
            });
            setAppliedPromo(data.quote.promoCode);
            setPromoCode(data.quote.promoCode);
          }
        }
      } catch {
        /* réseau : on garde le dernier devis */
      }
    },
    [lines, shippingMethod, form.postalCode, appliedPromo, setPromoCode],
  );

  useEffect(() => {
    if (!hydrated) return;
    if (quoteTimer.current) clearTimeout(quoteTimer.current);
    quoteTimer.current = setTimeout(() => void refreshQuote(), 250);
    return () => {
      if (quoteTimer.current) clearTimeout(quoteTimer.current);
    };
  }, [hydrated, refreshQuote]);

  const applyPromo = () => void refreshQuote({ promo: promoInput.trim().toUpperCase() });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: lines.map((l) => ({ sku: l.sku, quantity: l.quantity })),
          customer: { email: form.email, phone: form.phone, firstName: form.firstName, lastName: form.lastName },
          shippingMethod,
          address: needsAddress ? { line1: form.line1, line2: form.line2, postalCode: form.postalCode, city: form.city } : undefined,
          pickupPoint: shippingMethod === "retrait" ? form.pickupPoint : undefined,
          payOnPickup: shippingMethod === "retrait" ? form.payOnPickup : false,
          promoCode: appliedPromo ?? "",
          notes: form.notes,
          ageConfirmed: form.ageConfirmed,
          prudenceAck: form.prudenceAck,
          cgvAccepted: form.cgvAccepted,
        }),
      });
      const data = (await res.json()) as { ok: boolean; redirectUrl?: string; error?: string; fieldErrors?: Record<string, string> };
      if (!data.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        setFieldErrors(data.fieldErrors ?? {});
        setSubmitting(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      // Le panier est vidé sur la page de confirmation une fois le paiement validé
      window.location.href = data.redirectUrl!;
    } catch {
      setError("Connexion impossible. Vérifiez votre réseau et réessayez.");
      setSubmitting(false);
    }
  };

  const hasStrong = useMemo(() => lines.some((l) => l.force === 3 || l.force === "maxi"), [lines]);

  if (!hydrated) return <div className="mx-auto max-w-[1200px] px-5 py-16 text-foreground/50">Chargement de votre panier…</div>;

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-5 py-20 text-center">
        <h1 className="font-serif text-4xl mb-3">Votre panier est vide</h1>
        <p className="text-foreground/60 mb-6">Ajoutez des produits pour passer commande.</p>
        <Link href="/boutique" className="btn-gold inline-flex rounded-full px-6 py-3 text-sm font-semibold">Voir la boutique</Link>
      </div>
    );
  }

  const payOnline = !(shippingMethod === "retrait" && form.payOnPickup);

  return (
    <div className="mx-auto max-w-[1200px] px-5 sm:px-8 py-8 sm:py-12">
      <Link href="/panier" className="inline-flex items-center gap-1 text-xs text-foreground/55 hover:text-gold mb-6"><ChevronLeft size={14} /> Retour au panier</Link>
      <h1 className="font-serif text-4xl sm:text-5xl mb-8">
        Finaliser <span className="font-serif-italic text-gradient-gold">ma commande</span>
      </h1>

      {cancelled && !error && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm">
          <AlertCircle size={18} className="text-gold shrink-0 mt-0.5" /> Le paiement a été annulé. Votre panier est intact, vous pouvez réessayer.
        </div>
      )}
      {error && (
        <div role="alert" className="mb-6 flex items-start gap-3 rounded-2xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-100">
          <AlertCircle size={18} className="shrink-0 mt-0.5" /> {error}
        </div>
      )}
      {quoteErrors.map((qe) => (
        <div key={qe} role="alert" className="mb-6 flex items-start gap-3 rounded-2xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-100">
          <AlertCircle size={18} className="shrink-0 mt-0.5" /> {qe} <Link href="/panier" className="underline ml-1">Modifier le panier</Link>
        </div>
      ))}

      <form onSubmit={onSubmit} className="grid lg:grid-cols-12 gap-8" noValidate>
        <div className="lg:col-span-7 space-y-8">
          {/* 1. Coordonnées */}
          <Section n={1} title="Vos coordonnées">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Prénom" error={fieldErrors["customer.firstName"]}>
                <input className="input-dark" autoComplete="given-name" value={form.firstName} onChange={set("firstName")} required aria-invalid={!!fieldErrors["customer.firstName"]} />
              </Field>
              <Field label="Nom" error={fieldErrors["customer.lastName"]}>
                <input className="input-dark" autoComplete="family-name" value={form.lastName} onChange={set("lastName")} required aria-invalid={!!fieldErrors["customer.lastName"]} />
              </Field>
              <Field label="Email (confirmation & suivi)" error={fieldErrors["customer.email"]}>
                <input type="email" className="input-dark" autoComplete="email" inputMode="email" value={form.email} onChange={set("email")} required aria-invalid={!!fieldErrors["customer.email"]} />
              </Field>
              <Field label="Téléphone (livraison / WhatsApp)" error={fieldErrors["customer.phone"]}>
                <input type="tel" className="input-dark" autoComplete="tel" inputMode="tel" value={form.phone} onChange={set("phone")} required aria-invalid={!!fieldErrors["customer.phone"]} />
              </Field>
            </div>
          </Section>

          {/* 2. Livraison */}
          <Section n={2} title="Livraison ou retrait">
            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <Field label="Code postal" hint="Détermine les options disponibles" error={fieldErrors["address.postalCode"]}>
                <input className="input-dark" inputMode="numeric" autoComplete="postal-code" maxLength={5} value={form.postalCode} onChange={set("postalCode")} aria-invalid={!!fieldErrors["address.postalCode"]} />
              </Field>
              <Field label="Ville" error={fieldErrors["address.city"]}>
                <input className="input-dark" autoComplete="address-level2" value={form.city} onChange={set("city")} aria-invalid={!!fieldErrors["address.city"]} />
              </Field>
            </div>

            <div className="space-y-2" role="radiogroup" aria-label="Mode de livraison">
              {(methods.length ? methods : []).map((m) => {
                const active = m.id === shippingMethod;
                return (
                  <label key={m.id} className={cn("flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors", active ? "border-gold bg-gold/5" : "border-foreground/10 hover:border-foreground/30")}>
                    <input type="radio" name="shipping" value={m.id} checked={active} onChange={() => setShippingMethod(m.id)} className="mt-1 accent-[oklch(0.82_0.14_80)]" />
                    <span className="flex-1">
                      <span className="flex items-baseline justify-between gap-3">
                        <span className="font-medium">{m.name}</span>
                        <span className={cn("font-serif text-lg whitespace-nowrap", m.free ? "text-gold" : "")}>{m.free || m.priceCents === 0 ? "Offert" : formatEUR(m.priceCents)}</span>
                      </span>
                      <span className="block text-xs text-foreground/60 mt-0.5">{m.description}</span>
                      <span className="block font-mono text-[10px] uppercase tracking-[0.15em] text-gold/80 mt-1.5">{m.delay}</span>
                    </span>
                  </label>
                );
              })}
              {methods.length === 0 && <p className="text-sm text-foreground/50">Calcul des options de livraison…</p>}
            </div>
            {fieldErrors.shippingMethod && <p className="text-xs text-red-300 mt-2">{fieldErrors.shippingMethod}</p>}

            {shippingMethod === "retrait" ? (
              <div className="mt-5 grid sm:grid-cols-2 gap-4">
                <Field label="Point de retrait" error={fieldErrors.pickupPoint}>
                  <select className="input-dark" value={form.pickupPoint} onChange={set("pickupPoint")}>
                    {locations.pickupPoints.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.postalCode})
                      </option>
                    ))}
                  </select>
                </Field>
                {selected?.allowPayOnPickup && (
                  <label className="flex items-start gap-3 rounded-2xl border border-foreground/10 p-4 cursor-pointer self-end">
                    <input type="checkbox" checked={form.payOnPickup} onChange={set("payOnPickup")} className="mt-0.5 accent-[oklch(0.82_0.14_80)]" />
                    <span className="text-sm">
                      <span className="block font-medium">Payer sur place au retrait</span>
                      <span className="block text-xs text-foreground/60 mt-0.5">Espèces ou carte. Sinon, paiement en ligne sécurisé maintenant.</span>
                    </span>
                  </label>
                )}
              </div>
            ) : (
              <div className="mt-5 grid gap-4">
                <Field label="Adresse" error={fieldErrors["address.line1"]}>
                  <input className="input-dark" autoComplete="address-line1" value={form.line1} onChange={set("line1")} placeholder="N° et nom de rue" aria-invalid={!!fieldErrors["address.line1"]} />
                </Field>
                <Field label="Complément (bâtiment, étage, digicode…)" error={fieldErrors["address.line2"]}>
                  <input className="input-dark" autoComplete="address-line2" value={form.line2} onChange={set("line2")} />
                </Field>
              </div>
            )}
          </Section>

          {/* 3. Notes & conditions */}
          <Section n={3} title="Dernières précisions">
            <Field label="Notes pour votre commande (saveur de recharge, consignes de livraison…)">
              <textarea className="input-dark" rows={3} maxLength={500} value={form.notes} onChange={set("notes")} />
            </Field>
            <div className="mt-5 space-y-3">
              <Check checked={form.ageConfirmed} onChange={set("ageConfirmed")} error={fieldErrors.ageConfirmed}>
                Je certifie être <strong>majeur(e) (18 ans ou plus)</strong>. La vente de CBD est interdite aux mineurs.
              </Check>
              <Check checked={form.prudenceAck} onChange={set("prudenceAck")} error={fieldErrors.prudenceAck}>
                J'ai lu les{" "}
                <Link href="/conseils-prudence" target="_blank" className="underline text-gold">conseils de prudence</Link>
                {hasStrong ? " (mon panier contient des produits à concentration élevée : très petite quantité pour commencer, pas de conduite après usage)" : " et je consommerai avec modération, sans conduire après usage"}.
              </Check>
              <Check checked={form.cgvAccepted} onChange={set("cgvAccepted")} error={fieldErrors.cgvAccepted}>
                J'accepte les{" "}
                <Link href="/cgv" target="_blank" className="underline text-gold">conditions générales de vente</Link> et la{" "}
                <Link href="/confidentialite" target="_blank" className="underline text-gold">politique de confidentialité</Link>.
              </Check>
            </div>
          </Section>
        </div>

        {/* Récapitulatif */}
        <aside className="lg:col-span-5">
          <div className="lg:sticky lg:top-28 rounded-3xl border border-gold/25 bg-card/60 p-6 space-y-5">
            <h2 className="font-serif text-2xl">Récapitulatif</h2>
            <ul className="space-y-3 max-h-[40vh] overflow-y-auto pr-1">
              {lines.map((l) => (
                <li key={l.sku} className="flex gap-3 text-sm">
                  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-black/40">
                    <Image src={l.image} alt="" fill sizes="56px" className="object-cover" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block truncate">{l.name}</span>
                    <span className="block text-[11px] text-foreground/55">{l.variantLabel} × {l.quantity}</span>
                  </span>
                  <span className="whitespace-nowrap">{formatEUR(l.unitPriceCents * l.quantity)}</span>
                </li>
              ))}
            </ul>

            {/* Code promo */}
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/55 mb-2">Code promo</label>
              <div className="flex gap-2">
                <input className="input-dark uppercase" value={promoInput} onChange={(e) => setPromoInput(e.target.value)} placeholder="BIENVENUE10" aria-invalid={!!fieldErrors.promoCode} />
                <button type="button" onClick={applyPromo} className="btn-outline rounded-xl px-4 text-sm whitespace-nowrap inline-flex items-center gap-1.5">
                  <Tag size={14} /> Appliquer
                </button>
              </div>
              {fieldErrors.promoCode && <p className="text-xs text-red-300 mt-1.5">{fieldErrors.promoCode}</p>}
              {appliedPromo && !fieldErrors.promoCode && (
                <p className="text-xs text-gold mt-1.5 inline-flex items-center gap-1.5"><CheckCircle2 size={13} /> Code {appliedPromo} appliqué</p>
              )}
            </div>

            <dl className="space-y-2 text-sm border-t border-foreground/10 pt-4">
              <div className="flex justify-between"><dt className="text-foreground/65">Sous-total</dt><dd>{formatEUR(quote.subtotalCents || subtotal)}</dd></div>
              {quote.discountCents > 0 && <div className="flex justify-between text-gold"><dt>Remise</dt><dd>− {formatEUR(quote.discountCents)}</dd></div>}
              <div className="flex justify-between"><dt className="text-foreground/65">Livraison</dt><dd>{quote.shippingCents === 0 ? <span className="text-gold">Offerte</span> : formatEUR(quote.shippingCents)}</dd></div>
              <div className="flex justify-between items-baseline border-t border-foreground/10 pt-3">
                <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/60">Total TTC</dt>
                <dd className="font-serif text-3xl text-gradient-gold">{formatEUR(quote.totalCents || subtotal)}</dd>
              </div>
            </dl>

            <button type="submit" disabled={submitting || quoteErrors.length > 0} className="btn-gold w-full inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-semibold">
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
              {submitting ? "Redirection…" : payOnline ? `Payer ${formatEUR(quote.totalCents || subtotal)}` : "Confirmer la commande"}
            </button>
            <p className="text-[11px] text-foreground/50 leading-relaxed text-center">
              {payOnline ? "Paiement sécurisé (3-D Secure) par Mollie : CB, Visa, Mastercard, Apple Pay, Google Pay. Libellé bancaire neutre." : "Vous réglerez au moment du retrait, après confirmation du rendez-vous par WhatsApp."}
            </p>
            <ul className="space-y-1.5 text-[11px] text-foreground/55 pt-1">
              <li className="flex items-center gap-2"><Truck size={12} className="text-gold" /> Expédition sous 24 h ouvrées (avant 13 h = jour même)</li>
              <li className="flex items-center gap-2"><Package size={12} className="text-gold" /> Colis neutre, sachets hermétiques</li>
              <li className="flex items-center gap-2"><ShieldAlert size={12} className="text-gold" /> Produits réservés aux adultes · THC &lt; 0,3 %</li>
            </ul>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-foreground/10 bg-card/40 p-5 sm:p-7">
      <h2 className="font-serif text-2xl mb-5 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/50 bg-gold/10 font-mono text-xs text-gold">{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1.5">{label}</span>
      {children}
      {hint && !error && <span className="block text-[11px] text-foreground/45 mt-1">{hint}</span>}
      {error && <span className="block text-xs text-red-300 mt-1">{error}</span>}
    </label>
  );
}

function Check({ checked, onChange, error, children }: { checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; error?: string; children: React.ReactNode }) {
  return (
    <label className={cn("flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition-colors", error ? "border-red-400/50 bg-red-400/5" : checked ? "border-gold/40 bg-gold/5" : "border-foreground/10 hover:border-foreground/30")}>
      <input type="checkbox" checked={checked} onChange={onChange} className="mt-0.5 h-4 w-4 accent-[oklch(0.82_0.14_80)]" />
      <span className="text-sm text-foreground/85 leading-snug">
        {children}
        {error && <span className="block text-xs text-red-300 mt-1">{error}</span>}
      </span>
    </label>
  );
}
