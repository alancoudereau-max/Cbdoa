/**
 * Sélections thématiques (« CBD puissant », « CBD pas cher ») : des pages d'entrée pensées pour les recherches
 * les plus fréquentes. Les produits, prix et tableaux sont calculés depuis le catalogue (src/data/products.ts) :
 * changer un prix ou une force dans le catalogue met ces pages à jour automatiquement.
 * Règles de rédaction : identiques au catalogue (aucune allégation thérapeutique, aucun usage alimentaire).
 */
import { visibleProducts, formatPrice, type Product } from "@/data/products";
import type { GuideBlock } from "@/data/guides";
import { promos } from "@/data/promos";
import { FREE_SHIPPING_FROM_CENTS, LOCAL_FREE_FROM_CENTS } from "@/lib/shipping";

export type CollectionSlug = "cbd-puissant" | "cbd-pas-cher";

export type Collection = {
  slug: CollectionSlug;
  /** Libellé court (fil d'Ariane, liens) */
  name: string;
  /** Titre Google (la marque est ajoutée automatiquement si la place le permet) */
  title: string;
  description: string;
  kicker: string;
  h1: string;
  h1Italic: string;
  intro: string;
  products: Product[];
  sections: { heading: string; blocks: GuideBlock[] }[];
  faq: { q: string; a: string }[];
  relatedGuides: string[];
  keywords: string[];
};

const p = (text: string): GuideBlock => ({ type: "p", text });
const ul = (items: string[]): GuideBlock => ({ type: "ul", items });
const table = (headers: string[], rows: string[][]): GuideBlock => ({ type: "table", headers, rows });

const isFlowerOrResin = (x: Product) => x.category === "fleurs" || x.category === "resines";
const hasForce = (x: Product, force: 3 | "maxi") => x.variants.some((v) => v.force === force);

/** Prix le plus bas du format « 1 g » (en centimes), ou undefined si le produit n'est pas vendu au gramme. */
function perGramPrice(x: Product): number | undefined {
  const prices = x.variants.filter((v) => v.format === "1 g").map((v) => v.priceCents);
  return prices.length ? Math.min(...prices) : undefined;
}

/** Variante de 10 g la moins chère (sachet 10 g ou lot de 10 g). */
function tenGramVariant(x: Product) {
  return x.variants.filter((v) => v.grams === 10).sort((a, b) => a.priceCents - b.priceCents)[0];
}

