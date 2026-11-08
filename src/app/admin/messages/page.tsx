import { getSupabase } from "@/lib/supabase";
import { formatDateFR } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Msg = { id: string; name: string; contact: string; message: string; created_at: string };

export default async function MessagesPage() {
  const sb = getSupabase();
  const { data } = sb ? await sb.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(200) : { data: [] };
  const msgs = (data ?? []) as Msg[];
  return (
    <div>
      <h1 className="font-serif text-4xl mb-6">Messages de contact</h1>
      <div className="space-y-3">
        {msgs.map((m) => (
          <article key={m.id} className="rounded-2xl border border-foreground/10 bg-card/40 p-5">
            <div className="flex flex-wrap justify-between gap-2 text-sm mb-2">
              <span className="font-medium">{m.name} <span className="text-foreground/55 font-normal">· {m.contact}</span></span>
              <span className="text-xs text-foreground/50">{formatDateFR(m.created_at, true)}</span>
            </div>
            <p className="text-sm text-foreground/80 whitespace-pre-wrap">{m.message}</p>
          </article>
        ))}
        {msgs.length === 0 && <p className="text-foreground/50">Aucun message.</p>}
      </div>
    </div>
  );
}
