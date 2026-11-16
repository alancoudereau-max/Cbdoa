"use client";

import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";

const KEY = "cbdoux-age-ok";
const TTL_DAYS = 30;

/**
 * Vérification d'âge (18+) — obligatoire pour la vente de CBD.
 * Le contenu de la page reste dans le HTML (indexable par Google) ; seule une
 * superposition est affichée tant que le visiteur n'a pas confirmé sa majorité.
 * À la confirmation, elle se referme en cercle sur la page.
 */
export function AgeGate() {
  const [visible, setVisible] = useState(false);
  const [refused, setRefused] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const yes = useRef<HTMLButtonElement | null>(null);

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
    document.documentElement.setAttribute("data-gate", "");
    yes.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = "";
      document.documentElement.removeAttribute("data-gate");
    };
  }, [visible]);

  const accept = () => {
    try {
      localStorage.setItem(KEY, String(Date.now() + TTL_DAYS * 86400 * 1000));
    } catch {
      /* ignore */
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setVisible(false);
      return;
    }
    setLeaving(true);
    window.setTimeout(() => setVisible(false), 950);
  };

  if (!visible) return null;

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="agegate-title" className="gate bg-sapin" data-leaving={leaving}>
      <div aria-hidden className="guilloche guilloche-rosace spin-slow opacity-[0.16] left-1/2 top-[46%] w-[170vmin] max-w-[1150px] -translate-x-1/2 -translate-y-1/2" />
      <div className="relative mx-auto flex min-h-full max-w-xl flex-col items-center justify-center px-6 py-14 text-center">
        <Logo weight="fine" className="h-12 sm:h-14" />
        <div aria-hidden className="rule-double mt-7 w-24" />
        {!refused ? (
          <>
            <h2 id="agegate-title" className="t-h2 mt-9">
              Avez-vous 18 ans ou plus ?
            </h2>
            <p className="t-lead mt-5 max-w-md">
              Nos produits sont réservés aux adultes. Ils contiennent moins de 0,3&nbsp;% de THC, comme l'exige la loi française, et ne sont pas des médicaments.
            </p>
            <div className="mt-9 flex w-full max-w-sm flex-col gap-3">
              <button ref={yes} type="button" onClick={accept} className="btn btn-primary w-full">
                Oui, j'ai 18 ans ou plus
              </button>
              <button type="button" onClick={() => setRefused(true)} className="btn btn-ghost w-full">
                Non, je suis mineur
              </button>
            </div>
            <p className="t-fine mt-7 text-foreground/85">
              En entrant, vous acceptez nos{" "}
              <a href="/cgv" className="link">
                conditions générales de vente
              </a>
              .
            </p>
          </>
        ) : (
          <>
            <h2 id="agegate-title" className="t-h2 mt-9">
              Ce site est réservé aux adultes.
            </h2>
            <p className="t-lead mt-5 max-w-md">La vente de CBD est interdite aux mineurs. Merci de votre compréhension.</p>
            <a href="https://www.google.fr" className="btn btn-ghost mt-9">
              Quitter le site
            </a>
          </>
        )}
      </div>
    </div>
  );
}
