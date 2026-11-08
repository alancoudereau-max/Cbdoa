import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabase } from "@/lib/supabase";
import { sendContactMessage } from "@/lib/email";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  name: z.string().trim().min(1, "Votre nom est requis.").max(100),
  contact: z.string().trim().min(3, "Téléphone ou email requis.").max(120),
  message: z.string().trim().min(5, "Message trop court.").max(2000),
  website: z.string().max(0).optional(), // honeypot anti-spam
});

export async function POST(req: Request) {
  const ip = clientIp(req.headers);
  if (!rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000).ok) {
    return NextResponse.json({ ok: false, error: "Trop de messages envoyés. Réessayez plus tard." }, { status: 429 });
  }
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message ?? "Formulaire invalide." }, { status: 400 });
  const { name, contact, message } = parsed.data;

  const sb = getSupabase();
  if (sb) await sb.from("contact_messages").insert({ name, contact, message });
  try {
    await sendContactMessage({ name, contact, message });
  } catch (e) {
    console.error("[contact] email", e);
    if (!sb) return NextResponse.json({ ok: false, error: "Envoi impossible pour le moment. Écrivez-nous sur WhatsApp." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
