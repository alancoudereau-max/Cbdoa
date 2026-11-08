import "server-only";
import { Resend } from "resend";
import { site, company, SITE_URL } from "@/data/site";
import { getShippingMethod } from "@/lib/shipping";
import type { OrderRow, OrderItemRow } from "@/lib/supabase";
import { formatEUR, formatDateFR } from "@/lib/utils";

const FROM = process.env.EMAIL_FROM ?? "CBDoux <onboarding@resend.dev>";
const MERCHANT = process.env.MERCHANT_EMAIL ?? site.email;

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

function esc(s: string | null | undefined): string {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function layout(title: string, body: string): string {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(title)}</title></head>
<body style="margin:0;background:#0d0c0a;font-family:Inter,Helvetica,Arial,sans-serif;color:#f4efe3;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#0d0c0a;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#15130f;border:1px solid rgba(201,168,76,0.25);border-radius:20px;overflow:hidden;">
<tr><td style="padding:28px 28px 8px;text-align:center;">
  <div style="font-family:Georgia,serif;font-size:30px;letter-spacing:-0.5px;color:#d9b85c;">CBD<span style="font-style:italic">oux</span></div>
  <div style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:rgba(244,239,227,0.5);margin-top:4px;">La douceur du Haut-Doubs</div>
</td></tr>
<tr><td style="padding:16px 28px 28px;">${body}</td></tr>
<tr><td style="padding:18px 28px;border-top:1px solid rgba(244,239,227,0.08);font-size:11px;line-height:1.6;color:rgba(244,239,227,0.5);">
  ${esc(company.legalName)} (${esc(company.legalForm)}) · SIREN ${esc(company.siren)} · ${esc(company.address.street)}, ${esc(company.address.postalCode)} ${esc(company.address.city)}<br>
  Produits réservés aux adultes · THC &lt; 0,3 % · Ne pas conduire après usage · <a href="${SITE_URL}/cgv" style="color:#d9b85c">CGV</a> · <a href="${SITE_URL}/confidentialite" style="color:#d9b85c">Confidentialité</a>
</td></tr>
</table></td></tr></table></body></html>`;
}

function itemsTable(items: OrderItemRow[], order: OrderRow): string {
  const rows = items
    .map(
      (it) => `<tr>
      <td style="padding:10px 0;border-bottom:1px solid rgba(244,239,227,0.08);font-size:14px;">${esc(it.name)}<br><span style="font-size:11px;color:rgba(244,239,227,0.55);">${esc(it.variant_label)} × ${it.quantity}</span></td>
      <td style="padding:10px 0;border-bottom:1px solid rgba(244,239,227,0.08);font-size:14px;text-align:right;white-space:nowrap;">${formatEUR(it.total_cents)}</td></tr>`,
    )
    .join("");
  const method = getShippingMethod(order.shipping_method);
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:12px;">${rows}
  <tr><td style="padding:10px 0 4px;font-size:13px;color:rgba(244,239,227,0.7);">Sous-total</td><td style="padding:10px 0 4px;font-size:13px;text-align:right;">${formatEUR(order.subtotal_cents)}</td></tr>
  ${order.discount_cents > 0 ? `<tr><td style="padding:4px 0;font-size:13px;color:rgba(244,239,227,0.7);">Remise ${esc(order.promo_code)}</td><td style="padding:4px 0;font-size:13px;text-align:right;color:#8fd19e;">− ${formatEUR(order.discount_cents)}</td></tr>` : ""}
  <tr><td style="padding:4px 0;font-size:13px;color:rgba(244,239,227,0.7);">Livraison — ${esc(method?.name ?? order.shipping_method)}</td><td style="padding:4px 0;font-size:13px;text-align:right;">${order.shipping_cents === 0 ? "Offerte" : formatEUR(order.shipping_cents)}</td></tr>
  <tr><td style="padding:12px 0 0;font-size:16px;font-weight:bold;">Total TTC</td><td style="padding:12px 0 0;font-size:18px;font-weight:bold;text-align:right;color:#d9b85c;">${formatEUR(order.total_cents)}</td></tr>
  </table>`;
}

function addressBlock(order: OrderRow): string {
  if (order.shipping_address) {
    const a = order.shipping_address;
    return `${esc(order.first_name)} ${esc(order.last_name)}<br>${esc(a.line1)}${a.line2 ? `<br>${esc(a.line2)}` : ""}<br>${esc(a.postalCode)} ${esc(a.city)}<br>${esc(a.country)}`;
  }
  return `Retrait — ${esc(order.pickup_point ?? "point de retrait")} (rendez-vous confirmé par WhatsApp)`;
}

