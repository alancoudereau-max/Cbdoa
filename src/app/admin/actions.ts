"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ADMIN_COOKIE, SESSION_HOURS, adminConfigured, checkPassword, createSessionToken, verifySessionToken } from "@/lib/admin-auth";
import { getSupabase, getOrderById, type OrderStatus } from "@/lib/supabase";
import { getShippingMethod } from "@/lib/shipping";
import { sendShippingNotification } from "@/lib/email";
import { products } from "@/data/products";

async function requireAdmin() {
  const store = await cookies();
  const ok = await verifySessionToken(store.get(ADMIN_COOKIE)?.value);
  if (!ok) redirect("/admin");
}

export async function loginAction(_prev: { error?: string } | undefined, formData: FormData): Promise<{ error?: string }> {
  if (!adminConfigured()) return { error: "L'administration n'est pas configurée (ADMIN_PASSWORD / ADMIN_SESSION_SECRET manquants)." };
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin/commandes");
  if (!(await checkPassword(password))) {
    await new Promise((r) => setTimeout(r, 800));
    return { error: "Mot de passe incorrect." };
  }
  const token = await createSessionToken();
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: SESSION_HOURS * 3600 });
  redirect(next.startsWith("/admin") ? next : "/admin/commandes");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin");
}

const ALLOWED: OrderStatus[] = ["pending", "awaiting_pickup_payment", "paid", "preparing", "shipped", "ready_for_pickup", "delivered", "cancelled", "refunded"];

export async function updateOrderAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const sb = getSupabase();
  if (!sb) return;
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as OrderStatus;
  const tracking = String(formData.get("tracking_number") ?? "").trim();
  const notify = formData.get("notify") === "on";
  if (!id || !ALLOWED.includes(status)) return;

  const found = await getOrderById(id);
  if (!found) return;
  const method = getShippingMethod(found.order.shipping_method);
  const update: Record<string, unknown> = { status };
  if (tracking) {
    update.tracking_number = tracking;
    update.tracking_url = method?.trackingUrl ? method.trackingUrl(tracking) : null;
  }
  if (status === "shipped" && !found.order.shipped_at) update.shipped_at = new Date().toISOString();
  if (status === "paid" && !found.order.paid_at) update.paid_at = new Date().toISOString();
  await sb.from("orders").update(update).eq("id", id);

  if (notify && (status === "shipped" || status === "ready_for_pickup")) {
    const fresh = await getOrderById(id);
    if (fresh) {
      try {
        await sendShippingNotification(fresh.order, fresh.items);
      } catch (e) {
        console.error("[admin] email expédition", e);
      }
    }
  }
  revalidatePath(`/admin/commandes/${id}`);
  revalidatePath("/admin/commandes");
}

export async function toggleStockAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const sb = getSupabase();
  if (!sb) return;
  const sku = String(formData.get("sku") ?? "");
  const available = formData.get("available") === "true";
  const product = products.find((p) => p.variants.some((v) => v.sku === sku));
  if (!product) return;
  await sb.from("stock").upsert({ variant_sku: sku, product_slug: product.slug, available, updated_at: new Date().toISOString() });
  revalidatePath("/admin/stock");
  revalidatePath("/boutique");
  revalidatePath(`/produit/${product.slug}`);
  revalidatePath("/");
}

export async function toggleProductStockAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const sb = getSupabase();
  if (!sb) return;
  const slug = String(formData.get("slug") ?? "");
  const available = formData.get("available") === "true";
  const product = products.find((p) => p.slug === slug);
  if (!product) return;
  await sb.from("stock").upsert(product.variants.map((v) => ({ variant_sku: v.sku, product_slug: slug, available, updated_at: new Date().toISOString() })));
  revalidatePath("/admin/stock");
  revalidatePath("/boutique");
  revalidatePath(`/produit/${slug}`);
  revalidatePath("/");
}

export async function upsertPromoAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const sb = getSupabase();
  if (!sb) return;
  const code = String(formData.get("code") ?? "").trim().toUpperCase().replace(/[^A-Z0-9-]/g, "");
  const type = String(formData.get("type")) === "percent" ? "percent" : "fixed";
  const rawValue = Number(String(formData.get("value") ?? "0").replace(",", "."));
  const value = type === "percent" ? Math.round(rawValue) : Math.round(rawValue * 100);
  const min = Math.round(Number(String(formData.get("min") ?? "0").replace(",", ".")) * 100);
  const maxUses = formData.get("max_uses") ? Number(formData.get("max_uses")) : null;
  const expires = String(formData.get("expires_at") ?? "");
  const description = String(formData.get("description") ?? "").slice(0, 200);
  if (!code || !value || value <= 0) return;
  await sb.from("promo_codes").upsert({
    code,
    type,
    value,
    min_subtotal_cents: Math.max(0, min),
    max_uses: maxUses && maxUses > 0 ? maxUses : null,
    expires_at: expires ? new Date(expires).toISOString() : null,
    description: description || null,
    active: true,
  });
  revalidatePath("/admin/codes-promo");
}

export async function togglePromoAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const sb = getSupabase();
  if (!sb) return;
  const code = String(formData.get("code") ?? "");
  const active = formData.get("active") === "true";
  await sb.from("promo_codes").update({ active }).eq("code", code);
  revalidatePath("/admin/codes-promo");
}
