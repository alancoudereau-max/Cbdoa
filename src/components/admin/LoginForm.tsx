"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(loginAction, undefined);
  return (
    <form action={action} className="space-y-4 rounded-2xl border border-foreground/10 bg-card/50 p-6">
      <input type="hidden" name="next" value={next ?? ""} />
      <label className="block">
        <span className="block text-sm font-medium mb-1.5">Mot de passe</span>
        <input type="password" name="password" required autoComplete="current-password" className="input-dark" />
      </label>
      {state?.error && <p className="text-sm text-red-300">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn-gold w-full rounded-full px-5 py-3 text-sm font-semibold">
        {pending ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
