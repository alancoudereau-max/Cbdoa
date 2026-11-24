// Contrôle du catalogue (src/data/products.ts), sans navigateur : formats et prix de la force Maxi, remise
// propre à chaque référence, prix « dès » des cartes et des titres.
//   node --experimental-strip-types --no-warnings --import ./qa/alias.mjs qa/catalogue.test.mjs
import assert from "node:assert/strict";
import { visibleProducts, startingPriceLabel, lowestPerGram, lowestPerGramCents, getProductsByCategory } from "../src/data/products.ts";
import { bulkPercent, bulkPriceCents, bulkTiersFor, bulkRuleText } from "../src/lib/pricing.ts";

const plain = (s) => s.replace(/[  ]/g, " ");
const bySlug = Object.fromEntries(visibleProducts.map((p) => [p.slug, p]));

// Force Maxi : prix des formats 1 g, 10 g, 25 g (centimes) et prix d'appel attendus, tels que décidés avec Alan.
const maxi = {
  "artic-blue": [[800, 7200, 16000], "dès 6,40 €/g"],
  "mango-pops": [[700, 6300, 14000], "dès 5,60 €/g"],
  "royal-dwarf-small-buds": [[600, 5400, 12000], "dès 4,80 €/g"],
  "californienne-indoor-small-buds": [[700, 6300, 14000], "dès 5,60 €/g"],
  "jaune-mousseux": [[450, 4050, 9000], "dès 3,60 €/g"],
  beldia: [[800, 7200, 16000], "dès 6,40 €/g"],
  // Piatella : même prix que la Beldia, mais une seule remise, −10 % à partir de 25 g
  piatella: [[800, 8000, 18000], "dès 7,20 €/g"],
};
for (const [slug, [prices, label]] of Object.entries(maxi)) {
  const p = bySlug[slug];
  assert.ok(p, `produit absent : ${slug}`);
  assert.deepEqual(p.variants.map((v) => v.format), ["1 g", "10 g", "25 g"], `${slug} : formats`);
  assert.deepEqual(p.variants.map((v) => v.priceCents), prices, `${slug} : prix des formats`);
  assert.equal(plain(startingPriceLabel(p)), label, `${slug} : prix d'appel`);
}
assert.equal(bulkRuleText(bulkTiersFor("piatella")), "−10 % dès 25 g");
assert.equal(bulkRuleText(bulkTiersFor("beldia")), "−10 % dès 10 g, −20 % dès 25 g");

// Toutes les références au tarif dégressif, celles de la liste comme les prochaines : le prix de chaque format
// est celui de la règle de la référence, et chaque référence figure dans la liste ci-dessus.
for (const p of visibleProducts) {
  const bulk = p.variants.filter((v) => v.perGramCents !== undefined);
  if (!bulk.length) continue;
  assert.ok(maxi[p.slug], `${p.slug} : référence au tarif dégressif absente de la liste de contrôle`);
  for (const v of bulk) assert.equal(v.priceCents, bulkPriceCents(v.perGramCents, v.grams, bulkPercent(v.grams, bulkTiersFor(p.slug))), `${v.sku} : prix du format`);
}

// Prix d'appel de tout le catalogue : pour un produit vendu au gramme, c'est le prix au gramme le plus bas de
// ses formats, et ce prix tombe juste (pas de centime arrondi). Les autres produits gardent un prix sans « /g ».
for (const p of visibleProducts) {
  const label = plain(startingPriceLabel(p));
  const best = lowestPerGram(p);
  if (!p.variants.some((v) => v.format === "1 g")) {
    assert.equal(best, undefined, `${p.slug} : pas de prix au gramme attendu`);
    assert.ok(!label.includes("/g"), `${p.slug} : ${label}`);
    continue;
  }
  const perGram = p.variants.filter((v) => /^\d+ g$/.test(v.format)).map((v) => v.priceCents / v.grams);
  assert.equal(best.cents, Math.min(...perGram), `${p.slug} : prix au gramme le plus bas`);
  assert.ok(Number.isInteger(best.cents), `${p.slug} : prix au gramme non entier`);
  assert.ok(label.startsWith("dès ") && label.endsWith("/g"), `${p.slug} : ${label}`);
  // Jamais plus haut que le prix du gramme seul
  assert.ok(best.cents <= Math.min(...p.variants.filter((v) => v.format === "1 g").map((v) => v.priceCents)), `${p.slug}`);
}

// Rayons : le prix d'appel d'un rayon est celui de sa référence la moins chère au gramme.
assert.equal(lowestPerGramCents(getProductsByCategory("resines")), 360);
assert.equal(lowestPerGramCents(getProductsByCategory("huiles")), undefined);

console.log("catalogue : tous les contrôles passent");
console.log(visibleProducts.map((p) => `  ${p.slug.padEnd(34)} ${plain(startingPriceLabel(p))}`).join("\n"));
