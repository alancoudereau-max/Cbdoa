/**
 * Références « Sur commande » : elles ne sont pas en stock, nous les commandons pour le client et il les reçoit
 * sous le délai annoncé (ON_ORDER_DELAY, src/lib/pricing.ts). Elles ont leur propre section (/sur-commande) et
 * leur fiche produit, mais n'apparaissent ni dans les rayons, ni dans la boutique, ni dans les sélections.
 *
 * Toutes sont en CBD classique : aucune n'est enrichie en cannabinoïdes (pas de force 2, 3 ou Maxi ici).
 * Commande minimale : 25 g par référence (formats 25 g, 100 g et 500 g : ON_ORDER_PACKS, src/lib/pricing.ts).
 * Prix : src/data/tarifs-sur-commande.ts (prix de base, dès 100 g, dès 500 g). Photos : public/images/products/sc-*.jpg.
 * Retirer une référence : `hidden: true` ; la signaler indisponible : `soldOut: true`.
 *
 * Règles de rédaction : celles du catalogue (src/data/products.ts). Les arômes donnés sont le profil habituel de
 * la variété, pas celui d'un lot : chaque fiche le dit. `aromas` vide = profil inconnu, la fiche renvoie au lot.
 */
import type { Category, Product, Variant } from "@/data/products";
import { ON_ORDER_DELAY, ON_ORDER_MIN_GRAMS, ON_ORDER_PACKS, onOrderRate, onOrderRates, onOrderSku } from "@/lib/pricing";

export type OnOrderGroupKey = "californiennes" | "fleurs" | "faible-thc" | "small-buds" | "resines" | "rocks";

export const onOrderGroups: Array<{ key: OnOrderGroupKey; name: string; title: string; intro: string }> = [
  {
    key: "californiennes",
    name: "Fleurs californiennes",
    title: "Fleurs californiennes",
    intro: "Le haut de la gamme : cinq génétiques californiennes aux têtes denses et très résineuses.",
  },
  {
    key: "fleurs",
    name: "Fleurs CBD",
    title: "Fleurs CBD",
    intro: "Vingt-deux variétés, des classiques comme la White Rhino ou la Chemdawg aux profils gourmands comme la Runtz.",
  },
  {
    key: "faible-thc",
    name: "Très faible THC et CBG",
    title: "Fleurs à très faible THC et CBG",
    intro: "Des fleurs dont le producteur annonce un taux de THC de 0,1 % au maximum, et une fleur riche en CBG.",
  },
  {
    key: "small-buds",
    name: "Small buds et trim",
    title: "Small buds et trim",
    intro: "Les petites têtes et le trim : la même plante, dans un format à prix doux.",
  },
  {
    key: "resines",
    name: "Résines et pollens",
    title: "Résines et pollens",
    intro: "Vingt-quatre résines : en pollen (non pressées) ou en blocs pressés, blondes, brunes ou noires.",
  },
  {
    key: "rocks",
    name: "Moon rocks et ice rocks",
    title: "Moon rocks et ice rocks",
    intro: "Des têtes de fleurs enrobées d'extrait de chanvre puis de pollen ou de cristaux de CBD : les formats les plus concentrés en CBD.",
  },
];

type Kind = "fleur" | "small-buds" | "trim" | "kief" | "pollen" | "presse" | "rock";

type Row = {
  slug: string;
  name: string;
  group: OnOrderGroupKey;
  kind: Kind;
  /** Ce que montre la photo, en une proposition sans point : « Têtes denses aux reflets violets » */
  look: string;
  /** Profil aromatique habituel de la variété. Vide : inconnu, la fiche renvoie au lot. */
  aromas?: string;
  /** Vrai quand le registre n'est donné que par le nom de la variété. */
  byName?: boolean;
  /** Taux de THC annoncé par le producteur, en % : « 0,2 », « 0,1 », « 0 ». Sans lui : « THC < 0,3 % ». */
  thc?: "0,2" | "0,1" | "0";
  /** Teneur annoncée par le producteur : « 51 % de CBD » */
  content?: string;
  /** Phrase propre à la référence, ajoutée au premier paragraphe. */
  extra?: string;
  keywords?: string[];
  /** Ce qui suit le nom dans le titre Google, quand ce n'est pas celui de sa famille : « fleur CBG » */
  seo?: string;
};

