"use client";

import Link from "next/link";
import Image from "next/image";
import { labelImage } from "@/lib/etiquettes";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { priceCart, QUOTE_FROM_GRAMS } from "@/lib/pricing";
import { FREE_SHIPPING_FROM_CENTS } from "@/lib/shipping";
import { site } from "@/data/site";
import { formatEUR, commas, fr } from "@/lib/utils";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export function CartPage() {
  const { lines, hydrated, setQuantity, remove } = useCart();
  const cart = priceCart(lines);
  const subtotal = cart.subtotalCents;
  const remaining = Math.max(0, FREE_SHIPPING_FROM_CENTS - subtotal);

  return (
    <div className="wrap pb-24 pt-7 sm:pt-9">
      <Breadcrumbs items={[{ name: "Panier", path: "/panier" }]} />
      <h1 className="t-h1 mt-9 sm:mt-12">Votre panier</h1>

      {!hydrated ? (
        <p className="mt-10 text-foreground/70">Chargement…</p>
      ) : lines.length === 0 ? (
        <div className="mt-10 border-t border-foreground/15 pt-10">
          <p className="t-h3">Votre panier est vide.</p>
          <p className="mt-3 text-foreground/75">Fleurs, résines, huiles, vape : découvrez la sélection CBDoux.</p>
          <Link href="/boutique" className="btn btn-primary mt-7">
            Voir la boutique
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-10">
          <ul className="lg:col-span-7">
            {cart.lines.map((l) => (
              <li key={l.sku} className="flex gap-4 border-t border-foreground/15 py-5 last:border-b sm:gap-6">
                <Link href={`/produit/${l.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[3px] bg-[#e9dfc6] sm:h-28 sm:w-28">
                  <Image src={labelImage(l.image)} alt={l.name} fill sizes="112px" className="object-cover" />
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-4">
                    <Link href={`/produit/${l.slug}`} className="softens t-title">
                      {l.name}
                    </Link>
                    <p className="t-num whitespace-nowrap text-[1.0625rem] font-medium">{formatEUR(l.totalCents)}</p>
                  </div>
                  <p className="t-fine mt-1">
                    {commas(l.variantLabel)}, {formatEUR(l.unitCents)} l'unité
                    {l.bulkPercent > 0 && <span className="t-num block text-or">{fr(`Prix dégressif : −${l.bulkPercent} %`)}</span>}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                    <div className="inline-flex items-center rounded-full border border-foreground/30">
                      <button type="button" onClick={() => setQuantity(l.sku, l.quantity - 1)} aria-label="Diminuer la quantité" className="flex h-10 w-10 items-center justify-center">
                        <Minus aria-hidden size={14} />
                      </button>
                      <span className="t-num w-7 text-center">{l.quantity}</span>
                      <button type="button" onClick={() => setQuantity(l.sku, l.quantity + 1)} aria-label="Augmenter la quantité" className="flex h-10 w-10 items-center justify-center">
                        <Plus aria-hidden size={14} />
                      </button>
                    </div>
                    <button type="button" onClick={() => remove(l.sku)} className="link text-[0.9375rem]">
                      Retirer
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="panel paper-object lg:sticky lg:top-28">
              <div className="p-6 sm:p-7">
                <h2 className="t-h3">Récapitulatif</h2>
                <dl className="mt-5 space-y-2.5 text-[0.9688rem]">
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-foreground/75">Sous-total</dt>
                    <dd className="t-num">{formatEUR(subtotal)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-foreground/75">Livraison</dt>
                    <dd className="text-right">{remaining === 0 ? "Colissimo offert" : "calculée à l'étape suivante"}</dd>
                  </div>
                </dl>
                {cart.quotes.map((q) => {
                  const name = lines.find((l) => l.slug === q.slug)?.name ?? "";
                  return (
                    <p key={q.slug} className="mt-4 rounded-[3px] border border-or/50 px-3.5 py-3 text-[0.875rem] leading-snug">
                      {fr(`${q.grams} g de ${name} : à partir de ${QUOTE_FROM_GRAMS} g, le prix se négocie.`)}{" "}
                      <a href={`${site.whatsapp}?text=${encodeURIComponent(`Bonjour CBDoux, je souhaite un prix pour ${q.grams} g de ${name.replace(/\s+[—–-]\s+/g, " ")}.`)}`} target="_blank" rel="noopener noreferrer" className="link">
                        Nous écrire sur WhatsApp
                      </a>
                    </p>
                  );
                })}
                {remaining > 0 && (
                  <p className="mt-4 text-[0.875rem] text-foreground/80">
                    Plus que <strong className="t-num">{formatEUR(remaining)}</strong> pour le port Colissimo offert.
                  </p>
                )}
              </div>
              <div aria-hidden className="rule-double" />
              <div className="p-6 sm:p-7">
                <div className="flex items-baseline justify-between gap-4">
                  <span>Total estimé</span>
                  <span className="t-num font-serif text-[2.25rem] font-light leading-none tracking-[-0.02em]">{formatEUR(subtotal)}</span>
                </div>
                <Link href="/commande" className="btn btn-primary mt-6 w-full">
                  Finaliser ma commande
                </Link>
                <ul className="t-fine mt-6 space-y-1.5">
                  <li>Commande envoyée sur WhatsApp, paiement par lien sécurisé (carte).</li>
                  <li>Colis neutre, expédié sous 24 h ouvrées.</li>
                  <li>Code BIENVENUE10 : 10 € offerts dès 100 €.</li>
                </ul>
                <Link href="/boutique" className="link mt-6 block text-center text-[0.9375rem]">
                  Continuer mes achats
                </Link>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
