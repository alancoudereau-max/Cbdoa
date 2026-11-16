/**
 * Catalogue CBDoux — source de vérité des produits et des prix.
 *
 * Règles de rédaction (conformité DGCCRF / ANSM) :
 *  - aucune allégation thérapeutique (pas de « soigne », « anti-douleur », « sommeil »…)
 *  - descriptions sensorielles (arômes, texture, culture) et « ressenti » formulé en bien-être
 *  - THC < 0,3 %, réservé aux adultes, non destiné à un usage médical
 *
 * Les prix sont en centimes d'euro (prix payé par le client). Pour changer un prix, modifiez `priceCents`.
 * Rupture de stock : `soldOut: true` sur un produit ou une variante. Retirer un produit : `hidden: true`.
 */

export type Category = "fleurs" | "resines" | "huiles" | "vape";
export type Force = 1 | 2 | 3 | "maxi";
export type TierKey = "classique" | "force-2" | "force-3" | "maxi" | "unique";

export type Variant = {
  /** Identifiant unique de la variante (sert au panier, aux commandes et au stock) */
  sku: string;
  tier: TierKey;
  tierLabel: string;
  force: Force;
  /** Format vendu : « 1 g », « 10 g », « Flacon 30 ml », « Pièce » */
  format: string;
  /** Poids de produit en grammes (calcul du port). Pour les objets : poids approximatif emballé. */
  grams: number;
  priceCents: number;
  /** Information cannabinoïdes affichée (« Indoor 24 % CBD ») */
  cbdInfo: string;
  warning?: string;
  /** Rupture de stock : la variante reste visible mais ne peut plus être commandée */
  soldOut?: boolean;
};

export type Product = {
  slug: string;
  name: string;
  category: Category;
  origin?: string;
  badge?: string;
  featured?: boolean;
  isNew?: boolean;
  hidden?: boolean;
  /** Rupture de stock sur tout le produit */
  soldOut?: boolean;
  /** Accroche courte (cartes produit, meta description) — 1 à 2 phrases */
  short: string;
  /** Description longue (fiche produit, SEO) */
  description: string[];
  aromas: string;
  /** Profil / ressenti — formulation bien-être, sans allégation santé */
  profile: string;
  usage: string;
  image: string;
  video?: string;
  variants: Variant[];
  keywords: string[];
};

export const categories: Record<
  Category,
  {
    slug: string;
    name: string;
    title: string;
    h1: string;
    description: string;
    intro: string[];
    image: string;
    keywords: string[];
  }
> = {
  fleurs: {
    slug: "fleurs-cbd",
    name: "Fleurs CBD",
    title: "Fleurs CBD premium indoor & hydroponie — livraison France 24/48 h",
    h1: "Fleurs CBD premium",
    description:
      "Fleurs de CBD indoor, hydroponie et greenhouse sélectionnées dans le Haut-Doubs : Super Lemon Haze, Amnesia, Orangello, Snow White… THC < 0,3 %, analyses labo, expédition discrète partout en France.",
    intro: [
      "Nos fleurs de chanvre CBD sont choisies pour la densité de leurs têtes, leur taux de trichomes et la netteté de leurs arômes. Culture indoor, hydroponie ou greenhouse : chaque variété est goûtée et validée avant d'être proposée, et chaque lot est accompagné d'une analyse de laboratoire (THC < 0,3 %).",
      "Choisissez votre force : Classique (CBD naturel), Force 2 et Force 3 (CBD renforcé) ou Maxi (concentration la plus élevée de la gamme, réservée aux adultes habitués). Vendues au gramme et par 10 g, nos fleurs sont expédiées sous 24 h ouvrées en emballage neutre et hermétique.",
    ],
    image: "/images/products/fleurs-cbd.jpg",
    keywords: ["fleur cbd", "fleurs cbd pas cher", "fleur cbd indoor", "fleur cbd hydroponie", "acheter fleur cbd en ligne", "fleur cbd puissante", "fleur cbd livraison"],
  },
  resines: {
    slug: "resines-cbd",
    name: "Résines CBD",
    title: "Résines & hash CBD — 3X Filtré, Olivette Gold, Beldia, Piatella",
    h1: "Résines CBD",
    description:
      "Résines de CBD premium : hash triple filtré, pollen pressé Olivette Gold, Beldia et Piatella en force Maxi. THC < 0,3 %, analyses disponibles, livraison discrète en France.",
    intro: [
      "Une résine de CBD, c'est la concentration des trichomes de la plante. Notre sélection va du hash triple filtré (99 % de trichomes, sans déchet végétal) aux résines traditionnelles pressées, en passant par des textures plus grasses et friables comme l'Olivette Gold.",
      "Toutes nos résines affichent un THC inférieur à 0,3 % et sont proposées en plusieurs forces. Les références Beldia et Piatella sont exclusivement en force Maxi et réservées aux adultes habitués : commencez toujours par une très petite quantité.",
    ],
    image: "/images/products/resines-cbd.jpg",
    keywords: ["résine cbd", "hash cbd", "pollen cbd", "résine cbd pas cher", "acheter résine cbd", "hash cbd filtré", "résine cbd puissante"],
  },
  huiles: {
    slug: "huiles-cbd",
    name: "Huiles CBD",
    title: "Huiles CBD cutanées Full Spectrum 10 % & 20 % — fabriquées en France",
    h1: "Huiles CBD cutanées",
    description:
      "Huiles CBD Full Spectrum 10 % et 20 % à usage cutané (massage, peau), fabriquées en France. Flacon 30 ml. Livraison partout en France.",
    intro: [
      "Nos huiles Full Spectrum conservent l'ensemble des cannabinoïdes et terpènes du chanvre pour un effet d'entourage complet. Elles sont fabriquées en France et conditionnées en flacon de 30 ml avec pipette.",
      "Important : conformément à la réglementation française en vigueur, nos huiles sont des produits à usage cutané exclusivement (massage ciblé, peau). Elles ne sont pas destinées à être ingérées.",
    ],
    image: "/images/products/huiles-cbd.jpg",
    keywords: ["huile cbd", "huile cbd full spectrum", "huile cbd 10", "huile cbd 20", "huile cbd massage", "huile cbd cutanée"],
  },
  vape: {
    slug: "vape-cbd",
    name: "Vape & pods CBD",
    title: "Vape CBD : pods rechargeables et recharges CBD",
    h1: "Vape & pods CBD",
    description:
      "Pods CBD rechargeables et recharges aromatisées : vapeur dense, sans combustion, format nomade et discret. Livraison en France.",
    intro: [
      "La vape CBD permet de profiter des arômes du chanvre sans combustion : une vapeur dense, propre et discrète, idéale en déplacement. Nos pods rechargeables fonctionnent avec des recharges aromatisées (fruit, menthe, terreux).",
      "Produits réservés aux adultes. Les e-liquides et pods CBD respectent la réglementation française (THC < 0,3 %).",
    ],
    image: "/images/products/vape-cbd.jpg",
    keywords: ["vape cbd", "pod cbd", "e-liquide cbd", "puff cbd rechargeable", "vapoteuse cbd"],
  },
};

