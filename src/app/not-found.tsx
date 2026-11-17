import Link from "next/link";
import { Fleuron } from "@/components/ui/Fleuron";
import { categories, categoryOrder } from "@/data/products";

export default function NotFound() {
  return (
    <div className="relative overflow-hidden">
      <div aria-hidden className="guilloche guilloche-rosace opacity-[0.12] left-1/2 top-1/2 w-[150vw] max-w-[900px] -translate-x-1/2 -translate-y-1/2" />
      <div className="relative wrap py-24 text-center sm:py-36">
        <p className="t-num text-foreground/75">Erreur 404</p>
        <h1 className="t-h1 mx-auto mt-4">
          Page <em>introuvable</em>
        </h1>
        <Fleuron className="mx-auto mt-8 max-w-[19rem]" />
        <p className="t-lead mx-auto mt-8 max-w-md">Cette page n'existe pas ou a été déplacée. Le catalogue, lui, est bien là.</p>
        <div className="mt-9 flex flex-wrap justify-center gap-2.5">
          <Link href="/boutique" className="btn btn-primary">
            Voir la boutique
          </Link>
          <Link href="/" className="btn btn-ghost">
            Revenir à l'accueil
          </Link>
        </div>
        <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[0.9375rem]">
          {categoryOrder.map((key) => (
            <li key={key}>
              <Link href={`/${categories[key].slug}`} className="link">
                {categories[key].name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
