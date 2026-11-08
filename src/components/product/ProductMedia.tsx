"use client";

import Image from "next/image";
import { useState } from "react";
import { Play, ImageIcon } from "lucide-react";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";

/** Visuel produit : photo (par défaut) + vidéo si disponible. */
export function ProductMedia({ product: p }: { product: Product }) {
  const [mode, setMode] = useState<"image" | "video">("image");

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-br from-black via-card-2 to-black shadow-deep">
        {mode === "video" && p.video ? (
          <video src={p.video} controls autoPlay playsInline preload="metadata" poster={p.image} className="absolute inset-0 h-full w-full object-contain bg-black" aria-label={`Vidéo de présentation — ${p.name}`} />
        ) : (
          <Image src={p.image} alt={`${p.name} — photo CBDoux`} fill priority sizes="(max-width: 1024px) 100vw, 640px" className="object-cover" />
        )}
      </div>
      {p.video && (
        <div className="mt-3 flex gap-2" role="tablist" aria-label="Média">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "image"}
            onClick={() => setMode("image")}
            className={cn("inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs transition-colors", mode === "image" ? "border-gold text-gold bg-gold/10" : "border-foreground/15 text-foreground/70 hover:border-foreground/40")}
          >
            <ImageIcon size={14} /> Photo
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "video"}
            onClick={() => setMode("video")}
            className={cn("inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs transition-colors", mode === "video" ? "border-gold text-gold bg-gold/10" : "border-foreground/15 text-foreground/70 hover:border-foreground/40")}
          >
            <Play size={14} /> Vidéo
          </button>
        </div>
      )}
    </div>
  );
}
