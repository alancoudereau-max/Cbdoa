import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { site, company } from "@/data/site";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/ui/Reveal";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "À propos de CBDoux — CBD premium né dans le Haut-Doubs",
  description:
    "L'histoire de CBDoux : une marque de SMART VEND née dans le Haut-Doubs pour rendre le CBD premium accessible 24 h/24, en toute discrétion. Distributeurs, retrait, livraison France.",
  path: "/a-propos",
  keywords: ["cbdoux", "smart vend", "cbd haut-doubs", "boutique cbd française"],
});

const chapters = [
  { kicker: "Chapitre I", title: "Une idée pas si douce", body: "CBDoux est né d'une idée simple : rendre le CBD premium accessible à toute heure, sans contrainte et avec un maximum de discrétion. Dans le Haut-Doubs, cette idée est devenue un projet concret : proposer mieux, plus pratique, plus discret." },
  { kicker: "Chapitre II", title: "Du besoin à la solution", body: "Acheter du CBD de qualité pouvait être compliqué, peu discret, ou impossible au bon moment. Entre horaires de boutique et regards inutiles, l'expérience manquait de souplesse. CBDoux propose une autre façon, plus moderne et plus autonome." },
  { kicker: "Chapitre III", title: "SMART VEND, la structure derrière", body: "Derrière CBDoux, il y a SMART VEND, spécialisée dans la distribution automatique de produits de bien-être. Fiabilité des machines, qualité des produits, expérience client simple : un nouveau standard de distribution, plus propre et plus intelligent." },
  { kicker: "Chapitre IV", title: "Une cabine, beaucoup de sens", body: "Le premier distributeur a été installé dans une ancienne cabine téléphonique recyclée à Charquemont. Un objet du quotidien transformé en point d'accès discret, ouvert 24 h/24. Un second distributeur a suivi au Russey, face à la mairie." },
  { kicker: "Chapitre V", title: "La discrétion avant tout", body: "Pensé pour acheter sans se faire remarquer, sans se justifier et sans perdre de temps. Pas d'enseigne tapageuse, pas d'ambiance gênante : du CBD accessible, en toute autonomie. En ligne, le même principe : colis neutre, libellé bancaire neutre." },
  { kicker: "Chapitre VI", title: "Une marque douce, mais exigeante", body: "Le ton est moderne, parfois avec une touche d'humour, mais toujours sérieux sur l'essentiel : la qualité, la conformité et le service. Chaque lot est analysé en laboratoire, chaque variété est goûtée avant d'entrer au catalogue." },
];

export default function AboutPage() {
  return (
    <div className="relative">
      <section className="relative overflow-hidden border-b border-foreground/10">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-gold w-[600px] h-[600px] -top-40 -left-32 opacity-25 animate-float-slow" />
        </div>
        <div className="relative mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12 py-14 sm:py-24">
          <Breadcrumbs items={[{ name: "À propos", path: "/a-propos" }]} className="mb-8" />
          <p className="kicker mb-4">À propos de nous</p>
          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl leading-[0.92] mb-8 max-w-4xl">
            L'histoire de <span className="font-serif-italic text-gradient-gold">CBDoux.</span>
          </h1>
          <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed max-w-2xl">
            Une marque pensée pour celles et ceux qui veulent du CBD légal, premium, bien conservé et disponible sans compromis — dans le Haut-Doubs comme partout en France.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-5">
          {chapters.map((ch, i) => (
            <Reveal key={ch.title} delay={i * 60} className="group relative overflow-hidden rounded-2xl border border-foreground/10 bg-card p-7 sm:p-10 hover:border-gold/40 transition-colors">
              <p className="kicker mb-3">{ch.kicker}</p>
              <h2 className="font-serif text-3xl sm:text-4xl mb-4 leading-[1.05]">{ch.title}</h2>
              <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">{ch.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-gold/20 bg-gradient-to-br from-card via-background to-card">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12 py-16 sm:py-24 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="kicker mb-4">Nos engagements</p>
            <ul className="space-y-4 text-foreground/80">
              <li className="flex gap-3"><span className="text-gold">✺</span> Produits conformes (THC &lt; 0,3 %), analyses de laboratoire publiées.</li>
              <li className="flex gap-3"><span className="text-gold">✺</span> Sélection goûtée et validée, conservation à 20 °C en sachets biphase.</li>
              <li className="flex gap-3"><span className="text-gold">✺</span> Aucune promesse miracle : des descriptions honnêtes et des conseils de prudence clairs.</li>
              <li className="flex gap-3"><span className="text-gold">✺</span> Vente réservée aux adultes, discrétion totale en ligne comme sur place.</li>
              <li className="flex gap-3"><span className="text-gold">✺</span> Un interlocuteur humain sur WhatsApp, 7 j/7.</li>
            </ul>
            <p className="mt-8 text-xs text-foreground/50">
              {site.name} est le nom commercial de {company.legalName} ({company.legalForm}), SIREN {company.siren}.
            </p>
          </div>
          <blockquote className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-center lg:text-left">
            « La petite douceur du <span className="font-serif-italic text-gradient-gold">Haut-Doubs.</span> »
          </blockquote>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12 py-16 sm:py-24 grid lg:grid-cols-3 gap-6">
        <Reveal className="rounded-2xl border border-foreground/10 bg-card p-8 hover:border-gold/40 transition-colors">
          <h3 className="font-serif text-3xl mb-3">Une question ?</h3>
          <p className="text-foreground/70 mb-6 text-sm">Conseil produit, livraison, distributeur : on vous répond rapidement sur WhatsApp.</p>
          <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-gold inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"><MessageCircle size={16} /> Écrire sur WhatsApp</a>
        </Reveal>
        <Reveal delay={80} className="rounded-2xl border border-foreground/10 bg-card p-8 hover:border-gold/40 transition-colors">
          <h3 className="font-serif text-3xl mb-3">Le catalogue</h3>
          <p className="text-foreground/70 mb-6 text-sm">Fleurs, résines, huiles cutanées et vape : la sélection CBDoux, livrée partout en France.</p>
          <Link href="/boutique" className="btn-outline inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm">Voir la boutique <ArrowUpRight size={14} /></Link>
        </Reveal>
        <Reveal delay={160} className="relative overflow-hidden rounded-2xl border border-gold/30">
          <Image src="/images/brand/whatsapp-poster.jpg" alt="Rejoignez CBDoux sur WhatsApp" width={805} height={1200} sizes="(max-width: 1024px) 100vw, 400px" className="w-full h-full object-cover" />
        </Reveal>
      </section>
    </div>
  );
}
