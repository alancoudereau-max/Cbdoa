import Link from "next/link";
import Image from "next/image";
import { type Product, startingPriceLabel, maxForce, categories } from "@/data/products";
import { ForceBadge } from "@/components/ui/ForceBadge";
import { labelImage } from "@/lib/etiquettes";
import { cn, commas } from "@/lib/utils";

/**
 * Le nom tel qu'il s'imprime sur l'étiquette : sans tiret. La précision de rayon tombe quand la ligne
 * du dessous la donne déjà (« Beldia — Résine » devient « Beldia »), sinon elle suit le nom
 * (« Californienne Indoor — Small Buds » devient « Californienne Indoor Small Buds »).
 * Le nom complet reste celui de la fiche, du panier et du lien (aria-label).
 */
function labelName(name: string): string {
  const [main, suffix] = name.split(/\s+[—–]\s+/);
  if (!suffix) return name;
  return /^résines?$/i.test(suffix) ? main : `${main} ${suffix}`;
}

/**
 * Carte produit en forme d'étiquette : papier crème, photo fondue dans le papier,
 * double filet doré, nom, origine, force et prix d'appel — comme sur le flacon.
 */
export function ProductCard({
  product: p,
  priority = false,
  className,
  available = true,
  headingLevel = 3,
}: {
  product: Product;
  priority?: boolean;
  className?: string;
  available?: boolean;
  /** Niveau du titre : 2 quand la grille suit directement le H1 de la page (hiérarchie des titres). */
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article data-reveal="up" className={cn("paper etiquette group", className)}>
      <Link href={`/produit/${p.slug}`} className="absolute inset-0 z-10 rounded-[3px]" aria-label={`Voir ${p.name}`} />
      <div className="etiquette-photo">
        <Image
          src={labelImage(p.image)}
          alt={`${p.name} — ${categories[p.category].name} CBDoux`}
          fill
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={cn("object-cover", !available && "opacity-60 grayscale")}
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-2.5 sm:p-3">
          {!available ? <span className="pastille bg-sapin text-etiquette">Épuisé</span> : p.badge ? <span className="pastille">{p.badge}</span> : <span />}
          {p.video && <span className="pastille bg-etiquette/90 text-sapin font-medium">Vidéo</span>}
        </div>
      </div>
      <div aria-hidden className="rule-double" />
      <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-3 sm:px-5 sm:pb-5 sm:pt-4">
        <Heading className="softens font-serif text-[1.1875rem] font-normal leading-[1.14] tracking-[-0.012em] sm:text-[1.4rem]">{labelName(p.name)}</Heading>
        <p className="mt-1.5 text-[0.8125rem] leading-snug text-foreground/70">{commas(p.origin ?? categories[p.category].name)}</p>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-x-3 gap-y-1.5 pt-4 sm:pt-5">
          <ForceBadge force={maxForce(p)} />
          <p className="t-num whitespace-nowrap text-[0.9375rem] font-semibold">{startingPriceLabel(p)}</p>
        </div>
      </div>
    </article>
  );
}