export const categoryOrder: Category[] = ["fleurs", "resines", "huiles", "vape"];

export const forceLabels: Record<Force, { label: string; short: string; description: string; dots: number }> = {
  1: {
    label: "Classique",
    short: "CBD naturel",
    description: "CBD naturel non renforcé. Idéal pour découvrir ou pour un usage en journée.",
    dots: 1,
  },
  2: {
    label: "Force 2",
    short: "CBD renforcé · modéré",
    description: "Fleur ou résine renforcée en CBD (+ ~10 à 15 %). Ressenti plus présent, plutôt en fin de journée.",
    dots: 2,
  },
  3: {
    label: "Force 3",
    short: "CBD renforcé · puissant",
    description: "Renforcée en CBD (+ ~25 %). Réservée aux consommateurs habitués. Pas de conduite après usage.",
    dots: 3,
  },
  maxi: {
    label: "Force Maxi",
    short: "Concentration maximale",
    description:
      "Concentration la plus élevée de la gamme. Réservée aux adultes habitués, déconseillée aux débutants. Très petite quantité, attendez les effets avant toute nouvelle prise. Ni conduite ni machines après usage.",
    dots: 4,
  },
};

const DRIVING = "Déconseillé avant de conduire ou d'utiliser des machines.";
const MAXI_WARNING =
  "Force Maxi — très petite quantité, attendez les effets avant toute nouvelle prise. Ne conduisez pas et n'utilisez pas de machines après usage.";

/** Fabrique les variantes classiques fleur/résine : prix au gramme + prix 10 g pour chaque force. */
function tiers(
  prefix: string,
  rows: Array<{ force: 1 | 2 | 3; cbdInfo: string; perGram: number; per10g: number }>,
): Variant[] {
  const tierKey: Record<1 | 2 | 3, TierKey> = { 1: "classique", 2: "force-2", 3: "force-3" };
  return rows.flatMap((r) => [
    {
      sku: `${prefix}-F${r.force}-1G`,
      tier: tierKey[r.force],
      tierLabel: forceLabels[r.force].label,
      force: r.force,
      format: "1 g",
      grams: 1,
      priceCents: r.perGram,
      cbdInfo: r.cbdInfo,
      warning: r.force === 3 ? DRIVING : undefined,
    },
    {
      sku: `${prefix}-F${r.force}-10G`,
      tier: tierKey[r.force],
      tierLabel: forceLabels[r.force].label,
      force: r.force,
      format: "10 g",
      grams: 10,
      priceCents: r.per10g,
      cbdInfo: r.cbdInfo,
      warning: r.force === 3 ? DRIVING : undefined,
    },
  ]);
}

