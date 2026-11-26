import Link from "next/link";
import Image from "next/image";
import { type Product, startingPriceLabel, maxForce, categories } from "@/data/products";
import { ForceBadge } from "@/components/ui/ForceBadge";
import { labelImage } from "@/lib/etiquettes";
import { cn, commas, fr } from "@/lib/utils";

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
 * Prix d'appel : « dès » et « /g » en petit, le montant en caractères de titre, comme sur une étiquette de prix.
 * Un prix avec centimes (« 4,50 € ») est marqué `data-long` : plus large, son unité s'abrège plus tôt (globals.css).
 */
function PriceLabel({ label }: { label: string }) {
  const m = label.match(/^(dès\s+)?(.+?)(\s*\/\s*g)?$/);
  const [, from, amount, perGram] = m ?? [null, "", label, ""];
  return (
    <p className="etiquette-prix t-num" data-long={amount.length > 4 ? "" : undefined}>
      {from && <span className="etiquette-prix-mot">dès</span>}
      <span className="etiquette-prix-montant">{amount}</span>
      {/* l'unité en toutes lettres, ou abrégée quand l'étiquette est très étroite (voir globals.css) */}
      {perGram && (
        <>
          <span className="etiquette-prix-mot etiquette-unite">le gramme</span>
          <span className="etiquette-prix-mot etiquette-unite-courte">/g</span>
        </>
      )}
    </p>
  );
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
  hideBadge = false,
}: {
  product: Product;
  priority?: boolean;
  className?: string;
  available?: boolean;
  /** Niveau du titre : 2 quand la grille suit directement le H1 de la page (hiérarchie des titres). */
  headingLevel?: 2 | 3;
  /** Sans la pastille du produit : dans la section « Sur commande », toutes les étiquettes porteraient la même. */
  hideBadge?: boolean;
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
        {/* Sur une étiquette étroite, les deux pastilles ne tiennent pas côte à côte : « Vidéo » passe alors sous la première. */}
        <div className="absolute inset-x-0 top-0 z-[2] flex flex-wrap items-start justify-between gap-x-2 gap-y-1.5 p-3 sm:p-3.5">
          {!available ? <span className="pastille pastille-sapin">Épuisé</span> : p.badge && !hideBadge ? <span className="pastille">{fr(p.badge)}</span> : <span />}
          {p.video && <span className="pastille pastille-papier">Vidéo</span>}
        </div>
      </div>
      <div aria-hidden className="rule-double" />
      <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-3 sm:px-5 sm:pb-5 sm:pt-4">
        <Heading className="softens font-serif text-[1.1875rem] font-normal leading-[1.14] tracking-[-0.012em] sm:text-[1.4rem]">{fr(labelName(p.name))}</Heading>
        <p className="mt-1.5 text-[0.8125rem] leading-snug text-foreground/70">{commas(p.origin ?? categories[p.category].name)}</p>
        {/* Force et prix : l'un sous l'autre sur une étiquette étroite, face à face dès que l'étiquette elle-même est assez large */}
        <div className="etiquette-pied mt-auto">
          {p.objet ? <span className="text-[0.8125rem] text-foreground/75">{p.objet === "accessoire" ? "Accessoire" : "Cosmétique"}</span> : <ForceBadge force={maxForce(p)} label={p.forceLabel} />}
          <PriceLabel label={startingPriceLabel(p)} />
        </div>
      </div>
    </article>
  );
}
