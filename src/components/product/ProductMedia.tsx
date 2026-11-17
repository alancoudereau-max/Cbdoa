"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Product } from "@/data/products";

type Props = {
  product: Product;
  /** Photo affichée : la copie « sur papier » quand elle existe, sinon la photo d'origine. */
  src: string;
  /** Taille d'origine de la photo en pixels : dit si la loupe a de quoi montrer plus de détail. */
  natural?: [number, number] | null;
};

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Visuel produit : la photo posée sur le papier, la loupe d'horloger pour l'examiner de près,
 * et la vidéo quand il y en a une.
 *
 * La loupe : à la souris, elle suit le pointeur dès qu'il survole la photo ; au doigt, on touche la photo
 * (ou le bouton) pour la poser, on la promène en glissant, et on la range en touchant ailleurs. Au clavier,
 * le bouton la pose au centre et les flèches la déplacent. Elle n'est proposée que si la photo d'origine est
 * nettement plus grande que son affichage : sinon il n'y aurait rien de plus à voir.
 */
export function ProductMedia({ product: p, src, natural }: Props) {
  const [mode, setMode] = useState<"image" | "video">("image");
  const wrap = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const lens = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(0); // grossissement ; 0 = pas de loupe pour cette photo à cette taille d'écran
  const [held, setHeld] = useState(false); // loupe posée (doigt, clavier, bouton) ; à la souris le survol suffit
  const point = useRef({ x: 0.5, y: 0.5, above: false }); // point examiné, en fraction de la photo
  const raf = useRef(0);
  const idle = useRef(0);
  const pointer = useRef("mouse");
  const sharp = useRef(false);

  // La loupe n'a d'intérêt que si la photo d'origine dépasse nettement sa taille à l'écran.
  useEffect(() => {
    if (!natural) return;
    const measure = () => {
      const w = frame.current?.clientWidth ?? 0;
      if (!w) return;
      const ratio = natural[0] / w;
      setZoom(ratio >= 1.5 ? Math.min(2.4, Math.max(1.7, ratio)) : 0);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [natural]);

  const draw = useCallback(() => {
    raf.current = 0;
    const f = frame.current;
    const l = lens.current;
    if (!f || !l || !zoom) return;
    const W = f.clientWidth;
    const H = f.clientHeight;
    const d = l.offsetWidth;
    const { x, y, above } = point.current;
    const px = x * W;
    const py = y * H;
    // Au doigt, la loupe se tient au-dessus du doigt (qui cacherait ce qu'on regarde) et ne déborde pas sur les côtés.
    const cx = above ? Math.min(W - d / 2, Math.max(d / 2, px)) : px;
    const cy = above ? Math.max(-d * 0.42, py - d * 0.68) : py;
    l.style.translate = `${cx - d / 2}px ${cy - d / 2}px`;
    // Même cadrage que la photo (elle couvre le cadre, centrée), agrandi.
    const [nw, nh] = natural ?? [1, 1];
    const s = Math.max(W / nw, H / nh) * zoom;
    l.style.backgroundSize = `${nw * s}px ${nh * s}px`;
    l.style.backgroundPosition = `${d / 2 - px * zoom + (W * zoom - nw * s) / 2}px ${d / 2 - py * zoom + (H * zoom - nh * s) / 2}px`;
  }, [zoom, natural]);

  const moveTo = (clientX: number, clientY: number, above: boolean) => {
    const f = frame.current;
    if (!f) return;
    const r = f.getBoundingClientRect();
    point.current = { x: clamp01((clientX - r.left) / r.width), y: clamp01((clientY - r.top) / r.height), above };
    if (!raf.current) raf.current = requestAnimationFrame(draw);
  };

  const show = (on: boolean) => wrap.current?.toggleAttribute("data-loupe", on);

  // Au doigt, la loupe retient le défilement sur la photo : elle se range d'elle-même si on ne la touche plus.
  const rest = () => {
    window.clearTimeout(idle.current);
    idle.current = window.setTimeout(() => setHeld(false), 7000);
  };

  // Première utilisation : la loupe montre tout de suite l'image déjà à l'écran, puis la photo d'origine dès qu'elle est chargée.
  const sharpen = useCallback(() => {
    const l = lens.current;
    if (!l || sharp.current) return;
    sharp.current = true;
    const shown = frame.current?.querySelector("img")?.currentSrc;
    if (shown) l.style.backgroundImage = `url("${shown}")`;
    const full = new window.Image();
    full.onload = () => {
      if (lens.current) lens.current.style.backgroundImage = `url("${src}")`;
    };
    full.src = src;
  }, [src]);

  // Loupe posée : elle se range si l'on touche ailleurs, à la touche Échap, ou quand la photo quitte l'écran.
  useEffect(() => {
    show(held);
    if (!held) return;
    const away = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setHeld(false);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setHeld(false);
    };
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", key);
    const io = "IntersectionObserver" in window ? new IntersectionObserver(([en]) => !en.isIntersecting && setHeld(false)) : null;
    if (io && frame.current) io.observe(frame.current);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", key);
      io?.disconnect();
      window.clearTimeout(idle.current);
    };
  }, [held]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const canZoom = zoom > 0 && mode === "image";

  const toggle = (fromKeyboard: boolean) => {
    if (held) {
      setHeld(false);
      return;
    }
    sharpen();
    const byTouch = !fromKeyboard && pointer.current !== "mouse";
    point.current = { x: 0.5, y: 0.5, above: byTouch };
    draw();
    setHeld(true);
    if (byTouch) rest();
  };

  const nudge = (dx: number, dy: number) => {
    point.current = { x: clamp01(point.current.x + dx), y: clamp01(point.current.y + dy), above: false };
    draw();
  };

  return (
    <div>
      <div
        ref={wrap}
        className="loupe-wrap"
        onPointerDownCapture={(e) => {
          pointer.current = e.pointerType;
        }}
      >
        <div
          ref={frame}
          className="loupe-frame paper paper-object relative aspect-square overflow-hidden bg-[#e9dfc6]"
          data-zoom={canZoom ? "" : undefined}
          data-held={canZoom && held ? "" : undefined}
          onPointerEnter={(e) => {
            if (!canZoom || e.pointerType !== "mouse") return;
            sharpen();
            moveTo(e.clientX, e.clientY, false);
            show(true);
          }}
          onPointerMove={(e) => {
            if (!canZoom) return;
            if (e.pointerType === "mouse") {
              moveTo(e.clientX, e.clientY, false);
              show(true);
            } else if (held) {
              moveTo(e.clientX, e.clientY, true);
              rest();
            }
          }}
          onPointerLeave={(e) => {
            if (e.pointerType === "mouse" && !held) show(false);
          }}
          onPointerDown={(e) => {
            if (!canZoom || !held || e.pointerType === "mouse") return;
            moveTo(e.clientX, e.clientY, true);
            rest();
          }}
          onClick={(e) => {
            // Au doigt : toucher la photo pose la loupe à cet endroit.
            if (!canZoom || held || pointer.current === "mouse") return;
            sharpen();
            moveTo(e.clientX, e.clientY, true);
            setHeld(true);
            rest();
          }}
        >
          {mode === "video" && p.video ? (
            <video src={p.video} controls autoPlay playsInline preload="metadata" poster={p.image} className="absolute inset-0 h-full w-full bg-nuit object-contain" aria-label={`Vidéo de présentation, ${p.name}`} />
          ) : (
            <Image src={src} alt={`${p.name}, photo CBDoux`} fill priority sizes="(max-width: 1024px) 100vw, 640px" className="object-cover" draggable={false} />
          )}
        </div>

        <div ref={lens} aria-hidden className="loupe" />

        {canZoom && (
          <button
            type="button"
            className="loupe-btn"
            aria-pressed={held}
            aria-label={held ? "Ranger la loupe" : "Examiner la photo à la loupe"}
            onClick={(e) => toggle(e.detail === 0)}
            onKeyDown={(e) => {
              if (!held) return;
              const step = e.shiftKey ? 0.12 : 0.05;
              if (e.key === "ArrowLeft") nudge(-step, 0);
              else if (e.key === "ArrowRight") nudge(step, 0);
              else if (e.key === "ArrowUp") nudge(0, -step);
              else if (e.key === "ArrowDown") nudge(0, step);
              else return;
              e.preventDefault();
            }}
          >
            <svg aria-hidden width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="8.6" cy="8.6" r="5.9" />
              <path d="M13 13l4.6 4.6" />
              {!held && <path d="M8.6 6.3v4.6M6.3 8.6h4.6" />}
            </svg>
          </button>
        )}
      </div>

      {p.video && (
        <div className="mt-3 flex gap-2" role="tablist" aria-label="Photo ou vidéo">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "image"}
            onClick={() => setMode("image")}
            className="choice choice-pill px-4 py-2 text-[0.9375rem]"
          >
            Photo
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "video"}
            onClick={() => {
              setHeld(false);
              show(false);
              setMode("video");
            }}
            className="choice choice-pill px-4 py-2 text-[0.9375rem]"
          >
            Vidéo
          </button>
        </div>
      )}
    </div>
  );
}