/** Variantes « Force Maxi » : 1 g, 5 g, 10 g, 100 g */
function maxiTiers(prefix: string, cbdInfo: string): Variant[] {
  const packs: Array<[string, number, number]> = [
    ["1 g", 1, 1000],
    ["5 g", 5, 4000],
    ["10 g", 10, 8000],
    ["100 g", 100, 50000],
  ];
  return packs.map(([format, grams, priceCents]) => ({
    sku: `${prefix}-MAXI-${grams}G`,
    tier: "maxi",
    tierLabel: forceLabels.maxi.label,
    force: "maxi",
    format,
    grams,
    priceCents,
    cbdInfo,
    warning: MAXI_WARNING,
  }));
}

export const products: Product[] = [
  // ───────────────────────────── FLEURS ─────────────────────────────
  {
    slug: "super-lemon-haze-hydro-usa",
    name: "Super Lemon Haze Hydro USA",
    category: "fleurs",
    origin: "Hydroponie · USA",
    badge: "Best-seller",
    featured: true,
    short: "Têtes hydroponiques denses et ultra-résineuses au citron vert éclatant : notre Haze d'exception.",
    description: [
      "La Super Lemon Haze est une légende des variétés Haze. Cultivée en hydroponie aux États-Unis, elle développe des buds compacts, saturés de trichomes, avec cette robe vert clair striée de pistils orangés qui signe les belles génétiques sativa.",
      "À l'ouverture du sachet, le citron vert domine franchement, suivi d'une note de bonbon acidulé et d'un fond épicé typiquement Haze. En vaporisation, le profil reste net et électrique du début à la fin.",
      "Disponible en trois forces : Classique (indoor 24 % CBD), Force 2 et Force 3 renforcées en CBD. Vendue au gramme et par 10 g, expédiée sous 24 h ouvrées en emballage neutre.",
    ],
    aromas: "Citron vert acidulé, bonbon citron, Haze épicée, pointe diesel citronnée.",
    profile: "Profil vif et tonique, apprécié en journée pour un moment de détente lucide.",
    usage: "Vaporisation ou infusion (avec un corps gras). Non destinée à la combustion.",
    image: "/images/products/super-lemon-haze-hydro-usa.jpg",
    variants: tiers("SLH", [
      { force: 1, cbdInfo: "Indoor 24 % CBD", perGram: 600, per10g: 5500 },
      { force: 2, cbdInfo: "24 % + ~10 % CBD renforcé", perGram: 800, per10g: 7500 },
      { force: 3, cbdInfo: "24 % + ~25 % CBD renforcé", perGram: 950, per10g: 9000 },
    ]),
    keywords: ["super lemon haze cbd", "fleur cbd citron", "haze cbd", "fleur cbd hydroponie usa"],
  },
  {
    slug: "amnesia-haze-hydro",
    name: "Amnesia Haze Hydroponie",
    category: "fleurs",
    origin: "Hydroponie · Europe",
    badge: "Hydroponie",
    featured: true,
    short: "Têtes volumineuses cultivées en hydroponie indoor : la Haze citronnée emblématique, manucure soignée.",
    description: [
      "L'Amnesia Haze n'a plus rien à prouver : c'est l'une des variétés les plus recherchées d'Europe. Notre version est cultivée en hydroponie indoor, ce qui lui donne des têtes volumineuses, aérées et très bien manucurées.",
      "Le nez est dominé par le citron zesté et les agrumes vifs, soutenus par une note florale Haze et un fond légèrement terreux. Le bouquet reste long et persistant en vaporisation.",
      "Proposée en Classique (hydro 20 % CBD), Force 2 et Force 3.",
    ],
    aromas: "Citron zesté, agrumes vifs, floral Haze, fond légèrement terreux.",
    profile: "Profil clair et tonique, idéal pour une journée active.",
    usage: "Vaporisation ou infusion. Non destinée à la combustion.",
    image: "/images/products/amnesia-haze-hydro.jpg",
    variants: tiers("AMN", [
      { force: 1, cbdInfo: "Hydro 20 % CBD", perGram: 600, per10g: 5500 },
      { force: 2, cbdInfo: "20 % + ~10 % CBD renforcé", perGram: 800, per10g: 7500 },
      { force: 3, cbdInfo: "20 % + ~25 % CBD renforcé", perGram: 950, per10g: 9000 },
    ]),
    keywords: ["amnesia cbd", "amnesia haze cbd", "fleur cbd amnesia", "fleur cbd hydroponie"],
  },
  {
    slug: "orangello-hydroponie",
    name: "Orangello Hydroponie",
    category: "fleurs",
    origin: "Hydroponie · Europe",
    badge: "Hydroponie",
    short: "Buds denses orange-vert aux trichomes cristallins et à l'aromatique d'orange sanguine prononcée.",
    description: [
      "L'Orangello est une variété hydroponique à l'identité très marquée : des buds denses, une robe qui tire vers l'orange et des trichomes cristallins bien visibles.",
      "Son bouquet évoque l'orange sanguine et les zestes d'agrumes, relevés de touches florales et d'un fond sucré, presque miellé. Frais et ensoleillé, il reste très présent en vaporisation.",
      "Disponible en Classique (hydro 22 % CBD), Force 2 et Force 3.",
    ],
    aromas: "Orange sanguine, zestes d'agrumes, touches florales, fond sucré miellé.",
    profile: "Profil ensoleillé et léger, apprécié en journée et dans les moments créatifs.",
    usage: "Vaporisation ou infusion. Non destinée à la combustion.",
    image: "/images/products/orangello-hydroponie.jpg",
    variants: tiers("ORA", [
      { force: 1, cbdInfo: "Hydro 22 % CBD", perGram: 600, per10g: 5500 },
      { force: 2, cbdInfo: "22 % + ~10 % CBD renforcé", perGram: 800, per10g: 7500 },
      { force: 3, cbdInfo: "22 % + ~25 % CBD renforcé", perGram: 950, per10g: 9000 },
    ]),
    keywords: ["orangello cbd", "fleur cbd orange", "fleur cbd agrumes"],
  },
  {
    slug: "cali-fruit-indoor",
    name: "Cali Fruit Indoor",
    category: "fleurs",
    origin: "Indoor · génétique californienne",
    short: "Buds denses verts et orangés, résine collante : une Cali authentique au profil gourmand.",
    description: [
      "La Cali Fruit est une fleur indoor issue de génétiques californiennes. Ses buds compacts, verts et orangés, collent aux doigts tant la résine est abondante.",
      "Au nez, c'est une véritable salade de fruits : orange clémentine, fruits sucrés, une note de crème dessert et un fond floral Haze. Gourmande et persistante en vaporisation.",
      "Proposée en Classique (indoor 18 % CBD), Force 2 et Force 3.",
    ],
    aromas: "Orange clémentine, fruits sucrés, crème dessert, floral Haze.",
    profile: "Profil gourmand et équilibré, pour un moment de détente positive.",
    usage: "Vaporisation ou infusion. Non destinée à la combustion.",
    image: "/images/products/cali-fruit-indoor.jpg",
    variants: tiers("CALI", [
      { force: 1, cbdInfo: "Indoor 18 % CBD", perGram: 500, per10g: 4500 },
      { force: 2, cbdInfo: "18 % + ~10 % CBD renforcé", perGram: 650, per10g: 6000 },
      { force: 3, cbdInfo: "18 % + ~25 % CBD renforcé", perGram: 800, per10g: 7500 },
    ]),
    keywords: ["cali cbd", "fleur cbd californienne", "cali fruit cbd", "fleur cbd fruitée"],
  },
  {
    slug: "critical-berry-indoor-usa",
    name: "Critical Berry Indoor USA",
    category: "fleurs",
    origin: "Greenhouse · USA",
    featured: true,
    short: "Buds compacts, pistils orange et trichomes brillants : une qualité import qui se voit.",
    description: [
      "La Critical Berry combine la structure compacte de la Critical et le profil fruité des génétiques Berry. Cultivée sous serre aux États-Unis, elle présente des buds bien formés, des pistils orange vif et un givre de trichomes.",
      "Le bouquet mêle fruits rouges mûrs, baies sucrées et une pointe de citron acidulé sur un fond terreux et boisé. Doux et persistant en vaporisation.",
      "Disponible en Classique (indoor 21 % CBD), Force 2 et Force 3. Analyse de laboratoire consultable.",
    ],
    aromas: "Fruits rouges mûrs, baies sucrées, citron acidulé, fond terreux boisé.",
    profile: "Profil doux et enveloppant, apprécié en fin de journée.",
    usage: "Vaporisation ou infusion. Non destinée à la combustion.",
    image: "/images/products/critical-berry-indoor-usa.jpg",
    variants: tiers("CRB", [
      { force: 1, cbdInfo: "Indoor 21 % CBD", perGram: 500, per10g: 4500 },
      { force: 2, cbdInfo: "21 % + ~10 % CBD renforcé", perGram: 650, per10g: 6000 },
      { force: 3, cbdInfo: "21 % + ~25 % CBD renforcé", perGram: 800, per10g: 7500 },
    ]),
    keywords: ["critical berry cbd", "fleur cbd fruits rouges", "fleur cbd usa"],
  },
  {
    slug: "fruit-haze",
    name: "Fruit Haze",
    category: "fleurs",
    origin: "Indoor premium",
    short: "Grosses têtes premium, buds compacts et saveurs concentrées de fruits et d'agrumes.",
    description: [
      "La Fruit Haze est une fleur indoor premium aux grosses têtes compactes. Le travail de culture se ressent dans la densité des buds et la concentration des saveurs.",
      "Baies rouges, mangue tropicale, citron pétillant et une note florale douce : un profil vif et fruité qui s'exprime pleinement en vaporisation.",
      "Disponible en Classique (indoor 18 % CBD).",
    ],
    aromas: "Baies rouges, mangue tropicale, citron pétillant, floral doux.",
    profile: "Profil léger et fruité, pour une pause détente à toute heure.",
    usage: "Vaporisation ou infusion. Non destinée à la combustion.",
    image: "/images/products/fruit-haze.jpg",
    variants: tiers("FRH", [{ force: 1, cbdInfo: "Indoor 18 % CBD", perGram: 500, per10g: 4500 }]),
    keywords: ["fruit haze cbd", "fleur cbd mangue", "fleur cbd fruitée"],
  },
  {
    slug: "snow-white",
    name: "Snow White",
    category: "fleurs",
    origin: "Indoor",
    short: "Trichomes blancs comme neige, calices compacts ultra-résineux : une fleur qui colle aux doigts.",
    description: [
      "La Snow White porte bien son nom : ses calices compacts disparaissent sous un givre de trichomes blancs. C'est l'une des fleurs les plus résineuses de notre sélection.",
      "L'attaque est citron-mangue, puis viennent des notes florales poudrées et une finale de pin boisé. Un goût long, idéal en vaporisation.",
      "Disponible en Force 2 et Force 3 (CBD renforcé). Analyse de laboratoire consultable.",
    ],
    aromas: "Citron et mangue en attaque, floral poudré, finale de pin boisé.",
    profile: "Profil enveloppant et apaisant, à réserver au soir.",
    usage: "Vaporisation ou infusion. Non destinée à la combustion.",
    image: "/images/products/snow-white.jpg",
    variants: tiers("SNW", [
      { force: 2, cbdInfo: "20 % + ~10 % CBD renforcé", perGram: 800, per10g: 7500 },
      { force: 3, cbdInfo: "20 % + ~25 % CBD renforcé", perGram: 950, per10g: 9000 },
    ]),
    keywords: ["snow white cbd", "fleur cbd résineuse", "fleur cbd soirée"],
  },
  {
    slug: "bubble-gum-greenhouse",
    name: "Bubble Gum Greenhouse",
    category: "fleurs",
    origin: "Greenhouse",
    short: "Hybride à dominance indica aux buds compacts et à l'arôme de chewing-gum sucré.",
    description: [
      "La Bubble Gum est un hybride à dominance indica cultivé sous serre. Ses buds compacts dégagent un parfum immédiatement reconnaissable de chewing-gum sucré.",
      "Fraise tagada, notes fruitées rondes et fond floral doux : un profil gourmand et régressif, très agréable en vaporisation.",
      "Disponible en Force 3 (CBD renforcé).",
    ],
    aromas: "Chewing-gum sucré, fraise tagada, fruits ronds, fond floral doux.",
    profile: "Profil gourmand et enveloppant, idéal en fin de journée.",
    usage: "Vaporisation ou infusion. Non destinée à la combustion.",
    image: "/images/products/bubble-gum-greenhouse.jpg",
    variants: tiers("BBG", [{ force: 3, cbdInfo: "Greenhouse + ~25 % CBD renforcé", perGram: 800, per10g: 7500 }]),
    keywords: ["bubble gum cbd", "fleur cbd sucrée", "fleur cbd indica"],
  },
  {
    slug: "californienne-indoor-small-buds",
    name: "Californienne Indoor — Small Buds",
    category: "fleurs",
    origin: "Indoor",
    badge: "Force Maxi",
    isNew: true,
    short: "Petites têtes denses et givrées, cultivées en intérieur : le plaisir des grosses têtes à prix doux, en force Maxi.",
    description: [
      "Les small buds sont les petites têtes récoltées sur les mêmes plants que les grosses têtes : même génétique californienne, même culture indoor, même givre de trichomes — à un prix plus doux.",
      "Le profil est fruité et sucré, typique des génétiques californiennes. Les notes précises peuvent varier selon le lot ; n'hésitez pas à nous demander conseil.",
      "Disponible exclusivement en force Maxi : réservée aux adultes habitués, déconseillée aux débutants. Commencez par une très petite quantité.",
    ],
    aromas: "Fruité et sucré, typique des génétiques californiennes (variable selon le lot).",
    profile: "Force Maxi : ressenti marqué, à aborder avec une très petite quantité.",
    usage: "Vaporisation ou infusion. Non destinée à la combustion.",
    image: "/images/products/californienne-indoor-small-buds.jpg",
    video: "/videos/californienne-indoor-small-buds.mp4",
    variants: maxiTiers("CALSB", "Force Maxi — concentration maximale"),
    keywords: ["small buds cbd", "fleur cbd pas cher", "fleur cbd maxi", "petites têtes cbd"],
  },
  {
    slug: "trim-premium-indoor",
    name: "Trim Premium Indoor",
    category: "fleurs",
    origin: "Indoor · manucure premium",
    badge: "Petit prix",
    short: "Petites feuilles, pistils et mini-buds gorgés de trichomes, issus de la manucure de nos fleurs indoor.",
    description: [
      "Le trim, c'est tout ce qui entoure la fleur au moment de la manucure : petites feuilles résineuses, pistils et mini-buds. Issu de nos fleurs indoor, il conserve un profil terpénique fidèle à un prix imbattable.",
      "Idéal pour les infusions, les tisanes, la cuisine ou les préparations maison (huiles, beurres). Herbacé frais, notes boisées et pointe fruitée douce.",
      "Vendu par lots de 10 g, 50 g et 100 g.",
    ],
    aromas: "Herbacé frais, notes boisées, pointe fruitée douce.",
    profile: "CBD classique, pour un usage polyvalent au quotidien.",
    usage: "Infusion, cuisine, préparations maison.",
    image: "/images/products/trim-premium-indoor.jpg",
    variants: [
      { sku: "TRIM-10G", tier: "unique", tierLabel: "CBD classique", force: 1, format: "Lot 10 g", grams: 10, priceCents: 700, cbdInfo: "CBD classique" },
      { sku: "TRIM-50G", tier: "unique", tierLabel: "CBD classique", force: 1, format: "Lot 50 g", grams: 50, priceCents: 3500, cbdInfo: "CBD classique" },
      { sku: "TRIM-100G", tier: "unique", tierLabel: "CBD classique", force: 1, format: "Lot 100 g", grams: 100, priceCents: 7000, cbdInfo: "CBD classique" },
    ],
    keywords: ["trim cbd", "trim cbd pas cher", "cbd infusion", "feuilles cbd"],
  },

  // ───────────────────────────── RÉSINES ─────────────────────────────
  {
    slug: "3x-filtre",
    name: "3X Filtré — Résine",
    category: "resines",
    origin: "Triple filtration · 190, 120 et 73 microns",
    featured: true,
    short: "Hash triple filtré : 99 % de trichomes purs, sans déchet végétal.",
    description: [
      "Le 3X Filtré est obtenu par trois tamisages successifs (190 µ, 120 µ puis 73 µ) qui ne gardent que les têtes de trichomes. Résultat : une résine propre à 99 %, sans matière végétale, qui s'effrite facilement et s'exprime pleinement.",
      "Terre boisée, cèdre épicé, pin poivré et une pointe citronnée fruitée : un hash riche, rond, à la finale puissante.",
      "Disponible en Classique (40 % CBD), Force 2 et Force 3. Analyse de laboratoire consultable.",
    ],
    aromas: "Terre boisée, cèdre épicé, pin poivré, pointe de citron fruité.",
    profile: "Profil profond et enveloppant, idéal en soirée.",
    usage: "Vaporisation (chambre dédiée) ou infusion avec un corps gras. Non destinée à la combustion.",
    image: "/images/products/3x-filtre.jpg",
    variants: tiers("3XF", [
      { force: 1, cbdInfo: "40 % CBD", perGram: 500, per10g: 4500 },
      { force: 2, cbdInfo: "45 % + ~15 % CBD renforcé", perGram: 650, per10g: 6000 },
      { force: 3, cbdInfo: "45 % + ~25 % CBD renforcé", perGram: 800, per10g: 7500 },
    ]),
    keywords: ["hash cbd filtré", "résine cbd 3x filtré", "hash cbd pur", "résine cbd 40"],
  },
  {
    slug: "olivette-gold",
    name: "Olivette Gold — Résine",
    category: "resines",
    origin: "Résine pressée · pollen tamisé premium",
    badge: "Nouveauté",
    isNew: true,
    short: "Boules de résine pressée à la robe brun-olive et au cœur doré, friable et grasse au toucher.",
    description: [
      "L'Olivette Gold est une résine pressée à partir d'un pollen tamisé premium. Sa robe brun-olive cache un cœur doré, friable et gras au toucher — la signature d'un pollen frais.",
      "Épices douces, cuir, bois de santal et un fond légèrement floral et sucré : une résine ronde et très aromatique, en vaporisation comme à l'effritage.",
      "Disponible en Classique (35 % CBD), Force 2 et Force 3.",
    ],
    aromas: "Épices douces, cuir, bois de santal, fond floral et sucré.",
    profile: "Profil enveloppant et apaisant, pour une soirée calme.",
    usage: "Vaporisation ou infusion avec un corps gras. Non destinée à la combustion.",
    image: "/images/products/olivette-gold.jpg",
    variants: tiers("OLV", [
      { force: 1, cbdInfo: "35 % CBD", perGram: 500, per10g: 4500 },
      { force: 2, cbdInfo: "40 % + ~15 % CBD renforcé", perGram: 650, per10g: 6000 },
      { force: 3, cbdInfo: "40 % + ~25 % CBD renforcé", perGram: 800, per10g: 7500 },
    ]),
    keywords: ["olivette cbd", "pollen cbd", "résine pressée cbd", "pollen pressé cbd"],
  },
  {
    slug: "beldia",
    name: "Beldia — Résine",
    category: "resines",
    origin: "Résine traditionnelle",
    badge: "Force Maxi",
    isNew: true,
    short: "Résine au caractère traditionnel, robe brune et texture compacte. Exclusivement en force Maxi.",
    description: [
      "La Beldia est une résine de caractère, dans la plus pure tradition : robe brune, texture compacte, profil résineux aux notes terreuses et épicées.",
      "Elle est proposée exclusivement en force Maxi, la concentration la plus élevée de notre gamme. Réservée aux adultes habitués, déconseillée aux débutants.",
      "Découvrez sa texture en vidéo. Vendue en 1 g, 5 g, 10 g et 100 g.",
    ],
    aromas: "Résineux, notes terreuses et épicées, dans l'esprit des résines traditionnelles.",
    profile: "Force Maxi : ressenti marqué, à aborder avec une très petite quantité.",
    usage: "Vaporisation ou infusion avec un corps gras. Non destinée à la combustion.",
    image: "/images/products/beldia.jpg",
    video: "/videos/beldia.mp4",
    variants: maxiTiers("BELD", "Force Maxi — concentration maximale"),
    keywords: ["beldia cbd", "résine cbd traditionnelle", "résine cbd maxi", "hash cbd puissant"],
  },
  {
    slug: "piatella",
    name: "Piatella — Résine",
    category: "resines",
    origin: "Résine Piatella",
    badge: "Force Maxi",
    isNew: true,
    short: "Résine à la robe brun doré dont la coupe révèle un cœur finement granuleux. Exclusivement en force Maxi.",
    description: [
      "La Piatella est une résine à la robe brun doré. À la coupe, elle révèle un cœur finement granuleux et une texture généreuse, presque fondante, que nous vous montrons en vidéo.",
      "Son caractère est résineux, dans l'esprit des grandes résines de chanvre. Le profil aromatique précis varie selon le lot : demandez-nous conseil.",
      "Proposée exclusivement en force Maxi : réservée aux adultes habitués, déconseillée aux débutants.",
    ],
    aromas: "Résineux et rond ; profil précis variable selon le lot.",
    profile: "Force Maxi : ressenti marqué, à aborder avec une très petite quantité.",
    usage: "Vaporisation ou infusion avec un corps gras. Non destinée à la combustion.",
    image: "/images/products/piatella.jpg",
    video: "/videos/piatella.mp4",
    variants: maxiTiers("PIAT", "Force Maxi — concentration maximale"),
    keywords: ["piatella cbd", "résine cbd premium", "résine cbd maxi"],
  },

  // ───────────────────────────── HUILES ─────────────────────────────
  {
    slug: "huile-full-spectrum-10",
    name: "Huile CBD cutanée Full Spectrum 10 %",
    category: "huiles",
    origin: "Fabriquée en France",
    short: "Huile cutanée Full Spectrum 10 % en flacon 30 ml : l'équilibre douceur / concentration pour le quotidien.",
    description: [
      "Notre huile Full Spectrum 10 % conserve l'ensemble des cannabinoïdes et terpènes du chanvre (effet d'entourage). Fabriquée en France et conditionnée en flacon de 30 ml avec pipette.",
      "Appliquez quelques gouttes sur la zone souhaitée et massez. Usage cutané exclusivement : conformément à la réglementation en vigueur, cette huile n'est pas destinée à être ingérée.",
    ],
    aromas: "Profil naturel de chanvre.",
    profile: "Pour un rituel de massage et un moment de détente au quotidien.",
    usage: "Application cutanée uniquement (massage ciblé, peau). Ne pas ingérer.",
    image: "/images/products/huile-full-spectrum-10.jpg",
    variants: [
      { sku: "HUILE-10", tier: "unique", tierLabel: "Full Spectrum 10 %", force: 1, format: "Flacon 30 ml", grams: 80, priceCents: 1500, cbdInfo: "10 % Full Spectrum — usage cutané" },
    ],
    keywords: ["huile cbd 10", "huile cbd full spectrum 10", "huile cbd massage", "huile cbd 30 ml"],
  },
  {
    slug: "huile-full-spectrum-20",
    name: "Huile CBD cutanée Full Spectrum 20 %",
    category: "huiles",
    origin: "Fabriquée en France",
    featured: true,
    short: "Huile cutanée Full Spectrum concentrée à 20 % : la formule renforcée pour un effet d'entourage maximal.",
    description: [
      "Deux fois plus concentrée que notre 10 %, l'huile Full Spectrum 20 % s'adresse à celles et ceux qui recherchent une formule renforcée. Spectre complet, fabrication française, flacon 30 ml avec pipette.",
      "Appliquez quelques gouttes sur la zone souhaitée et massez. Usage cutané exclusivement : conformément à la réglementation en vigueur, cette huile n'est pas destinée à être ingérée.",
    ],
    aromas: "Profil naturel de chanvre, effet d'entourage du spectre complet.",
    profile: "Pour un rituel de massage renforcé.",
    usage: "Application cutanée uniquement (massage ciblé, peau). Ne pas ingérer.",
    image: "/images/products/huile-full-spectrum-20.jpg",
    variants: [
      { sku: "HUILE-20", tier: "unique", tierLabel: "Full Spectrum 20 %", force: 2, format: "Flacon 30 ml", grams: 80, priceCents: 3000, cbdInfo: "20 % Full Spectrum — usage cutané" },
    ],
    keywords: ["huile cbd 20", "huile cbd full spectrum 20", "huile cbd forte", "huile cbd massage"],
  },

  // ───────────────────────────── VAPE ─────────────────────────────
  {
    slug: "pods-cbd-rechargeables",
    name: "Pods CBD rechargeables",
    category: "vape",
    short: "Pods rechargeables prêts à l'emploi : capsules compatibles, format starter kit nomade et discret.",
    description: [
      "Un format simple pour découvrir la vape CBD : des pods rechargeables, prêts à l'emploi, compatibles avec nos recharges aromatisées. Vapeur dense, sans combustion, discrétion totale.",
      "CBD renforcé et terpènes naturels (fruit, menthe, terreux). Produit réservé aux adultes.",
    ],
    aromas: "Terpènes naturels : fruit, menthe ou terreux selon la recharge.",
    profile: "Un geste discret et dosé, à emporter partout.",
    usage: "Vapotage. Réservé aux adultes. Tenir hors de portée des enfants.",
    image: "/images/products/pods-cbd-rechargeables.jpg",
    variants: [
      { sku: "PODS-KIT", tier: "unique", tierLabel: "Force 2", force: 2, format: "Pièce", grams: 60, priceCents: 2500, cbdInfo: "10 % CBD renforcé" },
    ],
    keywords: ["pod cbd rechargeable", "vape cbd", "puff cbd rechargeable", "kit vape cbd"],
  },
  {
    slug: "recharge-pods",
    name: "Recharge pods CBD",
    category: "vape",
    short: "Recharges aromatisées pour pods CBD : saveurs au choix.",
    description: [
      "Les recharges aromatisées pour nos pods rechargeables. CBD renforcé et terpènes naturels, plusieurs saveurs au choix : fruit, menthe ou terreux. Précisez votre saveur dans les notes de commande.",
      "Produit réservé aux adultes.",
    ],
    aromas: "Fruit, menthe ou terreux (au choix).",
    profile: "Une vapeur dense et aromatique, sans combustion.",
    usage: "Vapotage. Réservé aux adultes. Tenir hors de portée des enfants.",
    image: "/images/products/recharge-pods.jpg",
    variants: [
      { sku: "PODS-RECHARGE", tier: "unique", tierLabel: "Recharge", force: 1, format: "Pièce", grams: 25, priceCents: 1200, cbdInfo: "Saveur au choix" },
    ],
    keywords: ["recharge pod cbd", "e-liquide cbd", "recharge vape cbd"],
  },
];

