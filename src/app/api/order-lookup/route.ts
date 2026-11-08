import { NextResponse } from "next/server";
import { z } from "zod";
import { getOrderByNumberAndEmail, orderStatusLabels } from "@/lib/supabase";
import { getShippingMethod } from "@/lib/shipping";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({ number: z.string().trim().min(6).max(30), email: z.string().trim().email() });

export async function POST(req: Request) {
  const ip = clientIp(req.headers);
  if (!rateLimit(`lookup:${ip}`, 20, 10 * 60 * 1000).ok) return NextResponse.json({ error: "Trop de requêtes." }, { status: 429 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Numéro de commande ou email invalide." }, { status: 400 });
  const found = await getOrderByNumberAndEmail(parsed.data.number, parsed.data.email);
  if (!found) return NextResponse.json({ error: "Aucune commande trouvée avec ces informations." }, { status: 404 });
  const { order, items } = found;
  const method = getShippingMethod(order.shipping_method);
  return NextResponse.json({
    order: {
      number: order.number,
      status: order.status,
      statusLabel: orderStatusLabels[order.status],
      createdAt: order.created_at,
      paidAt: order.paid_at,
      shippedAt: order.shipped_at,
      shippingMethod: method?.name ?? order.shipping_method,
      trackingNumber: order.tracking_number,
      trackingUrl: order.tracking_url,
      pickupPoint: order.pickup_point,
      totalCents: order.total_cents,
      shippingCents: order.shipping_cents,
      discountCents: order.discount_cents,
      subtotalCents: order.subtotal_cents,
      items: items.map((it) => ({ name: it.name, variantLabel: it.variant_label, quantity: it.quantity, totalCents: it.total_cents })),
    },
  });
}
