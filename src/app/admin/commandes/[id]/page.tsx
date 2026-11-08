import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById, orderStatusLabels, type OrderStatus } from "@/lib/supabase";
import { getShippingMethod } from "@/lib/shipping";
import { updateOrderAction } from "@/app/admin/actions";
import { formatEUR, formatDateFR } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUSES: OrderStatus[] = ["pending", "awaiting_pickup_payment", "paid", "preparing", "shipped", "ready_for_pickup", "delivered", "cancelled", "refunded"];

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const found = await getOrderById(id);
  if (!found) notFound();
  const { order: o, items } = found;
  const method = getShippingMethod(o.shipping_method);
  const isPickup = o.shipping_method === "retrait";

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      <div className="lg:col-span-7 space-y-6">
        <div>
          <Link href="/admin/commandes" className="text-xs text-foreground/55 hover:text-gold">← Toutes les commandes</Link>
          <h1 className="font-serif text-4xl mt-2">Commande <span className="font-mono text-gold">{o.number}</span></h1>
          <p className="text-sm text-foreground/55 mt-1">Passée le {formatDateFR(o.created_at, true)} · Statut : <strong className="text-foreground">{orderStatusLabels[o.status]}</strong></p>
        </div>

        <div className="rounded-2xl border border-foreground/10 bg-card/40 p-5">
          <h2 className="kicker mb-3">Articles</h2>
          <ul className="divide-y divide-foreground/10">
            {items.map((it) => (
              <li key={it.id} className="flex justify-between gap-4 py-2.5 text-sm">
                <span>{it.name}<span className="block text-xs text-foreground/55">{it.variant_label} × {it.quantity} · SKU {it.variant_sku}</span></span>
                <span>{formatEUR(it.total_cents)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-3 space-y-1 text-sm border-t border-foreground/10 pt-3">
            <div className="flex justify-between"><dt className="text-foreground/60">Sous-total</dt><dd>{formatEUR(o.subtotal_cents)}</dd></div>
            {o.discount_cents > 0 && <div className="flex justify-between text-gold"><dt>Remise {o.promo_code}</dt><dd>− {formatEUR(o.discount_cents)}</dd></div>}
            <div className="flex justify-between"><dt className="text-foreground/60">Livraison ({method?.name ?? o.shipping_method})</dt><dd>{formatEUR(o.shipping_cents)}</dd></div>
            <div className="flex justify-between font-medium pt-1"><dt>Total TTC</dt><dd className="text-gold">{formatEUR(o.total_cents)}</dd></div>
          </dl>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-foreground/10 bg-card/40 p-5 text-sm">
            <h2 className="kicker mb-3">Client</h2>
            <p className="font-medium">{o.first_name} {o.last_name}</p>
            <p><a href={`mailto:${o.email}`} className="text-gold hover:underline">{o.email}</a></p>
            {o.phone && <p><a href={`https://wa.me/${o.phone.replace(/[^0-9]/g, "").replace(/^0/, "33")}`} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">{o.phone}</a> (WhatsApp)</p>}
            <p className="text-xs text-foreground/50 mt-3">Majorité certifiée : {o.age_confirmed ? "oui" : "non"} · CGV : {o.cgv_accepted ? "oui" : "non"} · Prudence : {o.prudence_ack ? "oui" : "non"}</p>
          </div>
          <div className="rounded-2xl border border-foreground/10 bg-card/40 p-5 text-sm">
            <h2 className="kicker mb-3">{isPickup ? "Retrait" : "Livraison"}</h2>
            {o.shipping_address ? (
              <address className="not-italic">
                {o.shipping_address.line1}<br />
                {o.shipping_address.line2 && <>{o.shipping_address.line2}<br /></>}
                {o.shipping_address.postalCode} {o.shipping_address.city}<br />
                {o.shipping_address.country}
              </address>
            ) : (
              <p>{o.pickup_point ?? "—"}</p>
            )}
            <p className="text-xs text-foreground/50 mt-3">{method?.name} · {method?.delay}</p>
            {o.notes && <p className="mt-3 rounded-lg bg-gold/10 border border-gold/30 p-2 text-xs"><strong>Notes client :</strong> {o.notes}</p>}
          </div>
        </div>

        <div className="rounded-2xl border border-foreground/10 bg-card/40 p-5 text-xs text-foreground/60">
          <h2 className="kicker mb-3">Paiement</h2>
          <p>Prestataire : {o.payment_provider ?? "—"} · Statut : {o.payment_status ?? "—"} · Méthode : {o.payment_method ?? "—"}</p>
          <p>Référence : <span className="font-mono">{o.payment_id ?? "—"}</span>{o.paid_at ? ` · payé le ${formatDateFR(o.paid_at, true)}` : ""}</p>
        </div>
      </div>

      <aside className="lg:col-span-5">
        <form action={updateOrderAction} className="lg:sticky lg:top-28 rounded-2xl border border-gold/25 bg-card/60 p-6 space-y-4">
          <input type="hidden" name="id" value={o.id} />
          <h2 className="font-serif text-2xl">Mettre à jour</h2>
          <label className="block">
            <span className="block text-sm font-medium mb-1.5">Statut</span>
            <select name="status" defaultValue={o.status} className="input-dark">
              {STATUSES.map((s) => (
                <option key={s} value={s}>{orderStatusLabels[s]}</option>
              ))}
            </select>
          </label>
          {!isPickup && (
            <label className="block">
              <span className="block text-sm font-medium mb-1.5">Numéro de suivi {method?.carrier ? `(${method.carrier})` : ""}</span>
              <input name="tracking_number" defaultValue={o.tracking_number ?? ""} className="input-dark font-mono" placeholder="6A12345678901" />
              {o.tracking_url && <a href={o.tracking_url} target="_blank" rel="noopener noreferrer" className="block text-xs text-gold mt-1 hover:underline">Ouvrir le suivi transporteur</a>}
            </label>
          )}
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" name="notify" defaultChecked className="mt-1 accent-[oklch(0.82_0.14_80)]" />
            <span>Envoyer l'email au client si le statut passe à <strong>Expédiée</strong> ou <strong>Prête pour le retrait</strong> (avec le n° de suivi).</span>
          </label>
          <button type="submit" className="btn-gold w-full rounded-full px-5 py-3 text-sm font-semibold">Enregistrer</button>
          <p className="text-[11px] text-foreground/45">Astuce : passez en « En préparation » quand vous emballez, puis « Expédiée » avec le numéro de suivi — le client reçoit automatiquement l'email.</p>
        </form>
      </aside>
    </div>
  );
}