const VAPO = "Vaporisation. Non destinée à la combustion ni à un usage alimentaire.";
const VAPO_M = "Vaporisation. Non destiné à la combustion ni à un usage alimentaire.";
const VAPO_RESINE = "Vaporisation (chambre pour concentrés). Non destinée à la combustion ni à un usage alimentaire.";
const LOT = "Les notes varient d'un lot à l'autre : demandez-nous le profil du lot en cours avant de commander.";
const ORDER = `Cette référence se vend sur commande : nous la commandons pour vous dès votre paiement et vous la recevez sous ${ON_ORDER_DELAY} environ. Elle se commande à partir de ${ON_ORDER_MIN_GRAMS} g, avec un prix de gros dès 100 g puis dès 500 g de cette même référence.`;

const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const RESINS: Kind[] = ["kief", "pollen", "presse"];

const kinds: Record<Kind, { category: Category; origin: string; what: string; nature: string; usage: string; cbdInfo: string; profile: string; seo: string; keywords: string[] }> = {
  fleur: {
    category: "fleurs",
    origin: "Fleur de CBD",
    what: "Fleur de CBD",
    nature: "C'est une fleur de CBD classique, la force la plus douce de notre gamme : elle n'est pas enrichie en cannabinoïdes.",
    usage: VAPO,
    cbdInfo: "CBD classique, non enrichie",
    profile: "CBD classique, au naturel : la force la plus douce de notre gamme.",
    seo: "fleur CBD",
    keywords: ["fleur cbd", "fleur cbd sur commande", "fleur cbd prix de gros", "fleur cbd 100 g"],
  },
  "small-buds": {
    category: "fleurs",
    origin: "Petites têtes",
    what: "Small buds de CBD",
    nature: "Les small buds sont les petites têtes de la plante : la même fleur, dans un calibre réduit et à un prix plus doux. C'est du CBD classique, non enrichi en cannabinoïdes.",
    usage: VAPO,
    cbdInfo: "CBD classique, non enrichies",
    profile: "CBD classique, au naturel : la force la plus douce de notre gamme.",
    seo: "fleur CBD",
    keywords: ["small buds cbd", "petites têtes cbd", "small buds cbd pas cher", "small buds cbd 100 g"],
  },
  trim: {
    category: "fleurs",
    origin: "Feuilles de manucure",
    what: "Trim de CBD",
    nature: "Le trim, c'est ce qui entoure la fleur au moment de la manucure : petites feuilles résineuses et brisures de têtes. C'est du CBD classique, non enrichi en cannabinoïdes.",
    usage: VAPO_M,
    cbdInfo: "CBD classique, non enrichi",
    profile: "CBD classique, léger, pour le quotidien.",
    seo: "trim CBD",
    keywords: ["trim cbd", "trim cbd pas cher", "trim cbd 100 g", "trim cbd vaporisation"],
  },
  kief: {
    category: "resines",
    origin: "Pollen tamisé",
    what: "Kief de CBD",
    nature: "Le kief est le pollen de la fleur : les trichomes détachés par tamisage à sec. C'est du CBD classique, non enrichi en cannabinoïdes.",
    usage: VAPO_RESINE,
    cbdInfo: "CBD classique, non enrichi",
    profile: "CBD classique, plus concentré qu'une fleur : une petite quantité suffit.",
    seo: "pollen CBD",
    keywords: ["kief cbd", "pollen cbd", "pollen cbd prix de gros", "kief cbd 100 g"],
  },
  pollen: {
    category: "resines",
    origin: "Résine en pollen",
    what: "Résine de CBD en pollen",
    nature: "Elle est livrée en pollen, c'est-à-dire non pressée : une résine en poudre et en pépites, facile à émietter et à doser. C'est du CBD classique, non enrichi en cannabinoïdes.",
    usage: VAPO_RESINE,
    cbdInfo: "CBD classique, non enrichie",
    profile: "CBD classique, plus concentré qu'une fleur : une petite quantité suffit.",
    seo: "résine CBD",
    keywords: ["pollen cbd", "résine cbd", "hash cbd non pressé", "pollen cbd 100 g"],
  },
  presse: {
    category: "resines",
    origin: "Résine pressée",
    what: "Résine de CBD pressée",
    nature: "Elle est livrée pressée, en bloc : une pâte compacte qui se coupe et s'effrite à la demande. C'est du CBD classique, non enrichi en cannabinoïdes.",
    usage: VAPO_RESINE,
    cbdInfo: "CBD classique, non enrichie",
    profile: "CBD classique, plus concentré qu'une fleur : une petite quantité suffit.",
    seo: "résine CBD",
    keywords: ["résine cbd", "hash cbd", "résine cbd pressée", "résine cbd 100 g"],
  },
  rock: {
    category: "fleurs",
    origin: "Fleur enrobée",
    what: "Fleur de CBD enrobée",
    nature: "Un moon rock ou un ice rock, c'est une tête de fleur de chanvre enrobée d'un extrait de chanvre, puis roulée dans du pollen ou des cristaux de CBD.",
    usage: "Vaporisation, émietté en très petite quantité. Non destiné à la combustion ni à un usage alimentaire.",
    cbdInfo: "Fleur enrobée d'extrait de CBD",
    profile: "Concentré de CBD : bien plus chargé en CBD qu'une fleur, à aborder par très petites quantités.",
    seo: "fleur CBD enrobée",
    keywords: ["moon rock cbd", "ice rock cbd", "moonrock cbd", "fleur cbd concentrée"],
  },
};

