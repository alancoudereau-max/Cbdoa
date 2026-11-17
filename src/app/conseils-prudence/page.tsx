import type { Metadata } from "next";
import Link from "next/link";
import { forceLabels } from "@/data/products";
import { site } from "@/data/site";
import { PageHero } from "@/components/ui/PageHero";
import { commas } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Conseils & prudence CBD : dosage et précautions",
  description:
    "Bien utiliser nos produits CBD : forces Classique à Maxi, dosage progressif, délais d'action, conduite, contre-indications, conservation. Guide PDF à télécharger.",
  path: "/conseils-prudence",
  keywords: ["conseils cbd", "dosage cbd", "précautions cbd", "cbd effets secondaires", "cbd contre-indications"],
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-x-10 gap-y-3 border-t border-foreground/25 py-8 lg:grid-cols-12">
      <h2 className="t-h3 lg:col-span-4">{title}</h2>
      <div className="space-y-3 text-foreground/85 lg:col-span-8">{children}</div>
    </section>
  );
}

export default function ConseilsPrudencePage() {
  return (
    <div className="print-area">
      <PageHero
        crumbs={[{ name: "Conseils & prudence", path: "/conseils-prudence" }]}
        title="Conseils et prudence"
        lead="Nos produits CBD sont conçus pour des moments de détente. Pour en profiter sereinement, lisez attentivement les recommandations ci-dessous."
      >
        <div className="no-print flex flex-wrap gap-2.5">
          <a href="/conseils-prudence.pdf" download className="btn btn-primary">
            Télécharger le PDF
          </a>
          <Link href="/faq" className="btn btn-ghost">
            Voir la FAQ
          </Link>
        </div>
      </PageHero>

      <div className="wrap-narrow pb-24">
        <div className="panel sheet">
          <p className="rounded-[3px] bg-danger-soft px-5 py-4 text-[0.9688rem] leading-relaxed">
            <strong>Réservé aux adultes.</strong> Nos produits ne sont pas destinés aux mineurs, aux femmes enceintes ou allaitantes, ni aux personnes sous traitement médical sans avis d'un professionnel de santé. Ils ne sont pas des médicaments.
          </p>

          <div className="mt-8">
            <Section title="Niveaux de force">
              <p>La puissance dépend de la force choisie et de la quantité utilisée :</p>
              <ul className="space-y-2.5">
                {([1, 2, 3, "maxi"] as const).map((f) => (
                  <li key={String(f)}>
                    <strong>
                      {forceLabels[f].label}, {commas(forceLabels[f].short).toLowerCase()}.
                    </strong>{" "}
                    {forceLabels[f].description}
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="Dosage : commencer doucement">
              <p>
                La règle d'or : <strong>commencer bas, augmenter lentement</strong>. Prenez une petite quantité, attendez 15 à 30 minutes et évaluez le ressenti avant d'en reprendre.
              </p>
              <p>Le ressenti varie selon la sensibilité, le poids, le métabolisme et le moment de la journée. Un même produit peut agir différemment d'une personne à l'autre.</p>
            </Section>

            <Section title="Délai d'action et durée">
              <p>
                <strong>Vaporisation :</strong> ressenti en quelques minutes, durée 1 à 3 heures.
              </p>
              <p>
                <strong>Application cutanée (huiles) :</strong> usage local, à renouveler selon besoin. Ne pas ingérer.
              </p>
            </Section>

            <Section title="Conduite et activités à risque">
              <p>
                <strong>Ne conduisez pas</strong> après consommation, même à faible dose. Le CBD peut entraîner une somnolence, et le dépistage salivaire routier recherche le THC : les traces présentes dans un produit légal peuvent suffire à le rendre positif. Par prudence, attendez une nuit complète avant de reprendre le volant.
              </p>
              <p>Évitez l'utilisation de machines et toute activité nécessitant une vigilance soutenue.</p>
            </Section>

            <Section title="Traitements médicaux">
              <p>Demandez l'avis d'un médecin ou d'un pharmacien avant utilisation si vous suivez un traitement : le CBD peut interagir avec certains médicaments.</p>
              <p>Cessez l'utilisation et consultez en cas d'effet indésirable (somnolence excessive, nausées, maux de tête, bouche sèche persistante).</p>
            </Section>

            <Section title="Personnes vulnérables">
              <p>Nos produits sont strictement déconseillés aux mineurs, aux femmes enceintes ou allaitantes et aux personnes présentant des antécédents psychiatriques sans avis médical.</p>
            </Section>

            <Section title="Conservation">
              <p>Conservez vos produits à l'abri de la lumière, de la chaleur et de l'humidité, dans leur sachet hermétique d'origine, idéalement autour de 20 °C. Tenir hors de portée des enfants et des animaux.</p>
            </Section>

            <Section title="Qualité et traçabilité">
              <p>Tous nos produits respectent la réglementation française (THC &lt; 0,3 %) et disposent d'analyses de laboratoire consultables. Fleurs et résines sont destinées à la vaporisation, ni à la combustion, ni à un usage alimentaire. Les huiles sont à usage cutané exclusivement.</p>
              <p>
                <Link href="/analyses-laboratoires" className="link">
                  Voir nos analyses de laboratoire
                </Link>
              </p>
            </Section>
          </div>

          <div className="no-print border-t border-foreground/25 pt-8">
            <h3 className="t-h3">Un doute, une question ?</h3>
            <p className="mt-3 measure text-foreground/80">Avant tout achat, demandez-nous conseil : nous vous orientons vers le produit et la force adaptés à votre profil.</p>
            <a href={`${site.whatsapp}?text=${encodeURIComponent("Bonjour CBDoux, j'aimerais un conseil avant commande.")}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-6">
              Demander conseil sur WhatsApp
            </a>
          </div>

          <p className="t-fine mt-10">
            Les informations de cette page ne se substituent pas à l'avis d'un professionnel de santé. {site.name} ne saurait être tenu responsable d'une utilisation inappropriée de ses produits.
          </p>
        </div>
      </div>
    </div>
  );
}
