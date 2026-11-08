/**
 * Codes promo affichés dans le panier (à titre indicatif : la remise est confirmée sur la facture).
 * Montants en centimes.
 */
export type Promo = {
  code: string;
  type: "fixed" | "percent";
  value: number;
  minSubtotalCents: number;
  description: string;
  firstOrderOnly?: boolean;
};

export const promos: Promo[] = [
  { code: "BIENVENUE10", type: "fixed", value: 1000, minSubtotalCents: 10000, description: "10 € offerts dès 100 € — première commande", firstOrderOnly: true },
];

export function evaluatePromo(code: string, subtotalCents: number): { promo?: Promo; discountCents: number; error?: string } {
  const promo = promos.find((p) => p.code === code.trim().toUpperCase());
  if (!promo) return { discountCents: 0, error: "Code promo inconnu." };
  if (subtotalCents < promo.minSubtotalCents) {
    return { discountCents: 0, error: `Ce code est valable à partir de ${(promo.minSubtotalCents / 100).toLocaleString("fr-FR")} € d'achat.` };
  }
  const raw = promo.type === "percent" ? Math.round((subtotalCents * promo.value) / 100) : promo.value;
  return { promo, discountCents: Math.min(raw, subtotalCents) };
}