function button(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:linear-gradient(135deg,#9c7a2e,#f0d78c,#d9b85c);color:#0d0c0a;text-decoration:none;font-weight:bold;font-size:14px;padding:13px 24px;border-radius:999px;margin-top:18px;">${esc(label)}</a>`;
}

export function trackingLink(order: OrderRow): string {
  return `${SITE_URL}/suivi?numero=${encodeURIComponent(order.number)}&email=${encodeURIComponent(order.email)}`;
}

// ───────────────────────────── Emails client ─────────────────────────────

export async function sendOrderConfirmation(order: OrderRow, items: OrderItemRow[]): Promise<void> {
  const resend = getResend();
  if (!resend) return;
  const method = getShippingMethod(order.shipping_method);
  const isPickup = order.shipping_method === "retrait";
  const payOnPickup = order.status === "awaiting_pickup_payment";
  const body = `
    <h1 style="font-family:Georgia,serif;font-weight:normal;font-size:26px;margin:0 0 8px;">Merci ${esc(order.first_name)}, votre commande est ${payOnPickup ? "enregistrée" : "confirmée"} !</h1>
    <p style="font-size:14px;line-height:1.6;color:rgba(244,239,227,0.75);margin:0 0 6px;">Commande <strong style="color:#d9b85c">${esc(order.number)}</strong> du ${formatDateFR(order.created_at, true)}.</p>
    <p style="font-size:14px;line-height:1.6;color:rgba(244,239,227,0.75);margin:0;">
      ${
        isPickup
          ? payOnPickup
            ? "Vous avez choisi le retrait avec paiement sur place. Nous vous contactons sur WhatsApp pour convenir d'un rendez-vous (généralement dès le lendemain)."
            : "Vous avez choisi le retrait gratuit. Nous vous contactons sur WhatsApp pour convenir d'un rendez-vous (généralement dès le lendemain)."
          : order.shipping_method === "livraison-locale"
            ? "Nous vous contactons sur WhatsApp pour convenir d'un créneau de livraison (24 à 48 h)."
            : `Votre colis est préparé avec soin et expédié sous 24 h ouvrées (commande avant 13 h = départ le jour même) en <strong>${esc(method?.name ?? "")}</strong>, dans un emballage neutre. Vous recevrez un email avec votre numéro de suivi dès le départ du colis.`
      }
    </p>
    ${itemsTable(items, order)}
    <div style="margin-top:20px;padding:14px 16px;border:1px solid rgba(244,239,227,0.1);border-radius:12px;font-size:13px;line-height:1.6;color:rgba(244,239,227,0.8);">
      <strong style="color:#d9b85c;font-size:11px;letter-spacing:2px;text-transform:uppercase;">${isPickup ? "Retrait" : "Livraison"}</strong><br>${addressBlock(order)}
      ${order.notes ? `<br><br><strong style="color:#d9b85c;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Vos notes</strong><br>${esc(order.notes)}` : ""}
    </div>
    <div style="text-align:center">${button(trackingLink(order), "Suivre ma commande")}</div>
    <p style="font-size:12px;line-height:1.6;color:rgba(244,239,227,0.55);margin-top:22px;">
      Rappel : produits réservés aux adultes, à consommer avec modération. Commencez par une petite quantité, attendez les effets, ne conduisez pas après usage.
      Une question ? Répondez à cet email ou écrivez-nous sur WhatsApp au ${esc(site.phoneDisplay)}.
    </p>`;
  await resend.emails.send({
    from: FROM,
    to: order.email,
    replyTo: MERCHANT,
    subject: `Commande ${order.number} ${payOnPickup ? "enregistrée" : "confirmée"} — CBDoux`,
    html: layout(`Commande ${order.number}`, body),
  });
}

export async function sendShippingNotification(order: OrderRow, items: OrderItemRow[]): Promise<void> {
  const resend = getResend();
  if (!resend) return;
  const method = getShippingMethod(order.shipping_method);
  const ready = order.status === "ready_for_pickup";
  const body = `
    <h1 style="font-family:Georgia,serif;font-weight:normal;font-size:26px;margin:0 0 8px;">${ready ? "Votre commande est prête !" : "Votre colis est en route !"}</h1>
    <p style="font-size:14px;line-height:1.6;color:rgba(244,239,227,0.75);margin:0 0 6px;">Commande <strong style="color:#d9b85c">${esc(order.number)}</strong>.</p>
    ${
      ready
        ? `<p style="font-size:14px;line-height:1.6;color:rgba(244,239,227,0.75);">Votre commande vous attend à ${esc(order.pickup_point ?? "notre point de retrait")}. Nous vous confirmons le créneau sur WhatsApp.</p>`
        : `<p style="font-size:14px;line-height:1.6;color:rgba(244,239,227,0.75);">Expédiée en <strong>${esc(method?.name ?? "")}</strong>${order.tracking_number ? ` — numéro de suivi <strong style="color:#d9b85c">${esc(order.tracking_number)}</strong>` : ""}. Délai indicatif : ${esc(method?.delay ?? "")}.</p>
           ${order.tracking_url ? `<div style="text-align:center">${button(order.tracking_url, "Suivre mon colis")}</div>` : ""}`
    }
    ${itemsTable(items, order)}
    <p style="font-size:12px;line-height:1.6;color:rgba(244,239,227,0.55);margin-top:22px;">Conservez vos produits à l'abri de la lumière, de la chaleur et de l'humidité. Réservés aux adultes — ne pas conduire après usage. Besoin d'aide ? WhatsApp ${esc(site.phoneDisplay)}.</p>`;
  await resend.emails.send({
    from: FROM,
    to: order.email,
    replyTo: MERCHANT,
    subject: ready ? `Commande ${order.number} prête pour le retrait — CBDoux` : `Commande ${order.number} expédiée — CBDoux`,
    html: layout(`Commande ${order.number}`, body),
  });
}

// ───────────────────────────── Emails marchand ─────────────────────────────

export async function sendMerchantNewOrder(order: OrderRow, items: OrderItemRow[]): Promise<void> {
  const resend = getResend();
  if (!resend) return;
  const method = getShippingMethod(order.shipping_method);
  const body = `
    <h1 style="font-family:Georgia,serif;font-weight:normal;font-size:24px;margin:0 0 8px;">Nouvelle commande ${esc(order.number)}</h1>
    <p style="font-size:14px;line-height:1.7;color:rgba(244,239,227,0.8);margin:0;">
      <strong>${esc(order.first_name)} ${esc(order.last_name)}</strong><br>
      ${esc(order.email)}${order.phone ? ` · ${esc(order.phone)}` : ""}<br>
      Statut : <strong style="color:#d9b85c">${esc(order.status)}</strong> · ${esc(method?.name ?? order.shipping_method)}
    </p>
    ${itemsTable(items, order)}
    <div style="margin-top:20px;padding:14px 16px;border:1px solid rgba(244,239,227,0.1);border-radius:12px;font-size:13px;line-height:1.6;">
      ${addressBlock(order)}${order.notes ? `<br><br><em>Notes client :</em> ${esc(order.notes)}` : ""}
    </div>
    <div style="text-align:center">${button(`${SITE_URL}/admin/commandes/${order.id}`, "Ouvrir dans l'admin")}</div>`;
  await resend.emails.send({
    from: FROM,
    to: MERCHANT,
    replyTo: order.email,
    subject: `🛒 Commande ${order.number} — ${formatEUR(order.total_cents)} — ${esc(method?.name ?? "")}`,
    html: layout(`Nouvelle commande ${order.number}`, body),
  });
}

export async function sendContactMessage(data: { name: string; contact: string; message: string }): Promise<void> {
  const resend = getResend();
  if (!resend) return;
  const body = `
    <h1 style="font-family:Georgia,serif;font-weight:normal;font-size:24px;margin:0 0 8px;">Message via le formulaire de contact</h1>
    <p style="font-size:14px;line-height:1.7;"><strong>${esc(data.name)}</strong><br>${esc(data.contact)}</p>
    <div style="padding:14px 16px;border:1px solid rgba(244,239,227,0.1);border-radius:12px;font-size:14px;line-height:1.7;white-space:pre-wrap;">${esc(data.message)}</div>`;
  const maybeEmail = /\S+@\S+\.\S+/.test(data.contact) ? data.contact : undefined;
  await resend.emails.send({
    from: FROM,
    to: MERCHANT,
    ...(maybeEmail ? { replyTo: maybeEmail } : {}),
    subject: `✉️ Contact CBDoux — ${data.name}`,
    html: layout("Contact", body),
  });
}
