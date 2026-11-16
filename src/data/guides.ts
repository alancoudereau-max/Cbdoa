/**
 * Guides & conseils — contenu SEO éditorial.
 * Règles : aucune allégation thérapeutique, vouvoiement, informations réglementaires sourcées.
 */

export type GuideBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "table"; headers: string[]; rows: string[][] };

export type GuideSection = { heading: string; blocks: GuideBlock[] };

export type Guide = {
  slug: string;
  title: string;
  description: string;
  category: "Réglementation" | "Bien choisir" | "Utilisation" | "Qualité & analyses" | "Livraison" | "Haut-Doubs";
  publishedAt: string;
  readingMinutes: number;
  intro: string;
  sections: GuideSection[];
  faq: { q: string; a: string }[];
  relatedProducts: string[];
  relatedGuides: string[];
  keywords: string[];
};

const p = (text: string): GuideBlock => ({ type: "p", text });
const ul = (items: string[]): GuideBlock => ({ type: "ul", items });
const ol = (items: string[]): GuideBlock => ({ type: "ol", items });
const quote = (text: string): GuideBlock => ({ type: "quote", text });
const table = (headers: string[], rows: string[][]): GuideBlock => ({ type: "table", headers, rows });

export const guides: Guide[] = [
  {
    slug: "cbd-legal-france-2026",
    title: "CBD légal en France en 2026 : ce que dit vraiment la loi",
    description:
      "Fleurs, résines, huiles, vape : quels produits CBD sont autorisés en France en 2026 ? Seuil de THC, interdiction alimentaire, mineurs, allégations.",
    category: "Réglementation",
    publishedAt: "2026-11-08",
    readingMinutes: 7,
    intro:
      "Le CBD est légal en France, mais pas n'importe comment. Entre le seuil de THC, l'interdiction des denrées alimentaires au CBD entrée en vigueur en mai 2026 et les règles de vente aux particuliers, voici ce qu'un acheteur doit savoir avant de commander.",
    sections: [
      {
        heading: "Le CBD n'est pas un stupéfiant",
        blocks: [
          p("Le cannabidiol (CBD) est l'un des nombreux cannabinoïdes du chanvre (Cannabis sativa L.). Contrairement au THC, il n'est pas classé comme stupéfiant. La Cour de justice de l'Union européenne l'a rappelé dans l'arrêt « Kanavape » du 19 novembre 2020 : un État membre ne peut pas interdire la commercialisation d'un CBD légalement produit dans un autre État membre."),
          p("En France, le cadre actuel repose sur l'arrêté du 30 décembre 2021. Il autorise la culture, l'importation et la vente de produits issus de variétés de chanvre inscrites au catalogue, à condition que la teneur en THC de la plante ne dépasse pas 0,3 %."),
        ],
      },
      {
        heading: "Fleurs et résines : autorisées depuis la décision du Conseil d'État",
        blocks: [
          p("L'arrêté de 2021 interdisait initialement la vente des fleurs et feuilles brutes. Le Conseil d'État a annulé cette interdiction le 29 décembre 2022, estimant qu'elle était disproportionnée au regard de l'absence de nocivité démontrée du CBD. Depuis, fleurs, trims et résines de CBD peuvent être vendus librement aux adultes, sous réserve du seuil de THC."),
          p("Concrètement, pour l'acheteur : une fleur ou une résine de CBD vendue en France doit afficher un THC inférieur à 0,3 % et provenir de variétés autorisées. Un vendeur sérieux met ses analyses de laboratoire à disposition, comme nous le faisons sur notre page dédiée."),
        ],
      },
      {
        heading: "Ce qui a changé en mai 2026 : fin des aliments au CBD",
        blocks: [
          p("Depuis le 15 mai 2026, la France applique strictement la réglementation européenne sur les nouveaux aliments (« novel food ») : les denrées alimentaires contenant du CBD — huiles à avaler, gummies, tisanes à base de fleurs, chocolats — ne peuvent plus être commercialisées tant qu'aucune autorisation européenne n'a été délivrée."),
          p("Les fleurs et résines destinées à la vaporisation, les e-liquides et pods, ainsi que les cosmétiques (huiles et baumes à usage cutané) restent autorisés. C'est pourquoi nos huiles Full Spectrum sont exclusivement proposées pour un usage cutané, et nos fleurs et résines pour la vaporisation : nous ne les présentons ni pour l'infusion, ni pour la cuisine."),
        ],
      },
      {
        heading: "Les règles qui s'imposent aux vendeurs",
        blocks: [
          ul([
            "Interdiction de vente aux mineurs : un contrôle d'âge est obligatoire, en boutique comme en ligne.",
            "Interdiction des allégations thérapeutiques : un produit CBD n'est pas un médicament et ne peut pas promettre de soigner quoi que ce soit.",
            "Traçabilité : origine des variétés, analyses de lots, conformité de l'étiquetage.",
            "Information du consommateur : précautions d'emploi, recommandation de ne pas conduire après usage, avertissement pour les femmes enceintes ou allaitantes.",
          ]),
          quote("Un site qui promet de « guérir » ou de « traiter » avec du CBD est hors la loi. La prudence est un bon indicateur de sérieux."),
        ],
      },
      {
        heading: "Et les cannabinoïdes de synthèse ?",
        blocks: [
          p("Depuis 2023, l'Agence nationale de sécurité du médicament (ANSM) a classé comme stupéfiants plusieurs cannabinoïdes de synthèse ou semi-synthèse apparus sur le marché (HHC et ses dérivés, puis d'autres molécules). Leur vente est interdite en France. Nos produits sont exclusivement à base de CBD naturel ou renforcé en CBD, et respectent la réglementation en vigueur."),
        ],
      },
      {
        heading: "Ce que cela change pour vous",
        blocks: [
          p("Acheter du CBD en France en 2026 est légal et simple, à condition de choisir un vendeur transparent : analyses accessibles, THC < 0,3 %, vérification d'âge, informations claires sur l'usage. Chez CBDoux, chaque fiche produit indique la force, l'usage prévu et renvoie vers nos analyses et nos conseils de prudence."),
        ],
      },
    ],
    faq: [
      { q: "Peut-on se faire contrôler avec du CBD sur soi ?", a: "Oui, comme pour tout produit. Conservez votre produit dans son emballage d'origine et gardez votre facture : elle atteste qu'il s'agit d'un produit légal (THC < 0,3 %) acheté auprès d'un vendeur déclaré." },
      { q: "Le CBD est-il légal pour les mineurs ?", a: "Non. La vente de produits CBD est interdite aux moins de 18 ans. Notre site impose une vérification d'âge et une déclaration de majorité à la commande." },
      { q: "Les huiles CBD à avaler sont-elles encore vendues ?", a: "Non. Depuis le 15 mai 2026, les denrées alimentaires contenant du CBD ne sont plus autorisées en France. Nos huiles sont à usage cutané exclusivement." },
    ],
    relatedProducts: ["super-lemon-haze-hydro-usa", "3x-filtre", "huile-full-spectrum-10"],
    relatedGuides: ["cbd-et-conduite", "lire-analyse-laboratoire-coa"],
    keywords: ["cbd légal france", "cbd loi 2026", "thc 0,3", "fleur cbd légale", "cbd interdit alimentaire", "réglementation cbd"],
  },
  {
    slug: "comment-choisir-fleur-cbd",
    title: "Comment choisir sa fleur de CBD : indoor, hydro, greenhouse",
    description:
      "Indoor, hydroponie ou greenhouse ? Taux de CBD, trichomes, arômes, small buds et trim : le guide pour choisir une fleur de CBD de qualité, adaptée à vos goûts.",
    category: "Bien choisir",
    publishedAt: "2026-11-08",
    readingMinutes: 8,
    intro:
      "Toutes les fleurs de CBD ne se valent pas. Mode de culture, densité des têtes, richesse en trichomes, profil aromatique : voici les critères concrets que nous utilisons pour sélectionner nos variétés, et qui vous aideront à choisir la vôtre.",
    sections: [
      {
        heading: "Indoor, hydroponie, greenhouse : trois façons de cultiver",
        blocks: [
          table(
            ["Mode de culture", "Principe", "Ce que ça donne", "Prix"],
            [
              ["Indoor", "Intérieur, lumière artificielle, climat contrôlé", "Têtes denses, très aromatiques, aspect soigné", "€€€"],
              ["Hydroponie", "Culture indoor hors-sol, sur substrat inerte et solution nutritive", "Buds volumineux, propres, croissance rapide", "€€€"],
              ["Greenhouse", "Serre : soleil naturel + protection climatique", "Bon compromis arômes / prix", "€€"],
              ["Outdoor", "Plein champ", "Têtes plus aérées, profil plus rustique", "€"],
            ],
          ),
          p("Notre catalogue privilégie l'indoor et l'hydroponie (Super Lemon Haze, Amnesia, Orangello, Cali Fruit) avec quelques références greenhouse bien choisies (Critical Berry, Bubble Gum) pour les budgets plus serrés."),
        ],
      },
      {
        heading: "Le taux de CBD : utile, mais pas suffisant",
        blocks: [
          p("Le pourcentage de CBD indiqué (18 %, 22 %, 24 %…) donne une idée de la concentration en cannabidiol du lot. Il se vérifie sur l'analyse de laboratoire (COA). Mais deux fleurs à 20 % peuvent offrir des expériences très différentes selon leurs terpènes, leur fraîcheur et leur conservation."),
          p("Nos forces Classique, 2 et 3 permettent d'ajuster la concentration : la Force 2 et la Force 3 sont des fleurs renforcées en CBD après récolte. Pour une première commande, la force Classique est le choix le plus sûr."),
        ],
      },
      {
        heading: "Reconnaître une belle fleur",
        blocks: [
          ul([
            "Des trichomes visibles : ce « givre » blanc ou doré sur les têtes concentre les cannabinoïdes et les arômes.",
            "Une manucure soignée : peu de feuilles, pas de tiges apparentes.",
            "Une densité correcte : la tête résiste légèrement sous les doigts sans s'effriter en poussière.",
            "Une odeur nette et franche à l'ouverture du sachet : agrumes, fruits, pin, terre… jamais de notes de moisi ou de foin.",
            "Une couleur vivante : verts profonds, pistils orangés, parfois des reflets violets selon la génétique.",
          ]),
        ],
      },
      {
        heading: "Les arômes : choisissez selon vos goûts",
        blocks: [
          p("Les terpènes sont les molécules aromatiques de la plante. Ce sont eux qui font la différence entre une Haze citronnée et une Bubble Gum sucrée. Quelques repères :"),
          ul([
            "Agrumes et citron : Super Lemon Haze, Amnesia Haze, Orangello — profils vifs et toniques.",
            "Fruits rouges et sucrés : Critical Berry, Fruit Haze, Bubble Gum — profils gourmands.",
            "Pin, bois, floral : Snow White — profil plus enveloppant, souvent apprécié le soir.",
          ]),
        ],
      },
      {
        heading: "Small buds et trim : les bons plans",
        blocks: [
          p("Les small buds sont les petites têtes récoltées sur les mêmes plants que les grosses : même génétique, même culture, prix plus doux. Le trim rassemble les petites feuilles résineuses et mini-buds issus de la manucure : il se vaporise comme une fleur, avec un rendu plus léger, à prix très accessible."),
          p("Notre Californienne Indoor Small Buds est proposée en force Maxi, réservée aux adultes habitués. Le Trim Premium Indoor est vendu par lots de 10, 50 et 100 g."),
        ],
      },
      {
        heading: "Notre méthode de sélection",
        blocks: [
          p("Chaque variété est goûtée et validée par nos soins avant d'entrer au catalogue, puis chaque lot est analysé par un laboratoire indépendant (THC < 0,3 %). Nous conservons les fleurs à 20 °C dans des sachets hermétiques biphase, y compris dans nos distributeurs automatiques. Et nous répondons à vos questions sur WhatsApp avant l'achat."),
        ],
      },
    ],
    faq: [
      { q: "Quelle fleur CBD pour débuter ?", a: "Une fleur en force Classique au profil doux et fruité : Fruit Haze ou Cali Fruit Indoor. Commencez par 1 g pour tester les arômes et votre sensibilité." },
      { q: "Pourquoi certaines fleurs sont-elles plus chères ?", a: "Le mode de culture (indoor et hydroponie coûtent plus cher que la serre), la génétique, le travail de manucure et le taux de CBD expliquent les écarts. Le prix au gramme baisse sur les formats 10 g." },
      { q: "Une fleur à 24 % de CBD est-elle plus « forte » qu'une 18 % ?", a: "Plus concentrée en CBD, oui. Mais le ressenti dépend aussi des terpènes, de la quantité utilisée et de votre sensibilité. Les forces 2, 3 et Maxi vont plus loin que le taux naturel." },
    ],
    relatedProducts: ["super-lemon-haze-hydro-usa", "cali-fruit-indoor", "fruit-haze", "trim-premium-indoor"],
    relatedGuides: ["comprendre-les-forces-cbd", "fleur-ou-resine-cbd", "vaporiser-cbd-guide-pratique"],
    keywords: ["choisir fleur cbd", "fleur cbd indoor", "fleur cbd hydroponie", "meilleure fleur cbd", "fleur cbd débutant", "small buds cbd"],
  },
  {
    slug: "fleur-ou-resine-cbd",
    title: "Fleur ou résine de CBD : différences et conseils",
    description:
      "Fleur, résine, hash, pollen : comprenez les différences de fabrication, de texture, d'arômes et d'usage pour choisir le produit CBD qui vous correspond.",
    category: "Bien choisir",
    publishedAt: "2026-11-08",
    readingMinutes: 6,
    intro:
      "La fleur est la matière brute ; la résine en est le concentré. Entre les deux, une différence de texture, d'intensité aromatique et de manière de consommer. Voici comment trancher.",
    sections: [
      {
        heading: "La fleur : la plante telle quelle",
        blocks: [
          p("La fleur de CBD est la tête séchée du chanvre, manucurée et conservée. Elle offre le profil aromatique le plus fidèle à la variété et se vaporise facilement, à basse température. Son taux de CBD naturel se situe généralement entre 10 et 25 % selon les génétiques."),
        ],
      },
      {
        heading: "La résine : les trichomes concentrés",
        blocks: [
          p("La résine (hash) est obtenue en séparant les trichomes — ces glandes résineuses riches en cannabinoïdes et terpènes — du reste du végétal, puis en les pressant. Résultat : un produit plus concentré (35 à 45 % de CBD pour nos références Classique) et plus compact."),
          p("La qualité dépend surtout de la finesse de filtration. Notre 3X Filtré est tamisé en trois passes (190, 120 puis 73 microns) : il ne reste que les têtes de trichomes, sans matière végétale. L'Olivette Gold, pressée à partir d'un pollen tamisé premium, offre une texture grasse et friable caractéristique des pollens frais."),
        ],
      },
      {
        heading: "Pollen, hash, résine pressée : le vocabulaire",
        blocks: [
          ul([
            "Pollen : tamisage à sec, poudre de trichomes légèrement compactée, souvent dorée et friable.",
            "Hash / résine : pollen pressé et travaillé, plus compact, du brun clair au brun foncé.",
            "Résine traditionnelle (type Beldia) : robe brune, texture compacte, notes terreuses et épicées.",
            "Résines filtrées (3X) : pureté élevée, grain fin, arômes nets.",
          ]),
        ],
      },
      {
        heading: "Comparatif rapide",
        blocks: [
          table(
            ["", "Fleur", "Résine"],
            [
              ["Concentration CBD", "10 – 25 % (naturel)", "35 – 45 % et plus"],
              ["Arômes", "Fidèles à la variété, très lisibles", "Plus profonds, terreux, épicés"],
              ["Texture", "Têtes à effriter", "Bloc à chauffer légèrement et émietter"],
              ["Usage", "Vaporisation", "Vaporisation (chambre pour concentrés)"],
              ["Prix au gramme", "5 à 10 €", "5 à 10 €"],
              ["Conservation", "Plusieurs mois en sachet hermétique", "Très bonne, peu sensible au séchage"],
            ],
          ),
        ],
      },
      {
        heading: "Lequel choisir ?",
        blocks: [
          p("Vous aimez découvrir des profils aromatiques variés, vous vaporisez à basse température : la fleur est votre terrain de jeu. Vous recherchez quelque chose de plus concentré, compact, facile à conserver et à doser au gramme près : la résine s'impose. Beaucoup de nos clients alternent selon le moment."),
          p("Dans tous les cas, les mêmes règles s'appliquent : réservé aux adultes, à aborder avec de petites quantités, sans conduire après usage."),
        ],
      },
    ],
    faq: [
      { q: "La résine est-elle plus « forte » que la fleur ?", a: "Elle est plus concentrée en CBD, donc une plus petite quantité suffit. Le ressenti dépend de la force choisie et de votre sensibilité." },
      { q: "Comment utiliser une résine de CBD ?", a: "Chauffez-la quelques secondes entre les doigts pour l'assouplir, émiettez-la, puis vaporisez-la (chambre pour concentrés ou tampon de dégommage). Elle n'est destinée ni à la combustion ni à un usage alimentaire." },
      { q: "Qu'est-ce qu'une résine triple filtrée ?", a: "Une résine passée au tamis trois fois (190, 120, 73 µ) pour ne garder que les trichomes : pureté proche de 99 %, aucun déchet végétal." },
    ],
    relatedProducts: ["3x-filtre", "olivette-gold", "beldia", "super-lemon-haze-hydro-usa"],
    relatedGuides: ["piatella-cbd-c-est-quoi", "comment-choisir-fleur-cbd", "vaporiser-cbd-guide-pratique", "comprendre-les-forces-cbd"],
    keywords: ["fleur ou résine cbd", "différence hash fleur cbd", "pollen cbd", "résine cbd filtrée", "hash cbd"],
  },
  {
    slug: "piatella-cbd-c-est-quoi",
    title: "Piatella CBD : c'est quoi, comment l'utiliser ?",
    description:
      "D'où vient la Piatella, comment reconnaître cette résine à la texture fondante, comment l'utiliser et la conserver : le guide CBDoux, sans jargon.",
    category: "Bien choisir",
    publishedAt: "2026-11-16",
    readingMinutes: 5,
    intro:
      "Piatella : le mot revient partout dans l'univers de la résine. Derrière ce nom venu de la scène barcelonaise du hash, une texture souple, presque fondante, et une aromatique généreuse. Voici ce qu'il faut savoir avant d'en commander.",
    sections: [
      {
        heading: "D'où vient le nom « Piatella » ?",
        blocks: [
          p("La Piatella (on écrit aussi « piattella ») est née à Barcelone. Des artisans y ont popularisé un affinage à froid : une résine extraite à l'eau glacée, sans solvant, est séchée puis conservée plusieurs semaines au frais, entre 4 et 10 °C environ, à l'abri de l'air. Sans jamais être chauffée, elle passe d'une texture sableuse à une pâte souple, presque crémeuse."),
          p("Le terme a ensuite voyagé. Dans l'univers du CBD, il désigne aujourd'hui des résines travaillées dans cet esprit — texture malléable, aromatique marquée — sans qu'il existe de définition officielle. Les procédés varient d'un fabricant à l'autre : c'est l'analyse de laboratoire, et non le nom, qui renseigne sur ce que contient réellement une résine."),
        ],
      },
      {
        heading: "Comment reconnaître une Piatella",
        blocks: [
          ul([
            "Une robe claire à brun doré, souvent plus pâle qu'une résine pressée classique.",
            "Une texture souple, qui se travaille entre les doigts sans partir en poudre.",
            "Une coupe nette, au cœur finement granuleux ou crémeux.",
            "Un parfum présent dès l'ouverture du sachet.",
          ]),
          p("Notre Piatella présente une robe brun doré et un cœur finement granuleux, à la texture généreuse, presque fondante : nous la montrons en vidéo sur sa fiche produit."),
        ],
      },
      {
        heading: "Piatella, 3X Filtré, Olivette, Beldia : quelles différences ?",
        blocks: [
          table(
            ["Résine", "Ce qui la caractérise", "Texture"],
            [
              ["Piatella", "Résine à la texture travaillée, dans l'esprit des affinages à froid", "Souple, fondante"],
              ["3X Filtré", "Tamisage à sec en trois passes : 190, 120 puis 73 microns", "Fine, homogène"],
              ["Olivette Gold", "Pollen tamisé puis pressé en boules", "Friable et grasse"],
              ["Beldia", "Résine pressée à l'ancienne, de caractère", "Compacte"],
            ],
          ),
          p("Le mot « beldia » vient de l'arabe marocain, où il désigne ce qui est « du pays », traditionnel : on l'emploie pour les résines travaillées à l'ancienne."),
        ],
      },
      {
        heading: "Comment l'utiliser",
        blocks: [
          p("Comme toutes nos résines, la Piatella est destinée à la vaporisation, dans une chambre pour concentrés ou avec un tampon de dégommage. Elle n'est destinée ni à la combustion ni à un usage alimentaire."),
          ul([
            "Prélevez une très petite quantité : notre Piatella est proposée en Force Maxi, la concentration la plus élevée de la gamme.",
            "Montez progressivement en température.",
            "Attendez 15 à 30 minutes avant toute nouvelle prise.",
            "Ne conduisez pas après usage.",
          ]),
        ],
      },
      {
        heading: "Comment la conserver",
        blocks: [
          p("Une résine souple craint la chaleur et l'air. Gardez-la dans son sachet hermétique, à l'abri de la lumière, autour de 20 °C, et refermez bien après chaque utilisation : elle conserve ainsi sa texture et ses arômes plusieurs mois."),
        ],
      },
    ],
    faq: [
      { q: "La Piatella est-elle plus forte qu'une autre résine ?", a: "Le nom ne dit rien de la concentration : ce sont la force et l'analyse qui comptent. Chez CBDoux, la Piatella est proposée en Force Maxi, réservée aux adultes habitués." },
      { q: "La Piatella CBD est-elle légale ?", a: "Oui, comme toute résine de CBD dont le THC reste inférieur à 0,3 %. Nos lots sont analysés." },
      { q: "Piatella ou 3X Filtré : que choisir ?", a: "Le 3X Filtré existe en force Classique, 2 et 3 : c'est le bon choix pour découvrir la résine. La Piatella, en Force Maxi, s'adresse aux adultes habitués qui recherchent une texture souple et une résine très concentrée." },
    ],
    relatedProducts: ["piatella", "beldia", "3x-filtre", "olivette-gold"],
    relatedGuides: ["fleur-ou-resine-cbd", "comprendre-les-forces-cbd", "vaporiser-cbd-guide-pratique"],
    keywords: ["piatella cbd", "piatella c'est quoi", "résine piatella", "piattella", "beldia cbd", "résine cbd premium"],
  },
  {
    slug: "comprendre-les-forces-cbd",
    title: "Forces Classique, 2, 3 et Maxi : comprendre la gamme CBDoux",
    description:
      "Que signifient les forces Classique, 2, 3 et Maxi chez CBDoux ? Fleurs renforcées en CBD, dosage progressif, précautions : choisir la bonne force.",
    category: "Utilisation",
    publishedAt: "2026-11-08",
    readingMinutes: 6,
    intro:
      "Nos fleurs et résines existent en plusieurs forces. Ce n'est pas un gadget marketing : c'est une échelle de concentration en CBD qui vous permet de choisir un ressenti adapté à votre expérience. Explications.",
    sections: [
      {
        heading: "Classique : le CBD naturel",
        blocks: [
          p("La force Classique correspond à la fleur ou à la résine telle qu'elle sort de la culture et de la transformation, sans renforcement. Taux de CBD naturel (18 à 24 % pour nos fleurs, 35 à 40 % pour nos résines). C'est la force que nous recommandons pour découvrir une variété ou pour un usage en journée."),
        ],
      },
      {
        heading: "Force 2 et Force 3 : renforcées en CBD",
        blocks: [
          p("Une fleur « renforcée » (ou « boostée ») est enrichie en CBD après la récolte, à l'aide d'un extrait de chanvre riche en cannabidiol. La Force 2 ajoute environ 10 à 15 % de CBD, la Force 3 environ 25 %. Le taux de THC reste inférieur à 0,3 %."),
          p("Le ressenti est plus présent et plus enveloppant. La Force 3 s'adresse aux consommateurs habitués ; nous déconseillons de conduire après usage, quelle que soit la force."),
        ],
      },
      {
        heading: "Force Maxi : la concentration maximale",
        blocks: [
          p("La force Maxi est réservée à quelques références (Californienne Small Buds, Beldia, Piatella). C'est la concentration la plus élevée de notre gamme. Elle est réservée aux adultes habitués et déconseillée aux débutants."),
          ul([
            "Commencez par une très petite quantité.",
            "Attendez de ressentir les effets avant toute nouvelle prise (15 à 30 minutes en vaporisation).",
            "Ne conduisez pas et n'utilisez pas de machines après usage.",
            "En cas de doute, demandez-nous conseil avant l'achat.",
          ]),
        ],
      },
      {
        heading: "Start low, go slow",
        blocks: [
          quote("La bonne quantité est la plus petite qui vous convient."),
          p("Le ressenti varie selon la sensibilité, le poids, le moment de la journée et le mode de consommation. Une même fleur peut agir différemment d'une personne à l'autre. La règle d'or : commencer bas, augmenter lentement, et ne jamais consommer avant une activité exigeant de la vigilance."),
        ],
      },
      {
        heading: "Quelle force pour quel moment ?",
        blocks: [
          table(
            ["Force", "Pour qui", "Quand"],
            [
              ["Classique", "Découverte, usage régulier léger", "Journée, moments actifs"],
              ["Force 2", "Consommateurs occasionnels à réguliers", "Fin de journée, soirée"],
              ["Force 3", "Consommateurs habitués", "Soirée, sans conduite ensuite"],
              ["Maxi", "Adultes habitués uniquement", "Soirée calme, très petite quantité"],
            ],
          ),
        ],
      },
    ],
    faq: [
      { q: "Une fleur renforcée en CBD est-elle légale ?", a: "Oui, dès lors que le THC reste inférieur à 0,3 % et que le renforcement est réalisé avec du CBD (et non avec un cannabinoïde interdit). Nos lots sont analysés." },
      { q: "La force Maxi est-elle adaptée à une première commande ?", a: "Non. Pour découvrir, choisissez la force Classique. La force Maxi est réservée aux adultes habitués." },
      { q: "Peut-on mélanger les forces ?", a: "Rien ne l'interdit, mais commencez toujours par la force la plus douce et attendez les effets avant d'aller plus loin." },
    ],
    relatedProducts: ["super-lemon-haze-hydro-usa", "snow-white", "californienne-indoor-small-buds", "beldia"],
    relatedGuides: ["cbd-et-conduite", "comment-choisir-fleur-cbd", "vaporiser-cbd-guide-pratique"],
    keywords: ["fleur cbd renforcée", "fleur cbd boostée", "force cbd", "cbd puissant", "dosage cbd fleur", "cbd débutant"],
  },
  {
    slug: "cbd-et-conduite",
    title: "CBD et test salivaire : faut-il éviter de conduire ?",
    description:
      "Peut-on conduire après avoir consommé du CBD ? Test salivaire, somnolence, délais : ce que dit la réglementation et nos recommandations.",
    category: "Réglementation",
    publishedAt: "2026-11-08",
    readingMinutes: 5,
    intro:
      "Le CBD est légal, mais conduire après en avoir consommé expose à deux risques distincts : une vigilance diminuée et un test salivaire positif au THC. Voici pourquoi nous déconseillons formellement de prendre le volant après usage.",
    sections: [
      {
        heading: "Le test salivaire ne fait pas la différence",
        blocks: [
          p("Les tests salivaires routiers recherchent le THC. Un produit CBD légal contient jusqu'à 0,3 % de THC : des traces suffisantes, selon la quantité consommée et la sensibilité du test, pour provoquer un résultat positif. En France, la conduite après usage de stupéfiants est sanctionnée dès lors que du THC est détecté, sans seuil minimal."),
          p("Même si vous êtes certain de n'avoir consommé que du CBD légal, la procédure (immobilisation, prise de sang de confirmation, éventuelles poursuites) est longue et incertaine. Le plus simple est de ne pas conduire."),
        ],
      },
      {
        heading: "Une vigilance qui peut baisser",
        blocks: [
          p("Le CBD peut entraîner une somnolence, en particulier aux forces élevées, en soirée ou en association avec la fatigue. Une baisse de vigilance au volant ou sur une machine est dangereuse, pour vous comme pour les autres."),
        ],
      },
      {
        heading: "Nos recommandations",
        blocks: [
          ul([
            "Ne conduisez pas et n'utilisez pas de machines après avoir consommé, même une petite quantité.",
            "Prévoyez votre consommation le soir, à domicile, sans trajet prévu ensuite.",
            "Les forces 3 et Maxi exigent encore plus de prudence : attendez le lendemain pour conduire.",
            "Conservez vos produits dans leur emballage d'origine avec la facture en cas de contrôle.",
          ]),
        ],
      },
      {
        heading: "Combien de temps attendre ?",
        blocks: [
          p("Il n'existe pas de délai officiel garanti. Le THC résiduel peut rester détectable dans la salive plusieurs heures après une inhalation. Par prudence, nous recommandons d'attendre au minimum une nuit complète avant de reprendre le volant."),
        ],
      },
    ],
    faq: [
      { q: "Le CBD est-il considéré comme un stupéfiant au volant ?", a: "Le CBD non, mais le THC qu'il peut contenir à l'état de traces oui. Un test salivaire positif au THC entraîne les mêmes conséquences qu'une consommation de cannabis." },
      { q: "Puis-je conduire après une huile CBD cutanée ?", a: "Nos huiles sont à usage cutané ; elles ne sont pas conçues pour être absorbées comme un produit inhalé. Par principe de prudence, restez attentif à votre état avant toute conduite." },
      { q: "Que faire en cas de contrôle positif ?", a: "Restez calme, présentez votre facture et l'emballage du produit, et demandez la prise de sang de confirmation. Un avocat pourra vous accompagner si des poursuites sont engagées." },
    ],
    relatedProducts: ["snow-white", "3x-filtre"],
    relatedGuides: ["cbd-legal-france-2026", "comprendre-les-forces-cbd"],
    keywords: ["cbd et conduite", "cbd test salivaire", "conduire après cbd", "cbd volant", "cbd contrôle routier"],
  },
  {
    slug: "conserver-fleurs-resines-cbd",
    title: "Conserver ses fleurs et résines de CBD : les bons gestes",
    description:
      "Lumière, humidité, température, sachets hermétiques : comment conserver fleurs et résines de CBD pour préserver arômes et fraîcheur pendant des mois.",
    category: "Utilisation",
    publishedAt: "2026-11-08",
    readingMinutes: 5,
    intro:
      "Une fleur mal conservée perd ses arômes en quelques semaines. Bien stockée, elle garde ses qualités plusieurs mois. Voici nos règles — les mêmes que celles appliquées dans nos distributeurs automatiques.",
    sections: [
      {
        heading: "Les quatre ennemis du CBD",
        blocks: [
          ul([
            "La lumière : les UV dégradent les cannabinoïdes et les terpènes. Préférez un contenant opaque, rangé dans un placard.",
            "L'air : l'oxygène oxyde les terpènes. Un sachet hermétique ou un bocal bien fermé limite les échanges.",
            "La chaleur : au-delà de 25 °C, les terpènes s'évaporent plus vite. Visez une température stable autour de 20 °C.",
            "L'humidité : trop humide, la fleur risque de moisir ; trop sèche, elle devient friable et perd ses arômes.",
          ]),
        ],
      },
      {
        heading: "Les sachets biphase : notre choix",
        blocks: [
          p("Nos produits sont conditionnés dans des sachets hermétiques équipés d'un régulateur d'humidité biphase (bidirectionnel) : il absorbe l'excès d'humidité ou en restitue si l'air est trop sec, pour maintenir un taux stable. C'est également ce que nous utilisons dans nos distributeurs 24/7, régulés à 20 °C."),
          p("Conservez simplement votre produit dans ce sachet d'origine, refermé soigneusement après chaque utilisation."),
        ],
      },
      {
        heading: "Ce qu'il ne faut pas faire",
        blocks: [
          ul([
            "Le réfrigérateur ou le congélateur : la condensation et le froid cassent les trichomes et altèrent la texture.",
            "Le sachet ouvert sur une étagère : perte d'arômes en quelques jours.",
            "Le plastique souple non hermétique : odeurs et échanges d'air.",
            "Une boîte au-dessus d'un radiateur ou dans une voiture au soleil.",
          ]),
        ],
      },
      {
        heading: "Combien de temps ?",
        blocks: [
          p("Dans de bonnes conditions, une fleur conserve l'essentiel de ses qualités 6 à 12 mois. La résine, plus stable, se garde encore plus longtemps. Signes d'une mauvaise conservation : odeur de foin ou de moisi, fleur qui tombe en poussière, couleur ternie."),
          p("Tenez toujours vos produits hors de portée des enfants et des animaux."),
        ],
      },
    ],
    faq: [
      { q: "Peut-on conserver une fleur de CBD dans un bocal en verre ?", a: "Oui, un bocal hermétique opaque ou rangé à l'abri de la lumière est une très bonne solution, idéalement avec un régulateur d'humidité." },
      { q: "Les résines se conservent-elles mieux que les fleurs ?", a: "Oui, leur structure compacte les rend moins sensibles à l'air et au séchage. Le sachet d'origine fermé reste la meilleure option." },
      { q: "Pourquoi vos distributeurs sont-ils régulés à 20 °C ?", a: "Parce qu'une température stable autour de 20 °C préserve les terpènes et évite la condensation, même en plein hiver dans le Haut-Doubs." },
    ],
    relatedProducts: ["amnesia-haze-hydro", "olivette-gold"],
    relatedGuides: ["vaporiser-cbd-guide-pratique", "cbd-haut-doubs-distributeurs-24h"],
    keywords: ["conserver fleur cbd", "conservation cbd", "sachet cbd", "durée conservation cbd", "humidité fleur cbd"],
  },
  {
    slug: "vaporiser-cbd-guide-pratique",
    title: "Vaporiser son CBD : températures et bons gestes",
    description:
      "Vaporisation à basse température, réglages, matériel, pourquoi éviter la combustion : le guide pratique pour vos fleurs et résines de CBD.",
    category: "Utilisation",
    publishedAt: "2026-11-08",
    readingMinutes: 5,
    intro:
      "Nos fleurs et résines sont destinées à la vaporisation — pas à la combustion, ni à un usage alimentaire. La méthode préserve les arômes et se maîtrise facilement. Mode d'emploi.",
    sections: [
      {
        heading: "Pourquoi éviter la combustion",
        blocks: [
          p("Brûler une fleur détruit une grande partie des terpènes et produit des substances de combustion indésirables. La vaporisation chauffe la matière sans la brûler : la vapeur libère les arômes, sans fumée. C'est la méthode que nous recommandons."),
        ],
      },
      {
        heading: "La vaporisation : températures indicatives",
        blocks: [
          table(
            ["Plage", "Rendu"],
            [
              ["160 – 180 °C", "Vapeur légère, arômes très nets (citron, fruits), ressenti doux"],
              ["180 – 200 °C", "Équilibre entre arômes et densité de vapeur"],
              ["200 – 220 °C", "Vapeur dense, notes plus chaudes et terreuses"],
            ],
          ),
          ul([
            "Effritez finement la fleur (grinder) pour une chauffe homogène.",
            "Remplissez la chambre sans tasser.",
            "Commencez bas et montez progressivement au fil de la session.",
            "Pour la résine, utilisez une chambre pour concentrés ou un tampon de dégommage ; émiettez-la et montez un peu en température.",
          ]),
        ],
      },
      {
        heading: "Bien choisir son matériel",
        blocks: [
          ul([
            "Un vaporisateur portable à herbes sèches avec réglage de température : le plus simple pour débuter.",
            "Une chambre ou une capsule pour concentrés si vous vaporisez de la résine.",
            "Un grinder pour un effritage régulier, une petite brosse pour vider la chambre après chaque session.",
            "Un nettoyage régulier : une chambre propre restitue mieux les arômes.",
          ]),
        ],
      },
      {
        heading: "Et l'infusion, la cuisine ?",
        blocks: [
          p("Depuis le 15 mai 2026, la France applique la réglementation européenne sur les nouveaux aliments : les denrées contenant du CBD — tisanes de fleurs, huiles à avaler, préparations culinaires — ne peuvent plus être vendues. Nous ne proposons donc pas nos fleurs, notre trim ni nos résines pour l'infusion ou la cuisine : ils sont destinés à la vaporisation."),
          p("Notre guide sur la réglementation du CBD en France fait le point complet sur ce changement."),
        ],
      },
      {
        heading: "Les précautions de base",
        blocks: [
          ul([
            "Réservé aux adultes ; déconseillé aux femmes enceintes ou allaitantes.",
            "Petites quantités pour commencer, surtout en Force 3 ou Maxi.",
            "Pas de conduite ni de machines après usage.",
            "Demandez l'avis d'un professionnel de santé si vous suivez un traitement.",
          ]),
        ],
      },
    ],
    faq: [
      { q: "Quel vaporisateur choisir pour débuter ?", a: "Un vaporisateur portable à herbes sèches avec réglage de température par paliers suffit largement. Vérifiez qu'il accepte aussi les concentrés si vous souhaitez vaporiser de la résine." },
      { q: "Peut-on infuser ou cuisiner vos fleurs et résines ?", a: "Nous ne les proposons pas pour cet usage. Depuis le 15 mai 2026, les denrées alimentaires contenant du CBD ne peuvent plus être vendues en France : nos fleurs et résines sont destinées à la vaporisation." },
      { q: "Combien de temps dure une session de vaporisation ?", a: "Quelques minutes suffisent. Les effets apparaissent rapidement et durent généralement 1 à 3 heures." },
    ],
    relatedProducts: ["amnesia-haze-hydro", "trim-premium-indoor", "3x-filtre"],
    relatedGuides: ["comprendre-les-forces-cbd", "conserver-fleurs-resines-cbd", "cbd-legal-france-2026"],
    keywords: ["vaporiser cbd", "température vaporisation cbd", "vaporisateur cbd", "vaporiser résine cbd", "cbd sans combustion"],
  },
  {
    slug: "lire-analyse-laboratoire-coa",
    title: "Lire une analyse de laboratoire CBD (COA) : mode d'emploi",
    description:
      "CBD total, THC total, méthode HPLC, numéro de lot, laboratoire indépendant : apprenez à lire un certificat d'analyse (COA) pour acheter votre CBD en confiance.",
    category: "Qualité & analyses",
    publishedAt: "2026-11-08",
    readingMinutes: 6,
    intro:
      "Le certificat d'analyse (COA, Certificate of Analysis) est la carte d'identité d'un lot de CBD. Il prouve la teneur en cannabinoïdes et la conformité au seuil de THC. Voici comment le lire ligne par ligne.",
    sections: [
      {
        heading: "Qu'est-ce qu'un COA ?",
        blocks: [
          p("Un COA est un rapport émis par un laboratoire après analyse d'un échantillon précis. Il indique la méthode utilisée, la date, le nom du produit et les résultats pour chaque cannabinoïde recherché. Chez CBDoux, nous publions ces rapports sur la page Analyses laboratoires."),
        ],
      },
      {
        heading: "Les lignes à regarder en priorité",
        blocks: [
          ul([
            "THC total (Δ9-THC + THCA converti) : doit être inférieur à 0,3 %. C'est le critère légal.",
            "CBD total (CBD + CBDA converti) : la concentration réelle en cannabidiol du lot.",
            "La date et la référence de l'échantillon : un COA doit correspondre au lot vendu, pas à un lot d'il y a deux ans.",
            "Le laboratoire : indépendant du vendeur, identifiable, avec ses coordonnées.",
            "La méthode : HPLC (chromatographie liquide) ou GC (chromatographie gazeuse) — voir ci-dessous.",
          ]),
        ],
      },
      {
        heading: "HPLC ou GC : quelle différence ?",
        blocks: [
          p("La chromatographie liquide haute performance (HPLC) analyse l'échantillon à froid : elle distingue les formes acides (THCA, CBDA) des formes neutres (THC, CBD). La chromatographie gazeuse (GC-MS, GC-FID) chauffe l'échantillon, ce qui convertit les acides en formes neutres. Les deux sont fiables ; l'important est que le « total » soit calculé correctement."),
        ],
      },
      {
        heading: "Exemple : nos analyses",
        blocks: [
          p("Notre Critical Berry (analyse du 9 février 2026, laboratoire CBD-THC Lab, méthode HPLC) affiche 12,43 % de CBD total pour 0,22 % de THC total. Notre résine 3X Filtré : 9,56 % de CBD pour 0,24 % de THC. L'extrait utilisé pour le renforcement de nos forces 2 et 3 (distillat) affiche 46,69 % de CBD et un THC non détecté (GC-MS)."),
          p("Le taux de CBD mesuré sur la fleur brute peut être inférieur au taux affiché sur certains sites concurrents : nous préférons publier des valeurs réelles et expliquer les forces de renforcement plutôt que d'afficher des pourcentages invérifiables."),
        ],
      },
      {
        heading: "Les signaux d'alerte",
        blocks: [
          ul([
            "Pas de COA disponible, ou un COA « sur demande » jamais envoyé.",
            "Un rapport sans date, sans laboratoire identifiable ou sans numéro de lot.",
            "Un THC total proche ou supérieur à 0,3 %.",
            "Des taux de CBD extravagants (« 60 % de CBD » sur une fleur brute).",
          ]),
        ],
      },
    ],
    faq: [
      { q: "Pourquoi le taux de CBD affiché sur l'analyse est-il différent de celui de la fiche produit ?", a: "La fiche produit indique la force (Classique = taux naturel, Force 2/3 = renforcée). L'analyse porte sur un échantillon précis d'un lot ; des variations entre lots sont normales." },
      { q: "Puis-je obtenir l'analyse d'un lot précis ?", a: "Oui, demandez-la via le formulaire de contact ou sur WhatsApp en indiquant le produit et la date d'achat." },
      { q: "Qu'est-ce que le THC « non détecté » (ND) ?", a: "Le laboratoire n'a pas trouvé de THC au-dessus de son seuil de détection. C'est le cas de notre distillat de renforcement." },
    ],
    relatedProducts: ["critical-berry-indoor-usa", "3x-filtre", "snow-white"],
    relatedGuides: ["cbd-legal-france-2026", "comment-choisir-fleur-cbd"],
    keywords: ["analyse laboratoire cbd", "coa cbd", "certificat analyse cbd", "thc total", "hplc cbd", "cbd testé laboratoire"],
  },
  {
    slug: "livraison-cbd-discrete-france",
    title: "Livraison de CBD en France : discrète, rapide, suivie",
    description:
      "Comment se passe une commande CBDoux : colis neutre, sachets hermétiques, Lettre suivie, Colissimo 48 h ou Chronopost 24 h, suivi en temps réel.",
    category: "Livraison",
    publishedAt: "2026-11-08",
    readingMinutes: 5,
    intro:
      "Commander du CBD en ligne doit être aussi simple et discret que n'importe quel achat. Voici, étape par étape, ce qui se passe entre votre clic et la réception de votre colis.",
    sections: [
      {
        heading: "1. La commande et le paiement",
        blocks: [
          p("Vous choisissez vos produits, leur force et leur format, puis vous indiquez vos coordonnées et votre mode de livraison. En un clic, votre récapitulatif nous est envoyé sur WhatsApp. Nous confirmons la disponibilité, puis nous vous adressons votre facture avec un lien de paiement sécurisé par carte bancaire (ou un RIB). Aucune donnée bancaire n'est saisie sur le site et le libellé bancaire est neutre."),
        ],
      },
      {
        heading: "2. La préparation",
        blocks: [
          p("Chaque produit est pesé et conditionné dans un sachet hermétique inodore avec régulateur d'humidité, puis glissé dans une enveloppe matelassée ou un colis neutre : aucune mention de CBD ni de CBDoux à l'extérieur. Les commandes passées avant 13 h (jours ouvrés) partent le jour même."),
        ],
      },
      {
        heading: "3. L'expédition : trois vitesses",
        blocks: [
          table(
            ["Mode", "Délai indicatif", "Tarif"],
            [
              ["Lettre suivie La Poste (≤ 50 g)", "2 à 4 jours ouvrés", "3,90 € — offert dès 60 €"],
              ["Colissimo domicile", "48 h ouvrées", "5,90 € — offert dès 60 €"],
              ["Chronopost Express", "Lendemain avant 13 h", "12,90 €"],
            ],
          ),
          p("Dès le départ du colis, vous recevez sur WhatsApp (ou par email) le numéro de suivi et le lien du transporteur."),
        ],
      },
      {
        heading: "4. Dans le Haut-Doubs : retrait et livraison locale",
        blocks: [
          p("Si vous habitez autour de Damprichard, du Russey, de Charquemont ou de Maîche, vous pouvez retirer gratuitement votre commande sur rendez-vous (paiement par lien sécurisé ou sur place), ou choisir la livraison à domicile par nos soins (10 €, offerte dès 100 €) dans un rayon de 30 km autour du Russey et 10 km autour de Damprichard. Et nos distributeurs automatiques 24/7 restent accessibles à toute heure."),
        ],
      },
      {
        heading: "En cas de problème",
        blocks: [
          p("Colis en retard, perdu ou abîmé ? Contactez-nous sous 48 h avec votre numéro de commande (et des photos en cas de casse). Nous ouvrons une réclamation auprès du transporteur et vous renvoyons votre commande ou vous remboursons. Nos conditions de retour et de rétractation sont détaillées dans nos CGV."),
        ],
      },
    ],
    faq: [
      { q: "Le colis est-il vraiment discret ?", a: "Oui : sachets hermétiques inodores, colis ou enveloppe neutre sans mention du contenu, libellé bancaire neutre." },
      { q: "Livrez-vous le samedi ?", a: "Colissimo livre du lundi au samedi. Chronopost Express livre du mardi au samedi pour les commandes passées la veille avant 13 h." },
      { q: "Expédiez-vous hors de France ?", a: "La boutique en ligne expédie en France métropolitaine uniquement pour le moment." },
    ],
    relatedProducts: ["super-lemon-haze-hydro-usa", "huile-full-spectrum-20"],
    relatedGuides: ["cbd-haut-doubs-distributeurs-24h", "cbd-legal-france-2026"],
    keywords: ["livraison cbd", "cbd livraison discrète", "cbd colis neutre", "cbd chronopost", "cbd livraison rapide france", "commander cbd en ligne"],
  },
  {
    slug: "cbd-haut-doubs-distributeurs-24h",
    title: "CBD dans le Haut-Doubs : distributeurs 24h/24 et retrait",
    description:
      "Charquemont, Le Russey, Damprichard, Maîche, Morteau : où trouver du CBD dans le Haut-Doubs ? Distributeurs 24 h/24, retrait gratuit et livraison locale CBDoux.",
    category: "Haut-Doubs",
    publishedAt: "2026-11-08",
    readingMinutes: 5,
    intro:
      "CBDoux est né dans le Haut-Doubs avec une idée simple : rendre un CBD premium accessible à toute heure, sans contrainte et en toute discrétion. Voici où nous trouver entre Charquemont, Le Russey et Damprichard — et comment nous livrons le reste de la France.",
    sections: [
      {
        heading: "Une cabine téléphonique devenue distributeur",
        blocks: [
          p("Notre premier distributeur automatique est installé à Charquemont, à la Station Lavage Central (rue de la Vierge), dans une ancienne cabine téléphonique entièrement rénovée. Un objet du quotidien transformé en point d'accès discret, ouvert 24 h/24 et 7 j/7, avec paiement par carte bancaire."),
          p("Un second distributeur est installé au Russey, à l'Hôtel du Commerce (15 place Dominique Parrenin), en face de la mairie. Même principe : accès simple, discret, à toute heure."),
          p("Sur les deux machines, chaque vente est validée en direct : vous vous présentez devant la caméra, un membre de l'équipe vous répond par l'interphone, vérifie votre majorité et vous communique le code d'achat. De jour comme de nuit."),
        ],
      },
      {
        heading: "Pourquoi nos distributeurs conservent mieux",
        blocks: [
          ul([
            "Température régulée à 20 °C par thermostat, été comme hiver.",
            "Sachets hermétiques avec régulateur d'humidité biphase.",
            "Réassort régulier avec les mêmes lots analysés que la boutique en ligne.",
          ]),
        ],
      },
      {
        heading: "Retrait gratuit et livraison locale",
        blocks: [
          p("Vous préférez commander en ligne et récupérer votre commande en main propre ? Choisissez le retrait gratuit à Damprichard ou au Russey : nous convenons d'un rendez-vous par WhatsApp, généralement dès le lendemain. Vous pouvez régler par lien de paiement sécurisé ou sur place (espèces ou carte)."),
          p("Nous livrons aussi à domicile par nos soins dans un rayon de 30 km autour du Russey et 10 km autour de Damprichard (10 €, offert dès 100 €) : Maîche, Charquemont, Frambouhans, Les Fontenelles, Bonnétage, Villers-le-Lac, Morteau, Orchamps-Vennes…"),
        ],
      },
      {
        heading: "Et au-delà : Pontarlier, Besançon, toute la France",
        blocks: [
          p("Pour Pontarlier, Besançon, Montbéliard, Belfort et partout ailleurs en France métropolitaine, nous expédions en Lettre suivie, Colissimo 48 h (offert dès 60 €) ou Chronopost Express 24 h, dans un colis neutre. Le Haut-Doubs reste notre maison, mais la boutique en ligne est ouverte à tous les adultes de France."),
        ],
      },
      {
        heading: "SMART VEND, la structure derrière CBDoux",
        blocks: [
          p("CBDoux est le nom commercial de la SARL SMART VEND, spécialisée dans la distribution automatique de produits de bien-être. Fiabilité des machines, qualité des produits, conformité réglementaire : un nouveau standard de distribution, plus propre et plus intelligent."),
        ],
      },
    ],
    faq: [
      { q: "Les distributeurs acceptent-ils les espèces ?", a: "Non, uniquement la carte bancaire (sans contact ou code), 24 h/24." },
      { q: "Comment retirer une commande à Damprichard ?", a: "Choisissez « Retrait gratuit » lors de la commande ; nous vous contactons sur WhatsApp pour fixer un rendez-vous, généralement dès le lendemain." },
      { q: "Livrez-vous à Morteau ou Maîche ?", a: "Oui, Morteau, Maîche, Villers-le-Lac et les communes alentour sont dans notre zone de livraison à domicile (10 €, offerte dès 100 €)." },
    ],
    relatedProducts: ["super-lemon-haze-hydro-usa", "3x-filtre", "amnesia-haze-hydro"],
    relatedGuides: ["livraison-cbd-discrete-france", "conserver-fleurs-resines-cbd"],
    keywords: ["cbd haut-doubs", "cbd charquemont", "cbd le russey", "cbd damprichard", "cbd maîche", "distributeur cbd 24h", "cbd morteau"],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

export const guideCategories = Array.from(new Set(guides.map((g) => g.category)));
