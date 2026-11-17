import { Logo } from "@/components/brand/Logo";
import { Fleuron } from "@/components/ui/Fleuron";

const KEY = "cbdoux-age-ok";
const TTL_DAYS = 30;

/**
 * Vérification d'âge (18+), obligatoire pour la vente de CBD.
 *
 * Elle est écrite dans le HTML de chaque page et pilotée par deux petits scripts sans dépendance :
 *  - <AgeGateFlag />, tout en haut de <body>, pose `data-gate` sur <html> avant le premier affichage si la
 *    majorité n'a pas été confirmée depuis moins de 30 jours. Un voile couvre alors l'écran dès la première
 *    image, la porte (écrite en fin de page, après le contenu) s'affiche dès qu'elle est lue, et ses boutons
 *    répondent sans attendre le reste du JavaScript ;
 *  - le script qui suit la porte gère « oui », « non » et le clavier.
 *
 * Le contenu de la page reste dans le HTML, simplement recouvert (Google le lit normalement).
 * Tant que la porte est affichée, l'ouverture de la page est retenue (voir globals.css) : elle se joue
 * au moment où l'on entre, pendant que la porte se referme en cercle.
 * Sans JavaScript, la porte ne s'affiche pas (comportement inchangé).
 */
const FLAG = `try{var v=localStorage.getItem("${KEY}");if(!(v&&+v>Date.now()))document.documentElement.setAttribute("data-gate","")}catch(e){document.documentElement.setAttribute("data-gate","")}`;

const BEHAVIOUR = `(function(){var h=document.documentElement,g=document.getElementById("gate");if(!g||!h.hasAttribute("data-gate"))return;
var yes=g.querySelector('[data-gate-act="yes"]');try{yes.focus({preventScroll:true})}catch(e){}
g.addEventListener("click",function(e){var t=e.target&&e.target.closest?e.target.closest("[data-gate-act]"):null;if(!t)return;
if(t.getAttribute("data-gate-act")==="yes"){try{localStorage.setItem("${KEY}",String(Date.now()+${TTL_DAYS}*864e5))}catch(e){}
g.setAttribute("data-leaving","");h.removeAttribute("data-gate");
try{window.dispatchEvent(new Event("cbdoux:enter"))}catch(e){}
setTimeout(function(){g.removeAttribute("data-leaving")},1000)}
else{g.setAttribute("data-refused","");g.setAttribute("aria-labelledby","agegate-refused");var q=g.querySelector(".gate-refused a");try{q.focus({preventScroll:true})}catch(e){}}});
g.addEventListener("keydown",function(e){if(e.key!=="Tab")return;var f=[].filter.call(g.querySelectorAll("a[href],button"),function(x){return x.offsetParent!==null});if(!f.length)return;
var a=f[0],z=f[f.length-1],c=document.activeElement;if(e.shiftKey&&c===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&c===z){e.preventDefault();a.focus()}})})();`;

/** À placer en premier enfant de <body> ; <AgeGate /> se place, lui, à la fin. */
export function AgeGateFlag() {
  return <script dangerouslySetInnerHTML={{ __html: FLAG }} />;
}

export function AgeGate() {
  return (
    <>
      <div id="gate" role="dialog" aria-modal="true" aria-labelledby="agegate-title" className="gate bg-noir" data-nosnippet="" suppressHydrationWarning>
        <div aria-hidden className="guilloche guilloche-rosace spin-slow opacity-[0.16] left-1/2 top-[46%] w-[170vmin] max-w-[1150px] -translate-x-1/2 -translate-y-1/2" />
        <div aria-hidden className="gate-cadre coins" />
        <div className="relative mx-auto flex min-h-full max-w-xl flex-col items-center justify-center px-6 py-14 text-center">
          <Logo weight="fine" className="h-12 sm:h-14" />
          <Fleuron motif="losange" className="mt-7 w-full max-w-[15rem]" />

          <div className="gate-ask">
            <p id="agegate-title" className="gate-title t-h2 mt-9">
              Avez-vous 18 ans ou plus ?
            </p>
            <p className="t-lead mt-5 max-w-md">
              Nos produits sont réservés aux adultes. Ils contiennent moins de 0,3&nbsp;% de THC, comme l'exige la loi française, et ne sont pas des médicaments.
            </p>
            <div className="mt-9 flex w-full max-w-sm flex-col gap-3">
              <button type="button" data-gate-act="yes" className="btn btn-primary w-full">
                Oui, j'ai 18 ans ou plus
              </button>
              <button type="button" data-gate-act="no" className="btn btn-ghost w-full">
                Non, je suis mineur
              </button>
            </div>
            <p className="t-fine mt-7 text-foreground/85">
              En entrant, vous acceptez nos{" "}
              <a href="/cgv" className="link">
                conditions générales de vente
              </a>
              .
            </p>
          </div>

          <div className="gate-refused">
            <p id="agegate-refused" className="gate-title t-h2 mt-9">
              Ce site est réservé aux adultes.
            </p>
            <p className="t-lead mt-5 max-w-md">La vente de CBD est interdite aux mineurs. Merci de votre compréhension.</p>
            <a href="https://www.google.fr" className="btn btn-ghost mt-9">
              Quitter le site
            </a>
          </div>
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: BEHAVIOUR }} />
    </>
  );
}
