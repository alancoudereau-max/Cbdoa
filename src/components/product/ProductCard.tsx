import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, PlayCircle } from "lucide-react";
import { type Product, startingPriceLabel, maxForce, categories } from "@/data/products";
import { ForceBadge } from "@/components/ui/ForceBadge";
import { cn } from "@/lib/utils";

export function ProductCard({ product: p, priority = false, className, available = true }: { product: Product; priority?: boolean; className?: string; available?: boolean }) {
  return (
    <article className={cn("lift group relative flex flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-card/60 hover:border-gold/50 transition-colors", className)}>
      <Link href={`/produit/${p.slug}`} className="absolute inset-0 z-10" aria-label={`Voir ${p.name}`} />
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-black via-card-2 to-black">
        <Image
          src={p.image}
          alt={`${p.name} — ${categories[p.category].name} CBDoux`}
          fill
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <div className="flex flex-col gap-1.5">
            {p.badge && (
              <span className="rounded-full bg-background/80 backdrop-blur px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-gold border border-gold/30">
                {p.badge}
              </span>
            )}
            {!available && (
              <span className="rounded-full bg-background/85 backdrop-blur px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/70 border border-foreground/20">
                Épuisé
              </span>
            )}
          </div>
          {p.video && <PlayCircle size={20} className="text-gold/80 drop-shadow" aria-label="Vidéo disponible" />}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-1.5">{p.origin ?? categories[p.category].name}</p>
        <h3 className="font-serif text-xl sm:text-2xl leading-tight">{p.name}</h3>
        <div className="mt-2">
          <ForceBadge force={maxForce(p)} size="xs" />
        </div>
        <p className="mt-2.5 text-sm text-foreground/65 line-clamp-2 flex-1">{p.short}</p>
        <div className="mt-4 flex items-center justify-between border-t border-foreground/10 pt-3.5">
          <span className="font-serif text-lg text-gold">{startingPriceLabel(p)}</span>
          <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/50 group-hover:text-gold transition-colors">
            Voir <ArrowUpRight size={12} className="group-hover:rotate-45 transition-transform" />
          </span>
        </div>
      </div>
    </article>
  );
}
