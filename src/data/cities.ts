/** Pages locales (SEO) — une page par ville, contenu unique. */
export type CityMode = "distributeur" | "retrait" | "livraison-locale" | "expedition";

export type City = {
  slug: string;
  name: string;
  postalCode: string;
  department: string;
  /** Comment un habitant peut se procurer du CBDoux */
  modes: CityMode[];
  title: string;
  description: string;
  intro: string;
  body: string[];
  faq: { q: string; a: string }[];
  nearby: string[]; // slugs
};

export const cities: City[] = [
  {
    slug: "charquemont",
    name: "Charquemont",
    postalCode: "25140",
    department: "Doubs",
    modes: ["distributeur", "livraison-locale"],
    title: "CBD à Charquemont : distributeur 24h/24 et livraison",
    description: "Du CBD premium à Charquemont (25140) : distributeur automatique CBDoux ouvert 24 h/24 à la Station Lavage Central, livraison à domicile et boutique en ligne. THC < 0,3 %.",
    intro: "Charquemont est le berceau de CBDoux : c'est ici, dans une ancienne cabine téléphonique rénovée installée à la Station Lavage Central, qu'a ouvert notre premier distributeur automatique de CBD, accessible jour et nuit.",
    body: [
      "Le distributeur de Charquemont propose nos références phares (fleurs, résines, huiles cutanées) conservées à 20 °C dans des sachets hermétiques biphase, avec paiement par carte bancaire. Il fonctionne 24 h/24, 7 j/7, même les jours fériés — pratique après une journée de travail en Suisse voisine ou un week-end de randonnée sur le plateau.",
      "Vous préférez choisir tranquillement parmi les 18 références du catalogue ? Commandez en ligne et faites-vous livrer à domicile à Charquemont par nos soins (10 €, offert dès 100 €), ou retirez gratuitement votre commande à Damprichard ou au Russey, à quelques minutes.",
    ],
    faq: [
      { q: "Où se trouve exactement le distributeur de Charquemont ?", a: "À la Station Lavage Central, dans l'ancienne cabine téléphonique rénovée aux couleurs de CBDoux. Un lien d'itinéraire est disponible sur notre page Distributeurs." },
      { q: "Puis-je être livré à Charquemont le jour même ?", a: "Nous livrons à domicile sous 24 à 48 h sur un créneau convenu par WhatsApp. Pour un besoin immédiat, le distributeur est ouvert 24 h/24." },
    ],
    nearby: ["damprichard", "le-russey", "maiche"],
  },
  {
    slug: "le-russey",
    name: "Le Russey",
    postalCode: "25210",
    department: "Doubs",
    modes: ["distributeur", "retrait", "livraison-locale"],
    title: "CBD au Russey : distributeur face à la mairie, retrait gratuit",
    description: "CBD premium au Russey (25210) : distributeur automatique CBDoux 24 h/24 à l'Hôtel du Commerce (face à la mairie), retrait gratuit et livraison à domicile dans un rayon de 30 km.",
    intro: "Au Russey, CBDoux est au cœur du village : notre distributeur automatique est installé à l'Hôtel du Commerce, en face de la mairie, et le bourg est aussi l'un de nos deux points de retrait gratuit.",
    body: [
      "Le distributeur du Russey fonctionne 24 h/24 et 7 j/7, avec paiement par carte. Les produits y sont conservés à 20 °C en sachets hermétiques, exactement comme dans notre boutique en ligne. Idéal pour les habitants du plateau — Le Bélieu, Narbief, Bonnétage, Les Fontenelles, Noël-Cerneux — comme pour les frontaliers de passage.",
      "Le Russey est également le centre de notre zone de livraison à domicile : dans un rayon de 30 km, nous livrons nous-mêmes votre commande (10 €, offerte dès 100 €) sur un créneau convenu par WhatsApp. Et pour un retrait gratuit, choisissez simplement « Retrait — Le Russey » à la commande.",
    ],
    faq: [
      { q: "Comment retirer ma commande au Russey ?", a: "Choisissez « Retrait gratuit » puis « Le Russey » lors de la commande. Nous vous contactons sur WhatsApp pour fixer un rendez-vous, généralement dès le lendemain. Paiement en ligne ou sur place." },
      { q: "Quelles communes sont dans la zone de livraison autour du Russey ?", a: "Environ 30 km : Maîche, Charquemont, Morteau, Villers-le-Lac, Orchamps-Vennes, Pierrefontaine-les-Varans, Bonnétage, Les Fontenelles… Le code postal saisi à la commande vous indique si la livraison locale est disponible." },
    ],
    nearby: ["charquemont", "morteau", "maiche"],
  },
  {
    slug: "damprichard",
    name: "Damprichard",
    postalCode: "25450",
    department: "Doubs",
    modes: ["retrait", "livraison-locale"],
    title: "CBD à Damprichard : retrait gratuit et livraison à domicile",
    description: "Achetez votre CBD à Damprichard (25450) : retrait gratuit sur rendez-vous, livraison à domicile dans un rayon de 10 km, distributeur 24/7 à Charquemont. CBDoux, CBD premium du Haut-Doubs.",
    intro: "Damprichard est notre point de retrait historique : commandez en ligne, puis récupérez gratuitement vos produits sur rendez-vous, en toute discrétion.",
    body: [
      "Le retrait à Damprichard est gratuit et sans minimum d'achat. Après votre commande, nous convenons d'un créneau par WhatsApp — souvent dès le lendemain. Vous pouvez payer en ligne par carte, ou sur place en espèces ou par carte au moment du retrait. Pensez à vous munir d'une pièce d'identité : la vente est réservée aux adultes.",
      "Dans un rayon de 10 km autour de Damprichard (Trévillers, Indevillers, Charmauvillers, Fessevillers, Goumois…), nous livrons également à domicile pour 10 €, offert dès 100 € d'achat. Et le distributeur 24/7 de Charquemont est à moins de dix minutes.",
    ],
    faq: [
      { q: "Faut-il un minimum d'achat pour le retrait à Damprichard ?", a: "Non. Le retrait est gratuit dès le premier gramme." },
      { q: "Peut-on payer en espèces au retrait ?", a: "Oui, en choisissant « Payer sur place au retrait » lors de la commande." },
    ],
    nearby: ["charquemont", "maiche", "saint-hippolyte"],
  },
  {
    slug: "maiche",
    name: "Maîche",
    postalCode: "25120",
    department: "Doubs",
    modes: ["livraison-locale", "distributeur"],
    title: "CBD à Maîche : livraison à domicile et distributeurs proches",
    description: "CBD premium à Maîche (25120) : livraison à domicile par CBDoux (offerte dès 100 €), distributeurs 24h/24 à Charquemont et au Russey, retrait gratuit à Damprichard. THC < 0,3 %, analyses labo.",
    intro: "Maîche est au centre de notre zone de livraison locale : commandez avant 13 h et recevez vos produits chez vous sous 24 à 48 h, remis en main propre sur un créneau convenu.",
    body: [
      "Pas de boutique CBD à Maîche ? Pas besoin : CBDoux livre directement à domicile dans tout le secteur (Maîche, Les Écorces, Frambouhans, Charmauvillers, Thiébouhans, Mancenans-Lizerne…) pour 10 €, offert dès 100 € d'achat. Vos produits arrivent dans leurs sachets hermétiques d'origine, remis en main propre à un adulte.",
      "Pour un achat immédiat, deux distributeurs automatiques sont à moins de dix minutes : Charquemont (Station Lavage Central) et Le Russey (face à la mairie), ouverts 24 h/24. Et pour un conseil personnalisé sur les forces ou les variétés, nous répondons sur WhatsApp 7 j/7.",
    ],
    faq: [
      { q: "Quel délai de livraison à Maîche ?", a: "24 à 48 h après la commande, sur un créneau convenu par WhatsApp. Pour un besoin immédiat, les distributeurs de Charquemont et du Russey sont ouverts 24 h/24." },
      { q: "Le livreur peut-il déposer le colis dans la boîte aux lettres ?", a: "Non : la remise se fait en main propre à une personne majeure, par discrétion et pour respecter l'interdiction de vente aux mineurs." },
    ],
    nearby: ["charquemont", "damprichard", "le-russey"],
  },
  {
    slug: "morteau",
    name: "Morteau",
    postalCode: "25500",
    department: "Doubs",
    modes: ["livraison-locale", "expedition"],
    title: "CBD à Morteau : livraison à domicile par CBDoux",
    description: "Du CBD de qualité à Morteau (25500) : livraison à domicile par nos soins (offerte dès 100 €) ou Colissimo 48 h. Fleurs, résines, huiles cutanées analysées, THC < 0,3 %. CBDoux, Haut-Doubs.",
    intro: "Morteau, Les Fins, Montlebon, Grand'Combe-Châteleu : le val de Morteau fait partie de notre zone de livraison à domicile. Vos produits CBDoux vous sont remis en main propre, sans passer par la poste.",
    body: [
      "Commandez en ligne parmi nos 18 références — Super Lemon Haze hydro, Amnesia, Orangello, résines 3X Filtré et Olivette Gold, huiles Full Spectrum cutanées — et choisissez la livraison locale : 10 €, offerte dès 100 €, sous 24 à 48 h sur un créneau convenu par WhatsApp.",
      "Vous préférez la boîte aux lettres ? Colissimo 48 h (offert dès 60 €) ou Lettre suivie pour les petites quantités, dans un colis neutre. Et nos distributeurs 24/7 du Russey (20 minutes) et de Charquemont restent accessibles à toute heure.",
    ],
    faq: [
      { q: "Livrez-vous aussi Villers-le-Lac et Les Fins ?", a: "Oui, l'ensemble du val de Morteau (25500, 25130) est dans notre zone de livraison à domicile." },
      { q: "Livraison locale ou Colissimo : que choisir à Morteau ?", a: "La livraison locale est remise en main propre sur rendez-vous (gratuite dès 100 €). Colissimo est pratique si vous n'êtes pas disponible : colis neutre en boîte aux lettres ou en point de retrait La Poste." },
    ],
    nearby: ["villers-le-lac", "le-russey", "pontarlier"],
  },
  {
    slug: "villers-le-lac",
    name: "Villers-le-Lac",
    postalCode: "25130",
    department: "Doubs",
    modes: ["livraison-locale", "expedition"],
    title: "CBD à Villers-le-Lac : livraison à domicile CBDoux",
    description: "CBD premium livré à domicile à Villers-le-Lac (25130) par CBDoux, boutique du Haut-Doubs : fleurs, résines, huiles cutanées analysées. Offert dès 100 €, Colissimo dès 60 €.",
    intro: "À deux pas de la frontière suisse, Villers-le-Lac est desservi par notre livraison à domicile : des produits CBD légaux en France, analysés et remis en main propre.",
    body: [
      "Le Saut du Doubs, les bassins, la frontière : Villers-le-Lac vit entre deux pays. Côté CBD, la réglementation française s'applique : THC inférieur à 0,3 %, variétés autorisées, vente aux adultes. Tous nos produits respectent ces règles et leurs analyses sont publiques.",
      "Commandez en ligne et choisissez la livraison locale (10 €, offerte dès 100 €) : nous convenons d'un créneau par WhatsApp et livrons sous 24 à 48 h. Pour un envoi postal discret, Colissimo 48 h est offert dès 60 €.",
    ],
    faq: [
      { q: "Puis-je ramener du CBD acheté en Suisse en France ?", a: "La législation suisse autorise jusqu'à 1 % de THC, la France 0,3 % : un produit suisse peut donc être illégal en France. Nos produits sont conformes à la réglementation française." },
      { q: "Quel délai pour une livraison à Villers-le-Lac ?", a: "24 à 48 h en livraison locale sur rendez-vous, 48 h ouvrées en Colissimo." },
    ],
    nearby: ["morteau", "le-russey", "charquemont"],
  },
  {
    slug: "saint-hippolyte",
    name: "Saint-Hippolyte",
    postalCode: "25190",
    department: "Doubs",
    modes: ["livraison-locale", "expedition"],
    title: "CBD à Saint-Hippolyte : livraison locale et expédition",
    description: "Du CBD premium à Saint-Hippolyte (25190) et dans la vallée du Dessoubre : livraison à domicile CBDoux ou Colissimo 48 h, retrait gratuit à Damprichard. THC < 0,3 %.",
    intro: "Au confluent du Doubs et du Dessoubre, Saint-Hippolyte est à la limite de notre zone de livraison locale et à un quart d'heure de notre point de retrait de Damprichard.",
    body: [
      "Selon votre adresse exacte, la livraison à domicile par nos soins peut être proposée à la commande (le code postal saisi détermine les options). Sinon, le retrait gratuit à Damprichard est la solution la plus simple : rendez-vous convenu par WhatsApp, paiement en ligne ou sur place.",
      "Pour une livraison postale discrète, Colissimo 48 h est offert dès 60 € et Chronopost livre le lendemain. Dans tous les cas, votre colis est neutre et vos produits voyagent dans des sachets hermétiques inodores.",
    ],
    faq: [
      { q: "Saint-Hippolyte est-il dans la zone de livraison locale ?", a: "En partie. Saisissez votre code postal à la commande : si la livraison locale n'apparaît pas, le retrait gratuit à Damprichard (15 minutes) ou Colissimo sont disponibles." },
    ],
    nearby: ["damprichard", "maiche", "montbeliard"],
  },
  {
    slug: "pontarlier",
    name: "Pontarlier",
    postalCode: "25300",
    department: "Doubs",
    modes: ["expedition"],
    title: "CBD à Pontarlier : livraison 24/48 h en colis discret",
    description: "Commandez votre CBD à Pontarlier (25300) chez CBDoux, boutique du Haut-Doubs : expédition Colissimo 48 h offerte dès 60 €, Chronopost 24 h, colis neutre. Fleurs, résines, huiles analysées.",
    intro: "Pontarlier et le Haut-Doubs pontissalien sont à une heure de nos distributeurs, mais à 24 ou 48 h de votre boîte aux lettres : commandez avant 13 h, votre colis part le jour même.",
    body: [
      "CBDoux est une boutique du Doubs : nous connaissons le plateau, ses hivers et ses habitants frontaliers. Nos produits sont conservés à 20 °C dans des sachets hermétiques biphase et expédiés dans un colis neutre, sans aucune mention extérieure. Le libellé sur votre relevé bancaire est lui aussi neutre.",
      "Colissimo 48 h est offert dès 60 € d'achat ; Chronopost Express livre le lendemain avant 13 h pour 12,90 €. Pour les petites quantités, la Lettre suivie arrive directement dans votre boîte aux lettres. Toutes nos fleurs et résines affichent un THC inférieur à 0,3 %, analyses à l'appui.",
    ],
    faq: [
      { q: "Combien de temps pour recevoir ma commande à Pontarlier ?", a: "Commande avant 13 h = expédition le jour même. Colissimo : 48 h ouvrées. Chronopost : le lendemain avant 13 h." },
      { q: "Le colis est-il discret ?", a: "Totalement : emballage neutre, sachets hermétiques inodores, libellé bancaire neutre." },
    ],
    nearby: ["morteau", "besancon", "villers-le-lac"],
  },
  {
    slug: "besancon",
    name: "Besançon",
    postalCode: "25000",
    department: "Doubs",
    modes: ["expedition"],
    title: "CBD à Besançon : livraison rapide depuis le Haut-Doubs",
    description: "Acheter du CBD à Besançon (25000) : CBDoux, boutique bisontine-compatible du Haut-Doubs, expédie en 24/48 h en colis discret. Fleurs indoor, résines filtrées, huiles cutanées, THC < 0,3 %.",
    intro: "Besançon compte de nombreuses boutiques de CBD. CBDoux, c'est l'alternative en ligne d'un producteur-sélectionneur du Haut-Doubs : des lots analysés, des prix au gramme transparents et une livraison en 24/48 h.",
    body: [
      "Notre catalogue est pensé pour les connaisseurs comme pour les débutants : fleurs indoor et hydroponie (Super Lemon Haze, Amnesia, Orangello), résines filtrées (3X Filtré) et pressées (Olivette Gold), huiles Full Spectrum cutanées, vape. Chaque fiche indique la force (Classique, 2, 3, Maxi), l'usage prévu et renvoie vers l'analyse du lot.",
      "À Besançon, Colissimo livre en 48 h ouvrées (offert dès 60 €) et Chronopost le lendemain avant 13 h. Votre colis est neutre et le libellé bancaire discret. Une question avant de commander ? WhatsApp 7 j/7.",
    ],
    faq: [
      { q: "Proposez-vous un point de retrait à Besançon ?", a: "Pas pour le moment : nos points de retrait sont à Damprichard et au Russey. À Besançon, Colissimo et Chronopost sont les solutions les plus rapides." },
      { q: "Vos prix sont-ils compétitifs par rapport aux boutiques bisontines ?", a: "Nos fleurs démarrent à 5 €/g et nos résines à 5 €/g, avec un prix dégressif sur les formats 10 g et le port offert dès 60 €." },
    ],
    nearby: ["pontarlier", "montbeliard", "morteau"],
  },
  {
    slug: "montbeliard",
    name: "Montbéliard",
    postalCode: "25200",
    department: "Doubs",
    modes: ["expedition"],
    title: "CBD à Montbéliard : commande en ligne, colis discret 24/48 h",
    description: "CBD premium livré à Montbéliard (25200) et dans le Pays de Montbéliard : Colissimo 48 h offert dès 60 €, Chronopost 24 h. CBDoux, sélection analysée du Haut-Doubs, THC < 0,3 %.",
    intro: "Depuis le Haut-Doubs, nous expédions chaque jour vers Montbéliard, Audincourt, Valentigney et Sochaux : commande avant 13 h, colis parti le jour même.",
    body: [
      "CBDoux est né à 45 minutes de Montbéliard, dans le Haut-Doubs horloger. Nous sélectionnons des fleurs et résines de chanvre pour leur qualité (trichomes, arômes, manucure) et publions l'analyse de chaque lot : THC toujours inférieur à 0,3 %.",
      "Choisissez votre mode de livraison : Lettre suivie pour quelques grammes, Colissimo 48 h (offert dès 60 €) ou Chronopost Express 24 h. Emballage neutre, sachets hermétiques, suivi par email. Et si vous passez par le Haut-Doubs, nos distributeurs 24/7 de Charquemont et du Russey vous attendent.",
    ],
    faq: [
      { q: "Quel est le mode de livraison le plus rapide pour Montbéliard ?", a: "Chronopost Express : commande avant 13 h, livraison le lendemain avant 13 h, remise contre signature." },
    ],
    nearby: ["saint-hippolyte", "belfort", "besancon"],
  },
  {
    slug: "belfort",
    name: "Belfort",
    postalCode: "90000",
    department: "Territoire de Belfort",
    modes: ["expedition"],
    title: "CBD à Belfort : livraison 24/48 h par CBDoux",
    description: "Achetez du CBD à Belfort (90000) chez CBDoux : fleurs, résines, huiles cutanées et vape analysées (THC < 0,3 %), expédiées en 24/48 h en colis neutre. Port offert dès 60 €.",
    intro: "Belfort est à moins d'une heure de notre Haut-Doubs natal : vos commandes y arrivent en 24 h (Chronopost) ou 48 h (Colissimo), dans un colis parfaitement neutre.",
    body: [
      "Fleurs indoor et hydroponie, résines filtrées, huiles Full Spectrum à usage cutané, pods : notre sélection est goûtée, validée puis analysée lot par lot. Les forces Classique, 2, 3 et Maxi permettent à chacun de trouver le bon niveau — les débutants commencent toujours par la force Classique.",
      "Commande avant 13 h = expédition le jour même. Colissimo offert dès 60 €, Chronopost Express 12,90 €, Lettre suivie 3,90 € pour les petites quantités. Paiement sécurisé par carte, Apple Pay ou Google Pay.",
    ],
    faq: [
      { q: "Expédiez-vous dans tout le Territoire de Belfort ?", a: "Oui, comme partout en France métropolitaine : Belfort, Delle, Giromagny, Valdoie… aux mêmes tarifs." },
    ],
    nearby: ["montbeliard", "besancon", "saint-hippolyte"],
  },
  {
    slug: "orchamps-vennes",
    name: "Orchamps-Vennes",
    postalCode: "25390",
    department: "Doubs",
    modes: ["livraison-locale", "expedition"],
    title: "CBD à Orchamps-Vennes et Fuans : livraison à domicile",
    description: "CBD premium livré à domicile à Orchamps-Vennes, Fuans et Loray (25390) par CBDoux : fleurs, résines, huiles cutanées analysées. Livraison locale offerte dès 100 €.",
    intro: "Orchamps-Vennes, Fuans, Loray : le secteur est dans notre rayon de livraison à domicile autour du Russey. Vos produits CBDoux vous sont remis en main propre, sur un créneau convenu.",
    body: [
      "Entre Valdahon et Le Russey, le plateau n'a pas de boutique CBD — et n'en a pas besoin : nous livrons nous-mêmes (10 €, offert dès 100 €) sous 24 à 48 h. Pour un envoi postal, Colissimo 48 h est offert dès 60 €.",
      "Le distributeur 24/7 du Russey (face à la mairie) est à un quart d'heure pour un achat immédiat. Et pour un conseil sur les variétés ou les forces, nous sommes disponibles sur WhatsApp 7 j/7.",
    ],
    faq: [
      { q: "Livrez-vous aussi Valdahon ?", a: "Valdahon est en limite de zone : saisissez votre code postal à la commande. Si la livraison locale n'est pas proposée, Colissimo 48 h (offert dès 60 €) prend le relais." },
    ],
    nearby: ["le-russey", "morteau", "besancon"],
  },
];

export function getCity(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}
