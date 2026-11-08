import Link from "next/link";
import { getSupabase, orderStatusLabels, type OrderRow, type OrderStatus } from "@/lib/supabase";
import { getShippingMethod } from "@/lib/shipping";
import { formatEUR, formatDateFR, cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const FILTERS: Array<{ key: string; label: string; statuses?: OrderStatus[] }> = [
  { key: "a-traiter", label: "À traiter", statuses: ["paid", "awaiting_pickup_payment", "preparing"] },
  { key: "expediees", label: "Expédiées / prêtes", statuses: ["shipped", "ready_for_pickup"] },
  { key: "terminees", label: "Terminées", statuses: ["delivered"] },
  { key: "attente", label: "Paiement en attente", statuses: ["pending"] },
  { key: "annulees", label: "Annulées / échouées", statuses: ["cancelled", "failed", "expired", "refunded"] },
  { key: "toutes", label: "Toutes" },
];

const statusColor: Record<string, string> = {
  paid: "text-gold border-gold/40 bg-gold/10",
  awaiting_pickup_payment: "text-gold border-gold/40 bg-gold/10",
  preparing: "text-orange-300 border-orange-400/40 bg-orange-400/10",
  shipped: "text-sky-300 border-sky-400/40 bg-sky-400/10",
  ready_for_pickup: "text-sky-300 border-sky-400/40 bg-sky-400/10",
  delivered: "text-emerald-300 border-emerald-400/40 bg-emerald-400/10",
  pending: "text-foreground/60 border-foreground/20",
};

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ f?: string; q?: string }> }) {
  const { f = "a-traiter", q } = await searchParams;
  const sb = getSupabase();
  const filter = FILTERS.find((x) => x.key === f) ?? FILTERS[0];
  let orders: OrderRow[] = [];
  if (sb) {
    let query = sb.from("orders").select("*").order("created_at", { ascending: false }).limit(200);
    if (filter.statuses) query = query.in("status", filter.statuses);
    if (q) query = query.or(`number.ilike.%${q}%,email.ilike.%${q}%,last_name.ilike.%${q}%`);
    const { data } = await query;
    orders = (data ?? []) as OrderRow[];
  }

  // Compteurs rapides
  let counts: Record<string, number> = {};
  if (sb) {
    const { data } = await sb.from("orders").select("status");
    counts = ((data ?? []) as Array<{ status: string }>).reduce<Record<string, number>>((acc, r) => ({ ...acc, [r.status]: (acc[r.status] ?? 0) + 1 }), {});
  }
  const revenue = orders.filter((o) => ["paid", "preparing", "shipped", "ready_for_pickup", "delivered"].includes(o.status)).reduce((s, o) => s + o.total_cents, 0);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-4xl">Commandes</h1>
          <p className="text-sm text-foreground/55 mt-1">
            {orders.length} affichée{orders.length > 1 ? "s" : ""} · CA de la sélection : <span className="text-gold">{formatEUR(revenue)}</span>
          </p>
        </div>
        <form className="flex gap-2">
          <input type="hidden" name="f" value="toutes" />
          <input name="q" defaultValue={q ?? ""} placeholder="N° de commande, email, nom…" className="input-dark w-64" />
          <button className="btn-outline rounded-xl px-4 text-sm">Rechercher</button>
        </form>
      </div>

      {!sb && <p className="rounded-xl border border-red-400/40 bg-red-400/10 p-4 text-sm text-red-200 mb-6">Base de données non configurée (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).</p>}

      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((x) => {
          const n = x.statuses ? x.statuses.reduce((s, st) => s + (counts[st] ?? 0), 0) : Object.values(counts).reduce((s, v) => s + v, 0);
          return (
            <Link key={x.key} href={`/admin/commandes?f=${x.key}`} className={cn("rounded-full border px-4 py-2 text-xs", x.key === filter.key ? "border-gold text-gold bg-gold/10" : "border-foreground/15 text-foreground/70 hover:border-gold/50")}>
              {x.label} <span className="ml-1 text-foreground/45">{n}</span>
            </Link>
          );
        })}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-foreground/10">
        <table className="w-full text-sm">
          <thead className="bg-card/60 text-left font-mono text-[10px] uppercase tracking-[0.15em] text-gold">
            <tr>
              <th className="px-4 py-3">Commande</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Livraison</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/10">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-card/40">
                <td className="px-4 py-3 font-mono"><Link href={`/admin/commandes/${o.id}`} className="text-gold hover:underline">{o.number}</Link></td>
                <td className="px-4 py-3">{o.first_name} {o.last_name}<span className="block text-xs text-foreground/50">{o.email}</span></td>
                <td className="px-4 py-3 text-foreground/75">{getShippingMethod(o.shipping_method)?.name ?? o.shipping_method}{o.pickup_point ? ` · ${o.pickup_point}` : ""}</td>
                <td className="px-4 py-3"><span className={cn("rounded-full border px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.12em]", statusColor[o.status] ?? "text-red-300 border-red-400/40 bg-red-400/10")}>{orderStatusLabels[o.status]}</span></td>
                <td className="px-4 py-3 text-right whitespace-nowrap">{formatEUR(o.total_cents)}</td>
                <td className="px-4 py-3 text-foreground/60 whitespace-nowrap">{formatDateFR(o.created_at, true)}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-foreground/50">Aucune commande dans cette vue.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
