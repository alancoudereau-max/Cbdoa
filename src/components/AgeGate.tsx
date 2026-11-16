"use client";

import { useEffect, useState } from "react";
import { Logo, Ornament } from "@/components/brand/Logo";

const KEY = "cbdoux-age-ok";
const TTL_DAYS = 30;

/**
 * Vérification d'âge (18+) — obligatoire pour la vente de CBD.
 * Le contenu de la page reste dans le HTML (indexable par Google) ; seule une
 * superposition est affichée tant que le visiteur n'a pas confirmé sa majorité.
 */
export function AgeGate() {
  const [visible, setVisible] = useState(false);
  const [refused, setRefused] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw && Number(raw) > Date.now()) return;
    } catch {
      /* ignore */
    }
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  const accept = () => {
    try {
      localStorage.setItem(KEY, String(Date.now() + TTL_DAYS * 86400 * 1000));
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="agegate-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-xl px-4"
    >
      <div className="luxe-panel relative w-full max-w-md rounded-3xl p-7 sm:p-9 text-center animate-fade-up">
        <Logo weight="fine" className="mx-auto h-16 sm:h-[4.5rem]" />
        <Ornament className="mt-4 mb-5" />
        <p className="kicker mb-4">Accès réservé · 18 +</p>
        {!refused ? (
          <>
            <h2 id="agegate-title" className="font-serif text-3xl mb-3">
              Avez-vous 18 ans ou plus ?
            </h2>
            <p className="text-sm text-foreground/70 leading-relaxed mb-7">
              Ce site est réservé aux personnes majeures. Nos produits contiennent moins de 0,3&nbsp;% de THC, conformément à la
              législation française, et ne sont pas destinés à un usage médical.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRefused(true)}
                className="rounded-full border border-foreground/20 px-5 py-3.5 text-sm font-medium hover:border-foreground/40 transition-colors"
              >
                Non
              </button>
              <button type="button" onClick={accept} className="btn-gold rounded-full px-5 py-3.5 text-sm font-semibold">
                Oui, j'ai 18 ans
              </button>
            </div>
            <p className="mt-5 text-[11px] text-foreground/45">
              En entrant, vous acceptez nos{" "}
              <a href="/cgv" className="underline hover:text-gold">
                conditions générales
              </a>
              .
            </p>
          </>
        ) : (
          <>
            <h2 id="agegate-title" className="font-serif text-3xl mb-3">
              Désolé, ce site est réservé aux adultes.
            </h2>
            <p className="text-sm text-foreground/70 leading-relaxed mb-7">
              La vente de produits CBD est interdite aux mineurs. Merci de votre compréhension.
            </p>
            <a href="https://www.google.fr" className="btn-outline inline-flex rounded-full px-6 py-3 text-sm">
              Quitter le site
            </a>
          </>
        )}
      </div>
    </div>
  );
}
