"use client";

import Link from "next/link";
import Image from "next/image";
import { labelImage } from "@/lib/etiquettes";
import { useEffect, useMemo, useState } from "react";
import { useCart, cartSubtotalCents } from "@/lib/cart-store";
import { availableShippingMethods, type ShippingMethodId } from "@/lib/shipping";
import { evaluatePromo } from "@/data/promos";
import { locations, site } from "@/data/site";
import { formatEUR, cn, generateOrderNumber, commas } from "@/lib/utils";

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

  if (!hydrated) return <div className="wrap py-20 text-foreground/70">Chargement de votre panier…</div>;

  if (lines.length === 0 && !sent) {
    return (
      <div className="wrap py-24">
        <h1 className="t-h1">Votre panier est vide</h1>
        <p className="t-lead mt-5">Ajoutez des produits pour passer commande.</p>
        <Link href="/boutique" className="btn btn-primary mt-8">
          Voir la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="wrap pb-24 pt-7 sm:pt-9">
      <Link href="/panier" className="link text-[0.9375rem]">
        Retour au panier
      </Link>
      <h1 className="t-h1 mt-8">Finaliser ma commande</h1>
      <p className="t-lead mt-5 measure-wide">
        Dernière étape : vos coordonnées et votre mode de livraison. Votre récapitulatif nous est envoyé sur WhatsApp en un geste ; nous confirmons la disponibilité et vous adressons votre facture avec un lien de paiement sécurisé (ou vous réglez sur place pour un retrait).
      </p>

      {Object.keys(errors).length > 0 && (
        <p role="alert" className="mt-8 rounded-[3px] bg-danger-soft px-4 py-3.5 text-danger">
          Merci de vérifier les champs signalés ci-dessous.
        </p>
      )}

      {sent && (
        <div role="status" className="mt-8 rounded-[3px] border border-or/60 px-5 py-4">
          <p className="font-medium">WhatsApp s'est ouvert avec votre récapitulatif : il ne reste qu'à appuyer sur « Envoyer ».</p>
          <p className="mt-1.5 text-[0.9375rem] text-foreground/75">Rien ne s'est ouvert ? Utilisez « Copier le récapitulatif » puis collez-le dans WhatsApp au {site.phoneDisplay}, ou envoyez-le par email.</p>
        </div>
      )}

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
        <form onSubmit={(e) => e.preventDefault()} className="panel sheet lg:col-span-7" noValidate>
          <Section n={1} title="Vos coordonnées">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Prénom" error={errors.firstName}>
                <input className="field" autoComplete="given-name" value={form.firstName} onChange={set("firstName")} aria-invalid={!!errors.firstName} />
              </Field>
              <Field label="Nom" error={errors.lastName}>
                <input className="field" autoComplete="family-name" value={form.lastName} onChange={set("lastName")} aria-invalid={!!errors.lastName} />
              </Field>
              <Field label="Téléphone (WhatsApp)" error={errors.phone}>
                <input type="tel" className="field" autoComplete="tel" inputMode="tel" value={form.phone} onChange={set("phone")} aria-invalid={!!errors.phone} />
              </Field>
              <Field label="Email (facultatif, pour la facture)" error={errors.email}>
                <input type="email" className="field" autoComplete="email" inputMode="email" value={form.email} onChange={set("email")} aria-invalid={!!errors.email} />
              </Field>
            </div>
          </Section>

          <Section n={2} title="Livraison ou retrait">
            <div className="mb-5 grid gap-4 sm:grid-cols-2">
              <Field label="Code postal" hint="Détermine les options disponibles" error={errors.postalCode}>
                <input className="field" inputMode="numeric" autoComplete="postal-code" maxLength={5} value={form.postalCode} onChange={set("postalCode")} aria-invalid={!!errors.postalCode} />
              </Field>
              <Field label="Ville" error={errors.city}>
                <input className="field" autoComplete="address-level2" value={form.city} onChange={set("city")} aria-invalid={!!errors.city} />
              </Field>
            </div>
            <div className="space-y-2" role="radiogroup" aria-label="Mode de livraison">
              {methods.map((m) => {
                const active = m.id === shippingMethod;
                return (
                  <label key={m.id} data-active={active ? "true" : undefined} className="choice flex items-start gap-3.5 p-4">
                    <input type="radio" name="shipping" value={m.id} checked={active} onChange={() => setShippingMethod(m.id)} className="mt-1 h-4 w-4 shrink-0 accent-[#d7b565]" />
                    <span className="flex-1">
                      <span className="flex items-baseline justify-between gap-3">
                        <span className="font-medium">{m.name}</span>
                        <span className="t-num whitespace-nowrap font-medium">{m.free || m.computedPriceCents === 0 ? "Offert" : formatEUR(m.computedPriceCents)}</span>
                      </span>
                      <span className="mt-0.5 block text-[0.875rem] opacity-75">{m.description}</span>
                      <span className="mt-1 block text-[0.875rem] opacity-75">{m.delay}</span>
                    </span>
                  </label>
                );
              })}
            </div>
            <p className="t-fine mt-3">Frais de port indicatifs, confirmés sur votre facture avec le montant exact.</p>

            {shippingMethod === "retrait" ? (
              <div className="mt-5">
                <Field label="Point de retrait">
                  <select className="field" value={form.pickupPoint} onChange={set("pickupPoint")}>
                    {locations.pickupPoints.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.postalCode})
                      </option>
                    ))}
                  </select>
                </Field>
                <p className="t-fine mt-2">Rendez-vous convenu par WhatsApp. Paiement par lien sécurisé ou sur place (espèces ou carte).</p>
              </div>
            ) : (
              <div className="mt-5 grid gap-4">
                <Field label="Adresse" error={errors.line1}>
                  <input className="field" autoComplete="address-line1" value={form.line1} onChange={set("line1")} placeholder="N° et nom de rue" aria-invalid={!!errors.line1} />
                </Field>
                <Field label="Complément (bâtiment, étage, digicode…)">
                  <input className="field" autoComplete="address-line2" value={form.line2} onChange={set("line2")} />
                </Field>
              </div>
            )}
          </Section>

          <Section n={3} title="Dernières précisions">
            <Field label="Notes pour votre commande (saveur de recharge, créneau, consignes…)">
              <textarea className="field" rows={3} maxLength={500} value={form.notes} onChange={set("notes")} />
            </Field>
            <div className="mt-5 space-y-2.5">
              <Check checked={form.ageConfirmed} onChange={set("ageConfirmed")} error={errors.ageConfirmed}>
                Je certifie être <strong>majeur(e) (18 ans ou plus)</strong>. La vente de CBD est interdite aux mineurs.
              </Check>
              <Check checked={form.prudenceAck} onChange={set("prudenceAck")} error={errors.prudenceAck}>
                J'ai lu les{" "}
                <Link href="/conseils-prudence" target="_blank" className="link">
                  conseils de prudence
                </Link>
                {hasStrong ? " (mon panier contient des produits à concentration élevée : très petite quantité pour commencer, pas de conduite après usage)" : " et je consommerai avec modération, sans conduire après usage"}.
              </Check>
              <Check checked={form.cgvAccepted} onChange={set("cgvAccepted")} error={errors.cgvAccepted}>
                J'accepte les{" "}
                <Link href="/cgv" target="_blank" className="link">
                  conditions générales de vente
                </Link>{" "}
                et la{" "}
                <Link href="/confidentialite" target="_blank" className="link">
                  politique de confidentialité
                </Link>
                .
              </Check>
            </div>
          </Section>
        </form>

        <aside className="lg:col-span-5">
          <div className="panel paper-object lg:sticky lg:top-28">
            <div className="space-y-6 p-6 sm:p-7">
              <div>
                <h2 className="t-h3">Récapitulatif</h2>
                <p className="t-fine t-num mt-1">Référence {orderNumber}</p>
              </div>
              <ul className="max-h-[40vh] overflow-y-auto">
                {lines.map((l) => (
                  <li key={l.sku} className="flex gap-3.5 border-t border-foreground/20 py-3 text-[0.9375rem] last:border-b">
                    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[3px] bg-[#e9dfc6]">
                      <Image src={labelImage(l.image)} alt="" fill sizes="56px" className="object-cover" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{l.name}</span>
                      <span className="t-fine block">
                        {commas(l.variantLabel)}, quantité {l.quantity}
                      </span>
                    </span>
                    <span className="t-num whitespace-nowrap">{formatEUR(l.unitPriceCents * l.quantity)}</span>
                  </li>
                ))}
              </ul>

              <div>
                <label htmlFor="code-promo" className="field-label">
                  Code promo
                </label>
                <div className="flex gap-2">
                  <input id="code-promo" className="field uppercase" value={promoInput} onChange={(e) => setPromoInput(e.target.value)} placeholder="BIENVENUE10" aria-invalid={!!promoError} />
                  <button type="button" onClick={applyPromo} className="btn btn-ghost btn-sm min-h-0 shrink-0 px-5">
                    Appliquer
                  </button>
                </div>
                {promoError && <p className="mt-1.5 text-[0.875rem] text-danger">{promoError}</p>}
                {promoCode && !promoError && discountCents > 0 && <p className="mt-1.5 text-[0.875rem] font-medium text-success">Code {promoCode} appliqué.</p>}
              </div>

              <dl className="space-y-2 text-[0.9688rem]">
                <div className="flex justify-between gap-4">
                  <dt className="text-foreground/75">Sous-total</dt>
                  <dd className="t-num">{formatEUR(subtotal)}</dd>
                </div>
                {discountCents > 0 && (
                  <div className="flex justify-between gap-4 font-medium text-success">
                    <dt>Remise</dt>
                    <dd className="t-num">− {formatEUR(discountCents)}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <dt className="text-foreground/75">Livraison (indicatif)</dt>
                  <dd className="t-num">{shippingCents === 0 ? "Offerte" : formatEUR(shippingCents)}</dd>
                </div>
              </dl>
            </div>

            <div aria-hidden className="rule-double" />

            <div className="space-y-4 p-6 sm:p-7">
              <div className="flex items-baseline justify-between gap-4">
                <span>Total estimé</span>
                <span className="t-num font-serif text-[2.25rem] font-light leading-none tracking-[-0.02em]">{formatEUR(total)}</span>
              </div>
              <a href={waUrl} onClick={onSend} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full">
                Envoyer ma commande sur WhatsApp
              </a>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={copyRecap} className="btn btn-ghost btn-sm px-3">
                  {copied ? "Copié" : "Copier le récapitulatif"}
                </button>
                <a
                  href={mailUrl}
                  onClick={(e) => {
                    if (!validate()) e.preventDefault();
                  }}
                  className="btn btn-ghost btn-sm px-3"
                >
                  Envoyer par email
                </a>
              </div>
              <p className="t-fine">
                Après réception, nous confirmons la disponibilité et vous envoyons votre facture avec un lien de paiement sécurisé par carte (Shine) ou un RIB. Aucune donnée bancaire n'est saisie sur ce site.
              </p>
              <ul className="t-fine space-y-1">
                <li>Expédition sous 24 h ouvrées après paiement.</li>
                <li>Colis neutre, sachets hermétiques.</li>
                <li>Produits réservés aux adultes, THC &lt; 0,3 %.</li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10 border-t border-foreground/25 pt-9 first:mt-0 first:border-t-0 first:pt-0">
      <h2 className="mb-6 flex items-center gap-4">
        <span aria-hidden className="step-num">
          {n}
        </span>
        <span className="t-h3">{title}</span>
      </h2>
      {children}
    </section>
  );
}

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      {children}
      {hint && !error && <span className="t-fine mt-1 block">{hint}</span>}
      {error && <span className="mt-1 block text-[0.875rem] text-danger">{error}</span>}
    </label>
  );
}

function Check({ checked, onChange, error, children }: { checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; error?: string; children: React.ReactNode }) {
  return (
    <label className={cn("flex cursor-pointer items-start gap-3 rounded-[3px] border p-4 transition-colors", error ? "border-danger bg-danger-soft" : checked ? "border-foreground/60" : "border-foreground/25 hover:border-foreground/50")}>
      <input type="checkbox" checked={checked} onChange={onChange} className="mt-0.5 h-[1.125rem] w-[1.125rem] shrink-0 accent-[#d7b565]" />
      <span className="text-[0.9375rem] leading-snug">
        {children}
        {error && <span className="mt-1 block text-[0.875rem] text-danger">{error}</span>}
      </span>
    </label>
  );
}
