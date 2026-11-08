/** Certificats d'analyse (COA) — images dans /public/images/coa/ */
export type Coa = {
  id: string;
  name: string;
  type: string;
  date: string;
  cbd: string;
  thc: string;
  method: string;
  lab: string;
  images: string[];
  /** Produits concernés (slugs) */
  productSlugs: string[];
};

export const coas: Coa[] = [
  {
    id: "sour-lifter",
    name: "Sour Lifter",
    type: "Fleur CBD",
    date: "09/03/2026",
    cbd: "12,42 %",
    thc: "0,23 %",
    method: "HPLC",
    lab: "CBD-THC Lab",
    images: ["/images/coa/sour-lifter.jpg"],
    productSlugs: [],
  },
  {
    id: "critical-berry",
    name: "Critical Berry",
    type: "Fleur CBD",
    date: "09/02/2026",
    cbd: "12,43 %",
    thc: "0,22 %",
    method: "HPLC",
    lab: "CBD-THC Lab",
    images: ["/images/coa/critical-berry.jpg"],
    productSlugs: ["critical-berry-indoor-usa"],
  },
  {
    id: "snow-white-v2",
    name: "Snow White V2",
    type: "Fleur CBD (chanvre)",
    date: "09/01/2026",
    cbd: "9,95 %",
    thc: "0,19 %",
    method: "HPLC",
    lab: "CBD-THC Lab",
    images: ["/images/coa/snow-white-v2.jpg"],
    productSlugs: ["snow-white"],
  },
  {
    id: "amnesia",
    name: "Amnesia",
    type: "Fleur CBD (chanvre)",
    date: "30/10/2025",
    cbd: "9,48 %",
    thc: "0,26 %",
    method: "HPLC",
    lab: "CBD-THC Lab",
    images: ["/images/coa/amnesia.jpg"],
    productSlugs: ["amnesia-haze-hydro"],
  },
  {
    id: "peach-haze",
    name: "Peach Haze",
    type: "Fleur CBD (chanvre)",
    date: "08/10/2025",
    cbd: "8,67 %",
    thc: "0,27 %",
    method: "HPLC",
    lab: "CBD-THC Lab",
    images: ["/images/coa/peach-haze.jpg"],
    productSlugs: [],
  },
  {
    id: "3x-filtre",
    name: "3X Filtré",
    type: "Résine CBD",
    date: "08/10/2025",
    cbd: "9,56 %",
    thc: "0,24 %",
    method: "HPLC",
    lab: "CBD-THC Lab",
    images: ["/images/coa/3x-filtre.jpg"],
    productSlugs: ["3x-filtre"],
  },
  {
    id: "distillat-csa",
    name: "Distillat CSA",
    type: "Extrait / distillat (renforcement CBD)",
    date: "16/06/2025",
    cbd: "46,69 %",
    thc: "ND",
    method: "GC-MS / GC-FID",
    lab: "Spectral Fingerprints (Slovénie)",
    images: ["/images/coa/distillat-csa-p1.jpg", "/images/coa/distillat-csa-p2.jpg", "/images/coa/distillat-csa-p3.jpg"],
    productSlugs: [],
  },
];
