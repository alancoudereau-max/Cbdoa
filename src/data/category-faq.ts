import type { Category } from "@/data/products";
import type { FaqItem } from "@/components/ui/Faq";

export const categoryFaq: Record<Category, FaqItem[]> = {
  fleurs: [
    {
      q: "Quelle différence entre une fleur indoor, hydroponie et greenhouse ?",
      a: "L'indoor est cultivé en intérieur sous lumière artificielle avec un contrôle total du climat : têtes denses et très aromatiques. L'hydroponie est une culture indoor hors-sol, sur substrat inerte et solution nutritive : croissance rapide, buds volumineux et propres. Le greenhouse (serre) profite du soleil avec une protection climatique : bon rapport qualité/prix. Les trois sont analysés et conformes (THC < 0,3 %).",
    },
    {
      q: "Que signifie « fleur renforcée en CBD » (Force 2, Force 3) ?",
      a: "La fleur est enrichie en CBD après récolte, ce qui augmente sa concentration totale en cannabidiol (environ +10 à +15 % en Force 2, +25 % en Force 3). Le taux de THC reste inférieur à 0,3 %. Le ressenti étant plus présent, ces forces s'adressent aux consommateurs habitués ; commencez par une petite quantité.",
    },
    {
      q: "Comment utiliser une fleur de CBD ?",
      a: "Nos fleurs sont destinées à la vaporisation (vaporisateur à herbe sèche, 160 à 220 °C selon le rendu recherché) ou à l'infusion (10 à 15 minutes dans une boisson chaude avec un corps gras : lait entier, huile de coco…). Elles ne sont pas destinées à la combustion.",
    },
    {
      q: "Combien de temps se conserve une fleur de CBD ?",
      a: "Dans son sachet hermétique d'origine, à l'abri de la lumière, de la chaleur et de l'humidité (idéalement autour de 20 °C), une fleur conserve ses arômes plusieurs mois. Évitez le réfrigérateur et les sachets ouverts à l'air libre.",
    },
  ],
  resines: [
    {
      q: "Qu'est-ce qu'une résine de CBD ?",
      a: "La résine (ou hash) est obtenue en séparant les trichomes — les petites glandes résineuses riches en cannabinoïdes et terpènes — du reste de la plante, puis en les pressant. Plus la filtration est fine (notre 3X Filtré est tamisé à 190, 120 puis 73 µ), plus la résine est pure et concentrée.",
    },
    {
      q: "Quelle différence entre pollen, hash et résine pressée ?",
      a: "Le « pollen » désigne un tamisage à sec de trichomes, souvent plus friable et doré (comme notre Olivette Gold). Le hash ou résine pressée est plus compact et foncé. Les deux sont issus du même principe ; seules la finesse de filtration, la pression et la génétique changent la texture et les arômes.",
    },
    {
      q: "Comment consommer une résine de CBD ?",
      a: "En vaporisation (vaporisateur compatible concentrés ou chambre dédiée, souvent avec un tampon de dégommage) ou en infusion après l'avoir émiettée dans une boisson chaude contenant un corps gras. La résine n'est pas destinée à la combustion.",
    },
    {
      q: "Que sont les résines « Force Maxi » (Beldia, Piatella) ?",
      a: "Ce sont les références les plus concentrées de notre gamme, réservées aux adultes habitués et déconseillées aux débutants. Utilisez une très petite quantité, attendez les effets avant toute nouvelle prise et ne conduisez pas après usage. THC toujours inférieur à 0,3 %.",
    },
  ],
  huiles: [
    {
      q: "Peut-on avaler vos huiles CBD ?",
      a: "Non. Depuis le 15 mai 2026, la France interdit la vente de denrées alimentaires contenant du CBD (réglementation « novel food »). Nos huiles Full Spectrum sont des produits à usage cutané exclusivement : massage ciblé, application sur la peau.",
    },
    {
      q: "Que signifie Full Spectrum ?",
      a: "Une huile Full Spectrum (spectre complet) conserve l'ensemble des cannabinoïdes et terpènes naturellement présents dans le chanvre, contrairement à un isolat qui ne contient que du CBD. On parle d'« effet d'entourage » pour décrire l'action combinée de ces composés.",
    },
    {
      q: "10 % ou 20 % : comment choisir ?",
      a: "La 10 % est la formule d'entrée, équilibrée, pour un usage quotidien. La 20 % est deux fois plus concentrée : elle s'adresse à celles et ceux qui recherchent une formule renforcée. Dans les deux cas, quelques gouttes suffisent par application.",
    },
    {
      q: "Comment conserver une huile CBD ?",
      a: "Flacon bien fermé, à l'abri de la lumière directe et de la chaleur, à température ambiante. Agitez légèrement avant usage. Tenir hors de portée des enfants.",
    },
  ],
  vape: [
    {
      q: "La vape CBD est-elle légale en France ?",
      a: "Oui. Les e-liquides et pods contenant du CBD sont autorisés dès lors que le THC est inférieur à 0,3 % et que les produits respectent la réglementation applicable aux produits de vapotage. Ils sont réservés aux adultes.",
    },
    {
      q: "Quelle différence entre un pod rechargeable et une puff jetable ?",
      a: "Le pod rechargeable est un appareil réutilisable dans lequel on insère ou remplit une recharge : moins de déchets, moins cher à l'usage. Les puffs jetables à usage unique sont interdites à la vente en France depuis 2025.",
    },
    {
      q: "Comment choisir sa saveur de recharge ?",
      a: "Nos recharges existent en profils fruité, menthe ou terreux (goût chanvre naturel). Indiquez la saveur souhaitée dans les notes de votre commande, nous nous adaptons.",
    },
  ],
};
