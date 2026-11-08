import { getSupabase, type PromoCodeRow } from "@/lib/supabase";
import { upsertPromoAction, togglePromoAction } from "@/app/admin/actions";
import { formatEUR, formatDateFR, cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PromoPage() {
  const sb = getSupabase();
  const { data } = sb ? await sb.from("promo_codes").select("*").order("created_at", { ascending: false }) : { data: [] };
  const codes = (data ?? []) as PromoCodeRow[];

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      <div className="lg:col-span-7">
        <h1 className="font-serif text-4xl mb-6">Codes promo</h1>
        <div className="overflow-x-auto rounded-2xl border border-foreground/10">
          <table className="w-full text-sm">
            <thead className="bg-card/60 text-left font-mono text-[10px] uppercase tracking-[0.15em] text-gold">
              <tr><th className="px-4 py-3">Code</th><th className="px-4 py-3">Remise</th><th className="px-4 py-3">Conditions</th><th className="px-4 py-3">Utilisations</th><th className="px-4 py-3">État</th></tr>
            </thead>
            <tbody className="divide-y divide-foreground/10">
              {codes.map((c) => (
                <tr key={c.code}>
                  <td className="px-4 py-3 font-mono text-gold">{c.code}<span className="block text-[11px] text-foreground/50 font-sans">{c.description}</span></td>
                  <td className="px-4 py-3">{c.type === "percent" ? `${c.value} %` : formatEUR(c.value)}</td>
                  <td className="px-4 py-3 text-foreground/70 text-xs">
                    {c.min_subtotal_cents > 0 && <span>dès {formatEUR(c.min_subtotal_cents)}</span>}
                    {c.expires_at && <span className="block">jusqu'au {formatDateFR(c.expires_at)}</span>}
                  </td>
                  <td className="px-4 py-3">{c.uses}{c.max_uses ? ` / ${c.max_uses}` : ""}</td>
                  <td className="px-4 py-3">
                    <form action={togglePromoAction}>
                      <input type="hidden" name="code" value={c.code} />
                      <input type="hidden" name="active" value={c.active ? "false" : "true"} />
                      <button className={cn("rounded-full border px-3 py-1 text-[10px] font-mono uppercase tracking-[0.12em]", c.active ? "text-emerald-300 border-emerald-400/40" : "text-foreground/50 border-foreground/20")}>{c.active ? "Actif" : "Inactif"}</button>
                    </form>
                  </td>
                </tr>
              ))}
              {codes.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-foreground/50">Aucun code. Créez-en un ci-contre.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      <aside className="lg:col-span-5">
        <form action={upsertPromoAction} className="rounded-2xl border border-gold/25 bg-card/60 p-6 space-y-4">
          <h2 className="font-serif text-2xl">Créer / modifier un code</h2>
          <label className="block"><span className="block text-sm font-medium mb-1.5">Code</span><input name="code" required className="input-dark uppercase font-mono" placeholder="NOEL15" /></label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block"><span className="block text-sm font-medium mb-1.5">Type</span>
              <select name="type" className="input-dark"><option value="fixed">Montant (€)</option><option value="percent">Pourcentage (%)</option></select>
            </label>
            <label className="block"><span className="block text-sm font-medium mb-1.5">Valeur</span><input name="value" required inputMode="decimal" className="input-dark" placeholder="10" /></label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="block"><span className="block text-sm font-medium mb-1.5">Minimum d'achat (€)</span><input name="min" inputMode="decimal" className="input-dark" placeholder="0" /></label>
            <label className="block"><span className="block text-sm font-medium mb-1.5">Max utilisations</span><input name="max_uses" inputMode="numeric" className="input-dark" placeholder="illimité" /></label>
          </div>
          <label className="block"><span className="block text-sm font-medium mb-1.5">Expire le</span><input type="date" name="expires_at" className="input-dark" /></label>
          <label className="block"><span className="block text-sm font-medium mb-1.5">Description (interne)</span><input name="description" className="input-dark" placeholder="Offre de Noël" /></label>
          <button className="btn-gold w-full rounded-full px-5 py-3 text-sm font-semibold">Enregistrer</button>
        </form>
      </aside>
    </div>
  );
}
