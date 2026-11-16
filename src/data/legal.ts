import { site, company } from "@/data/site";

export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] };

export type LegalSection = { heading: string; blocks: LegalBlock[] };

export type LegalDoc = {
  slug: "mentions-legales" | "cgv" | "confidentialite" | "cookies" | "retours";
  title: string;
  description: string;
  updatedAt: string;
  intro?: string;
  sections: LegalSection[];
};

const p = (text: string): LegalBlock => ({ type: "p", text });
const ul = (items: string[]): LegalBlock => ({ type: "ul", items });
const ol = (items: string[]): LegalBlock => ({ type: "ol", items });
const table = (headers: string[], rows: string[][]): LegalBlock => ({ type: "table", headers, rows });

/** Mention TVA de l'identité légale : franchise en base, ou numéro de TVA intracommunautaire si la société y est assujettie. */
const tvaIdentite = company.vatExempt || !company.vatNumber ? company.vatMention : `TVA intracommunautaire ${company.vatNumber}`;
/** Phrase TVA de l'article « Prix » des CGV. */
const tvaPrix = company.vatExempt
  ? `${company.vatMention}. Les prix affichés sont nets : aucune TVA n'est facturée en sus.`
  : "Les prix s'entendent toutes taxes comprises (TVA française incluse).";

const vendeur = `${company.legalName}, ${company.legalForm} au capital de ${company.capital}, immatriculée au ${company.rcs} (SIRET ${company.siret} — ${tvaIdentite}), dont le siège social est situé ${company.address.street}, ${company.address.postalCode} ${company.address.city}, ${company.address.country}`;

const shippingTable = table(
  ["Mode", "Zone", "Délai indicatif", "Tarif"],
  [
    ["Lettre suivie La Poste (≤ 50 g)", "France métropolitaine", "2 à 4 jours ouvrés", "3,90 € — offert dès 60 €"],
    ["Colissimo domicile", "France métropolitaine", "48 h ouvrées", "5,90 € — offert dès 60 €"],
    ["Chronopost Express", "France métropolitaine", "24 h (jours ouvrés)", "12,90 €"],
    ["Livraison locale par nos soins", "≈ 30 km autour du Russey, 10 km autour de Damprichard", "24 à 48 h, créneau convenu", "10 € — offerte dès 100 €"],
    ["Retrait sur rendez-vous", "Damprichard · Le Russey", "Dès le lendemain", "Gratuit"],
  ],
);

