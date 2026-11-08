import { NextResponse } from "next/server";
import { getMolliePayment, mapMollieStatus } from "@/lib/mollie";
import { getSupabase, type OrderRow, type OrderItemRow } from "@/lib/supabase";
import { sendOrderConfirmation, sendMerchantNewOrder } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Webhook Mollie : Mollie envoie `id=tr_xxx` (form-urlencoded). On ne fait JAMAIS confiance
 * au contenu : on relit le paiement via l'API avec notre clé secrète, puis on met la commande à jour.
 * Idempotent : peut être appelé plusieurs fois sans effet de bord.
 */
export async function POST(req: Request) {
  const text = await req.text();
  const params = new URLSearchParams(text);
  const paymentId = params.get("id");
  if (!paymentId || !/^tr_[A-Za-z0-9]+$/.test(paymentId)) return new NextResponse("Bad request", { status: 400 });

  const sb = getSupabase();
  if (!sb) return new NextResponse("No database", { status: 500 });

  try {
    const payment = await getMolliePayment(paymentId);
    const status = mapMollieStatus(payment);
    const metadata = (payment.metadata ?? {}) as { orderId?: string };

    await sb.from("webhook_events").insert({ provider: "mollie", external_id: paymentId, payload: { status: payment.status, method: payment.method, metadata } });

    let { data: order } = await sb.from("orders").select("*").eq("payment_id", paymentId).maybeSingle();
    if (!order && metadata.orderId && /^[0-9a-f-]{36}$/i.test(metadata.orderId)) {
      ({ data: order } = await sb.from("orders").select("*").eq("id", metadata.orderId).maybeSingle());
    }
    if (!order) return new NextResponse("Order not found", { status: 200 }); // 200 pour éviter les re-tentatives infinies

    const current = order as OrderRow;
    const update: Partial<OrderRow> & { payment_status: string; payment_method?: string | null } = {
      payment_status: payment.status,
      payment_method: payment.method ?? null,
      payment_id: paymentId,
    };

    // Ne jamais rétrograder une commande déjà payée / expédiée
    const locked: OrderRow["status"][] = ["paid", "preparing", "shipped", "ready_for_pickup", "delivered", "refunded"];
    const alreadyLocked = locked.includes(current.status);

    if (status === "paid" && !alreadyLocked) {
      update.status = "paid";
      update.paid_at = new Date().toISOString();
    } else if (status === "refunded") {
      update.status = "refunded";
    } else if (!alreadyLocked && (status === "failed" || status === "cancelled" || status === "expired")) {
      update.status = status;
    }

    await sb.from("orders").update(update).eq("id", current.id);

    // Première confirmation de paiement → emails + compteur promo
    if (status === "paid" && !alreadyLocked) {
      const { data: items } = await sb.from("order_items").select("*").eq("order_id", current.id);
      const fresh = { ...current, ...update } as OrderRow;
      if (fresh.promo_code) await sb.rpc("increment_promo_use", { p_code: fresh.promo_code });
      await Promise.allSettled([sendOrderConfirmation(fresh, (items ?? []) as OrderItemRow[]), sendMerchantNewOrder(fresh, (items ?? []) as OrderItemRow[])]);
    }

    return new NextResponse("OK", { status: 200 });
  } catch (e) {
    console.error("[webhook mollie]", e);
    return new NextResponse("Error", { status: 500 }); // Mollie réessaiera
  }
}

// Mollie peut vérifier l'URL avec un GET
export async function GET() {
  return new NextResponse("Webhook Mollie CBDoux — OK", { status: 200 });
}
