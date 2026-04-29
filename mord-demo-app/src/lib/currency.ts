export type CurrencyCode = "USD" | "GBP" | "INR" | "EUR";

export type CountryCode =
  | "US"
  | "GB"
  | "IN"
  | "DE"
  | "FR";

const COUNTRY_TO_CURRENCY: Record<CountryCode, CurrencyCode> = {
  US: "USD",
  GB: "GBP",
  IN: "INR",
  DE: "EUR",
  FR: "EUR",
};

const CURRENCY_META: Record<
  CurrencyCode,
  { code: CurrencyCode; symbol: string; locale: string }
> = {
  USD: { code: "USD", symbol: "$", locale: "en-US" },
  GBP: { code: "GBP", symbol: "£", locale: "en-GB" },
  INR: { code: "INR", symbol: "₹", locale: "en-IN" },
  EUR: { code: "EUR", symbol: "€", locale: "de-DE" },
};

export function currencyForCountry(country: CountryCode): CurrencyCode {
  return COUNTRY_TO_CURRENCY[country];
}

export function formatMoney(amount: number, currency: CurrencyCode) {
  const meta = CURRENCY_META[currency];
  try {
    return new Intl.NumberFormat(meta.locale, {
      style: "currency",
      currency: currency,
      currencyDisplay: "symbol",
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${meta.symbol}${amount.toFixed(2)}`;
  }
}

export function isCountryCode(v: string): v is CountryCode {
  return v === "US" || v === "GB" || v === "IN" || v === "DE" || v === "FR";
}

export const COUNTRY_OPTIONS: Array<{ code: CountryCode; name: string }> = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "IN", name: "India" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
];

