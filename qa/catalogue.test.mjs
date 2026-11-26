// Contrôle du catalogue (src/data/products.ts), sans navigateur : formats et prix de la force Maxi, remise
// propre à chaque référence, prix « dès » des cartes et des titres.
//   node --experimental-strip-types --no-warnings --import ./qa/alias.mjs qa/catalogue.test.mjs
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { visibleProducts, visibleOnOrderProducts, allProducts, getProduct, findVariant, startingPriceLabel, lowestPerGram, lowestPerGramCents, getProductsByCategory, thcLabel } from "../src/data/products.ts";
import { onOrderGroups } from "../src/data/sur-commande.ts";
import { ON_ORDER_RATES } from "../src/data/tarifs-sur-commande.ts";
import { bulkPercent, bulkPriceCents, bulkTiersFor, bulkRuleText, onOrderEntry } from "../src/lib/pricing.ts";

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

// ───────────── Références sur commande (src/data/sur-commande.ts)
// Elles ne sont pas dans les rayons : le catalogue en stock ne change pas.
assert.equal(visibleProducts.length, 22);
assert.ok(visibleProducts.every((p) => !p.onOrder), "une référence sur commande est dans le catalogue en stock");
assert.equal(visibleOnOrderProducts.length, 67);
assert.equal(visibleOnOrderProducts.length, Object.keys(ON_ORDER_RATES).length, "chaque tarif a sa référence, et inversement");
assert.equal(new Set(allProducts.map((p) => p.slug)).size, allProducts.length, "deux produits ont le même identifiant");
assert.equal(new Set(allProducts.map((p) => p.name)).size, allProducts.length, "deux produits ont le même nom");
const skus = allProducts.flatMap((p) => p.variants.map((v) => v.sku));
assert.equal(new Set(skus).size, skus.length, "deux formats ont le même identifiant");
const groupKeys = onOrderGroups.map((g) => g.key);
// Prix attendus de quelques références (centimes : 25 g, 100 g, 500 g ; 25 g est la commande minimale) et leur prix d'appel.
const surCommande = {
  "mandarine-sherbet": [[37125, 108000, 378000], "dès 7,56 €/g"],
  "white-rhino": [[13750, 40000, 138000], "dès 2,76 €/g"],
  "trim-standard": [[1525, 4400, 16500], "dès 0,33 €/g"],
  "small-buds-standard": [[2200, 6400, 24000], "dès 0,48 €/g"],
  ketama: [[6875, 20000, 75000], "dès 1,50 €/g"],
  "ice-o-lator": [[26125, 76000, 285000], "dès 5,70 €/g"],
  "moon-rock": [[15125, 44000, 147000], "dès 2,94 €/g"],
};
for (const [slug, [prices, label]] of Object.entries(surCommande)) {
  const p = getProduct(slug);
  assert.ok(p?.onOrder, `référence sur commande absente : ${slug}`);
  assert.deepEqual(p.variants.map((v) => v.priceCents), prices, `${slug} : prix des formats`);
  assert.equal(plain(startingPriceLabel(p)), label, `${slug} : prix d'appel`);
}
for (const p of visibleOnOrderProducts) {
  const rates = ON_ORDER_RATES[p.slug];
  assert.ok(rates, `${p.slug} : tarif manquant`);
  assert.ok(groupKeys.includes(p.onOrder), `${p.slug} : famille inconnue`);
  assert.equal(p.badge, "Sur commande");
  assert.deepEqual(p.variants.map((v) => v.format), ["25 g", "100 g", "500 g"], `${p.slug} : formats (25 g au minimum)`);
  for (const v of p.variants) {
    assert.deepEqual(onOrderEntry(v.sku), [v.priceCents, v.perGramCents], `${v.sku} : prix du format`);
    assert.equal(v.force, 1, `${v.sku} : aucune référence sur commande n'est enrichie`);
    assert.equal(findVariant(v.sku)?.product.slug, p.slug);
  }
  // Prix d'appel : le prix au gramme des 500 g, le plus bas des trois
  assert.equal(lowestPerGram(p).cents, rates[2], `${p.slug} : prix d'appel`);
  assert.equal(plain(startingPriceLabel(p)).startsWith("dès "), true);
  assert.ok(existsSync(new URL(`../public${p.image}`, import.meta.url)), `${p.slug} : photo absente (${p.image})`);
  assert.equal(p.description.length, 4, `${p.slug} : quatre paragraphes`);
  const text = [p.name, p.short, p.aromas, p.profile, p.usage, p.origin, ...p.description, ...p.keywords].join(" ");
  assert.ok(!/undefined|null|\s{2,}| \.| ,/.test(text), `${p.slug} : texte mal formé`);
  assert.ok(/^THC (< 0,3 %|0,[12] % max)$/.test(plain(thcLabel(p))), `${p.slug} : ${thcLabel(p)}`);
}
assert.equal(lowestPerGramCents(visibleOnOrderProducts), 33);

console.log("catalogue : tous les contrôles passent");
console.log(`sur commande : ${visibleOnOrderProducts.length} références, ${onOrderGroups.map((g) => `${g.name} ${visibleOnOrderProducts.filter((p) => p.onOrder === g.key).length}`).join(", ")}`);
console.log(visibleProducts.map((p) => `  ${p.slug.padEnd(34)} ${plain(startingPriceLabel(p))}`).join("\n"));
