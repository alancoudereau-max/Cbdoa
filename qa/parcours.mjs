// Parcours d'achat complet sur le site construit (npx next start -p 3100) : tarif dégressif de la force Maxi,
// panier, récapitulatif WhatsApp, demande de prix dès 100 g, panier enregistré avant un changement de prix.
//   node qa/parcours.mjs 390        (largeur de l'écran ; 320, 390 et 1440 couvrent téléphone et ordinateur)
// Les montants attendus sont ceux du catalogue du 24 novembre 2026 : à mettre à jour si un prix change.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
// Playwright est installé hors du projet : PLAYWRIGHT_MODULES donne son dossier node_modules (avec la barre finale).
const require = createRequire(process.env.PLAYWRIGHT_MODULES ?? "/home/claude/.npm-global/lib/node_modules/");
const { chromium } = require("playwright");

const BASE = process.env.BASE_URL ?? "http://localhost:3100";
const SHOTS = process.env.SHOTS_DIR ?? "/tmp";
const W = +(process.argv[2] ?? 390);
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? "/usr/bin/google-chrome", args: ["--no-sandbox"] });
const clean = (s) => s.replace(/[  ]/g, " ").replace(/\s+/g, " ").trim();
const errors = [];

async function open(storage = {}) {
  const ctx = await browser.newContext({ viewport: { width: W, height: W < 700 ? 844 : 900 }, deviceScaleFactor: W < 700 ? 2 : 1, hasTouch: W < 700, locale: "fr-FR", timezoneId: "Europe/Paris", reducedMotion: "reduce" });
  await ctx.addInitScript((st) => {
    try {
      if (!sessionStorage.getItem("seeded")) {
        localStorage.setItem("cbdoux-age-ok", String(Date.now() + 864e5));
        for (const [k, v] of Object.entries(st)) localStorage.setItem(k, v);
        sessionStorage.setItem("seeded", "1");
      }
    } catch {}
  }, storage);
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  return { ctx, page };
}
const panel = (page) => page.locator(".panel.paper-object").first();
const tiles = async (page) => (await page.locator('[role="radiogroup"][aria-label="Format"] [role="radio"]').allInnerTexts()).map(clean);
const total = async (page) => clean(await panel(page).locator(".price-tick").innerText());
const drawer = (page) => page.locator('aside[aria-label="Votre panier"]');
const drawerLines = async (page) => (await drawer(page).locator("li.cart-line").allInnerTexts()).map(clean);
const subtotal = async (page) => clean(await drawer(page).locator("span.font-serif").last().innerText());
const closeDrawer = async (page) => { await drawer(page).getByRole("button", { name: "Fermer le panier" }).click(); await page.waitForTimeout(650); };
const add = async (page) => { await panel(page).getByRole("button", { name: "Ajouter au panier" }).click(); await page.waitForTimeout(700); };
const plus = async (page, n) => { for (let i = 0; i < n; i++) await panel(page).getByRole("button", { name: "Augmenter la quantité" }).click(); };
const minus = async (page, n) => { for (let i = 0; i < n; i++) await panel(page).getByRole("button", { name: "Diminuer la quantité" }).click(); };

