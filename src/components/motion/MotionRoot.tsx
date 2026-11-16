"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Mouvement lié au défilement (monté une seule fois dans le layout). Volontairement réduit :
 *  - `.unveil` : les grandes images se dévoilent en entrant à l'écran ;
 *  - `[data-inview]` : reçoit la classe `is-in` (exemple de conversation, tracés qui se dessinent) ;
 *  - `[data-parallax]` : léger décalage vertical (cartes postales).
 * Rien n'est masqué dans le HTML : sans JavaScript ou avec « réduire les animations », tout est visible.
 */
export function MotionRoot() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = Array.from(document.querySelectorAll<HTMLElement>(".unveil, [data-inview]"));

    if (reduced || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-in"));
      return;
    }

    // Ce qui est déjà à l'écran au chargement ne se « dévoile » pas : on le laisse en place.
    const fold = window.innerHeight * 0.9;
    const waiting: HTMLElement[] = [];
    targets.forEach((el) => {
      if (el.classList.contains("is-in")) return;
      const r = el.getBoundingClientRect();
      if (r.top < fold && r.bottom > 0 && !el.hasAttribute("data-inview")) el.classList.add("is-in", "no-anim");
      else waiting.push(el);
    });
    root.classList.add("js");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          e.target.classList.add("is-in");
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );
    waiting.forEach((el) => io.observe(el));

    // Parallaxe légère
    const parallax = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      parallax.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const factor = Number(el.dataset.parallax) || 0.06;
        const offset = (r.top + r.height / 2 - vh / 2) * -factor;
        el.style.translate = `0 ${offset.toFixed(1)}px`;
      });
    };
    const onScroll = () => {
      if (ticking || parallax.length === 0) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    if (parallax.length) {
      update();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
    }

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return null;
}
