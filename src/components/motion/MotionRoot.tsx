"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Chef d'orchestre des animations du site (monté une seule fois dans le layout) :
 *  - apparition au défilement des éléments marqués `data-reveal` (et des <section> de page) ;
 *  - barre de progression de lecture en haut de l'écran ;
 *  - halo qui suit le curseur sur les cartes `.spotlight` ;
 *  - compteurs animés `data-count`, parallaxe légère `data-parallax`.
 * Rien n'est masqué dans le HTML : seuls les blocs sous la ligne de flottaison reçoivent l'état
 * « en attente », après chargement. Sans JavaScript ou avec « réduire les animations », tout reste visible.
 */
const REVEAL_SELECTOR = "[data-reveal], main section:not([data-reveal]):not(:has([data-reveal]))";

export function MotionRoot() {
  const pathname = usePathname();

  // Barre de progression + parallaxe + halo des cartes (une seule fois)
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ticking = false;

    const update = () => {
      ticking = false;
      const max = root.scrollHeight - window.innerHeight;
      root.style.setProperty("--progress", max > 0 ? String(Math.min(1, window.scrollY / max)) : "0");
      if (reduced) return;
      document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return;
        const factor = Number(el.dataset.parallax) || 0.1;
        const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * -factor;
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
      });
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const card = (e.target as Element | null)?.closest?.<HTMLElement>(".spotlight");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    document.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("pointermove", onPointer);
    };
  }, []);

  // Apparitions au défilement + compteurs (à chaque changement de page)
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let els: HTMLElement[];
    try {
      els = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
    } catch {
      // Navigateur sans :has() : on se limite aux éléments marqués explicitement
      els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    }
    const counters = Array.from(document.querySelectorAll<HTMLElement>("[data-count]"));

    if (reduced || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }

    const runCounter = (el: HTMLElement) => {
      const target = Number(el.dataset.count);
      if (!Number.isFinite(target) || el.dataset.counted) return;
      el.dataset.counted = "1";
      const prefix = el.dataset.prefix ?? "";
      const suffix = el.dataset.suffix ?? "";
      const start = performance.now();
      const duration = 1300;
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 4);
        el.textContent = `${prefix}${Math.round(target * eased)}${suffix}`;
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const show = (el: HTMLElement, delay: number) => {
      el.style.setProperty("--rv-delay", `${delay}ms`);
      el.classList.add("rv-in", "is-in");
      // Double image : laisse le navigateur peindre l'état masqué avant de lancer la transition
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove("rv-wait")));
      window.setTimeout(() => el.classList.remove("rv-in"), 1300 + delay);
    };

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement);
        visible.forEach((el, i) => {
          io.unobserve(el);
          if (el.dataset.count !== undefined) runCounter(el);
          else show(el, Math.min(i, 6) * 80);
        });
      },
      { rootMargin: "0px 0px -7% 0px", threshold: 0.06 },
    );

    const fold = window.innerHeight * 0.92;
    els.forEach((el) => {
      if (el.classList.contains("is-in")) return;
      const rect = el.getBoundingClientRect();
      // Déjà à l'écran, ou rangé sur le côté dans un carrousel horizontal : on ne le masque pas
      // (sinon la carte resterait vide le temps du balayage au doigt).
      if (rect.top < fold || rect.left >= window.innerWidth || rect.right <= 0) {
        el.classList.add("is-in");
      } else {
        el.classList.add("rv-wait");
        io.observe(el);
      }
    });
    counters.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, [pathname]);

  return <div aria-hidden className="scroll-progress" />;
}
