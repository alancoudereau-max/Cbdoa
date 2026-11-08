"use client";

import { useState } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fd.get("name"), contact: fd.get("contact"), message: fd.get("message"), website: fd.get("website") }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) throw new Error(data.error ?? "Erreur");
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Envoi impossible.");
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-gold/30 bg-gold/10 p-8 text-center">
        <CheckCircle2 size={36} className="mx-auto text-gold mb-3" />
        <p className="font-serif text-2xl mb-1">Message envoyé !</p>
        <p className="text-sm text-foreground/70">Nous vous répondons généralement dans la journée.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-gold/20 bg-card/60 p-6 sm:p-8 space-y-4">
      <label className="block">
        <span className="block text-sm font-medium mb-1.5">Votre nom</span>
        <input name="name" required maxLength={100} className="input-dark" autoComplete="name" />
      </label>
      <label className="block">
        <span className="block text-sm font-medium mb-1.5">Téléphone ou email</span>
        <input name="contact" required maxLength={120} className="input-dark" autoComplete="email" />
      </label>
      <label className="block">
        <span className="block text-sm font-medium mb-1.5">Message</span>
        <textarea name="message" required rows={6} maxLength={2000} className="input-dark resize-y" />
      </label>
      {/* Honeypot anti-spam */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {error && <p className="text-sm text-red-300">{error}</p>}
      <button type="submit" disabled={status === "sending"} className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold">
        {status === "sending" ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} Envoyer le message
      </button>
      <p className="text-[11px] text-foreground/45">Vos données servent uniquement à vous répondre. Voir notre politique de confidentialité.</p>
    </form>
  );
}
