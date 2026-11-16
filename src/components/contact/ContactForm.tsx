"use client";

import { useState } from "react";
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
    <form onSubmit={(e) => e.preventDefault()} className="paper sheet space-y-5">
      <div>
        <label htmlFor="contact-nom" className="field-label">
          Votre nom
        </label>
        <input id="contact-nom" value={name} onChange={(e) => setName(e.target.value)} required maxLength={100} className="field" autoComplete="name" />
      </div>
      <div>
        <label htmlFor="contact-coordonnees" className="field-label">
          Téléphone ou email, pour vous répondre
        </label>
        <input id="contact-coordonnees" value={contact} onChange={(e) => setContact(e.target.value)} maxLength={120} className="field" autoComplete="email" />
      </div>
      <div>
        <label htmlFor="contact-message" className="field-label">
          Message
        </label>
        <textarea id="contact-message" value={message} onChange={(e) => setMessage(e.target.value)} required rows={6} maxLength={2000} className="field resize-y" placeholder="Une question sur un produit, une force, une livraison…" />
      </div>
      <div className="flex flex-col gap-2.5 pt-1 sm:flex-row">
        <a href={ready ? waUrl : undefined} target="_blank" rel="noopener noreferrer" aria-disabled={!ready} className={`btn btn-primary flex-1 ${ready ? "" : "pointer-events-none"}`}>
          Envoyer sur WhatsApp
        </a>
        <a href={ready ? mailUrl : undefined} aria-disabled={!ready} className={`btn btn-ghost flex-1 ${ready ? "" : "pointer-events-none"}`}>
          Envoyer par email
        </a>
      </div>
      <p className="t-fine">
        {ready ? "Réponse généralement dans la journée, 7 jours sur 7." : "Indiquez votre nom et votre message pour activer l'envoi."} Vos données servent uniquement à vous répondre (voir notre politique de confidentialité).
      </p>
    </form>
  );
}