export const legalDocs: LegalDoc[] = [
  // ───────────────────────────── MENTIONS LÉGALES ─────────────────────────────
  {
    slug: "mentions-legales",
    title: "Mentions légales",
    description: `Mentions légales du site ${site.url} édité par ${company.legalName} : éditeur, hébergeur, propriété intellectuelle, produits CBD.`,
    updatedAt: "2026-11-16",
    intro: "Conformément à l'article 6-III de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN), vous trouverez ci-dessous les informations relatives à l'éditeur et à l'hébergeur du site.",
    sections: [
      {
        heading: "Éditeur du site",
        blocks: [
          p(`Le site ${site.url} (ci-après « le Site ») est édité par ${vendeur}.`),
          ul([
            `Directeur de la publication : ${company.publicationDirector}.`,
            `Email : ${site.email}`,
            `Téléphone / WhatsApp : ${site.phoneDisplay}`,
            `Nom commercial : ${site.name}.`,
          ]),
        ],
      },
      {
        heading: "Hébergement",
        blocks: [
          p(`Le Site est hébergé par ${company.host.name}, ${company.host.address} — ${company.host.url}.`),
        ],
      },
      {
        heading: "Information sur les produits CBD",
        blocks: [
          p("Les produits proposés sur le Site sont issus de variétés de chanvre (Cannabis sativa L.) autorisées et présentent une teneur en THC inférieure à 0,3 %, conformément à l'arrêté du 30 décembre 2021. Ils ne sont pas des médicaments et ne font l'objet d'aucune allégation thérapeutique. Les fleurs et résines sont destinées à la vaporisation ; elles ne sont destinées ni à la combustion ni à un usage alimentaire. Les huiles sont des produits à usage cutané exclusivement."),
          p("La vente est strictement réservée aux personnes majeures. Les produits sont déconseillés aux femmes enceintes ou allaitantes et aux personnes suivant un traitement médical sans avis d'un professionnel de santé. Il est recommandé de ne pas conduire ni d'utiliser de machines après consommation."),
        ],
      },
      {
        heading: "Propriété intellectuelle",
        blocks: [
          p(`L'ensemble des éléments du Site (textes, photographies, vidéos, logos, nom commercial ${site.name}, charte graphique, code) est protégé par le droit de la propriété intellectuelle et demeure la propriété exclusive de ${company.legalName} ou de ses partenaires. Toute reproduction, représentation, modification ou exploitation, totale ou partielle, sans autorisation écrite préalable est interdite.`),
        ],
      },
      {
        heading: "Responsabilité",
        blocks: [
          p(`${company.legalName} s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur le Site, dont elle se réserve le droit de corriger le contenu à tout moment. Elle ne saurait toutefois être tenue responsable des erreurs ou omissions, d'une indisponibilité temporaire du Site, ni des dommages résultant d'une utilisation non conforme des produits aux recommandations figurant sur le Site.`),
          p("Les informations de nature générale figurant dans nos guides ne constituent pas un avis médical et ne se substituent pas à la consultation d'un professionnel de santé."),
        ],
      },
      {
        heading: "Liens hypertextes",
        blocks: [
          p(`Le Site peut contenir des liens vers des sites tiers (transporteurs, prestataire de paiement, réseaux sociaux). ${company.legalName} n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.`),
        ],
      },
      {
        heading: "Données personnelles et cookies",
        blocks: [
          p("Le traitement de vos données personnelles est décrit dans notre Politique de confidentialité. L'utilisation des cookies et traceurs est décrite dans notre Politique cookies."),
        ],
      },
      {
        heading: "Droit applicable",
        blocks: [p("Les présentes mentions légales sont soumises au droit français. En cas de litige, et à défaut de résolution amiable, les tribunaux français seront compétents.")],
      },
    ],
  },

  // ───────────────────────────── CGV ─────────────────────────────
  {
    slug: "cgv",
    title: "Conditions générales de vente",
    description: `Conditions générales de vente ${site.name} : commande par WhatsApp, prix, paiement par lien sécurisé, livraison en France, rétractation, garanties, médiation.`,
    updatedAt: "2026-11-16",
    intro: `Les présentes conditions générales de vente (ci-après « CGV ») régissent les ventes de produits conclues à distance entre ${vendeur} (ci-après « le Vendeur » ou « ${site.name} ») et toute personne physique majeure agissant à des fins non professionnelles (ci-après « le Client ») sur le site ${site.url}.`,
    sections: [
      {
        heading: "Article 1 — Objet et champ d'application",
        blocks: [
          p("Les CGV définissent les droits et obligations des parties dans le cadre de la vente en ligne des produits proposés sur le Site. Toute commande implique l'acceptation sans réserve des CGV en vigueur au jour de la commande, matérialisée par une case à cocher lors de la validation. Le Vendeur se réserve le droit de modifier les CGV à tout moment ; les CGV applicables sont celles acceptées par le Client au moment de sa commande."),
        ],
      },
      {
        heading: "Article 2 — Produits",
        blocks: [
          p("Les produits proposés sont des fleurs, résines (« trim » inclus) et extraits de chanvre à teneur en THC inférieure à 0,3 %, des huiles à usage cutané et des produits de vapotage contenant du CBD. Ils sont décrits avec la plus grande exactitude possible ; les photographies et vidéos n'ont pas de valeur contractuelle (variations naturelles d'aspect selon les lots)."),
          ul([
            "Les fleurs et résines sont destinées à la vaporisation. Elles ne sont destinées ni à la combustion ni à un usage alimentaire.",
            "Les huiles sont des produits à usage cutané exclusivement. Elles ne doivent pas être ingérées.",
            "Les produits ne sont pas des médicaments ; aucune allégation thérapeutique n'est formulée.",
            "Les produits sont destinés à un usage personnel. Toute revente est interdite.",
          ]),
          p("La « force » indiquée (Classique, Force 2, Force 3, Maxi) désigne la concentration en CBD du produit. Les produits en Force 3 et Maxi sont réservés aux consommateurs adultes habitués ; le Client reconnaît avoir pris connaissance des conseils de prudence accessibles sur le Site."),
        ],
      },
      {
        heading: "Article 3 — Conditions d'accès et vérification de l'âge",
        blocks: [
          p("La vente de produits à base de CBD est interdite aux mineurs. En passant commande, le Client déclare sur l'honneur être âgé d'au moins 18 ans et disposer de la pleine capacité juridique. Le Vendeur se réserve le droit de demander un justificatif d'identité, de refuser ou d'annuler toute commande en cas de doute sur l'âge du Client, de suspicion de fraude, d'adresse manifestement erronée ou de litige antérieur."),
        ],
      },
      {
        heading: "Article 4 — Prix",
        blocks: [
          p("Les prix sont indiqués en euros et correspondent au montant total à payer par le Client pour les produits, hors frais de livraison. Les frais de livraison sont indiqués avant la validation définitive de la commande et récapitulés à l'article 7. Le Vendeur se réserve le droit de modifier ses prix à tout moment ; les produits sont facturés sur la base des tarifs en vigueur au moment de la validation de la commande."),
          p(tvaPrix),
          p("Les codes promotionnels ne sont pas cumulables entre eux sauf mention contraire, et s'appliquent dans les conditions indiquées (montant minimum, durée de validité, première commande)."),
        ],
      },
      {
        heading: "Article 5 — Commande",
        blocks: [
          ol([
            "Sélection des produits, de leur force et de leur format, ajout au panier.",
            "Saisie des coordonnées, choix du mode de livraison ou de retrait, saisie éventuelle d'un code promotionnel.",
            "Vérification du récapitulatif (produits, prix, frais de livraison indicatifs, total estimé) et acceptation des CGV, de la déclaration de majorité et des conseils de prudence.",
            "Transmission du récapitulatif au Vendeur par WhatsApp (ou par email) : cette transmission constitue une demande de commande.",
            "Confirmation par le Vendeur de la disponibilité des produits et du montant total (frais de port compris), accompagnée de la facture et des modalités de paiement.",
            "Paiement par le Client ; le contrat de vente est conclu à la réception du paiement (ou, pour le retrait avec paiement sur place, à la confirmation du rendez-vous par le Vendeur).",
          ]),
          p("Le Vendeur se réserve le droit de refuser ou d'annuler toute demande de commande en cas d'indisponibilité d'un produit, de doute sur l'âge du Client ou de litige antérieur ; le Client en est informé dans les meilleurs délais et toute somme éventuellement versée lui est remboursée. Une demande de commande restée sans paiement 7 jours après l'envoi de la facture est annulée."),
        ],
      },
      {
        heading: "Article 6 — Paiement",
        blocks: [
          p("Après confirmation de la commande, le Vendeur adresse au Client sa facture ainsi qu'un lien de paiement sécurisé par carte bancaire (CB, Visa, Mastercard) émis via l'établissement de paiement agréé Shine (Shine SAS, Paris), avec authentification forte (3-D Secure), ou ses coordonnées bancaires pour un règlement par virement. Aucune donnée bancaire n'est saisie sur le Site et le Vendeur n'a jamais accès aux données de carte du Client. Le libellé figurant sur le relevé bancaire est neutre."),
          p("Pour le retrait sur rendez-vous, le Client peut régler sur place en espèces ou par carte. Les produits sont préparés et expédiés après encaissement et restent la propriété du Vendeur jusqu'au paiement intégral du prix."),
        ],
      },
      {
        heading: "Article 7 — Livraison",
        blocks: [
          p("Les produits sont livrés en France métropolitaine uniquement, à l'adresse indiquée par le Client, dans un emballage neutre. Les commandes dont le paiement est reçu avant 13 h un jour ouvré sont expédiées le jour même ; au-delà, le jour ouvré suivant. Les délais ci-dessous sont indicatifs et courent à compter de l'expédition."),
          shippingTable,
          p("Conformément à l'article L216-1 du Code de la consommation, en cas de non-livraison dans le délai indiqué ou, à défaut, dans les trente jours suivant la commande, le Client peut, après avoir enjoint le Vendeur d'effectuer la livraison dans un délai supplémentaire raisonnable resté infructueux, résoudre le contrat par lettre recommandée ou écrit sur support durable ; les sommes versées lui sont alors remboursées."),
          p("Les risques de perte ou d'endommagement des produits sont transférés au Client au moment où il en prend physiquement possession. Il appartient au Client de vérifier l'état du colis à réception et de formuler toute réserve auprès du transporteur et du Vendeur sous 48 h. Un colis retourné pour adresse erronée ou non réclamé pourra être réexpédié aux frais du Client."),
        ],
      },
      {
        heading: "Article 8 — Retrait et livraison locale",
        blocks: [
          p("Pour le retrait (Damprichard, Le Russey) et la livraison locale par nos soins, le Vendeur contacte le Client par téléphone ou WhatsApp pour convenir d'un rendez-vous. Le Client dispose de 14 jours à compter de la confirmation pour retirer sa commande ; passé ce délai et sans nouvelle du Client, la commande est annulée et, le cas échéant, remboursée déduction faite d'éventuels frais engagés."),
        ],
      },
      {
        heading: "Article 9 — Droit de rétractation",
        blocks: [
          p("Conformément aux articles L221-18 et suivants du Code de la consommation, le Client dispose d'un délai de quatorze (14) jours à compter de la réception des produits pour exercer son droit de rétractation sans avoir à justifier de motif. Il notifie sa décision par email ou courrier à l'aide du formulaire type ci-dessous ou de toute déclaration dénuée d'ambiguïté, puis retourne les produits dans les 14 jours suivant cette notification, à ses frais."),
          p("Exceptions (article L221-28 du Code de la consommation) : le droit de rétractation ne peut être exercé pour les produits descellés après la livraison et qui ne peuvent être renvoyés pour des raisons d'hygiène ou de protection de la santé — ce qui est le cas des fleurs, résines, trims, huiles et pods/recharges dont le sachet, le flacon ou l'emballage scellé a été ouvert — ni pour les produits susceptibles de se détériorer rapidement. Seuls les produits retournés complets, non ouverts et dans leur emballage d'origine intact peuvent donner lieu à remboursement."),
          p("Le remboursement intervient au plus tard 14 jours après réception des produits retournés (ou de la preuve d'expédition), par le même moyen de paiement que celui utilisé pour la commande, frais de livraison standard inclus (les frais supplémentaires liés au choix d'un mode de livraison plus onéreux ne sont pas remboursés)."),
          p(`Formulaire type de rétractation — à l'attention de ${company.legalName}, ${company.address.street}, ${company.address.postalCode} ${company.address.city} — ${site.email} : « Je vous notifie par la présente ma rétractation du contrat portant sur la vente des biens ci-dessous : [désignation], commandé le [date] / reçu le [date], numéro de commande [n°], nom et adresse du consommateur, signature (si papier), date. »`),
        ],
      },
      {
        heading: "Article 10 — Garanties légales",
        blocks: [
          p("Le Client bénéficie de la garantie légale de conformité (articles L217-3 à L217-20 du Code de la consommation) et de la garantie des vices cachés (articles 1641 à 1649 du Code civil)."),
          p("Le consommateur dispose d'un délai de deux ans à compter de la délivrance du bien pour obtenir la mise en œuvre de la garantie légale de conformité en cas d'apparition d'un défaut de conformité. Durant ce délai, le consommateur n'est tenu d'établir que l'existence du défaut de conformité et non la date d'apparition de celui-ci. La garantie légale de conformité emporte obligation pour le professionnel, le cas échéant, de fournir tous les moyens nécessaires à la mise en œuvre de la garantie. Le consommateur peut choisir entre la réparation et le remplacement du bien, sous réserve des conditions de coût prévues à l'article L217-12 ; à défaut, il peut obtenir une réduction du prix ou la résolution du contrat. La garantie légale de conformité s'applique indépendamment de toute garantie commerciale."),
          p("Le consommateur peut également décider de mettre en œuvre la garantie contre les défauts cachés de la chose vendue au sens de l'article 1641 du Code civil ; dans cette hypothèse, il peut choisir entre la résolution de la vente ou une réduction du prix conformément à l'article 1644 du Code civil."),
        ],
      },
      {
        heading: "Article 11 — Usage des produits et responsabilité",
        blocks: [
          p("Le Client s'engage à utiliser les produits conformément à leur destination et aux conseils de prudence du Site : réservés aux adultes, commencer par une petite quantité, ne pas conduire ni utiliser de machines après usage, déconseillés aux femmes enceintes ou allaitantes et aux personnes sous traitement sans avis médical, tenir hors de portée des enfants et des animaux. Le Vendeur ne saurait être tenu responsable d'une utilisation non conforme, d'une consommation excessive ou d'un usage détourné des produits."),
        ],
      },
      {
        heading: "Article 12 — Données personnelles",
        blocks: [p("Les données collectées lors de la commande sont nécessaires au traitement de celle-ci et traitées conformément à notre Politique de confidentialité (RGPD). Le Client dispose d'un droit d'accès, de rectification, d'effacement, d'opposition et de portabilité qu'il peut exercer à l'adresse " + site.email + ".")],
      },
      {
        heading: "Article 13 — Propriété intellectuelle",
        blocks: [p(`Tous les éléments du Site sont et restent la propriété intellectuelle exclusive de ${company.legalName}. Toute reproduction ou exploitation sans autorisation est interdite.`)],
      },
      {
        heading: "Article 14 — Service client et réclamations",
        blocks: [p(`Pour toute question ou réclamation : ${site.email}, WhatsApp ${site.phoneDisplay}, ou par courrier au siège social. Nous nous engageons à répondre sous 48 h ouvrées.`)],
      },
      {
        heading: "Article 15 — Médiation de la consommation",
        blocks: [
          p(`Conformément aux articles L612-1 et suivants du Code de la consommation, le Client peut, après démarche écrite préalable auprès du Vendeur restée sans réponse satisfaisante sous deux mois, recourir gratuitement au médiateur de la consommation dont relève le Vendeur : ${company.mediator.name} — ${company.mediator.address} — ${company.mediator.url}.`),
          p("Le Client peut également utiliser la plateforme européenne de règlement en ligne des litiges : https://ec.europa.eu/consumers/odr"),
        ],
      },
      {
        heading: "Article 16 — Droit applicable et litiges",
        blocks: [p("Les présentes CGV sont soumises au droit français. En cas de litige, les parties rechercheront une solution amiable avant toute action judiciaire. À défaut, le litige sera porté devant les tribunaux compétents conformément aux règles du Code de procédure civile et du Code de la consommation.")],
      },
      {
        heading: "Article 17 — Modifications",
        blocks: [p("Le Vendeur se réserve le droit de modifier les présentes CGV. La version applicable est celle en vigueur à la date de la commande, accessible en permanence sur le Site.")],
      },
    ],
  },

  // ───────────────────────────── CONFIDENTIALITÉ ─────────────────────────────
  {
    slug: "confidentialite",
    title: "Politique de confidentialité",
    description: `Comment ${site.name} collecte, utilise et protège vos données personnelles (RGPD) : finalités, bases légales, durées de conservation, sous-traitants, vos droits.`,
    updatedAt: "2026-11-16",
    intro: `${company.legalName} attache une grande importance à la protection de vos données personnelles. La présente politique décrit les traitements réalisés via le site ${site.url}, conformément au Règlement (UE) 2016/679 (RGPD) et à la loi Informatique et Libertés.`,
    sections: [
      {
        heading: "Responsable du traitement",
        blocks: [p(`${vendeur}. Contact : ${site.email}.`)],
      },
      {
        heading: "Données collectées",
        blocks: [
          ul([
            "Identité et contact : nom, prénom, email, téléphone.",
            "Commande : adresse de livraison, produits commandés, montants, mode de livraison, historique.",
            "Paiement : aucune donnée bancaire n'est collectée par le Site. Les paiements par lien sont traités par notre établissement de paiement (Shine) sur sa propre page sécurisée.",
            "Déclarations : confirmation de majorité, acceptation des CGV et des conseils de prudence (horodatées).",
            "Données techniques : données de connexion traitées par notre hébergeur (adresse IP, date et heure, pages demandées) pour afficher le Site et en assurer la sécurité. Aucune mesure d'audience n'est réalisée.",
            "Messages : contenu des demandes de commande et des messages que vous nous adressez par WhatsApp ou par email.",
          ]),
        ],
      },
      {
        heading: "Finalités et bases légales",
        blocks: [
          table(
            ["Finalité", "Base légale"],
            [
              ["Traitement, livraison et suivi des commandes, service client", "Exécution du contrat"],
              ["Facturation et obligations comptables", "Obligation légale"],
              ["Vérification de la majorité, lutte contre la fraude", "Obligation légale / intérêt légitime"],
              ["Sécurité et bon fonctionnement du Site (données techniques de connexion)", "Intérêt légitime"],
              ["Réponse aux demandes de contact", "Intérêt légitime / mesures précontractuelles"],
              ["Communications commerciales (si vous y consentez)", "Consentement, retirable à tout moment"],
            ],
          ),
        ],
      },
      {
        heading: "Destinataires et sous-traitants",
        blocks: [
          ul([
            "Netlify, Inc. (États-Unis) — hébergement du site. Netlify est certifiée au titre du cadre de protection des données UE–États-Unis (Data Privacy Framework), qui encadre les transferts de données vers les États-Unis.",
            "WhatsApp (Meta Platforms Ireland Ltd) — réception de vos demandes de commande et échanges avec notre service client, lorsque vous choisissez ce canal. Les messages sont chiffrés de bout en bout ; la politique de confidentialité de WhatsApp s'applique.",
            "Shine SAS (France) — émission des liens de paiement et traitement des règlements par carte.",
            "La Poste / Colissimo / Chronopost — acheminement des colis (nom, adresse, téléphone pour le suivi).",
          ]),
          p("Vos données ne sont ni vendues ni louées à des tiers."),
        ],
      },
      {
        heading: "Durées de conservation",
        blocks: [
          ul([
            "Données de commande et de facturation : 10 ans (pièces comptables, article L123-22 du Code de commerce).",
            "Données clients à des fins commerciales : 3 ans après le dernier contact.",
            "Messages de contact : 12 mois.",
            "Conversations WhatsApp liées à une commande : 3 ans après le dernier échange.",
          ]),
        ],
      },
      {
        heading: "Vos droits",
        blocks: [
          p(`Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition, de portabilité de vos données, ainsi que du droit de définir des directives relatives au sort de vos données après votre décès. Pour les exercer : ${site.email} (une preuve d'identité pourra être demandée). Nous répondons dans un délai d'un mois.`),
          p("Vous pouvez introduire une réclamation auprès de la CNIL : 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07 — www.cnil.fr."),
        ],
      },
      {
        heading: "Sécurité",
        blocks: [p("Connexion chiffrée (HTTPS/TLS), aucun stockage de données clients sur le Site (le panier reste sur votre appareil), paiement délégué à un établissement de paiement agréé. Nous ne stockons aucune donnée de carte bancaire.")],
      },
      {
        heading: "Mineurs",
        blocks: [p("Le Site est réservé aux personnes majeures. Nous ne collectons pas sciemment de données concernant des mineurs ; toute commande identifiée comme émanant d'un mineur est annulée et ses données supprimées.")],
      },
    ],
  },

  // ───────────────────────────── COOKIES ─────────────────────────────
  {
    slug: "cookies",
    title: "Politique cookies",
    description: `${site.name} n'utilise aucun cookie publicitaire : seulement des stockages techniques indispensables (panier, vérification d'âge), sans mesure d'audience.`,
    updatedAt: "2026-11-16",
    intro: "Nous avons fait le choix d'un site sobre : pas de cookies publicitaires, pas de suivi par des tiers. Voici précisément ce qui est stocké sur votre appareil et pourquoi.",
    sections: [
      {
        heading: "Stockages techniques indispensables (exemptés de consentement)",
        blocks: [
          p("Conformément à l'article 82 de la loi Informatique et Libertés et aux lignes directrices de la CNIL, les stockages strictement nécessaires au service demandé par l'utilisateur ne requièrent pas de consentement."),
          table(
            ["Nom", "Type", "Finalité", "Durée"],
            [
              ["cbdoux-cart-v2", "Stockage local (localStorage)", "Mémoriser le contenu de votre panier et le code promo saisi", "Jusqu'à suppression par vos soins"],
              ["cbdoux-age-ok", "Stockage local", "Mémoriser votre confirmation de majorité pour ne pas la redemander", "30 jours"],
              ["cbdoux-prudence-ack", "Stockage local", "Mémoriser la lecture des conseils de prudence pour les produits forts", "Jusqu'à suppression"],
            ],
          ),
        ],
      },
      {
        heading: "Mesure d'audience",
        blocks: [p("Le Site n'utilise aucun outil de mesure d'audience : aucune statistique de visite n'est collectée, avec ou sans cookie. Notre hébergeur traite uniquement les données techniques nécessaires à l'affichage des pages et à la sécurité du service (adresse IP, date et heure, pages demandées).")],
      },
      {
        heading: "Services tiers",
        blocks: [p("Aucun service tiers (publicité, réseaux sociaux intégrés, chat) n'est chargé sur le Site. Les liens vers WhatsApp, Facebook ou Google Maps ouvrent ces services dans une nouvelle fenêtre : leurs propres politiques s'appliquent alors. Le lien de paiement que nous vous envoyons ouvre la page sécurisée de Shine, soumise à sa propre politique de confidentialité.")],
      },
      {
        heading: "Gérer les stockages",
        blocks: [p("Vous pouvez supprimer à tout moment les données stockées localement via les paramètres de votre navigateur (« Effacer les données de navigation » / « Données des sites »). La suppression du panier ou de la confirmation d'âge n'empêche pas la navigation ; la confirmation d'âge vous sera simplement redemandée.")],
      },
    ],
  },

  // ───────────────────────────── RETOURS ─────────────────────────────
  {
    slug: "retours",
    title: "Retours, rétractation et remboursements",
    description: `Vos droits en clair : rétractation sous 14 jours, exceptions pour les produits descellés, procédure de retour, remboursement, colis perdu ou abîmé.`,
    updatedAt: "2026-11-08",
    intro: "Nous voulons que chaque commande se passe bien. Si ce n'est pas le cas, voici vos droits et la marche à suivre, en langage clair. Les règles complètes figurent dans nos Conditions générales de vente.",
    sections: [
      {
        heading: "Votre droit de rétractation en bref",
        blocks: [
          ul([
            "Vous disposez de 14 jours après réception pour changer d'avis, sans justification.",
            "Les produits doivent être retournés complets, non ouverts, dans leur emballage d'origine scellé.",
            "Les frais de retour sont à votre charge ; nous vous conseillons un envoi suivi.",
            "Remboursement sous 14 jours après réception du retour, sur votre moyen de paiement initial.",
          ]),
        ],
      },
      {
        heading: "L'exception hygiène : produits descellés",
        blocks: [
          p("La loi (article L221-28 du Code de la consommation) exclut du droit de rétractation les produits descellés après livraison qui ne peuvent être renvoyés pour des raisons d'hygiène ou de protection de la santé. Concrètement : un sachet de fleurs ou de résine ouvert, un flacon d'huile descellé ou un pod/une recharge ouvert(e) ne peut pas être repris. Un produit encore scellé peut l'être."),
        ],
      },
      {
        heading: "Comment procéder",
        blocks: [
          ol([
            `Écrivez-nous sous 14 jours à ${site.email} ou sur WhatsApp (${site.phoneDisplay}) avec votre numéro de commande et les produits concernés — vous pouvez utiliser le formulaire type ci-dessous.`,
            "Nous vous confirmons l'adresse de retour et le numéro de dossier.",
            "Expédiez les produits non ouverts sous 14 jours, en envoi suivi, bien protégés.",
            "Dès réception et vérification, nous vous remboursons sous 14 jours maximum, par le même moyen de paiement.",
          ]),
        ],
      },
      {
        heading: "Colis perdu, en retard ou abîmé",
        blocks: [
          p("Signalez-nous tout problème sous 48 h après la date de livraison prévue ou la réception, avec des photos en cas de casse. Nous ouvrons une réclamation auprès du transporteur et, selon votre préférence, nous réexpédions votre commande ou nous vous remboursons. Un colis perdu par le transporteur est toujours réexpédié ou remboursé intégralement."),
        ],
      },
      {
        heading: "Erreur de préparation ou produit non conforme",
        blocks: [p("Si vous recevez un produit différent de votre commande ou présentant un défaut, prévenez-nous sous 48 h : nous prenons en charge le retour et vous renvoyons le bon produit à nos frais, ou vous remboursons. Vous bénéficiez par ailleurs de la garantie légale de conformité (2 ans) détaillée dans nos CGV.")],
      },
      {
        heading: "Formulaire type de rétractation",
        blocks: [
          p(`À l'attention de ${company.legalName} — ${company.address.street}, ${company.address.postalCode} ${company.address.city} — ${site.email}`),
          p("« Je vous notifie par la présente ma rétractation du contrat portant sur la vente des biens suivants : [désignation des produits]. Commandé le [date] / reçu le [date]. Numéro de commande : [CBD-XXXXXX-XXXX]. Nom du consommateur : […]. Adresse du consommateur : […]. Date : […]. Signature (uniquement en cas de notification papier). »"),
        ],
      },
    ],
  },
];

export function getLegalDoc(slug: string): LegalDoc | undefined {
  return legalDocs.find((d) => d.slug === slug);
}
