// Contrôle automatique des pages du site construit (npm run build, puis npx next start -p 3100) :
// page plus large que l'écran, texte qui sort d'une étiquette ou d'une case, images cassées, erreurs du navigateur.
//   node qa/audit.mjs 320,360,390,768,1024,1280,1440            toutes les pages du plan du site
//   node qa/audit.mjs 390 /resines-cbd /produit/beldia           quelques pages
//   node qa/audit.mjs 390,1440 mouvement / /boutique             animations actives : signale aussi les blocs restés masqués
// À lancer seul (pas en parallèle d'un autre contrôle) : une machine saturée fausse les mesures.
import { createRequire } from "node:module";
// Playwright est installé hors du projet : PLAYWRIGHT_MODULES donne son dossier node_modules (avec la barre finale).
const require = createRequire(process.env.PLAYWRIGHT_MODULES ?? "/home/claude/.npm-global/lib/node_modules/");
const { chromium } = require("playwright");

const BASE = process.env.BASE_URL ?? "http://localhost:3100";
const widths = process.argv[2].split(",").map(Number);
// « mouvement » : animations actives, défilement lent, et contrôle des blocs restés masqués (plus long)
const MOTION = process.argv[3] === "mouvement";
let paths = process.argv.slice(MOTION ? 4 : 3);
if (!paths.length) {
  const xml = await (await fetch(BASE + "/sitemap.xml")).text();
  paths = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  paths.push("/panier", "/commande", "/page-introuvable");
}
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? "/usr/bin/google-chrome", args: ["--no-sandbox"] });
let problems = 0;
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 700 ? 780 : 900 }, hasTouch: w < 700, locale: "fr-FR", timezoneId: "Europe/Paris", reducedMotion: MOTION ? "no-preference" : "reduce" });
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem("cbdoux-age-ok", String(Date.now() + 864e5));
    } catch {}
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push("JS " + String(e).slice(0, 160)));
  page.on("console", (m) => m.type() === "error" && errors.push("console " + m.text().slice(0, 160)));
  page.on("response", (r) => r.status() >= 400 && !r.url().includes("page-introuvable") && errors.push(`HTTP ${r.status()} ${r.url().replace(BASE, "")}`));
  for (const path of paths) {
    errors.length = 0;
    await page.goto(BASE + path, { waitUntil: "load" });
    await page.evaluate(async (motion) => {
      await document.fonts.ready;
      const step = innerHeight * (motion ? 0.5 : 0.85);
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) { scrollTo(0, y); await new Promise((r) => setTimeout(r, motion ? 140 : 35)); }
      await new Promise((r) => setTimeout(r, motion ? 1600 : 250));
    }, MOTION);
    const found = await page.evaluate((motion) => {
      const out = [];
      const vw = document.documentElement.clientWidth;
      if (document.documentElement.scrollWidth > vw + 1) out.push(`page plus large que l'écran : ${document.documentElement.scrollWidth} > ${vw}`);
      const label = (el) => `${el.tagName.toLowerCase()}.${String(el.className).split(" ").slice(0, 3).join(".")} « ${(el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 50)} »`;
      // contenu qui dépasse de sa propre boîte
      for (const el of document.querySelectorAll(".etiquette-prix, .etiquette-pied, .etiquette h2, .etiquette h3, .choice, .pastille, .buybar-row, .btn, .panel table, .save-chip, .jauge, .cart-line")) {
        if (!el.offsetParent && getComputedStyle(el).position !== "fixed") continue;
        if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflowX !== "auto") out.push(`déborde de sa boîte (${el.scrollWidth} > ${el.clientWidth}) : ${label(el)}`);
      }
      // éléments d'une étiquette qui sortent du cadre de l'étiquette
      for (const card of document.querySelectorAll(".etiquette")) {
        const c = card.getBoundingClientRect();
        if (!c.width) continue;
        for (const el of card.querySelectorAll(".etiquette-prix > *, .pastille, .pips, h2, h3")) {
          const r = el.getBoundingClientRect();
          if (!r.width) continue;
          if (r.right > c.right - 9 || r.left < c.left + 9) out.push(`touche ou dépasse le cadre de l'étiquette (${Math.round(r.right - c.right)} px) : ${label(el)}`);
        }
      }
      // cases de format : texte qui sort de la case
      for (const tile of document.querySelectorAll(".choice")) {
        const t = tile.getBoundingClientRect();
        if (!t.width) continue;
        for (const el of tile.querySelectorAll("span")) {
          if (el.classList.contains("save-chip") || el.classList.contains("sr-only")) continue;
          const range = document.createRange(); range.selectNodeContents(el);
          const r = range.getBoundingClientRect();
          if (r.width && r.right > t.right - 4) out.push(`texte hors de sa case (${Math.round(r.right - t.right)} px) : ${label(el)}`);
        }
      }
      for (const img of document.images) if (img.complete && img.naturalWidth === 0 && img.currentSrc) out.push("image cassée : " + img.currentSrc.slice(0, 120));
      if (motion) for (const el of document.querySelectorAll("[data-reveal]")) if (+getComputedStyle(el).opacity < 0.99) out.push("bloc encore masqué : " + label(el));
      return out;
    }, MOTION);
    for (const f of [...new Set([...found, ...errors])]) { problems++; console.log(`[${w}] ${path} : ${f}`); }
  }
  await ctx.close();
  console.log(`— largeur ${w} : ${paths.length} pages parcourues`);
}
await browser.close();
console.log(problems ? `${problems} point(s) à regarder` : "aucun défaut relevé");
