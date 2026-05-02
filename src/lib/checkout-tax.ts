/** Demo sales / VAT rates on subtotal only (excluding processing fee). */
export type CheckoutCountry = {
  code: string;
  name: string;
  /** 0.0875 = 8.75% */
  taxRate: number;
  shortLabel: string;
};

export const PROCESSING_FEE_RATE = 0.04;

export const CHECKOUT_COUNTRIES: CheckoutCountry[] = [
  { code: "US", name: "United States", taxRate: 0.0875, shortLabel: "Sales tax (~8.75%) — demo blended" },
  { code: "GB", name: "United Kingdom", taxRate: 0.2, shortLabel: "VAT 20%" },
  { code: "FR", name: "France", taxRate: 0.2, shortLabel: "VAT 20%" },
  { code: "DE", name: "Germany", taxRate: 0.19, shortLabel: "VAT 19%" },
  { code: "LK", name: "Sri Lanka", taxRate: 0.18, shortLabel: "VAT 18%" },
  { code: "IN", name: "India", taxRate: 0.18, shortLabel: "GST 18%" },
  { code: "CA", name: "Canada", taxRate: 0.13, shortLabel: "Sales tax blended (~13%)" },
  { code: "AU", name: "Australia", taxRate: 0.1, shortLabel: "GST 10%" },
  { code: "SG", name: "Singapore", taxRate: 0.09, shortLabel: "GST 9%" },
  { code: "JP", name: "Japan", taxRate: 0.1, shortLabel: "Consumption tax 10%" },
];

export function getCheckoutCountry(code: string): CheckoutCountry {
  return CHECKOUT_COUNTRIES.find((c) => c.code === code) ?? CHECKOUT_COUNTRIES[0];
}

export function roundMoney(n: number): number {
  return Math.round(n * 100) / 100;
}

export type CheckoutTotalsOptions = {
  /** When true (default), the 4% processing fee applies. When false, merchant absorbs fee ($0). */
  customerCoversProcessing?: boolean;
};

/** Subtotal is the product/service amount from the payment link (USD). */
export function computeCheckoutTotals(
  subtotal: number,
  countryCode: string,
  options?: CheckoutTotalsOptions
) {
  const customerCoversProcessing = options?.customerCoversProcessing !== false;
  const country = getCheckoutCountry(countryCode);
  const nominalProcessing = roundMoney(subtotal * PROCESSING_FEE_RATE);
  const processingFee = customerCoversProcessing ? nominalProcessing : 0;
  const salesTax = roundMoney(subtotal * country.taxRate);
  const total = roundMoney(subtotal + processingFee + salesTax);
  return {
    country,
    subtotal,
    processingFee,
    nominalProcessing,
    salesTax,
    total,
    customerCoversProcessing,
    processingPct: PROCESSING_FEE_RATE * 100,
    taxPct: country.taxRate * 100,
  };
}

export type ComputedCheckoutTotals = ReturnType<typeof computeCheckoutTotals>;
