"use client";

import { useEffect, useRef } from "react";

/**
 * Poussière d'or en suspension (canvas léger) derrière le premier écran.
 * Une seule pastille lumineuse est dessinée une fois, puis recopiée pour chaque grain : très peu de calcul.
 * En pause hors écran ou onglet masqué ; immobile si le visiteur a demandé moins d'animations.
 */
export function GoldDust({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 32;
    const sctx = sprite.getContext("2d");
    if (!sctx) return;
    const g = sctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    g.addColorStop(0, "rgba(246, 222, 150, 1)");
    g.addColorStop(0.35, "rgba(240, 208, 130, 0.45)");
    g.addColorStop(1, "rgba(240, 208, 130, 0)");
    sctx.fillStyle = g;
    sctx.fillRect(0, 0, 32, 32);

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    type P = { x: number; y: number; r: number; vy: number; phase: number; sway: number; alpha: number };
    let particles: P[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(56, Math.max(22, (w * h) / 20000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 2.4 + Math.random() * 6,
        vy: 0.07 + Math.random() * 0.24,
        phase: Math.random() * Math.PI * 2,
        sway: 0.2 + Math.random() * 0.6,
        alpha: 0.22 + Math.random() * 0.5,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        const x = p.x + Math.sin(t / 2600 + p.phase) * 18 * p.sway;
        ctx.globalAlpha = p.alpha * (0.55 + 0.45 * Math.sin(t / 900 + p.phase));
        ctx.drawImage(sprite, x - p.r, p.y - p.r, p.r * 2, p.r * 2);
        p.y -= p.vy;
        if (p.y < -12) {
          p.y = h + 12;
          p.x = Math.random() * w;
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (t: number) => {
      if (!running) return;
      draw(t);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    draw(0);
    // La poussière ne se met en mouvement qu'une fois la page arrivée : le chargement passe d'abord.
    let armed = false;
    let visible = false;
    const arm = () => {
      armed = true;
      if (visible && !document.hidden) start();
    };
    const onLoad = () => window.setTimeout(arm, 900);
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    const io = new IntersectionObserver((entries) => {
      visible = Boolean(entries[0]?.isIntersecting);
      if (visible && armed && !document.hidden) start();
      else stop();
    });
    io.observe(canvas);
    const onVisibility = () => (document.hidden || !visible || !armed ? stop() : start());
    const onResize = () => {
      resize();
      draw(performance.now());
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("load", onLoad);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}
