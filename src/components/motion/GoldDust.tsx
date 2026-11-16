"use client";

import { useEffect, useRef } from "react";

/**
 * Poussière d'or en suspension (canvas léger) pour le fond de l'accueil.
 * En pause hors écran ou onglet masqué ; immobile si l'utilisateur a demandé moins d'animations.
 */
export function GoldDust({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
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
      const count = Math.round(Math.min(70, Math.max(26, (w * h) / 16000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1.9,
        vy: 0.08 + Math.random() * 0.26,
        phase: Math.random() * Math.PI * 2,
        sway: 0.2 + Math.random() * 0.6,
        alpha: 0.25 + Math.random() * 0.55,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        const twinkle = 0.55 + 0.45 * Math.sin(t / 900 + p.phase);
        const x = p.x + Math.sin(t / 2600 + p.phase) * 18 * p.sway;
        const g = ctx.createRadialGradient(x, p.y, 0, x, p.y, p.r * 4);
        g.addColorStop(0, `rgba(240, 208, 130, ${(p.alpha * twinkle).toFixed(3)})`);
        g.addColorStop(1, "rgba(240, 208, 130, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
        p.y -= p.vy;
        if (p.y < -12) {
          p.y = h + 12;
          p.x = Math.random() * w;
        }
      }
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
    const io = new IntersectionObserver((entries) => (entries[0]?.isIntersecting && !document.hidden ? start() : stop()));
    io.observe(canvas);
    const onVisibility = () => (document.hidden ? stop() : start());
    const onResize = () => {
      resize();
      draw(performance.now());
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}