function strongCollection(): Collection {
  const products = visibleProducts
    .filter((x) => isFlowerOrResin(x) && (hasForce(x, 3) || hasForce(x, "maxi")))
    .sort((a, b) => Number(hasForce(b, "maxi")) - Number(hasForce(a, "maxi")));
  const maxi = products.filter((x) => hasForce(x, "maxi")).map((x) => x.name.replace(/\s+[—–-]\s+/g, " "));

  return {
    slug: "cbd-puissant",
    name: "CBD puissant",
    title: "CBD puissant : fleurs et résines Force 3 & Maxi",
    description:
      "Notre sélection de CBD puissant : fleurs enrichies Force 3, Small Buds et résines Force Maxi (Beldia, Piatella). THC < 0,3 %, analyses labo, livraison 24/48 h.",
    kicker: "Forces 3 & Maxi · THC < 0,3 %",
    h1: "CBD puissant",
    h1Italic: "nos références les plus concentrées.",
    intro:
      "Vous cherchez un CBD plus puissant ? Voici les références les plus fortes de notre gamme : fleurs enrichies en cannabinoïdes (Force 3), Small Buds et résines en Force Maxi. Des produits réservés aux adultes habitués, à utiliser en très petite quantité.",
    products,
    sections: [
      {
        heading: "Ce qu'on appelle un CBD « puissant »",
        blocks: [
          p("On parle de CBD puissant pour les produits au ressenti le plus marqué. Nos fleurs affichent naturellement 18 à 24 % de CBD, nos résines 35 à 40 %. Les forces 2 et 3 sont enrichies en cannabinoïdes après la récolte, la Force 3 plus fortement que la Force 2, et la Force Maxi correspond à l'enrichissement le plus élevé de la gamme."),
          p("Puissant ne veut pas dire chargé en THC : toutes nos références restent sous 0,3 % de THC, conformément à la réglementation française, et chaque lot est analysé."),
        ],
      },
      {
        heading: "Fleur ou résine : laquelle choisir ?",
        blocks: [
          p("La résine concentre les trichomes de la plante : à force égale, elle est plus concentrée qu'une fleur et se vaporise en plus petite quantité. La fleur, elle, offre le profil aromatique le plus fidèle à la variété. Pour un premier essai en Force 3, une fleur est plus facile à doser."),
        ],
      },
      {
        heading: "Bien utiliser un CBD fort",
        blocks: [
          ul([
            "Commencez par une très petite quantité.",
            "Attendez 15 à 30 minutes avant toute nouvelle prise.",
            "Ne conduisez pas et n'utilisez pas de machines après usage : attendez le lendemain.",
            "Déconseillé aux débutants, aux femmes enceintes ou allaitantes et aux personnes sous traitement sans avis médical.",
          ]),
        ],
      },
      {
        heading: "Vérifier un taux avant d'acheter",
        blocks: [
          p("Un taux annoncé ne vaut que s'il est mesuré. Nos analyses de laboratoire indiquent le CBD total et le THC total des lots : consultez-les avant de commander, et demandez-nous conseil sur WhatsApp si vous hésitez entre deux forces."),
        ],
      },
    ],
    faq: [
      {
        q: "Quel est le CBD le plus puissant chez CBDoux ?",
        a: `Les références en Force Maxi${maxi.length ? ` : ${maxi.join(", ")}` : ""}. Ce sont les concentrations les plus élevées de notre gamme, réservées aux adultes habitués.`,
      },
      { q: "Un CBD puissant est-il légal ?", a: "Oui, dès lors que le THC reste inférieur à 0,3 % et que les cannabinoïdes utilisés pour l'enrichissement sont autorisés en France. Nos lots sont analysés." },
      { q: "Par quelle force commencer ?", a: "Par la force Classique, pour découvrir une variété. Passez à la Force 2, puis à la Force 3, seulement si le ressenti vous paraît trop léger. La Force Maxi n'est pas adaptée à une première commande." },
      { q: "Peut-on conduire après un CBD puissant ?", a: "Non. Le CBD peut diminuer la vigilance, et un test salivaire peut réagir aux traces de THC d'un produit légal. Après une Force 3 ou Maxi, attendez le lendemain pour reprendre le volant." },
    ],
    relatedGuides: ["comprendre-les-forces-cbd", "cbd-et-conduite", "lire-analyse-laboratoire-coa"],
    keywords: ["cbd puissant", "fleur cbd puissante", "résine cbd puissante", "cbd fort", "cbd le plus puissant"],
  };
}

