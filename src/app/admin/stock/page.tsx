import { visibleProducts, categories, formatPrice } from "@/data/products";
import { getAvailabilityMap, hasDatabase } from "@/lib/supabase";
import { toggleStockAction, toggleProductStockAction } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function StockPage() {
  const availability = await getAvailabilityMap();
  return (
    <div>
      <h1 className="font-serif text-4xl mb-2">Disponibilité des produits</h1>
      <p className="text-sm text-foreground/55 mb-8 max-w-2xl">
        Un produit « épuisé » reste visible mais ne peut plus être ajouté au panier (et apparaît en rupture pour Google). Les prix et descriptions se modifient dans le fichier <code className="font-mono text-gold">src/data/products.ts</code>.
      </p>
      {!hasDatabase() && <p className="rounded-xl border border-red-400/40 bg-red-400/10 p-4 text-sm text-red-200 mb-6">Base de données non configurée : la disponibilité ne peut pas être modifiée.</p>}

      <div className="space-y-4">
        {visibleProducts.map((p) => {
          const allOff = p.variants.every((v) => availability[v.sku] === false);
          const anyOff = p.variants.some((v) => availability[v.sku] === false);
          return (
            <details key={p.slug} className="rounded-2xl border border-foreground/10 bg-card/40 open:border-gold/30">
              <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-3 px-5 py-4">
                <span>
                  <span className="font-serif text-xl">{p.name}</span>
                  <span className="ml-3 font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/50">{categories[p.category].name} · {p.variants.length} variantes</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className={cn("rounded-full border px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.12em]", allOff ? "text-red-300 border-red-400/40 bg-red-400/10" : anyOff ? "text-orange-300 border-orange-400/40 bg-orange-400/10" : "text-emerald-300 border-emerald-400/40 bg-emerald-400/10")}>
                    {allOff ? "Épuisé" : anyOff ? "Partiel" : "Disponible"}
                  </span>
                  <form action={toggleProductStockAction}>
                    <input type="hidden" name="slug" value={p.slug} />
                    <input type="hidden" name="available" value={allOff ? "true" : "false"} />
                    <button className="btn-outline rounded-full px-3 py-1.5 text-xs">{allOff ? "Tout remettre en stock" : "Tout passer épuisé"}</button>
                  </form>
                </span>
              </summary>
              <div className="border-t border-foreground/10 px-5 py-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {p.variants.map((v) => {
                  const ok = availability[v.sku] !== false;
                  return (
                    <form key={v.sku} action={toggleStockAction} className="flex items-center justify-between gap-3 rounded-xl border border-foreground/10 px-3 py-2 text-sm">
                      <input type="hidden" name="sku" value={v.sku} />
                      <input type="hidden" name="available" value={ok ? "false" : "true"} />
                      <span>
                        {v.tierLabel} · {v.format}
                        <span className="block text-[11px] text-foreground/50">{formatPrice(v.priceCents)} · {v.sku}</span>
                      </span>
                      <button className={cn("rounded-full border px-3 py-1 text-[10px] font-mono uppercase tracking-[0.12em]", ok ? "text-emerald-300 border-emerald-400/40 hover:bg-red-400/10 hover:text-red-300 hover:border-red-400/40" : "text-red-300 border-red-400/40 hover:bg-emerald-400/10 hover:text-emerald-300 hover:border-emerald-400/40")}>
                        {ok ? "Disponible" : "Épuisé"}
                      </button>
                    </form>
                  );
                })}
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
