import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert, Flame, Droplet, Clock, Car, HeartPulse, Baby, ThermometerSun, Leaf, Download, MessageCircle } from "lucide-react";
import { forceLabels } from "@/data/products";
import { site } from "@/data/site";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Conseils & prudence CBD : dosage et précautions",
  description:
    "Bien utiliser nos produits CBD : forces Classique à Maxi, dosage progressif, délais d'action, conduite, contre-indications, conservation. Guide PDF à télécharger.",
  path: "/conseils-prudence",
  keywords: ["conseils cbd", "dosage cbd", "précautions cbd", "cbd effets secondaires", "cbd contre-indications"],
});

function Section({ icon: Icon, title, children }: { icon: typeof ShieldAlert; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-gold/20 bg-card/50 p-6 sm:p-7">
      <div className="flex items-center gap-3 mb-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold"><Icon size={18} /></span>
        <h2 className="font-serif text-2xl text-gradient-gold">{title}</h2>
      </div>
      <div className="text-sm sm:text-[15px] text-foreground/80 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default function ConseilsPrudencePage() {
  return (
    <div className="print-area mx-auto max-w-3xl px-5 sm:px-8 py-10 sm:py-14">
      <Breadcrumbs items={[{ name: "Conseils & prudence", path: "/conseils-prudence" }]} className="mb-8 no-print" />
      <header className="mb-10 text-center">
        <p className="kicker mb-3">Guide d'utilisation</p>
        <h1 className="font-serif text-4xl sm:text-6xl mb-4"><span className="text-gradient-gold">Conseils & prudence</span></h1>
        <p className="text-foreground/70 max-w-xl mx-auto">Nos produits CBD sont conçus pour des moments de détente. Pour en profiter sereinement, lisez attentivement les recommandations ci-dessous.</p>
        <div className="no-print mt-6 flex flex-wrap items-center justify-center gap-3">
          <a href="/conseils-prudence.pdf" download className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"><Download size={16} /> Télécharger le PDF</a>
          <Link href="/faq" className="btn-outline inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm">Voir la FAQ</Link>
        </div>
      </header>

      <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/10 via-card/40 to-transparent px-5 py-4 sm:px-6 sm:py-5 mb-8 flex items-start gap-4">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/50 bg-background text-gold"><ShieldAlert size={16} /></span>
        <div>
          <p className="kicker mb-1">Réservé aux adultes (18+)</p>
          <p className="text-sm text-foreground/80 leading-relaxed">Nos produits ne sont pas destinés aux mineurs, aux femmes enceintes ou allaitantes, ni aux personnes sous traitement médical sans avis d'un professionnel de santé. Ils ne sont pas des médicaments.</p>
        </div>
      </div>

      <div className="space-y-6">
        <Section icon={Flame} title="Niveaux de force">
          <p>La puissance dépend de la force choisie et de la quantité utilisée :</p>
          <ul className="space-y-2 pl-1">
            {([1, 2, 3, "maxi"] as const).map((f) => (
              <li key={String(f)}><span className="font-semibold text-foreground">{forceLabels[f].label} · {forceLabels[f].short}</span> — {forceLabels[f].description}</li>
            ))}
          </ul>
        </Section>

        <Section icon={Droplet} title="Dosage : commencer doucement">
          <p>La règle d'or : <span className="text-foreground font-medium">commencer bas, augmenter lentement</span>. Prenez une petite quantité, attendez 15 à 30 minutes et évaluez le ressenti avant d'en reprendre.</p>
          <p>Le ressenti varie selon la sensibilité, le poids, le métabolisme et le moment de la journée. Un même produit peut agir différemment d'une personne à l'autre.</p>
        </Section>

        <Section icon={Clock} title="Délai d'action et durée">
          <p><span className="font-medium text-foreground">Vaporisation :</span> ressenti en quelques minutes, durée 1 à 3 heures.</p>
          <p><span className="font-medium text-foreground">Application cutanée (huiles) :</span> usage local, à renouveler selon besoin. Ne pas ingérer.</p>
        </Section>

        <Section icon={Car} title="Conduite & activités à risque">
          <p><span className="font-medium text-foreground">Ne conduisez pas</span> après consommation, même à faible dose. Le CBD peut entraîner une somnolence et le dépistage salivaire routier ne distingue pas le CBD du THC. Par prudence, attendez une nuit complète avant de reprendre le volant.</p>
          <p>Évitez l'utilisation de machines et toute activité nécessitant une vigilance soutenue.</p>
        </Section>

        <Section icon={HeartPulse} title="Traitements médicaux">
          <p>Demandez l'avis d'un médecin ou d'un pharmacien avant utilisation si vous suivez un traitement : le CBD peut interagir avec certains médicaments.</p>
          <p>Cessez l'utilisation et consultez en cas d'effet indésirable (somnolence excessive, nausées, maux de tête, bouche sèche persistante).</p>
        </Section>

        <Section icon={Baby} title="Personnes vulnérables">
          <p>Nos produits sont strictement déconseillés aux mineurs, aux femmes enceintes ou allaitantes et aux personnes présentant des antécédents psychiatriques sans avis médical.</p>
        </Section>

        <Section icon={ThermometerSun} title="Conservation">
          <p>Conservez vos produits à l'abri de la lumière, de la chaleur et de l'humidité, dans leur sachet hermétique d'origine, idéalement autour de 20 °C. Tenir hors de portée des enfants et des animaux.</p>
        </Section>

        <Section icon={Leaf} title="Qualité & traçabilité">
          <p>Tous nos produits respectent la réglementation française (THC &lt; 0,3 %) et disposent d'analyses de laboratoire consultables. Fleurs et résines sont destinées à la vaporisation — ni à la combustion, ni à un usage alimentaire. Les huiles sont à usage cutané exclusivement.</p>
          <p><Link href="/analyses-laboratoires" className="text-gold underline decoration-gold/40 hover:decoration-gold">Voir nos analyses laboratoires →</Link></p>
        </Section>
      </div>

      <div className="no-print mt-12 rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/10 via-card/40 to-transparent p-6 sm:p-8 text-center">
        <h3 className="font-serif text-2xl text-gradient-gold mb-2">Un doute, une question ?</h3>
        <p className="text-sm text-foreground/75 mb-5 max-w-md mx-auto">Avant tout achat, demandez-nous conseil : nous vous orientons vers le produit et la force adaptés à votre profil.</p>
        <a href={`${site.whatsapp}?text=${encodeURIComponent("Bonjour CBDoux, j'aimerais un conseil avant commande.")}`} target="_blank" rel="noopener noreferrer" className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"><MessageCircle size={16} /> Demander conseil sur WhatsApp</a>
      </div>

      <p className="mt-10 text-[11px] text-foreground/50 leading-relaxed text-center">Les informations de cette page ne se substituent pas à l'avis d'un professionnel de santé. {site.name} ne saurait être tenu responsable d'une utilisation inappropriée de ses produits.</p>
    </div>
  );
}
