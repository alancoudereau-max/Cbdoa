import { NextResponse } from "next/server";
import { processCheckout } from "@/lib/checkout";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const ip = clientIp(req.headers);
  const rl = rateLimit(`checkout:${ip}`, 10, 10 * 60 * 1000);
  if (!rl.ok) return NextResponse.json({ ok: false, error: "Trop de tentatives. Réessayez dans quelques minutes." }, { status: 429 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }
  const result = await processCheckout(body, { ip, userAgent: req.headers.get("user-agent") ?? undefined });
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
