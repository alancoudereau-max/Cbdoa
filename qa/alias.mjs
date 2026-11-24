// Permet aux contrôles sans navigateur de charger les fichiers du site qui s'importent entre eux par « @/… »
// (l'alias de tsconfig.json, que Node ne connaît pas). Usage :
//   node --experimental-strip-types --no-warnings --import ./qa/alias.mjs qa/catalogue.test.mjs
import { registerHooks } from "node:module";
import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const src = path.resolve(import.meta.dirname, "../src");

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      const base = path.join(src, specifier.slice(2));
      const file = [".ts", ".tsx", "/index.ts"].map((ext) => base + ext).find(existsSync);
      if (file) return nextResolve(pathToFileURL(file).href, context);
    }
    return nextResolve(specifier, context);
  },
});