// ───────────── 1. Fiche Mango Pops : formats, total dégressif selon la quantité
{
  const { ctx, page } = await open();
  await page.goto(BASE + "/produit/mango-pops", { waitUntil: "networkidle" });
  const t = await tiles(page);
  console.log("cases :", t);
  assert.deepEqual(t, ["1 g 7 €", "10 g 63 € 6,30 € le gramme −10 % , 10 % de moins au gramme", "25 g 140 € 5,60 € le gramme −20 % , 20 % de moins au gramme", "100 g et plus Prix à négocier sur WhatsApp"]);
  assert.match(clean(await panel(page).innerText()), /Prix dégressif : −10 % dès 10 g, −20 % dès 25 g de cette référence dans votre panier, tous formats additionnés\./);
  assert.equal(await total(page), "7 €");
  // case de prudence : le bouton reste bloqué tant qu'elle n'est pas cochée
  assert.equal(await panel(page).getByRole("button", { name: "Cochez la case ci-dessus" }).isDisabled(), true);
  await panel(page).locator('input[type="checkbox"]').check();
  await plus(page, 8);
  assert.equal(await total(page), "63 €"); // 9 × 7 €
  await plus(page, 1);
  assert.equal(await total(page), "63 €"); // 10 × 6,30 €
  assert.match(clean(await panel(page).innerText()), /soit 6,30 € le gramme, 10 % de moins qu'au détail/);
  await plus(page, 2);
  assert.equal(await total(page), "75,60 €"); // 12 × 6,30 €
  await minus(page, 2);
  await page.screenshot({ path: `${SHOTS}/p1-fiche-${W}.png` });
  await add(page);
  let lines = await drawerLines(page);
  console.log("panier 1 :", lines, await subtotal(page));
  assert.match(lines[0], /Mango Pops 63 € Force Maxi, 1 g Prix dégressif : −10 %/);
  assert.equal(await subtotal(page), "63 €");
  await closeDrawer(page);

  // + un sachet de 10 g : 20 g au total, toujours −10 %
  await page.getByRole("radio", { name: /^10 g/ }).click();
  // la quantité choisie est conservée d'un format à l'autre : 10 × 10 g = 100 g, −20 %, et le seuil de négociation est signalé
  assert.equal(await total(page), "560 €");
  assert.match(clean(await panel(page).innerText()), /100 g : à partir de 100 g, le prix se négocie\. Demander un prix sur WhatsApp/);
  await minus(page, 9);
  assert.equal(await total(page), "63 €");
  await add(page);
  lines = await drawerLines(page);
  console.log("panier 2 :", lines, await subtotal(page));
  assert.equal(await subtotal(page), "126 €");
  await closeDrawer(page);

  // + 5 × 1 g : 25 g au total, −20 % sur toutes les lignes = 140 €, le prix du sachet de 25 g
  await page.getByRole("radio", { name: /^1 g/ }).click();
  await minus(page, 20);
  await plus(page, 4);
  assert.equal(await total(page), "35 €");
  await add(page);
  lines = await drawerLines(page);
  console.log("panier 3 :", lines, await subtotal(page));
  assert.match(lines[0], /Mango Pops 84 € Force Maxi, 1 g Prix dégressif : −20 %/);
  assert.match(lines[1], /Mango Pops 56 € Force Maxi, 10 g Prix dégressif : −20 %/);
  assert.equal(await subtotal(page), "140 €");
  await page.screenshot({ path: `${SHOTS}/p2-panier-${W}.png` });
  await closeDrawer(page);

  // une référence sans tarif dégressif à côté : son prix ne bouge pas
  await page.goto(BASE + "/produit/super-lemon-haze-hydro-usa", { waitUntil: "networkidle" });
  assert.deepEqual((await tiles(page)).slice(0, 2), ["1 g 6 €", "10 g 55 € 5,50 € le gramme −8 % , 8 % de moins au gramme"]);
  await plus(page, 9);
  assert.equal(await total(page), "60 €");
  await add(page);
  assert.equal(await subtotal(page), "200 €");
  await closeDrawer(page);

  // page panier
  await page.goto(BASE + "/panier", { waitUntil: "networkidle" });
  const cartText = clean(await page.locator("main").innerText());
  assert.match(cartText, /Mango Pops 84 € Force Maxi, 1 g, 5,60 € l'unité Prix dégressif : −20 %/);
  assert.match(cartText, /Mango Pops 56 € Force Maxi, 10 g, 56 € l'unité Prix dégressif : −20 %/);
  assert.match(cartText, /Super Lemon Haze Hydro USA 60 € Classique, 1 g, 6 € l'unité/);
  assert.match(cartText, /Total estimé 200 €/);
  await page.screenshot({ path: `${SHOTS}/p3-page-panier-${W}.png`, fullPage: true });

  // commande : récapitulatif et message WhatsApp
  await page.goto(BASE + "/commande", { waitUntil: "networkidle" });
  await page.getByLabel("Prénom").fill("Camille");
  await page.getByLabel("Nom", { exact: true }).fill("Test");
  await page.getByLabel("Téléphone (WhatsApp)").fill("06 00 00 00 00");
  await page.getByLabel("Code postal").fill("25140");
  await page.getByLabel("Ville").fill("Charquemont");
  await page.getByLabel("Adresse", { exact: true }).fill("1 rue de l'Essai");
  const href = await page.getByRole("link", { name: "Envoyer ma commande sur WhatsApp" }).getAttribute("href");
  const message = decodeURIComponent(href.split("?text=")[1]).replace(/[\u00a0\u202f]/g, " ");
  console.log("----- message WhatsApp -----\n" + message + "\n----------------------------");
  assert.match(message, /• Mango Pops — Force Maxi · 1 g × 15 = 84 € \(prix dégressif −20 %\)/u);
  assert.match(message.replace(/[  ]/g, " "), /• Mango Pops — Force Maxi · 10 g × 1 = 56 € \(prix dégressif −20 %\)/u);
  assert.match(message.replace(/[  ]/g, " "), /• Super Lemon Haze Hydro USA — Classique · 1 g × 10 = 60 €\n/u);
  assert.match(message.replace(/[  ]/g, " "), /Sous-total : 200 €/);
  const recap = clean(await page.locator("main aside").innerText());
  assert.match(recap, /Mango Pops Force Maxi, 1 g, quantité 15 Prix dégressif : −20 % 84 €/);
  assert.match(recap, /Sous-total 200 €/);
  await page.locator("main aside").screenshot({ path: `${SHOTS}/p4-commande-${W}.png` });
  await ctx.close();
}

// ───────────── 2. « 100 g et plus » : demande de prix sur WhatsApp
{
  const { ctx, page } = await open({ "cbdoux-prudence-ack": "1" });
  await page.goto(BASE + "/produit/beldia", { waitUntil: "networkidle" });
  assert.deepEqual(await tiles(page), ["1 g 8 €", "10 g 72 € 7,20 € le gramme −10 % , 10 % de moins au gramme", "25 g 160 € 6,40 € le gramme −20 % , 20 % de moins au gramme", "100 g et plus Prix à négocier sur WhatsApp"]);
  await page.getByRole("radio", { name: /^100 g et plus/ }).click();
  assert.equal(await total(page), "Prix à négocier");
  const link = panel(page).getByRole("link", { name: "Demander un prix sur WhatsApp" });
  const msg = decodeURIComponent((await link.getAttribute("href")).split("?text=")[1]);
  console.log("demande de prix :", msg);
  assert.equal(msg, "Bonjour CBDoux, je souhaite un prix pour 100 g ou plus de Beldia Résine (Force Maxi).");
  assert.equal(await panel(page).getByRole("button", { name: "Ajouter au panier" }).count(), 0);
  await panel(page).screenshot({ path: `${SHOTS}/p5-devis-${W}.png` });
  // retour à un format ordinaire
  await page.getByRole("radio", { name: /^25 g/ }).click();
  assert.equal(await total(page), "160 €");
  await plus(page, 3);
  assert.equal(await total(page), "640 €");
  await add(page);
  const note = clean(await drawer(page).innerText());
  assert.match(note, /100 g de Beldia — Résine : à partir de 100 g, le prix se négocie\. Nous écrire sur WhatsApp/);
  await page.screenshot({ path: `${SHOTS}/p6-panier-100g-${W}.png` });
  await closeDrawer(page);
  // lien « à négocier » du tableau des tarifs
  const row = decodeURIComponent((await page.getByRole("link", { name: "à négocier" }).getAttribute("href")).split("?text=")[1]);
  assert.equal(row, msg);
  await page.goto(BASE + "/commande", { waitUntil: "networkidle" });
  const href = await page.getByRole("link", { name: "Envoyer ma commande sur WhatsApp" }).getAttribute("href");
  const message = decodeURIComponent(href.split("?text=")[1]).replace(/[  ]/g, " ");
  assert.match(message, /• Beldia — Résine — Force Maxi · 25 g × 4 = 640 € \(prix dégressif −20 %\)\nℹ️ 100 g de Beldia — Résine : à partir de 100 g, prix à négocier\./u);
  assert.match(clean(await page.locator("main aside").innerText()), /100 g de Beldia — Résine : à partir de 100 g, le prix se négocie\. Nous vous proposerons un prix en confirmant votre commande\./);
  await ctx.close();
}

// ───────────── 3. Un panier enregistré avant les changements de prix se remet à jour
{
  const old = { state: { lines: [
    { sku: "CALSB-MAXI-1G", slug: "californienne-indoor-small-buds", name: "Californienne Indoor — Small Buds", variantLabel: "Force Maxi · 1 g", format: "1 g", grams: 1, unitPriceCents: 1000, image: "/images/products/californienne-indoor-small-buds.jpg", quantity: 2, force: "maxi" },
    { sku: "CALSB-MAXI-5G", slug: "californienne-indoor-small-buds", name: "Californienne Indoor — Small Buds", variantLabel: "Force Maxi · 5 g", format: "5 g", grams: 5, unitPriceCents: 4000, image: "/images/products/californienne-indoor-small-buds.jpg", quantity: 1, force: "maxi" },
    { sku: "BELD-MAXI-10G", slug: "beldia", name: "Beldia — Résine", variantLabel: "Force Maxi · 10 g", format: "10 g", grams: 10, unitPriceCents: 8000, image: "/images/products/beldia.jpg", quantity: 1, force: "maxi" },
    { sku: "PIAT-MAXI-100G", slug: "piatella", name: "Piatella — Résine", variantLabel: "Force Maxi · 100 g", format: "100 g", grams: 100, unitPriceCents: 50000, image: "/images/products/piatella-2.jpg", quantity: 1, force: "maxi" },
    { sku: "SLH-F1-1G", slug: "super-lemon-haze-hydro-usa", name: "Super Lemon Haze Hydro USA", variantLabel: "Classique · 1 g", format: "1 g", grams: 1, unitPriceCents: 600, image: "/images/products/super-lemon-haze-hydro-usa-2.jpg", quantity: 1, force: 1 },
  ], promoCode: null }, version: 0 };
  const { ctx, page } = await open({ "cbdoux-cart-v2": JSON.stringify(old) });
  await page.goto(BASE + "/panier", { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  const stored = JSON.parse(await page.evaluate(() => localStorage.getItem("cbdoux-cart-v2"))).state.lines.map((l) => [l.sku, l.unitPriceCents, l.perGramCents ?? null, l.quantity]);
  console.log("ancien panier remis à jour :", JSON.stringify(stored));
  assert.deepEqual(stored, [["CALSB-MAXI-1G", 700, 700, 2], ["BELD-MAXI-10G", 7200, 800, 1], ["SLH-F1-1G", 600, null, 1]]);
  const cartText = clean(await page.locator("main").innerText());
  assert.match(cartText, /Californienne Indoor — Small Buds 14 € Force Maxi, 1 g, 7 € l'unité/);
  assert.match(cartText, /Beldia — Résine 72 € Force Maxi, 10 g, 72 € l'unité Prix dégressif : −10 %/);
  assert.match(cartText, /Total estimé 92 €/);
  await ctx.close();
}

await browser.close();
if (errors.length) { console.log("ERREURS NAVIGATEUR :", errors); process.exit(1); }
console.log(`parcours ${W} px : tout est conforme`);