// ───────────────────────────── Helpers ─────────────────────────────

export const visibleProducts = products.filter((p) => !p.hidden);

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug && !p.hidden);
}

export function getProductsByCategory(category: Category): Product[] {
  return visibleProducts.filter((p) => p.category === category);
}

export function getCategoryBySlug(slug: string): (typeof categories)[Category] & { key: Category } | undefined {
  const key = (Object.keys(categories) as Category[]).find((k) => categories[k].slug === slug);
  return key ? { ...categories[key], key } : undefined;
}

export function findVariant(sku: string): { product: Product; variant: Variant } | undefined {
  for (const product of products) {
    const variant = product.variants.find((v) => v.sku === sku);
    if (variant) return { product, variant };
  }
  return undefined;
}

export function minPriceCents(p: Product): number {
  return Math.min(...p.variants.map((v) => v.priceCents));
}

export function maxPriceCents(p: Product): number {
  return Math.max(...p.variants.map((v) => v.priceCents));
}

/** Prix d'appel affiché sur les cartes : « dès 5 €/g » ou « 15 € » */
export function startingPriceLabel(p: Product): string {
  const perGram = p.variants.filter((v) => v.grams === 1 && /^1 g$/.test(v.format));
  if (perGram.length) {
    const min = Math.min(...perGram.map((v) => v.priceCents));
    return `dès ${formatPrice(min)}/g`;
  }
  const min = minPriceCents(p);
  const hasMultiple = p.variants.length > 1;
  return hasMultiple ? `dès ${formatPrice(min)}` : formatPrice(min);
}

export function maxForce(p: Product): Force {
  const order: Force[] = [1, 2, 3, "maxi"];
  return p.variants.map((v) => v.force).reduce<Force>((max, cur) => (order.indexOf(cur) > order.indexOf(max) ? cur : max), 1);
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export const featuredProducts = visibleProducts.filter((p) => p.featured);
export const newProducts = visibleProducts.filter((p) => p.isNew);