function cheapCollection(): Collection {
  const sold = visibleProducts.filter(isFlowerOrResin);
  const gramPrices = sold.map(perGramPrice).filter((n): n is number => n !== undefined);
  const min = Math.min(...gramPrices);
  /** Seuil « petit prix » : le prix au gramme le plus bas du catalogue + 1 € */
  const threshold = min + 100;
  const lots = sold.filter((x) => perGramPrice(x) === undefined && tenGramVariant(x));
  const byGram = sold
    .filter((x) => (perGramPrice(x) ?? Infinity) <= threshold)
    .sort((a, b) => (perGramPrice(a) ?? 0) - (perGramPrice(b) ?? 0) || a.name.localeCompare(b.name, "fr"));
  const products = [...lots, ...byGram];
  const minLabel = formatPrice(min);

  const rows = products.map((x) => {
    const one = perGramPrice(x);
    const ten = tenGramVariant(x);
    return [
      x.name.replace(/\s+[—–-]\s+/g, " "),
      one !== undefined ? formatPrice(one) : "—",
      ten ? formatPrice(ten.priceCents) : "—",
      ten ? `${formatPrice(Math.round(ten.priceCents / 10))}/g` : "—",
    ];
  });

  const example = byGram.find((x) => tenGramVariant(x));
  const exampleTen = example ? tenGramVariant(example) : undefined;
  const lot = lots[0];
  const lotTen = lot ? tenGramVariant(lot) : undefined;
  const promo = promos[0];
  const freeShipping = formatPrice(FREE_SHIPPING_FROM_CENTS);
  const localFree = formatPrice(LOCAL_FREE_FROM_CENTS);

  return {
    slug: "cbd-pas-cher",
    name: "CBD pas cher",
    title: `CBD pas cher : fleurs et résines dès ${minLabel}/g`,
    description: `CBD pas cher et analysé : fleurs et résines dès ${minLabel}/g, trim en lot, prix dégressifs par 10 g, port offert dès ${freeShipping}. THC < 0,3 %, livraison 24/48 h.`,
    kicker: `Dès ${minLabel}/g · analyses labo`,
    h1: "CBD pas cher",
    h1Italic: "sans rogner sur la qualité.",
    intro: `Nos prix les plus doux, sans compromis sur les analyses : fleurs et résines à partir de ${minLabel} le gramme, trim en lot, tarifs dégressifs par 10 g et port offert dès ${freeShipping}.`,
    products,
    sections: [
      {
        heading: "Nos petits prix, au gramme et par 10 g",
        blocks: [table(["Produit", "1 g", "10 g", "Prix au gramme par 10 g"], rows), p("Prix de la force Classique (ou de la première force disponible). Le détail de chaque force figure sur la fiche du produit.")],
      },
      {
        heading: "Cinq façons de payer son CBD moins cher",
        blocks: [
          ul([
            exampleTen && example
              ? `Achetez par 10 g : le prix au gramme baisse (${example.name.replace(/\s+[—–-]\s+/g, " ")} : ${formatPrice(perGramPrice(example) ?? 0)} le gramme, ${formatPrice(exampleTen.priceCents)} les 10 g).`
              : "Achetez par 10 g : le prix au gramme baisse.",
            "Choisissez la force Classique : c'est la moins chère, et la plus adaptée pour découvrir une variété.",
            `Regroupez vos achats : le port Colissimo est offert dès ${freeShipping}.`,
            `Dans le Haut-Doubs, retirez gratuitement votre commande à Damprichard ou au Russey (livraison à domicile offerte dès ${localFree}).`,
            ...(promo ? [`Première commande : le code ${promo.code} offre ${formatPrice(promo.value)} dès ${formatPrice(promo.minSubtotalCents)} d'achat.`] : []),
          ]),
        ],
      },
      {
        heading: "Pas cher, mais contrôlé",
        blocks: [
          p("Un prix bas ne doit jamais se payer en transparence. Toutes nos références, y compris les moins chères, affichent un THC inférieur à 0,3 % et s'accompagnent d'analyses de laboratoire consultables avant l'achat."),
        ],
      },
    ],
    faq: [
      {
        q: "Quel est le CBD le moins cher chez CBDoux ?",
        a:
          lot && lotTen
            ? `Le ${lot.name}, vendu en lot de 10 g à ${formatPrice(lotTen.priceCents)}. Côté fleurs et résines, plusieurs références démarrent à ${minLabel} le gramme.`
            : `Plusieurs fleurs et résines démarrent à ${minLabel} le gramme.`,
      },
      { q: "Pourquoi le prix baisse-t-il par 10 g ?", a: "Un seul sachet, une seule préparation : nous répercutons cette économie sur le prix au gramme." },
      { q: "Un CBD pas cher est-il de moins bonne qualité ?", a: "Pas chez nous : les références d'entrée de gamme sont des fleurs et des résines analysées, simplement moins rares ou vendues en plus grande quantité. Les analyses sont consultables avant l'achat." },
      { q: "À partir de quel montant la livraison est-elle gratuite ?", a: `Dès ${freeShipping} d'achat en Colissimo. La livraison locale à domicile est offerte dès ${localFree}, et le retrait à Damprichard ou au Russey est toujours gratuit.` },
    ],
    relatedGuides: ["comment-choisir-fleur-cbd", "fleur-ou-resine-cbd", "livraison-cbd-discrete-france"],
    keywords: ["cbd pas cher", "fleur cbd pas cher", "résine cbd pas cher", "cbd petit prix", "cbd prix au gramme"],
  };
}

export const collections: Collection[] = [strongCollection(), cheapCollection()];

export function getCollection(slug: CollectionSlug): Collection {
  const found = collections.find((c) => c.slug === slug);
  if (!found) throw new Error(`Sélection inconnue : ${slug}`);
  return found;
}
