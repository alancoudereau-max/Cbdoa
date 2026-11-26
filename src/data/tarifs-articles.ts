/**
 * Articles « Sur commande » vendus à la pièce (accessoires, cosmétiques), en centimes d'euro.
 * Une ligne par référence : ses formats, chacun [libellé, prix, poids emballé en grammes pour le port].
 * Les prix sont les prix publics conseillés par les marques.
 * Ce fichier ne dépend d'aucun autre : il est chargé tel quel par le site et par les contrôles (qa/).
 */
export const ON_ORDER_ITEMS: Readonly<Record<string, ReadonlyArray<readonly [string, number, number]>>> = {
  // Accessoires
  "raw-plateau": [["Pièce", 1500, 350]],
  "raw-cendrier": [["Pièce", 700, 150]],
  "raw-grinder": [["Pièce", 3000, 250]],
  "raw-classic-king-size": [["1 carnet", 100, 10], ["Boîte de 50 carnets", 5000, 500]],
  "raw-wide-tips": [["1 carnet", 50, 10], ["Boîte de 50 carnets", 2500, 500]],
  "ocb-black-1": [["1 carnet", 50, 10], ["Boîte de 50 carnets", 2500, 400]],
  "ocb-black-4": [["1 carnet", 130, 10], ["Boîte de 25 carnets", 3250, 300]],
  "ocb-black-slim": [["1 carnet", 80, 10], ["Boîte de 50 carnets", 4000, 500]],
  "ocb-black-slim-tips": [["1 carnet", 110, 15], ["Boîte de 32 carnets", 3520, 500]],
  "juicy-hemp-wraps-blue": [["Paquet de 2", 80, 10], ["Boîte de 25 paquets", 2000, 300]],
  "cones-basic": [["Étui", 390, 30]],
  // Cosmétiques
  "trycome-baume-levres": [["Stick de 4,8 g", 990, 20]],
  "trycome-gommage": [["Pot de 245 g", 2990, 320]],
  "trycome-creme-jour": [["Pot de 50 ml", 3990, 150]],
  "trycome-creme-nuit": [["Pot de 50 ml", 4990, 150]],
  "trycome-serum-visage": [["Flacon de 50 ml", 3990, 150]],
  "trycome-creme-mains": [["Boîte de 60 ml", 2990, 120]],
  "trycome-huile-corps": [["Flacon de 100 ml", 3990, 250]],
  "trycome-serum-cheveux": [["Flacon de 100 ml", 4990, 250]],
  "alpinium-gel-arnica": [["Pot", 3990, 150]],
  "alpinium-creme-decontractante": [["Pot", 3990, 200]],
  "alpinium-baume-refroidissant": [["Pot", 2990, 150]],
  "alpinium-baume-chauffant": [["Pot", 2990, 150]],
  "alpinium-gel-cryogene": [["Flacon pompe", 4990, 300]],
  "alpinium-huile-relaxante": [["Flacon pompe", 4990, 300]],
};
