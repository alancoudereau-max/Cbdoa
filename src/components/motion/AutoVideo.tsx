"use client";

import { useEffect, useRef } from "react";

/**
 * Boucle vidéo muette qui ne se charge et ne joue que lorsqu'elle est à l'écran.
 * L'image d'attente (poster) est affichée par le parent ; la vidéo apparaît en fondu dès qu'elle peut jouer.
 * Respecte « réduire les animations » et le mode économie de données : dans ces cas, seule l'image reste.
 */
export function AutoVideo({ src, label, className }: { src: string; label: string; className?: string }) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduced || saveData || !("IntersectionObserver" in window)) return;

    const onReady = () => video.setAttribute("data-ready", "1");
    video.addEventListener("playing", onReady);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            if (!video.src) video.src = src;
            video.play().catch(() => undefined);
          } else {
            video.pause();
          }
        });
      },
      { rootMargin: "120px 0px", threshold: 0.2 },
    );
    io.observe(video);
    return () => {
      io.disconnect();
      video.removeEventListener("playing", onReady);
    };
  }, [src]);

  return <video ref={ref} muted loop playsInline preload="none" aria-label={label} className={className} />;
}
