import "server-only";
import createMollieClient, { type MollieClient, type Payment, PaymentStatus, Locale } from "@mollie/api-client";

let client: MollieClient | null = null;

export function hasMollie(): boolean {
  return Boolean(process.env.MOLLIE_API_KEY);
}

export function isMollieTestMode(): boolean {
  return (process.env.MOLLIE_API_KEY ?? "").startsWith("test_");
}

export function getMollie(): MollieClient {
  if (!process.env.MOLLIE_API_KEY) throw new Error("MOLLIE_API_KEY manquante");
  if (!client) client = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY });
  return client;
}

export function toMollieAmount(cents: number): string {
  return (cents / 100).toFixed(2);
}

/** Crée un paiement Mollie (page de paiement hébergée, 3-D Secure) et retourne l'URL de redirection. */
export async function createMolliePayment(opts: {
  orderId: string;
  orderNumber: string;
  totalCents: number;
  description: string;
  redirectUrl: string;
  cancelUrl: string;
  webhookUrl: string;
  email: string;
  givenName: string;
  familyName: string;
  /** Adresse de facturation complète (si connue) — améliore le taux d'acceptation 3-D Secure */
  address?: { streetAndNumber: string; postalCode: string; city: string; country: string };
}): Promise<{ paymentId: string; checkoutUrl: string }> {
  const mollie = getMollie();
  const payment = await mollie.payments.create({
    amount: { currency: "EUR", value: toMollieAmount(opts.totalCents) },
    description: opts.description,
    redirectUrl: opts.redirectUrl,
    cancelUrl: opts.cancelUrl,
    webhookUrl: opts.webhookUrl,
    locale: Locale.fr_FR,
    metadata: { orderId: opts.orderId, orderNumber: opts.orderNumber },
    ...(opts.address
      ? {
          billingAddress: {
            givenName: opts.givenName,
            familyName: opts.familyName,
            email: opts.email,
            streetAndNumber: opts.address.streetAndNumber,
            postalCode: opts.address.postalCode,
            city: opts.address.city,
            country: opts.address.country,
          },
        }
      : { billingEmail: opts.email }),
    // Permet de réessayer sans créer deux paiements en cas d'erreur réseau
    idempotencyKey: `order-${opts.orderId}`,
  });
  const checkoutUrl = payment.getCheckoutUrl();
  if (!checkoutUrl) throw new Error("Mollie n'a pas renvoyé d'URL de paiement");
  return { paymentId: payment.id, checkoutUrl };
}

export async function getMolliePayment(paymentId: string): Promise<Payment> {
  return getMollie().payments.get(paymentId);
}

/** Traduit le statut Mollie en statut de commande interne. */
export function mapMollieStatus(p: Payment): "paid" | "pending" | "failed" | "cancelled" | "expired" | "refunded" {
  if (p.amountRefunded && Number(p.amountRefunded.value) > 0 && Number(p.amountRefunded.value) >= Number(p.amount.value)) return "refunded";
  switch (p.status) {
    case PaymentStatus.paid:
    case PaymentStatus.authorized:
      return "paid";
    case PaymentStatus.failed:
      return "failed";
    case PaymentStatus.canceled:
      return "cancelled";
    case PaymentStatus.expired:
      return "expired";
    default:
      return "pending";
  }
}
