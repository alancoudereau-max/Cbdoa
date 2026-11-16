"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Chef d'orchestre des animations du site (monté une seule fois dans le layout) :
 *  - apparition au défilement des éléments marqués `data-reveal` (et des <section> de page qui n'en contiennent pas) ;
 *  - compteurs animés `data-count` ;
 *  - barre de progression de lecture en haut de l'écran ;
 *  - parallaxe légère `data-parallax`.
 *
 * Règle d'or : rien n'est masqué dans le HTML, et aucune image n'attend ce script pour s'afficher.
 * Seuls les blocs situés sous l'écran au chargement reçoivent l'état « en attente » ; ils reviennent dès
 * qu'ils approchent du bas de l'écran. La position est relue à chaque défilement (pas seulement signalée
 * par le navigateur) : un bloc ne peut donc pas rester invisible. Sans JavaScript ou avec « réduire les
 * animations », tout est visible d'emblée.
 */
const REVEAL_SELECTOR = "[data-reveal], main section:not([data-reveal]):not(:has([data-reveal]))";

export function MotionRoot() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let reveals: HTMLElement[];
    try {
      reveals = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
    } catch {
      // Navigateur sans :has() : on se limite aux éléments marqués explicitement
      reveals = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    }
    let counters = Array.from(document.querySelectorAll<HTMLElement>("[data-count]"));
    const parallax = reduced ? [] : Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));

    const runCounter = (el: HTMLElement) => {
      const target = Number(el.dataset.count);
      if (!Number.isFinite(target) || el.dataset.counted) return;
      el.dataset.counted = "1";
      if (reduced) return;
      const start = performance.now();
      const step = (t: number) => {
        const k = Math.min(1, (t - start) / 1400);
        el.textContent = String(Math.round(target * (1 - Math.pow(1 - k, 4))));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const show = (el: HTMLElement, delay: number) => {
      el.style.setProperty("--rv-delay", `${delay}ms`);
      el.classList.add("rv-in", "is-in");
      // Double image : laisse le navigateur peindre l'état masqué avant de lancer la transition
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove("rv-wait")));
      window.setTimeout(() => el.classList.remove("rv-in"), 1000 + delay);
    };

    // État initial : ce qui est déjà à l'écran (ou rangé sur le côté dans une rangée qui défile à l'horizontale)
    // n'est jamais masqué.
    let waiting: HTMLElement[] = [];
    if (reduced) {
      reveals.forEach((el) => el.classList.add("is-in"));
    } else {
      const fold = window.innerHeight * 0.92;
      reveals.forEach((el) => {
        if (el.classList.contains("is-in")) return;
        const r = el.getBoundingClientRect();
        if (r.top < fold || r.left >= window.innerWidth || r.right <= 0) el.classList.add("is-in");
        else {
          el.classList.add("rv-wait");
          waiting.push(el);
        }
      });
    }

    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      const max = root.scrollHeight - vh;
      root.style.setProperty("--progress", max > 0 ? String(Math.min(1, window.scrollY / max)) : "0");

      if (waiting.length) {
        const line = vh * 0.99;
        const ready = waiting.filter((el) => el.getBoundingClientRect().top < line);
        if (ready.length) {
          waiting = waiting.filter((el) => !ready.includes(el));
          ready.forEach((el, i) => show(el, Math.min(i, 4) * 60));
        }
      }
      if (counters.length) {
        const line = vh * 0.96;
        const ready = counters.filter((el) => el.getBoundingClientRect().top < line);
        if (ready.length) {
          counters = counters.filter((el) => !ready.includes(el));
          ready.forEach(runCounter);
        }
      }
      parallax.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const factor = Number(el.dataset.parallax) || 0.06;
        el.style.translate = `0 ${((r.top + r.height / 2 - vh / 2) * -factor).toFixed(1)}px`;
      });
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    // Filet de sécurité : après le chargement complet (images, polices), on relit les positions.
    window.addEventListener("load", onScroll, { once: true });
    const safety = window.setTimeout(onScroll, 1200);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("load", onScroll);
      window.clearTimeout(safety);
      // En changeant de page, rien ne doit rester masqué
      waiting.forEach((el) => el.classList.remove("rv-wait"));
    };
  }, [pathname]);

  return <div aria-hidden className="scroll-progress" />;
}