const rows: Row[] = [
  // ───────────────────────────── Fleurs californiennes ─────────────────────────────
  { slug: "mandarine-sherbet", name: "Mandarine Sherbet", group: "californiennes", kind: "fleur", thc: "0,2", look: "Têtes denses aux reflets violets et mauves, striées de pistils cuivrés", aromas: "Mandarine et agrumes sucrés, finale douce et crémeuse, façon sorbet." },
  { slug: "platinum-og", name: "Platinum OG", group: "californiennes", kind: "fleur", thc: "0,2", look: "Têtes compactes d'un vert clair tirant sur le jaune, aux pistils orangés", aromas: "Terre et pin, pointe de carburant : le registre des OG." },
  { slug: "mint-kush", name: "Mint Kush", group: "californiennes", kind: "fleur", thc: "0,2", look: "Têtes allongées et serrées, vert olive", aromas: "Menthe fraîche sur un fond terreux et boisé, typique des Kush." },
  { slug: "trainwreck", name: "Trainwreck", group: "californiennes", kind: "fleur", thc: "0,2", look: "Têtes denses vert olive, piquées de pistils orange vif", aromas: "Pin et citron, épices poivrées, fond terreux." },
  { slug: "dom-p", name: "Dom P.", group: "californiennes", kind: "fleur", thc: "0,2", look: "Grosses têtes rondes et pleines, d'un vert tendre" },

  // ───────────────────────────── Fleurs CBD ─────────────────────────────
  { slug: "banana-sour", name: "Banana Sour", group: "fleurs", kind: "fleur", thc: "0,2", look: "Têtes vert sombre aux reflets argentés", aromas: "Banane mûre, pointe acidulée, fond de carburant." },
  { slug: "exotic-haze", name: "Exotic Haze", group: "fleurs", kind: "fleur", thc: "0,2", look: "Têtes élancées vert clair, bien givrées", aromas: "Agrumes, épices et encens : le registre des Haze.", byName: true },
  { slug: "chocolope", name: "Chocolope", group: "fleurs", kind: "fleur", thc: "0,2", look: "Têtes compactes d'un vert franc", aromas: "Cacao et café, fond terreux et doux." },
  { slug: "white-rhino", name: "White Rhino", group: "fleurs", kind: "fleur", thc: "0,2", look: "Têtes denses vert olive aux pistils cuivrés", aromas: "Terre et bois, pointe sucrée." },
  { slug: "godfather-og", name: "Godfather OG", group: "fleurs", kind: "fleur", thc: "0,2", look: "Têtes effilées vert olive", aromas: "Pin et terre, pointe de raisin." },
  { slug: "gmo-cookies", name: "GMO Cookies", group: "fleurs", kind: "fleur", thc: "0,2", look: "Têtes massives et serrées, vert olive", aromas: "Ail, champignon et carburant : un profil salé, très marqué." },
  { slug: "tropical-punch", name: "Tropical Punch", group: "fleurs", kind: "fleur", thc: "0,2", look: "Têtes fournies vert olive", aromas: "Fruits tropicaux et agrumes, finale sucrée." },
  { slug: "tangie", name: "Tangie", group: "fleurs", kind: "fleur", thc: "0,2", look: "Têtes coniques vert clair aux pistils orangés", aromas: "Mandarine et zeste d'orange." },
  { slug: "cherry-coco", name: "Cherry Coco", group: "fleurs", kind: "fleur", thc: "0,2", look: "Têtes aérées d'un vert clair lumineux", aromas: "Cerise et noix de coco.", byName: true },
  { slug: "limoncello", name: "Limoncello", group: "fleurs", kind: "fleur", thc: "0,2", look: "Têtes aux reflets rosés et aux pistils cuivrés", aromas: "Citron confit et zeste, fond sucré." },
  { slug: "fat-banana", name: "Fat Banana", group: "fleurs", kind: "fleur", thc: "0,2", look: "Têtes pointues d'un vert clair", aromas: "Banane mûre et sucrée, fond terreux." },
  { slug: "pineapple-jet", name: "Pineapple Jet", group: "fleurs", kind: "fleur", thc: "0,2", look: "Têtes coniques aux tons bruns et dorés", aromas: "Ananas, pointe de carburant.", byName: true },
  { slug: "double-cinnamon", name: "Double Cinnamon", group: "fleurs", kind: "fleur", thc: "0,2", look: "Têtes rondes d'un vert foncé", aromas: "Épices douces et cannelle.", byName: true },
  { slug: "fragola", name: "Fragola", group: "fleurs", kind: "fleur", thc: "0,2", look: "Têtes vert olive bien formées", aromas: "Fraise (c'est son nom, en italien) et fruits rouges sucrés.", byName: true },
  { slug: "aladin-purple-kush", name: "Aladin Purple Kush", group: "fleurs", kind: "fleur", thc: "0,2", look: "Têtes aux reflets violets et pourpres", aromas: "Raisin et fruits noirs, fond terreux des Purple Kush." },
  { slug: "chemdawg", name: "Chemdawg", group: "fleurs", kind: "fleur", thc: "0,2", look: "Têtes coniques vert clair, couvertes de pistils orange", aromas: "Carburant, notes piquantes, pin." },
  { slug: "bubblegum-gelato", name: "Bubblegum Gelato", group: "fleurs", kind: "fleur", thc: "0,2", look: "Têtes vert tendre, bien fournies", aromas: "Chewing-gum sucré, crème et fruits." },
  { slug: "runtz", name: "Runtz", group: "fleurs", kind: "fleur", thc: "0,2", look: "Têtes vert clair tirant sur le jaune", aromas: "Bonbon fruité, sucré et crémeux." },
  { slug: "sugar-candy", name: "Sugar Candy", group: "fleurs", kind: "fleur", thc: "0,2", look: "Têtes compactes d'un vert franc", aromas: "Sucre et bonbon, fruits doux.", byName: true },
  { slug: "frosted-flakes", name: "Frosted Flakes", group: "fleurs", kind: "fleur", thc: "0,2", look: "Têtes larges vert clair, givrées de trichomes" },
  { slug: "cherry-bomb", name: "Cherry Bomb", group: "fleurs", kind: "fleur", thc: "0,2", look: "Têtes vert clair aux longs pistils orangés", aromas: "Cerise et fruits rouges, fond sucré." },
  { slug: "special-sauce", name: "Special Sauce", group: "fleurs", kind: "fleur", thc: "0,2", look: "Têtes brunes et cuivrées, très garnies de pistils", aromas: "Baies, houblon, fond terreux." },

  // ───────────────────────────── Très faible THC et CBG ─────────────────────────────
  { slug: "zero-gravity", name: "Zero Gravity", group: "faible-thc", kind: "fleur", thc: "0", look: "Têtes rondes vert tendre aux pistils orangés" },
  { slug: "cannalight", name: "Cannalight", group: "faible-thc", kind: "fleur", thc: "0", look: "Têtes vert olive aux pistils orange" },
  { slug: "northern-light", name: "Northern Light", group: "faible-thc", kind: "fleur", thc: "0,1", look: "Têtes compactes d'un vert sombre", aromas: "Pin et terre, pointe sucrée et épicée." },
  { slug: "mercury-og", name: "Mercury OG", group: "faible-thc", kind: "fleur", thc: "0,1", look: "Têtes vert-jaune à la structure ouverte", aromas: "Pin, terre et carburant : le registre des OG.", byName: true },
  { slug: "blue-venom", name: "Blue Venom", group: "faible-thc", kind: "fleur", thc: "0,1", look: "Têtes larges vert olive", aromas: "Myrtille et fruits rouges, fond sucré : la lignée des Blueberry." },
  {
    slug: "orange-bud-cbg",
    name: "Orange Bud CBG",
    group: "faible-thc",
    kind: "fleur",
    thc: "0,1",
    look: "Têtes très claires, presque blanches de trichomes",
    aromas: "Orange et agrumes sucrés.",
    extra: "C'est une fleur riche en CBG (cannabigérol), un cannabinoïde du chanvre distinct du CBD ; ses têtes sont naturellement plus pâles.",
    seo: "fleur CBG",
    keywords: ["fleur cbg", "orange bud cbg", "cbg fleur", "fleur cbg prix de gros"],
  },

  // ───────────────────────────── Small buds et trim ─────────────────────────────
  { slug: "double-cinnamon-small-buds", name: "Double Cinnamon — Small Buds", group: "small-buds", kind: "small-buds", thc: "0,2", look: "Petites têtes rondes d'un vert foncé", aromas: "Épices douces et cannelle.", byName: true },
  { slug: "fragolina-small-buds", name: "Fragolina — Small Buds", group: "small-buds", kind: "small-buds", thc: "0,2", look: "Petites têtes vert clair, régulières", aromas: "Fraise et fruits rouges sucrés.", byName: true },
  { slug: "aladin-purple-kush-small-buds", name: "Aladin Purple Kush — Small Buds", group: "small-buds", kind: "small-buds", thc: "0,2", look: "Petites têtes sombres aux reflets violets", aromas: "Raisin et fruits noirs, fond terreux des Purple Kush." },
  { slug: "pop-star-small-buds", name: "Pop Star — Small Buds", group: "small-buds", kind: "small-buds", thc: "0,2", look: "Petites têtes très claires, givrées" },
  { slug: "small-buds-standard", name: "Small Buds Standard", group: "small-buds", kind: "small-buds", thc: "0,1", look: "Petites têtes vertes, de calibre mêlé", extra: "C'est un mélange de petites têtes de plusieurs variétés : le prix le plus bas de nos fleurs." },
  { slug: "trim-standard", name: "Trim Standard", group: "small-buds", kind: "trim", thc: "0,1", look: "Fines feuilles et brisures de fleurs, blond doré", extra: "C'est la référence la moins chère de toute la section." },

  // ───────────────────────────── Résines et pollens ─────────────────────────────
  { slug: "kief-californien-pollen", name: "Kief californien en pollen", group: "resines", kind: "kief", look: "Pollen blond en poudre et en pépites" },
  { slug: "kief-californien-presse", name: "Kief californien pressé", group: "resines", kind: "kief", look: "Blocs de pollen pressé, blond clair", extra: "Celui-ci est livré pressé, en blocs à couper." },
  { slug: "amnesia-hash-pollen", name: "Amnesia Hash en pollen", group: "resines", kind: "pollen", look: "Résine brune en poudre et en pépites", aromas: "Citron et notes Haze, fond résineux.", byName: true },
  { slug: "amnesia-hash-presse", name: "Amnesia Hash pressé", group: "resines", kind: "presse", look: "Blocs blonds à la pâte fine et régulière", aromas: "Citron et notes Haze, fond résineux.", byName: true },
  { slug: "ms13-pollen", name: "MS13 en pollen", group: "resines", kind: "pollen", look: "Résine beige clair, en pépites" },
  { slug: "ms13-presse", name: "MS13 pressé", group: "resines", kind: "presse", look: "Blocs beiges à la coupe nette" },
  { slug: "skittlez-pollen", name: "Skittlez en pollen", group: "resines", kind: "pollen", look: "Résine couleur sable, en poudre et en boulettes", aromas: "Fruité et sucré, façon bonbon.", byName: true },
  { slug: "skittlez-presse", name: "Skittlez pressé", group: "resines", kind: "presse", look: "Blocs bruns au grain serré", aromas: "Fruité et sucré, façon bonbon.", byName: true },
  { slug: "gorilla-banana-pollen", name: "Gorilla Banana en pollen", group: "resines", kind: "pollen", look: "Résine beige, en poudre et en pépites", aromas: "Banane, terre, pointe de carburant.", byName: true },
  { slug: "gorilla-banana-presse", name: "Gorilla Banana pressé", group: "resines", kind: "presse", look: "Blocs couleur caramel", aromas: "Banane, terre, pointe de carburant.", byName: true },
  { slug: "casablanca-pollen", name: "Casablanca en pollen", group: "resines", kind: "pollen", look: "Résine vert kaki, en poudre et en pépites", aromas: "Épices douces, bois et terre, dans l'esprit des résines marocaines.", byName: true },
  { slug: "casablanca-presse", name: "Casablanca pressé", group: "resines", kind: "presse", look: "Blocs brun-vert au cœur plus clair", aromas: "Épices douces, bois et terre, dans l'esprit des résines marocaines.", byName: true },
  { slug: "amg13-pollen", name: "AMG13 en pollen", group: "resines", kind: "pollen", look: "Résine kaki, en poudre et en pépites" },
  { slug: "amg13-presse", name: "AMG13 pressé", group: "resines", kind: "presse", look: "Blocs vert kaki à la pâte souple" },
  {
    slug: "hash-cbg-pollen",
    name: "Hash CBG en pollen",
    group: "resines",
    kind: "pollen",
    look: "Résine blond doré, en poudre et en pépites",
    aromas: "Doux et herbacé, plus discret qu'une résine de CBD.",
    extra: "C'est une résine riche en CBG (cannabigérol), un cannabinoïde du chanvre distinct du CBD.",
    seo: "résine CBG",
    keywords: ["hash cbg", "résine cbg", "pollen cbg", "cbg prix de gros"],
  },
  {
    slug: "hash-cbg-presse",
    name: "Hash CBG pressé",
    group: "resines",
    kind: "presse",
    look: "Blocs beige et brun, à la pâte aérée",
    aromas: "Doux et herbacé, plus discret qu'une résine de CBD.",
    extra: "C'est une résine riche en CBG (cannabigérol), un cannabinoïde du chanvre distinct du CBD.",
    seo: "résine CBG",
    keywords: ["hash cbg", "résine cbg", "résine cbg pressée", "cbg prix de gros"],
  },
  { slug: "libanais-rouge", name: "Libanais Rouge", group: "resines", kind: "presse", look: "Pain brun-rouge sombre, lisse et dense", aromas: "Épicé et boisé, légèrement fruité, dans l'esprit des résines libanaises.", byName: true },
  { slug: "la-filtrada", name: "La Filtrada", group: "resines", kind: "presse", content: "plus de 50 % de CBD", look: "Plaques gris-vert au grain très fin", aromas: "Terre et bois, épices.", extra: "Son nom le dit : c'est une résine filtrée, tamisée finement." },
  { slug: "crazy-bubble", name: "Crazy Bubble", group: "resines", kind: "presse", look: "Blocs brun doré à la pâte aérée" },
  { slug: "nepal-cream", name: "Nepal Cream", group: "resines", kind: "presse", look: "Pain noir, lisse et gras", aromas: "Épicé et terreux, dans l'esprit des résines népalaises.", byName: true },
  { slug: "ice-o-lator", name: "Ice O Lator", group: "resines", kind: "pollen", content: "51 % de CBD", look: "Résine dorée et ambrée, en poudre et en pépites", extra: "Le nom « ice o lator » désigne une résine extraite à l'eau glacée, sans solvant. C'est la plus concentrée de nos résines sur commande." },
  { slug: "ketama", name: "Ketama", group: "resines", kind: "presse", look: "Blocs bruns au grain régulier", aromas: "Épices, bois et terre, dans l'esprit des résines du Rif.", byName: true },
  { slug: "tidirhine-express", name: "Tidirhine Express", group: "resines", kind: "presse", look: "Blocs blond-vert à la pâte fine", aromas: "Herbacé et floral, épices douces.", byName: true },
  { slug: "super-pollen", name: "Super Pollen", group: "resines", kind: "presse", look: "Plaque couleur sable, à la pâte fine", aromas: "Herbacé et doux, légèrement épicé." },

  // ───────────────────────────── Moon rocks et ice rocks ─────────────────────────────
  { slug: "moon-rock", name: "Moon Rock", group: "rocks", kind: "rock", content: "60 % de CBD", look: "Têtes enrobées, brun doré, couvertes de pollen" },
  { slug: "ice-rock-cbd", name: "Ice Rock CBD", group: "rocks", kind: "rock", content: "60 % de CBD", look: "Têtes enrobées, blanches de cristaux" },
  { slug: "ice-rock-cbg", name: "Ice Rock CBG", group: "rocks", kind: "rock", content: "70 % de CBD, moins de 10 % de CBG", look: "Têtes enrobées, blanches de cristaux", extra: "Cette version ajoute du CBG (cannabigérol), un autre cannabinoïde du chanvre." },
  { slug: "ice-rock-cbn", name: "Ice Rock CBN", group: "rocks", kind: "rock", content: "70 % de CBD, moins de 10 % de CBN", look: "Têtes enrobées, blanches de cristaux", extra: "Cette version ajoute du CBN (cannabinol), un autre cannabinoïde du chanvre." },
];

