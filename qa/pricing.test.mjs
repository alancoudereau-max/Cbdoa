// Contrôle de la règle de prix dégressif (src/lib/pricing.ts), sans navigateur.
//   node --experimental-strip-types --no-warnings qa/pricing.test.mjs
import assert from "node:assert/strict";
import { bulkPercent, bulkPriceCents, bulkRuleText, priceCart, quoteMessage, QUOTE_FROM_GRAMS } from "../src/lib/pricing.ts";

// Paliers
for (const [g, pct] of [[0, 0], [1, 0], [9, 0], [10, 10], [11, 10], [24, 10], [25, 20], [26, 20], [99, 20], [100, 20], [500, 20]]) assert.equal(bulkPercent(g), pct, `palier ${g} g`);
assert.equal(bulkRuleText(), "−10 % dès 10 g, −20 % dès 25 g");
assert.equal(QUOTE_FROM_GRAMS, 100);

// Prix des formats pour chaque prix au gramme du catalogue (centimes)
const grid = { 450: [450, 4050, 9000], 600: [600, 5400, 12000], 700: [700, 6300, 14000], 800: [800, 7200, 16000], 1000: [1000, 9000, 20000] };
for (const [p, [g1, g10, g25]] of Object.entries(grid)) {
  assert.equal(bulkPriceCents(+p, 1), g1);
  assert.equal(bulkPriceCents(+p, 10), g10);
  assert.equal(bulkPriceCents(+p, 25), g25);
}

const line = (slug, grams, quantity, perGramCents, unitPriceCents) => ({ slug, grams, quantity, perGramCents, unitPriceCents: unitPriceCents ?? bulkPriceCents(perGramCents, grams) });

// 9 × 1 g : pas de remise ; 10 × 1 g : −10 % ; 12 × 1 g : −10 % sur les 12
let c = priceCart([line("mango", 1, 9, 700)]);
assert.deepEqual([c.subtotalCents, c.lines[0].bulkPercent, c.lines[0].unitCents], [6300, 0, 700]);
c = priceCart([line("mango", 1, 10, 700)]);
assert.deepEqual([c.subtotalCents, c.lines[0].bulkPercent, c.lines[0].unitCents], [6300, 10, 630]);
c = priceCart([line("mango", 1, 12, 700)]);
assert.deepEqual([c.subtotalCents, c.lines[0].bulkPercent], [7560, 10]);

// Sachet 10 g seul = 63 € ; 10 g + 5 × 1 g = 15 g à −10 % = 94,50 €
c = priceCart([line("mango", 10, 1, 700)]);
assert.deepEqual([c.subtotalCents, c.lines[0].bulkPercent], [6300, 10]);
c = priceCart([line("mango", 10, 1, 700), line("mango", 1, 5, 700)]);
assert.equal(c.subtotalCents, 9450);
assert.deepEqual(c.lines.map((l) => l.totalCents), [6300, 3150]);

// 2 × 10 g + 5 × 1 g = 25 g : −20 % sur tout = 140 € (le prix du sachet 25 g)
c = priceCart([line("mango", 10, 2, 700), line("mango", 1, 5, 700)]);
assert.equal(c.subtotalCents, 14000);
assert.deepEqual(c.lines.map((l) => [l.unitCents, l.bulkPercent]), [[5600, 20], [560, 20]]);
c = priceCart([line("mango", 25, 1, 700)]);
assert.equal(c.subtotalCents, 14000);

// Deux références différentes ne s'additionnent pas : 9 g + 9 g, aucune remise
c = priceCart([line("mango", 1, 9, 700), line("artic", 1, 9, 800)]);
assert.deepEqual([c.subtotalCents, c.lines.map((l) => l.bulkPercent)], [13500, [0, 0]]);

// Une référence sans tarif dégressif garde son prix catalogue, même à 10 × 1 g
c = priceCart([{ slug: "slh", grams: 1, quantity: 10, unitPriceCents: 600 }, line("mango", 1, 10, 700)]);
assert.deepEqual(c.lines.map((l) => [l.totalCents, l.bulkPercent]), [[6000, 0], [6300, 10]]);

// Résine à 4,50 € : centimes exacts à chaque palier
c = priceCart([line("jaune", 1, 10, 450)]);
assert.deepEqual([c.lines[0].unitCents, c.subtotalCents], [405, 4050]);
c = priceCart([line("jaune", 1, 20, 450), line("jaune", 10, 1, 450)]);
assert.deepEqual(c.lines.map((l) => l.totalCents), [7200, 3600]);

// À partir de 100 g : signalé pour négociation, prix affiché plafonné à −20 %
c = priceCart([line("beldia", 25, 4, 800)]);
assert.deepEqual([c.subtotalCents, c.quotes], [64000, [{ slug: "beldia", grams: 100 }]]);
c = priceCart([line("beldia", 25, 3, 800), line("beldia", 10, 2, 800)]);
assert.deepEqual(c.quotes, []);

// Jamais plus cher que le prix catalogue du format (ancien panier dont le prix au gramme serait faux)
c = priceCart([{ slug: "x", grams: 10, quantity: 1, perGramCents: 900, unitPriceCents: 7200 }]);
assert.equal(c.lines[0].unitCents, 7200);

// Panier vide
assert.deepEqual(priceCart([]), { lines: [], subtotalCents: 0, quotes: [] });

assert.equal(quoteMessage("Beldia — Résine", "Force Maxi"), "Bonjour CBDoux, je souhaite un prix pour 100 g ou plus de Beldia Résine (Force Maxi).");
console.log("pricing : tous les contrôles passent");
