import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/** Indique si la base de données est configurée (variables d'environnement présentes). */
export function hasDatabase(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Client Supabase côté serveur (clé service_role — ne JAMAIS exposer au navigateur).
 * Retourne null si la base n'est pas configurée, pour que le site vitrine fonctionne sans.
 */
export function getSupabase(): SupabaseClient | null {
  if (!hasDatabase()) return null;
  if (!client) {
    client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}

// ───────────────────────────── Types ─────────────────────────────

export type OrderStatus =
  | "pending" // créée, en attente de paiement
  | "awaiting_pickup_payment" // retrait avec paiement sur place
  | "paid"
  | "preparing"
  | "shipped"
  | "ready_for_pickup"
  | "delivered"
  | "cancelled"
  | "failed"
  | "expired"
  | "refunded";

export const orderStatusLabels: Record<OrderStatus, string> = {
  pending: "En attente de paiement",
  awaiting_pickup_payment: "Retrait — paiement sur place",
  paid: "Payée",
  preparing: "En préparation",
  shipped: "Expédiée",
  ready_for_pickup: "Prête pour le retrait",
  delivered: "Livrée / retirée",
  cancelled: "Annulée",
  failed: "Paiement échoué",
  expired: "Paiement expiré",
  refunded: "Remboursée",
};

export type OrderRow = {
  id: string;
  number: string;
  status: OrderStatus;
  payment_provider: string | null;
  payment_id: string | null;
  payment_status: string | null;
  payment_method: string | null;
  email: string;
  phone: string | null;
  first_name: string;
  last_name: string;
  shipping_method: string;
  shipping_address: {
    line1: string;
    line2?: string;
    postalCode: string;
    city: string;
    country: string;
  } | null;
  pickup_point: string | null;
  subtotal_cents: number;
  shipping_cents: number;
  discount_cents: number;
  total_cents: number;
  promo_code: string | null;
  notes: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  age_confirmed: boolean;
  prudence_ack: boolean;
  cgv_accepted: boolean;
  created_at: string;
  paid_at: string | null;
  shipped_at: string | null;
};

export type OrderItemRow = {
  id: string;
  order_id: string;
  product_slug: string;
  variant_sku: string;
  name: string;
  variant_label: string;
  unit_price_cents: number;
  quantity: number;
  total_cents: number;
};

export type PromoCodeRow = {
  code: string;
  type: "percent" | "fixed";
  value: number;
  min_subtotal_cents: number;
  active: boolean;
  expires_at: string | null;
  max_uses: number | null;
  uses: number;
  description: string | null;
};

// ───────────────────────────── Stock ─────────────────────────────

/** Carte sku → disponible. Sans base ou en cas d'erreur : tout est disponible. */
export async function getAvailabilityMap(): Promise<Record<string, boolean>> {
  const sb = getSupabase();
  if (!sb) return {};
  const { data, error } = await sb.from("stock").select("variant_sku, available");
  if (error || !data) return {};
  const map: Record<string, boolean> = {};
  for (const row of data as Array<{ variant_sku: string; available: boolean }>) map[row.variant_sku] = row.available;
  return map;
}

export function isSkuAvailable(map: Record<string, boolean>, sku: string): boolean {
  return map[sku] !== false;
}

// ───────────────────────────── Commandes ─────────────────────────────

export async function getOrderByNumberAndEmail(number: string, email: string): Promise<{ order: OrderRow; items: OrderItemRow[] } | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data: order } = await sb
    .from("orders")
    .select("*")
    .eq("number", number.trim().toUpperCase())
    .ilike("email", email.trim())
    .maybeSingle();
  if (!order) return null;
  const { data: items } = await sb.from("order_items").select("*").eq("order_id", order.id).order("name");
  return { order: order as OrderRow, items: (items ?? []) as OrderItemRow[] };
}

export async function getOrderById(id: string): Promise<{ order: OrderRow; items: OrderItemRow[] } | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data: order } = await sb.from("orders").select("*").eq("id", id).maybeSingle();
  if (!order) return null;
  const { data: items } = await sb.from("order_items").select("*").eq("order_id", order.id).order("name");
  return { order: order as OrderRow, items: (items ?? []) as OrderItemRow[] };
}

// ───────────────────────────── Codes promo ─────────────────────────────

export async function getPromoCode(code: string): Promise<PromoCodeRow | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb.from("promo_codes").select("*").eq("code", code.trim().toUpperCase()).maybeSingle();
  return (data as PromoCodeRow | null) ?? null;
}

/** Valide un code promo pour un sous-total et retourne la remise (centimes) ou une erreur. */
export function evaluatePromo(promo: PromoCodeRow | null, subtotalCents: number): { discountCents: number; error?: string } {
  if (!promo) return { discountCents: 0, error: "Code promo inconnu." };
  if (!promo.active) return { discountCents: 0, error: "Ce code n'est plus actif." };
  if (promo.expires_at && new Date(promo.expires_at).getTime() < Date.now()) return { discountCents: 0, error: "Ce code a expiré." };
  if (promo.max_uses !== null && promo.uses >= promo.max_uses) return { discountCents: 0, error: "Ce code a atteint son nombre d'utilisations." };
  if (subtotalCents < promo.min_subtotal_cents) {
    return { discountCents: 0, error: `Ce code est valable à partir de ${(promo.min_subtotal_cents / 100).toLocaleString("fr-FR")} € d'achat.` };
  }
  const raw = promo.type === "percent" ? Math.round((subtotalCents * promo.value) / 100) : promo.value;
  return { discountCents: Math.min(raw, subtotalCents) };
}
