import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import { site, company, locations } from "@/data/site";
import { PageHero } from "@/components/ui/PageHero";
import { WhatsAppPlaque } from "@/components/brand/WhatsAppPlaque";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "À propos de CBDoux — CBD premium né dans le Haut-Doubs",
  description:
    "L'histoire de CBDoux, nom commercial de SMART VEND : un CBD premium né dans le Haut-Doubs, accessible 24 h/24. Distributeurs, retrait, livraison en France.",
  path: "/a-propos",
  keywords: ["cbdoux", "smart vend", "cbd haut-doubs", "boutique cbd française"],
});

const chapters = [
  { title: "Une idée pas si douce", body: "CBDoux est né d'une idée simple : rendre le CBD premium accessible à toute heure, sans contrainte et avec un maximum de discrétion. Dans le Haut-Doubs, cette idée est devenue un projet concret : proposer mieux, plus pratique, plus discret." },
  { title: "Du besoin à la solution", body: "Acheter du CBD de qualité pouvait être compliqué, peu discret, ou impossible au bon moment. Entre horaires de boutique et regards inutiles, l'expérience manquait de souplesse. CBDoux propose une autre façon, plus moderne et plus autonome." },
  { title: "SMART VEND, la structure derrière", body: "Derrière CBDoux, il y a SMART VEND, spécialisée dans la distribution automatique de produits de bien-être. Fiabilité des machines, qualité des produits, expérience client simple : un nouveau standard de distribution, plus propre et plus intelligent." },
  { title: "Une cabine, beaucoup de sens", body: "Le premier distributeur a été installé dans une ancienne cabine téléphonique recyclée à Charquemont. Un objet du quotidien transformé en point d'accès discret, ouvert 24 h/24. Un second distributeur a suivi au Russey, face à la mairie." },
  { title: "La discrétion avant tout", body: "Pensé pour acheter sans se faire remarquer, sans se justifier et sans perdre de temps. Pas d'enseigne tapageuse, pas d'ambiance gênante : du CBD accessible, en toute autonomie. En ligne, le même principe : colis neutre, libellé bancaire neutre." },
  { title: "Une marque douce, mais exigeante", body: "Le ton est moderne, parfois avec une touche d'humour, mais toujours sérieux sur l'essentiel : la qualité, la conformité et le service. Chaque lot est analysé en laboratoire, chaque variété est goûtée avant d'entrer au catalogue." },
];

const commitments = [
  "Produits conformes (THC < 0,3 %), analyses de laboratoire publiées.",
  "Sélection goûtée et validée, conservation à 20 °C en sachets biphase.",
  "Aucune promesse miracle : des descriptions honnêtes et des conseils de prudence clairs.",
  "Vente réservée aux adultes, discrétion totale en ligne comme sur place.",
  "Un interlocuteur humain sur WhatsApp, 7 jours sur 7.",
];

export default function AboutPage() {
  const [charquemont, russey] = locations.vendingMachines;
  return (
    <div>
      <PageHero
        crumbs={[{ name: "À propos", path: "/a-propos" }]}
        title={
          <>
            L'histoire <em>de CBDoux</em>
          </>
        }
        lead="Une marque pensée pour celles et ceux qui veulent du CBD légal, premium, bien conservé et disponible sans compromis, dans le Haut-Doubs comme partout en France."
      />

      {/* Six chapitres, dans l'ordre */}
      <section className="nuit section">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-10">
          <ol className="lg:col-span-7">
            {chapters.map((ch, n) => (
              <li key={ch.title} className="grid grid-cols-[2.75rem_1fr] gap-x-4 border-t border-foreground/15 py-8 last:border-b sm:grid-cols-[5rem_1fr]">
                <span aria-hidden className="step-num sm:h-[3.1rem] sm:w-[3.1rem] sm:text-[1.4375rem]">
                  {n + 1}
                </span>
                <div>
                  <h2 className="t-h3">{ch.title}</h2>
                  <p className="mt-3.5 measure-wide text-foreground/80">{ch.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-28">
              <figure className="paper postcard relative z-[2] mx-auto w-[78%] max-w-[19rem] lg:w-full" style={{ "--tilt": "1.8deg", "--drift": "26px" } as CSSProperties}>
                <Image src={charquemont.image} alt={charquemont.imageAlt} width={charquemont.imageSize[0]} height={charquemont.imageSize[1]} sizes="(max-width: 1024px) 78vw, 300px" className="block h-auto w-full" />
                <figcaption>
                  <span className="t-note text-[1.125rem] leading-tight">Charquemont</span>
                  <span className="text-[0.8125rem] text-foreground/70">La cabine</span>
                </figcaption>
              </figure>
              <figure className="paper postcard relative z-[1] mx-auto -mt-12 w-[64%] max-w-[15rem] translate-x-[14%] lg:ml-auto lg:mr-0 lg:w-[72%] lg:translate-x-0" style={{ "--tilt": "-2.4deg", "--drift": "7px" } as CSSProperties}>
                <Image src={russey.image} alt={russey.imageAlt} width={russey.imageSize[0]} height={russey.imageSize[1]} sizes="240px" className="block h-auto w-full" />
                <figcaption>
                  <span className="t-note text-[1.125rem] leading-tight">Le Russey</span>
                  <span className="text-[0.8125rem] text-foreground/70">Le chalet</span>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* Engagements, sur papier */}
      <section className="nuit section">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-10">
          <blockquote className="t-h1 lg:col-span-6">« La petite douceur du Haut-Doubs. »</blockquote>
          <div className="lg:col-span-5 lg:col-start-8">
            <h2 className="font-sans text-base font-semibold tracking-normal">Nos engagements</h2>
            <ul className="mt-4">
              {commitments.map((c) => (
                <li key={c} className="border-t border-foreground/25 py-3.5 last:border-b">
                  {c}
                </li>
              ))}
            </ul>
            <p className="t-fine mt-6">
              {site.name} est le nom commercial de {company.legalName} ({company.legalForm}), SIREN {company.siren}.
            </p>
          </div>
        </div>
      </section>

      <section className="wrap section grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-10">
        <div className="lg:col-span-6">
          <h2 className="t-h2">Une question ? Le catalogue ?</h2>
          <p className="t-lead mt-6 measure">Conseil produit, livraison, distributeur : on vous répond rapidement sur WhatsApp. Et la sélection CBDoux est livrée partout en France.</p>
          <div className="mt-8 flex flex-wrap gap-2.5">
            <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Écrire sur WhatsApp
            </a>
            <Link href="/boutique" className="btn btn-ghost">
              Voir la boutique
            </Link>
          </div>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <WhatsAppPlaque />
        </div>
      </section>
    </div>
  );
}
