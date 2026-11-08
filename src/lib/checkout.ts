import "server-only";
import { z } from "zod";
import { findVariant } from "@/data/products";
import { locations, SITE_URL } from "@/data/site";
import { availableShippingMethods, getShippingMethod, isLocalPostalCode, shippingPriceFor } from "@/lib/shipping";
import { getSupabase, hasDatabase, getPromoCode, evaluatePromo, getAvailabilityMap, type OrderRow, type OrderItemRow } from "@/lib/supabase";
import { createMolliePayment, hasMollie } from "@/lib/mollie";
import { generateOrderNumber } from "@/lib/utils";
import { sendOrderConfirmation, sendMerchantNewOrder } from "@/lib/email";

export const checkoutSchema = z.object({
  lines: z
    .array(z.object({ sku: z.string().min(1).max(60), quantity: z.number().int().min(1).max(20) }))
    .min(1, "Votre panier est vide.")
    .max(40),
  customer: z.object({
    email: z.string().trim().email("Adresse email invalide.").max(120),
    phone: z
      .string()
      .trim()
      .min(6, "Numéro de téléphone requis (pour la livraison et le suivi).")
      .max(30)
      .regex(/^[+0-9 .()-]+$/, "Numéro de téléphone invalide."),
    firstName: z.string().trim().min(1, "Prénom requis.").max(60),
    lastName: z.string().trim().min(1, "Nom requis.").max(60),
  }),
  shippingMethod: z.enum(["lettre-suivie", "colissimo", "chronopost", "livraison-locale", "retrait"]),
  address: z
    .object({
      line1: z.string().trim().min(3, "Adresse requise.").max(120),
      line2: z.string().trim().max(120).optional().or(z.literal("")),
      postalCode: z.string().trim().regex(/^\d{5}$/, "Code postal à 5 chiffres."),
      city: z.string().trim().min(1, "Ville requise.").max(80),
    })
    .optional(),
  pickupPoint: z.enum(["damprichard", "le-russey"]).optional(),
  payOnPickup: z.boolean().optional(),
  promoCode: z.string().trim().max(40).optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
  ageConfirmed: z.literal(true, { message: "Vous devez certifier être majeur(e)." }),
  prudenceAck: z.literal(true, { message: "Merci de lire et d'accepter les conseils de prudence." }),
  cgvAccepted: z.literal(true, { message: "Merci d'accepter les conditions générales de vente." }),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export type Quote = {
  lines: Array<{ sku: string; slug: string; name: string; variantLabel: string; unitPriceCents: number; quantity: number; totalCents: number; grams: number }>;
  subtotalCents: number;
  shippingCents: number;
  discountCents: number;
  totalCents: number;
  promoError?: string;
  promoCode?: string;
};

/** Recalcule intégralement le devis côté serveur (les prix du client ne sont jamais utilisés). */
export async function buildQuote(input: {
  lines: Array<{ sku: string; quantity: number }>;
  shippingMethod: string;
  postalCode?: string;
  promoCode?: string;
}): Promise<{ quote: Quote; errors: string[] }> {
  const errors: string[] = [];
  const availability = await getAvailabilityMap();
  const lines: Quote["lines"] = [];

  for (const l of input.lines) {
    const found = findVariant(l.sku);
    if (!found || found.product.hidden) {
      errors.push(`Un article de votre panier n'est plus disponible (${l.sku}).`);
      continue;
    }
    if (availability[l.sku] === false) {
      errors.push(`« ${found.product.name} — ${found.variant.tierLabel} · ${found.variant.format} » est épuisé.`);
      continue;
    }
    lines.push({
      sku: l.sku,
      slug: found.product.slug,
      name: found.product.name,
      variantLabel: `${found.variant.tierLabel} · ${found.variant.format}`,
      unitPriceCents: found.variant.priceCents,
      quantity: l.quantity,
      totalCents: found.variant.priceCents * l.quantity,
      grams: found.variant.grams,
    });
  }

  const subtotalCents = lines.reduce((s, l) => s + l.totalCents, 0);

  const method = getShippingMethod(input.shippingMethod);
  let shippingCents = 0;
  if (!method) {
    errors.push("Mode de livraison invalide.");
  } else {
    const allowed = availableShippingMethods({ subtotalCents, lines, postalCode: input.postalCode }).some((m) => m.id === method.id);
    if (!allowed) errors.push(`Le mode « ${method.name} » n'est pas disponible pour ce panier${method.localOnly ? " (hors zone de livraison locale)" : ""}.`);
    shippingCents = shippingPriceFor(method, subtotalCents);
  }

  let discountCents = 0;
  let promoError: string | undefined;
  let promoCode: string | undefined;
  if (input.promoCode) {
    if (!hasDatabase()) {
      promoError = "Les codes promo seront disponibles très prochainement.";
    } else {
    const promo = await getPromoCode(input.promoCode);
    const res = evaluatePromo(promo, subtotalCents);
    if (res.error) promoError = res.error;
    else {
      discountCents = res.discountCents;
      promoCode = promo!.code;
    }
    }
  }

  const totalCents = Math.max(0, subtotalCents - discountCents + shippingCents);
  return { quote: { lines, subtotalCents, shippingCents, discountCents, totalCents, promoError, promoCode }, errors };
}

export type CheckoutResult =
  | { ok: true; redirectUrl: string; orderNumber: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export async function processCheckout(raw: unknown, meta: { ip?: string; userAgent?: string }): Promise<CheckoutResult> {
  const parsed = checkoutSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[issue.path.join(".")] = issue.message;
    return { ok: false, error: "Merci de vérifier les champs du formulaire.", fieldErrors };
  }
  const input = parsed.data;
  const method = getShippingMethod(input.shippingMethod)!;

  if (method.requiresAddress && !input.address) return { ok: false, error: "Adresse de livraison requise.", fieldErrors: { "address.line1": "Adresse requise." } };
  if (method.id === "livraison-locale" && !isLocalPostalCode(input.address?.postalCode)) {
    return { ok: false, error: "Ce code postal n'est pas dans notre zone de livraison locale. Choisissez Colissimo ou Chronopost.", fieldErrors: { shippingMethod: "Hors zone locale." } };
  }
  if (method.id === "retrait" && !input.pickupPoint) return { ok: false, error: "Choisissez un point de retrait.", fieldErrors: { pickupPoint: "Point de retrait requis." } };

  const { quote, errors } = await buildQuote({
    lines: input.lines,
    shippingMethod: input.shippingMethod,
    postalCode: input.address?.postalCode,
    promoCode: input.promoCode || undefined,
  });
  if (errors.length) return { ok: false, error: errors.join(" ") };
  if (quote.promoError) return { ok: false, error: quote.promoError, fieldErrors: { promoCode: quote.promoError } };
  if (quote.lines.length === 0) return { ok: false, error: "Votre panier est vide." };

  const sb = getSupabase();
  if (!sb) return { ok: false, error: "La boutique n'est pas encore connectée à sa base de données. Contactez-nous sur WhatsApp pour commander." };

  const payOnPickup = method.id === "retrait" && method.allowPayOnPickup && input.payOnPickup === true;
  if (!payOnPickup && !hasMollie()) return { ok: false, error: "Le paiement en ligne n'est pas encore activé. Choisissez le retrait avec paiement sur place ou contactez-nous." };

  const pickup = input.pickupPoint ? locations.pickupPoints.find((p) => p.id === input.pickupPoint) : undefined;
  const number = generateOrderNumber();

  const { data: order, error: insertError } = await sb
    .from("orders")
    .insert({
      number,
      status: payOnPickup ? "awaiting_pickup_payment" : "pending",
      payment_provider: payOnPickup ? "sur-place" : "mollie",
      email: input.customer.email.toLowerCase(),
      phone: input.customer.phone,
      first_name: input.customer.firstName,
      last_name: input.customer.lastName,
      shipping_method: method.id,
      shipping_address: input.address
        ? { line1: input.address.line1, line2: input.address.line2 || undefined, postalCode: input.address.postalCode, city: input.address.city, country: "France" }
        : null,
      pickup_point: pickup?.name ?? null,
      subtotal_cents: quote.subtotalCents,
      shipping_cents: quote.shippingCents,
      discount_cents: quote.discountCents,
      total_cents: quote.totalCents,
      promo_code: quote.promoCode ?? null,
      notes: input.notes || null,
      age_confirmed: true,
      prudence_ack: true,
      cgv_accepted: true,
      ip: meta.ip ?? null,
      user_agent: meta.userAgent?.slice(0, 300) ?? null,
    })
    .select("*")
    .single();

  if (insertError || !order) {
    console.error("[checkout] insert order", insertError);
    return { ok: false, error: "Impossible d'enregistrer la commande pour le moment. Réessayez dans un instant." };
  }

  const itemsPayload = quote.lines.map((l) => ({
    order_id: order.id,
    product_slug: l.slug,
    variant_sku: l.sku,
    name: l.name,
    variant_label: l.variantLabel,
    unit_price_cents: l.unitPriceCents,
    quantity: l.quantity,
    total_cents: l.totalCents,
  }));
  const { error: itemsError } = await sb.from("order_items").insert(itemsPayload);
  if (itemsError) {
    console.error("[checkout] insert items", itemsError);
    await sb.from("orders").delete().eq("id", order.id);
    return { ok: false, error: "Impossible d'enregistrer la commande pour le moment. Réessayez dans un instant." };
  }

  const typedOrder = order as OrderRow;
  const typedItems = itemsPayload.map((it, i) => ({ ...it, id: String(i) })) as OrderItemRow[];

  // Retrait avec paiement sur place : pas de paiement en ligne → confirmation immédiate
  if (payOnPickup) {
    if (quote.promoCode) await sb.rpc("increment_promo_use", { p_code: quote.promoCode });
    await Promise.allSettled([sendOrderConfirmation(typedOrder, typedItems), sendMerchantNewOrder(typedOrder, typedItems)]);
    return { ok: true, redirectUrl: `${SITE_URL}/commande/confirmation?n=${encodeURIComponent(number)}&e=${encodeURIComponent(typedOrder.email)}`, orderNumber: number };
  }

  // Paiement en ligne Mollie
  try {
    const { paymentId, checkoutUrl } = await createMolliePayment({
      orderId: order.id,
      orderNumber: number,
      totalCents: quote.totalCents,
      description: `CBDoux — commande ${number}`,
      redirectUrl: `${SITE_URL}/commande/confirmation?n=${encodeURIComponent(number)}&e=${encodeURIComponent(typedOrder.email)}`,
      cancelUrl: `${SITE_URL}/commande?annule=1`,
      webhookUrl: `${SITE_URL}/api/webhooks/mollie`,
      email: typedOrder.email,
      givenName: input.customer.firstName,
      familyName: input.customer.lastName,
      address: input.address
        ? { streetAndNumber: input.address.line1, postalCode: input.address.postalCode, city: input.address.city, country: "FR" }
        : undefined,
    });
    await sb.from("orders").update({ payment_id: paymentId, payment_status: "open" }).eq("id", order.id);
    return { ok: true, redirectUrl: checkoutUrl, orderNumber: number };
  } catch (e) {
    console.error("[checkout] mollie", e);
    await sb.from("orders").update({ status: "failed", payment_status: "creation_failed" }).eq("id", order.id);
    return { ok: false, error: "Le service de paiement est momentanément indisponible. Réessayez dans quelques minutes ou contactez-nous sur WhatsApp." };
  }
}
