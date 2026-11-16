"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/data/products";

/** Visuel produit : la photo posée sur le papier (par défaut), et la vidéo quand il y en a une. */
export function ProductMedia({ product: p }: { product: Product }) {
  const [mode, setMode] = useState<"image" | "video">("image");

  return (
    <div>
      <div className="paper paper-object relative aspect-square overflow-hidden bg-[#e9dfc6]">
        {mode === "video" && p.video ? (
          <video src={p.video} controls autoPlay playsInline preload="metadata" poster={p.image} className="absolute inset-0 h-full w-full bg-nuit object-contain" aria-label={`Vidéo de présentation, ${p.name}`} />
        ) : (
          <Image src={p.image} alt={`${p.name}, photo CBDoux`} fill priority sizes="(max-width: 1024px) 100vw, 640px" className="on-paper object-cover" />
        )}
      </div>
      {p.video && (
        <div className="mt-3 flex gap-2" role="tablist" aria-label="Photo ou vidéo">
          <button type="button" role="tab" aria-selected={mode === "image"} onClick={() => setMode("image")} className="choice choice-pill px-4 py-2 text-[0.9375rem]">
            Photo
          </button>
          <button type="button" role="tab" aria-selected={mode === "video"} onClick={() => setMode("video")} className="choice choice-pill px-4 py-2 text-[0.9375rem]">
            Vidéo
          </button>
        </div>
      )}
    </div>
  );
}
