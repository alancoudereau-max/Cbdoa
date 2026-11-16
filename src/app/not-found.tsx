import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative overflow-hidden">
      <div aria-hidden className="guilloche guilloche-rosace opacity-[0.12] left-1/2 top-1/2 w-[150vw] max-w-[900px] -translate-x-1/2 -translate-y-1/2" />
      <div className="relative wrap py-28 text-center sm:py-40">
        <p className="text-foreground/75">Erreur 404</p>
        <h1 className="t-h1 mx-auto mt-4">Page introuvable</h1>
        <p className="t-lead mx-auto mt-6 max-w-md">Cette page n'existe pas ou a été déplacée. Le catalogue, lui, est bien là.</p>
        <div className="mt-9 flex flex-wrap justify-center gap-2.5">
          <Link href="/boutique" className="btn btn-primary">
            Voir la boutique
          </Link>
          <Link href="/" className="btn btn-ghost">
            Revenir à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
