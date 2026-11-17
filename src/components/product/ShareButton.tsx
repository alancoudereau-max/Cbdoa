"use client";

import { useState } from "react";

/**
 * Partager la page : la feuille de partage du téléphone quand elle existe (WhatsApp, Messages…),
 * sinon le lien est copié dans le presse-papiers.
 */
export function ShareButton({ title, text, className }: { title: string; text?: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      /* presse-papiers indisponible : rien à faire de plus */
    }
  };

  const share = async () => {
    const url = window.location.href.split("#")[0];
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, text, url });
      } catch (e) {
        // Partage refermé sans rien choisir : on n'insiste pas. Toute autre erreur : on copie le lien.
        if ((e as DOMException)?.name !== "AbortError") await copy(url);
      }
      return;
    }
    await copy(url);
  };

  return (
    <button type="button" onClick={share} className={className}>
      <svg aria-hidden width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
        <path d="M9 11.2V2.4M5.8 5.4 9 2.4l3.2 3M4 8.6v5.6a1.3 1.3 0 0 0 1.3 1.3h7.4a1.3 1.3 0 0 0 1.3-1.3V8.6" />
      </svg>
      <span aria-live="polite">{copied ? "Lien copié" : "Partager"}</span>
    </button>
  );
}