function thcSentence(r: Row): string {
  const cert = "Le certificat d'analyse du lot est disponible sur demande, avant de commander.";
  if (r.thc === "0") return `Le producteur l'annonce à 0 % de THC, c'est-à-dire sans THC détecté à l'analyse. ${cert}`;
  if (r.thc) return `Le producteur annonce un taux de THC inférieur à ${r.thc} %, sous le plafond légal de 0,3 %. ${cert}`;
  return `Comme tous nos produits, cette référence respecte le plafond légal de 0,3 % de THC. ${cert}`;
}

function aromaSentence(r: Row): string {
  if (!r.aromas) return "Son profil aromatique dépend du lot : demandez-le-nous avant de commander.";
  const a = lower(r.aromas).replace(/\.$/, "");
  if (r.byName) return `Son nom annonce le registre : ${a}. ${LOT}`;
  return `${RESINS.includes(r.kind) ? "Le profil habituel de cette résine" : "Le profil habituel de la variété"} : ${a}. ${LOT}`;
}

function variants(slug: string, cbdInfo: string, tierLabel: string): Variant[] {
  const rates = onOrderRates(slug);
  if (!rates) throw new Error(`Tarif sur commande manquant : ${slug}`);
  return ON_ORDER_PACKS.map((grams) => ({
    sku: onOrderSku(slug, grams),
    tier: "unique",
    tierLabel,
    force: 1,
    format: `${grams} g`,
    grams,
    priceCents: (onOrderRate(slug, grams) as number) * grams,
    perGramCents: rates[0],
    cbdInfo,
  }));
}

