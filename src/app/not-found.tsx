import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <p className="kicker mb-4">Erreur 404</p>
      <h1 className="font-serif text-6xl sm:text-7xl text-gradient-gold mb-4">Page introuvable</h1>
      <p className="text-foreground/65 mb-8">Cette page n'existe pas ou a été déplacée. Le catalogue, lui, est bien là.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/boutique" className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold">Voir la boutique <ArrowRight size={14} /></Link>
        <Link href="/" className="btn-outline inline-flex rounded-full px-6 py-3 text-sm">Accueil</Link>
      </div>
    </div>
  );
}
