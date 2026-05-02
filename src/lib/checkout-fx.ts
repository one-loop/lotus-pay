/**
 * Demo FX table: multiply a USD amount by `multiplier` to get the billing country's currency.
 * Rates are illustrative for the demo only — not updated for trading.
 */

export type CheckoutFxRow = {
  /** ISO 4217 */
  currency: string;
  /** localAmount = USD * multiplier */
  multiplier: number;
  fractionDigits: number;
};

/** Keyed by the same codes as checkout billing / tax (`CHECKOUT_COUNTRIES[].code`). */
export const CHECKOUT_USD_TO_LOCAL: Record<string, CheckoutFxRow> = {
  US: { currency: "USD", multiplier: 1, fractionDigits: 2 },
  GB: { currency: "GBP", multiplier: 0.786, fractionDigits: 2 },
  FR: { currency: "EUR", multiplier: 0.918, fractionDigits: 2 },
  DE: { currency: "EUR", multiplier: 0.918, fractionDigits: 2 },
  LK: { currency: "LKR", multiplier: 322.5, fractionDigits: 2 },
  IN: { currency: "INR", multiplier: 86.4, fractionDigits: 2 },
  CA: { currency: "CAD", multiplier: 1.441, fractionDigits: 2 },
  AU: { currency: "AUD", multiplier: 1.549, fractionDigits: 2 },
  SG: { currency: "SGD", multiplier: 1.324, fractionDigits: 2 },
  JP: { currency: "JPY", multiplier: 155.2, fractionDigits: 0 },
};

export function getCheckoutFx(countryCode: string): CheckoutFxRow {
  return CHECKOUT_USD_TO_LOCAL[countryCode] ?? CHECKOUT_USD_TO_LOCAL.US;
}

export function isUsdBilling(countryCode: string): boolean {
  return getCheckoutFx(countryCode).currency === "USD";
}

export function convertUsdToLocal(usdAmount: number, countryCode: string): number {
  const { multiplier, fractionDigits } = getCheckoutFx(countryCode);
  const raw = usdAmount * multiplier;
  if (fractionDigits <= 0) return Math.round(raw);
  const f = Math.pow(10, fractionDigits);
  return Math.round(raw * f) / f;
}

export function formatMoneyInCurrency(
  amount: number,
  currencyCode: string,
  fractionDigits: number
): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(amount);
  } catch {
    return `${amount.toFixed(fractionDigits)} ${currencyCode}`;
  }
}

/** Format a USD amount converted to local billing currency */
export function formatUsdAsLocal(usdAmount: number, billingCountryCode: string): string {
  const fx = getCheckoutFx(billingCountryCode);
  const local = convertUsdToLocal(usdAmount, billingCountryCode);
  return formatMoneyInCurrency(local, fx.currency, fx.fractionDigits);
}
