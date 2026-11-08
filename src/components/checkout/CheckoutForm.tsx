"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Mail, Copy, Check as CheckIcon, Truck, Package, ShieldAlert, Tag, CheckCircle2, ChevronLeft, Info } from "lucide-react";
import { useCart, cartSubtotalCents } from "@/lib/cart-store";
import { availableShippingMethods, type ShippingMethodId } from "@/lib/shipping";
import { evaluatePromo } from "@/data/promos";
import { locations, site } from "@/data/site";
import { formatEUR, cn, generateOrderNumber } from "@/lib/utils";

type FormState = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  line1: string;
  line2: string;
  postalCode: string;
  city: string;
  notes: string;
  pickupPoint: "damprichard" | "le-russey";
  ageConfirmed: boolean;
  prudenceAck: boolean;
  cgvAccepted: boolean;
};

const initial: FormState = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  line1: "",
  line2: "",
  postalCode: "",
  city: "",
  notes: "",
  pickupPoint: "damprichard",
  ageConfirmed: false,
  prudenceAck: false,
  cgvAccepted: false,
};

export function CheckoutForm() {
  const { lines, hydrated, promoCode, setPromoCode } = useCart();
  const [form, setForm] = useState<FormState>(initial);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodId>("colissimo");
  const [promoInput, setPromoInput] = useState(promoCode ?? "");
  const [promoError, setPromoError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderNumber] = useState(() => generateOrderNumber());
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);

  const subtotal = cartSubtotalCents(lines);
  const methods = useMemo(
    () =>
      availableShippingMethods({
        subtotalCents: subtotal,
        lines: lines.map((l) => ({ grams: l.grams, quantity: l.quantity })),
        postalCode: form.postalCode.length === 5 ? form.postalCode : undefined,
      }),
    [subtotal, lines, form.postalCode],
  );
  useEffect(() => {
    if (methods.length && !methods.some((m) => m.id === shippingMethod)) setShippingMethod(methods[0].id);
  }, [methods, shippingMethod]);

  const selected = methods.find((m) => m.id === shippingMethod);
  const needsAddress = selected ? selected.requiresAddress : true;
  const shippingCents = selected?.computedPriceCents ?? 0;
  const promo = promoCode ? evaluatePromo(promoCode, subtotal) : { discountCents: 0 };
  const discountCents = promo.discountCents;
  const total = Math.max(0, subtotal - discountCents + shippingCents);
  const hasStrong = lines.some((l) => l.force === 3 || l.force === "maxi");

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const v = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
    // Efface l'erreur du champ dès qu'il est modifié
    setErrors((prev) => {
      if (!(k in prev)) return prev;
      const next = { ...prev };
      delete next[k];
      return next;
    });
  };

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) {
      setPromoCode(null);
      setPromoError(null);
      return;
    }
    const res = evaluatePromo(code, subtotal);
    if (res.error) {
      setPromoError(res.error);
      setPromoCode(null);
    } else {
      setPromoError(null);
      setPromoCode(code);
    }
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "Prénom requis.";
    if (!form.lastName.trim()) e.lastName = "Nom requis.";
    if (!/^[+0-9 .()-]{6,}$/.test(form.phone.trim())) e.phone = "Numéro de téléphone requis (pour vous confirmer la commande).";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = "Adresse email invalide.";
    if (needsAddress) {
      if (form.line1.trim().length < 3) e.line1 = "Adresse requise.";
      if (!/^\d{5}$/.test(form.postalCode.trim())) e.postalCode = "Code postal à 5 chiffres.";
      if (!form.city.trim()) e.city = "Ville requise.";
    }
    if (!form.ageConfirmed) e.ageConfirmed = "Vous devez certifier être majeur(e).";
    if (!form.prudenceAck) e.prudenceAck = "Merci de lire et d'accepter les conseils de prudence.";
    if (!form.cgvAccepted) e.cgvAccepted = "Merci d'accepter les conditions générales de vente.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const pickup = locations.pickupPoints.find((p) => p.id === form.pickupPoint);

  const recap = useMemo(() => {
    const L: string[] = [];
    L.push(`🛒 *Nouvelle commande CBDoux* — réf. ${orderNumber}`);
    L.push("");
    L.push("*Client*");
    L.push(`${form.firstName.trim()} ${form.lastName.trim()}`.trim());
    L.push(`📞 ${form.phone.trim()}${form.email.trim() ? ` · ✉️ ${form.email.trim()}` : ""}`);
    L.push("");
    L.push("*Produits*");
    lines.forEach((l) => L.push(`• ${l.name} — ${l.variantLabel} × ${l.quantity} = ${formatEUR(l.unitPriceCents * l.quantity)}`));
    L.push("");
    L.push(`Sous-total : ${formatEUR(subtotal)}`);
    if (discountCents > 0) L.push(`Code promo ${promoCode} : − ${formatEUR(discountCents)}`);
    if (selected) L.push(`Livraison souhaitée : ${selected.name}${shippingCents === 0 ? " (offerte)" : ` (${formatEUR(shippingCents)})`}`);
    L.push(`*Total estimé : ${formatEUR(total)}*`);
    L.push("");
    if (shippingMethod === "retrait") {
      L.push(`*Retrait* : ${pickup?.name ?? ""}`);
    } else {
      L.push(`*Adresse de livraison*`);
      L.push(form.line1.trim());
      if (form.line2.trim()) L.push(form.line2.trim());
      L.push(`${form.postalCode.trim()} ${form.city.trim()}`.trim());
    }
    if (form.notes.trim()) {
      L.push("");
      L.push(`*Notes* : ${form.notes.trim()}`);
    }
    L.push("");
    L.push("✅ Je certifie être majeur(e), avoir lu les conseils de prudence et accepté les CGV.");
    L.push("Merci de me confirmer la disponibilité et de m'envoyer la facture et le lien de paiement.");
    return L.join("\n");
  }, [orderNumber, form, lines, subtotal, discountCents, promoCode, selected, shippingCents, total, shippingMethod, pickup]);

  const waUrl = `${site.whatsapp}?text=${encodeURIComponent(recap)}`;
  const mailUrl = `mailto:${site.email}?subject=${encodeURIComponent(`Commande CBDoux ${orderNumber}`)}&body=${encodeURIComponent(recap.replace(/\*/g, ""))}`;

  const onSend = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!validate()) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setSent(true);
  };

  const copyRecap = async () => {
    if (!validate()) return;
    try {
      await navigator.clipboard.writeText(recap.replace(/\*/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  if (!hydrated) return <div className="mx-auto max-w-[1200px] px-5 py-16 text-foreground/50">Chargement de votre panier…</div>;

  if (lines.length === 0 && !sent) {
    return (
      <div className="mx-auto max-w-xl px-5 py-20 text-center">
        <h1 className="font-serif text-4xl mb-3">Votre panier est vide</h1>
        <p className="text-foreground/60 mb-6">Ajoutez des produits pour passer commande.</p>
        <Link href="/boutique" className="btn-gold inline-flex rounded-full px-6 py-3 text-sm font-semibold">Voir la boutique</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-5 sm:px-8 py-8 sm:py-12">
      <Link href="/panier" className="inline-flex items-center gap-1 text-xs text-foreground/55 hover:text-gold mb-6"><ChevronLeft size={14} /> Retour au panier</Link>
      <h1 className="font-serif text-4xl sm:text-5xl mb-3">
        Finaliser <span className="font-serif-italic text-gradient-gold">ma commande</span>
      </h1>
      <p className="text-foreground/65 mb-8 max-w-2xl text-sm sm:text-base">
        Dernière étape : vos coordonnées et votre mode de livraison. Votre récapitulatif nous est envoyé sur WhatsApp en un clic ; nous confirmons la disponibilité et vous adressons votre facture avec un lien de paiement sécurisé (ou vous réglez sur place pour un retrait).
      </p>

      {Object.keys(errors).length > 0 && (
        <div role="alert" className="mb-6 rounded-2xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-100">
          Merci de vérifier les champs signalés ci-dessous.
        </div>
      )}

      {sent && (
        <div role="status" className="mb-6 flex items-start gap-3 rounded-2xl border border-gold/50 bg-gold/10 px-4 py-4 text-sm">
          <CheckCircle2 size={20} className="text-gold shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">WhatsApp s'est ouvert avec votre récapitulatif : il ne reste qu'à appuyer sur « Envoyer ».</p>
            <p className="text-foreground/65 mt-1">Rien ne s'est ouvert ? Utilisez « Copier le récapitulatif » puis collez-le dans WhatsApp au {site.phoneDisplay}, ou envoyez-le par email.</p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-8">
        <form onSubmit={(e) => e.preventDefault()} className="lg:col-span-7 space-y-8" noValidate>
          <Section n={1} title="Vos coordonnées">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Prénom" error={errors.firstName}>
                <input className="input-dark" autoComplete="given-name" value={form.firstName} onChange={set("firstName")} aria-invalid={!!errors.firstName} />
              </Field>
              <Field label="Nom" error={errors.lastName}>
                <input className="input-dark" autoComplete="family-name" value={form.lastName} onChange={set("lastName")} aria-invalid={!!errors.lastName} />
              </Field>
              <Field label="Téléphone (WhatsApp)" error={errors.phone}>
                <input type="tel" className="input-dark" autoComplete="tel" inputMode="tel" value={form.phone} onChange={set("phone")} aria-invalid={!!errors.phone} />
              </Field>
              <Field label="Email (facultatif, pour la facture)" error={errors.email}>
                <input type="email" className="input-dark" autoComplete="email" inputMode="email" value={form.email} onChange={set("email")} aria-invalid={!!errors.email} />
              </Field>
            </div>
          </Section>

          <Section n={2} title="Livraison ou retrait">
            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <Field label="Code postal" hint="Détermine les options disponibles" error={errors.postalCode}>
                <input className="input-dark" inputMode="numeric" autoComplete="postal-code" maxLength={5} value={form.postalCode} onChange={set("postalCode")} aria-invalid={!!errors.postalCode} />
              </Field>
              <Field label="Ville" error={errors.city}>
                <input className="input-dark" autoComplete="address-level2" value={form.city} onChange={set("city")} aria-invalid={!!errors.city} />
              </Field>
            </div>
            <div className="space-y-2" role="radiogroup" aria-label="Mode de livraison">
              {methods.map((m) => {
                const active = m.id === shippingMethod;
                return (
                  <label key={m.id} className={cn("flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors", active ? "border-gold bg-gold/5" : "border-foreground/10 hover:border-foreground/30")}>
                    <input type="radio" name="shipping" value={m.id} checked={active} onChange={() => setShippingMethod(m.id)} className="mt-1 accent-[oklch(0.82_0.14_80)]" />
                    <span className="flex-1">
                      <span className="flex items-baseline justify-between gap-3">
                        <span className="font-medium">{m.name}</span>
                        <span className={cn("font-serif text-lg whitespace-nowrap", m.free || m.computedPriceCents === 0 ? "text-gold" : "")}>{m.free || m.computedPriceCents === 0 ? "Offert" : formatEUR(m.computedPriceCents)}</span>
                      </span>
                      <span className="block text-xs text-foreground/60 mt-0.5">{m.description}</span>
                      <span className="block font-mono text-[10px] uppercase tracking-[0.15em] text-gold/80 mt-1.5">{m.delay}</span>
                    </span>
                  </label>
                );
              })}
            </div>
            <p className="mt-3 flex items-start gap-2 text-[11px] text-foreground/50"><Info size={13} className="shrink-0 mt-0.5" /> Frais de port indicatifs, confirmés sur votre facture avec le montant exact.</p>

            {shippingMethod === "retrait" ? (
              <div className="mt-5">
                <Field label="Point de retrait">
                  <select className="input-dark" value={form.pickupPoint} onChange={set("pickupPoint")}>
                    {locations.pickupPoints.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.postalCode})
                      </option>
                    ))}
                  </select>
                </Field>
                <p className="mt-2 text-xs text-foreground/55">Rendez-vous convenu par WhatsApp. Paiement par lien sécurisé ou sur place (espèces / carte).</p>
              </div>
            ) : (
              <div className="mt-5 grid gap-4">
                <Field label="Adresse" error={errors.line1}>
                  <input className="input-dark" autoComplete="address-line1" value={form.line1} onChange={set("line1")} placeholder="N° et nom de rue" aria-invalid={!!errors.line1} />
                </Field>
                <Field label="Complément (bâtiment, étage, digicode…)">
                  <input className="input-dark" autoComplete="address-line2" value={form.line2} onChange={set("line2")} />
                </Field>
              </div>
            )}
          </Section>

          <Section n={3} title="Dernières précisions">
            <Field label="Notes pour votre commande (saveur de recharge, créneau, consignes…)">
              <textarea className="input-dark" rows={3} maxLength={500} value={form.notes} onChange={set("notes")} />
            </Field>
            <div className="mt-5 space-y-3">
              <Check checked={form.ageConfirmed} onChange={set("ageConfirmed")} error={errors.ageConfirmed}>
                Je certifie être <strong>majeur(e) (18 ans ou plus)</strong>. La vente de CBD est interdite aux mineurs.
              </Check>
              <Check checked={form.prudenceAck} onChange={set("prudenceAck")} error={errors.prudenceAck}>
                J'ai lu les <Link href="/conseils-prudence" target="_blank" className="underline text-gold">conseils de prudence</Link>
                {hasStrong ? " (mon panier contient des produits à concentration élevée : très petite quantité pour commencer, pas de conduite après usage)" : " et je consommerai avec modération, sans conduire après usage"}.
              </Check>
              <Check checked={form.cgvAccepted} onChange={set("cgvAccepted")} error={errors.cgvAccepted}>
                J'accepte les <Link href="/cgv" target="_blank" className="underline text-gold">conditions générales de vente</Link> et la{" "}
                <Link href="/confidentialite" target="_blank" className="underline text-gold">politique de confidentialité</Link>.
              </Check>
            </div>
          </Section>
        </form>

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

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/55 mb-2">Code promo</label>
              <div className="flex gap-2">
                <input className="input-dark uppercase" value={promoInput} onChange={(e) => setPromoInput(e.target.value)} placeholder="BIENVENUE10" aria-invalid={!!promoError} />
                <button type="button" onClick={applyPromo} className="btn-outline rounded-xl px-4 text-sm whitespace-nowrap inline-flex items-center gap-1.5">
                  <Tag size={14} /> Appliquer
                </button>
              </div>
              {promoError && <p className="text-xs text-red-300 mt-1.5">{promoError}</p>}
              {promoCode && !promoError && discountCents > 0 && (
                <p className="text-xs text-gold mt-1.5 inline-flex items-center gap-1.5"><CheckCircle2 size={13} /> Code {promoCode} appliqué</p>
              )}
            </div>

            <dl className="space-y-2 text-sm border-t border-foreground/10 pt-4">
              <div className="flex justify-between"><dt className="text-foreground/65">Sous-total</dt><dd>{formatEUR(subtotal)}</dd></div>
              {discountCents > 0 && <div className="flex justify-between text-gold"><dt>Remise</dt><dd>− {formatEUR(discountCents)}</dd></div>}
              <div className="flex justify-between"><dt className="text-foreground/65">Livraison (indicatif)</dt><dd>{shippingCents === 0 ? <span className="text-gold">Offerte</span> : formatEUR(shippingCents)}</dd></div>
              <div className="flex justify-between items-baseline border-t border-foreground/10 pt-3">
                <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/60">Total estimé</dt>
                <dd className="font-serif text-3xl text-gradient-gold">{formatEUR(total)}</dd>
              </div>
            </dl>

            <a href={waUrl} onClick={onSend} target="_blank" rel="noopener noreferrer" className="btn-gold w-full inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-semibold">
              <MessageCircle size={18} /> Envoyer ma commande sur WhatsApp
            </a>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={copyRecap} className="btn-outline inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs">
                {copied ? <CheckIcon size={14} /> : <Copy size={14} />} {copied ? "Copié !" : "Copier le récapitulatif"}
              </button>
              <a href={mailUrl} onClick={(e) => { if (!validate()) e.preventDefault(); }} className="btn-outline inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs">
                <Mail size={14} /> Envoyer par email
              </a>
            </div>
            <p className="text-[11px] text-foreground/50 leading-relaxed text-center">
              Après réception, nous confirmons la disponibilité et vous envoyons votre facture avec un lien de paiement sécurisé par carte (Shine) ou un RIB. Aucune donnée bancaire n'est saisie sur ce site.
            </p>
            <ul className="space-y-1.5 text-[11px] text-foreground/55 pt-1">
              <li className="flex items-center gap-2"><Truck size={12} className="text-gold" /> Expédition sous 24 h ouvrées après paiement</li>
              <li className="flex items-center gap-2"><Package size={12} className="text-gold" /> Colis neutre, sachets hermétiques</li>
              <li className="flex items-center gap-2"><ShieldAlert size={12} className="text-gold" /> Produits réservés aux adultes · THC &lt; 0,3 %</li>
            </ul>
          </div>
        </aside>
      </div>
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
