import type { Metadata } from "next";
import Link from "next/link";
import { cities, inCity } from "@/data/cities";
import { locations } from "@/data/site";
import { PageHero } from "@/components/ui/PageHero";
import { HautDoubsMap } from "@/components/content/HautDoubsMap";
import { buildMetadata } from "@/lib/seo";
import { fr } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "CBD près de chez vous : Haut-Doubs, Doubs, France",
  description: "Où trouver CBDoux : distributeurs 24 h/24 à Charquemont et au Russey, retrait à Damprichard, livraison locale et expédition 24/48 h partout en France.",
  path: "/cbd",
  keywords: ["cbd doubs", "cbd haut-doubs", "cbd près de chez moi", "acheter cbd franche-comté"],
});

const modeLabel: Record<string, string> = {
  distributeur: "distributeur 24 h/24",
  retrait: "retrait gratuit",
  "livraison-locale": "livraison à domicile",
  expedition: "expédition 24/48 h",
};

// Communes qui ont leur propre distributeur ; ailleurs, le plus proche est « à proximité ».
const machineTowns = new Set<string>(locations.vendingMachines.map((m) => m.id));

export default function CbdIndexPage() {
  return (
    <div>
      <PageHero
        crumbs={[{ name: "CBD près de chez vous", path: "/cbd" }]}
        title="Du CBD premium, près de chez vous"
        lead="Distributeurs ouverts jour et nuit, retrait gratuit, livraison à domicile dans le Haut-Doubs et expédition partout en France en 24/48 h."
      />
      <section className="wrap grid gap-12 pb-24 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <HautDoubsMap />
            <p className="t-fine mt-4 measure">
              Livraison à domicile par nos soins dans un rayon de 30 km autour du Russey et de 10 km autour de Damprichard, côté français. Au-delà, expédition en 24/48 h.
            </p>
          </div>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <ul>
            {cities.map((c) => (
              <li key={c.slug} className="border-t border-foreground/15 last:border-b">
                <Link href={`/cbd/${c.slug}`} className="group grid gap-x-10 gap-y-1.5 py-5 sm:grid-cols-[1fr_auto] sm:items-baseline sm:py-6">
                  <h2 className="softens t-h3">CBD {inCity(c.name)}</h2>
                  <p className="t-num text-[0.9375rem] text-foreground/70 sm:text-right">
                    {c.postalCode}, {c.department}
                  </p>
                  <p className="text-[0.9375rem] text-foreground/75 sm:col-span-2 first-letter:uppercase">
                    {fr(c.modes.map((m) => (m === "distributeur" && !machineTowns.has(c.slug) ? "distributeur 24 h/24 à proximité" : modeLabel[m])).join(", "))}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-10 measure-wide text-foreground/75">
            Votre ville n'est pas listée ? Nous expédions partout en France métropolitaine :{" "}
            <Link href="/livraison" className="link">
              voir les modes et tarifs de livraison
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
