import { NextResponse } from "next/server";
import { z } from "zod";
import { buildQuote } from "@/lib/checkout";
import { availableShippingMethods } from "@/lib/shipping";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  lines: z.array(z.object({ sku: z.string().min(1).max(60), quantity: z.number().int().min(1).max(20) })).max(40),
  shippingMethod: z.string().max(40).optional(),
  postalCode: z.string().max(10).optional(),
  promoCode: z.string().max(40).optional(),
});

/** Devis serveur : prix, livraison disponible, remise — appelé par le tunnel de commande. */
export async function POST(req: Request) {
  const ip = clientIp(req.headers);
  if (!rateLimit(`quote:${ip}`, 60, 10 * 60 * 1000).ok) {
    return NextResponse.json({ error: "Trop de requêtes." }, { status: 429 });
  }
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  const { lines, shippingMethod, postalCode, promoCode } = parsed.data;
  const { quote, errors } = await buildQuote({ lines, shippingMethod: shippingMethod ?? "colissimo", postalCode, promoCode });
  const methods = availableShippingMethods({
    subtotalCents: quote.subtotalCents,
    lines: quote.lines.map((l) => ({ grams: l.grams, quantity: l.quantity })),
    postalCode,
  }).map((m) => ({ id: m.id, name: m.name, description: m.description, delay: m.delay, priceCents: m.computedPriceCents, free: m.free, requiresAddress: m.requiresAddress, allowPayOnPickup: Boolean(m.allowPayOnPickup) }));
  return NextResponse.json({ quote, methods, errors: errors.filter((e) => !e.startsWith("Le mode")) });
}
