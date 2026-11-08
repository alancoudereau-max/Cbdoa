"use client";

import { useState } from "react";
import { MessageCircle, Mail } from "lucide-react";
import { site } from "@/data/site";

/** Formulaire sans serveur : le message part sur WhatsApp (recommandé) ou par email. */
export function ContactForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");

  const body = [`Bonjour CBDoux,`, ``, message.trim(), ``, `— ${name.trim()}${contact.trim() ? ` (${contact.trim()})` : ""}`].join("\n");
  const ready = name.trim().length > 0 && message.trim().length >= 5;
  const waUrl = `${site.whatsapp}?text=${encodeURIComponent(body)}`;
  const mailUrl = `mailto:${site.email}?subject=${encodeURIComponent(`Contact CBDoux — ${name.trim()}`)}&body=${encodeURIComponent(body)}`;

  return (
    <form onSubmit={(e) => e.preventDefault()} className="rounded-2xl border border-gold/20 bg-card/60 p-6 sm:p-8 space-y-4">
      <label className="block">
        <span className="block text-sm font-medium mb-1.5">Votre nom</span>
        <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={100} className="input-dark" autoComplete="name" />
      </label>
      <label className="block">
        <span className="block text-sm font-medium mb-1.5">Téléphone ou email (pour vous répondre)</span>
        <input value={contact} onChange={(e) => setContact(e.target.value)} maxLength={120} className="input-dark" autoComplete="email" />
      </label>
      <label className="block">
        <span className="block text-sm font-medium mb-1.5">Message</span>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={6} maxLength={2000} className="input-dark resize-y" placeholder="Une question sur un produit, une force, une livraison…" />
      </label>
      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        <a
          href={ready ? waUrl : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!ready}
          className={`btn-gold inline-flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold ${ready ? "" : "pointer-events-none opacity-50"}`}
        >
          <MessageCircle size={16} /> Envoyer sur WhatsApp
        </a>
        <a
          href={ready ? mailUrl : undefined}
          aria-disabled={!ready}
          className={`btn-outline inline-flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm ${ready ? "" : "pointer-events-none opacity-50"}`}
        >
          <Mail size={16} /> Envoyer par email
        </a>
      </div>
      <p className="text-[11px] text-foreground/45">Réponse généralement dans la journée, 7 j/7. Vos données servent uniquement à vous répondre (voir notre politique de confidentialité).</p>
    </form>
  );
}
