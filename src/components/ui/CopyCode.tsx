"use client";

import { useState } from "react";

/**
 * Un code à recopier (bon de bienvenue) : on le touche, il est copié, et l'étiquette le confirme.
 * Sans presse-papiers disponible, le code reste simplement lisible et sélectionnable.
 */
export function CopyCode({ code, className = "" }: { code: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2600);
    } catch {
      /* presse-papiers indisponible : rien de plus à faire */
    }
  };
  return (
    <button type="button" onClick={copy} className={`copy-code ${className}`} aria-label={`Copier le code ${code}`}>
      <span className="copy-code-value">{code}</span>
      <span className="copy-code-hint" aria-live="polite">
        <svg aria-hidden width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
          {copied ? <path d="M3 8.4l3.2 3.1L13 4.6" /> : <path d="M5.6 5.6V3.4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2.2M3.4 5.6h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1z" />}
        </svg>
        {copied ? "Copié" : "Copier"}
      </span>
    </button>
  );
}