function build(r: Row): Product {
  const k = kinds[r.kind];
  const rock = r.kind === "rock";
  const first = [`${r.look}.`, k.nature, r.content ? `Teneur annoncée par le producteur : ${r.content}.` : "", r.extra ?? ""].filter(Boolean).join(" ");
  const plain = r.name.replace(/\s+[—–]\s+/g, " ");
  // Une référence au CBG se nomme comme telle : « résine de CBG pressée », mot-clé sans « cbd » accolé.
  const cbg = /\bCBG\b/.test(plain) && !rock;
  const what = cbg ? k.what.replace("CBD", "CBG") : k.what;
  return {
    slug: r.slug,
    name: r.name,
    category: k.category,
    origin: r.content ? `${k.origin} · ${r.content}` : k.origin,
    badge: "Sur commande",
    onOrder: r.group,
    thcMax: r.thc === "0" ? "0,1" : r.thc,
    forceLabel: rock ? "Concentré de CBD" : undefined,
    notice: rock
      ? "Concentré de CBD : une fleur enrobée est bien plus chargée en CBD qu'une fleur. Commencez par une très petite quantité."
      : "CBD classique : fleur ou résine au naturel, non enrichie.",
    short: `${plain}, ${lower(what)} : ${lower(r.look)}. Sur commande : livraison sous ${ON_ORDER_DELAY}.`,
    description: [first, aromaSentence(r), thcSentence(r), ORDER],
    aromas: r.aromas ? `${r.aromas} ${RESINS.includes(r.kind) ? "Profil habituel" : "Profil habituel de la variété"}, variable selon le lot.` : "Variable selon le lot : demandez-le-nous avant de commander.",
    profile: k.profile,
    usage: k.usage,
    image: `/images/products/sc-${r.slug}.jpg`,
    variants: variants(r.slug, r.content ?? k.cbdInfo, rock ? "Concentré de CBD" : "CBD classique"),
    keywords: [cbg ? plain.toLowerCase() : `${plain.toLowerCase().replace(/\.$/, "")} cbd`, ...(r.keywords ?? k.keywords)],
    seoName: `${plain} : ${r.seo ?? k.seo}`,
  };
}

/** Toutes les références sur commande, dans l'ordre de la section. */
export const onOrderProducts: Product[] = rows.map(build);
