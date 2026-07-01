import type { Currency } from "@/types/calculator";

const CURRENCY_CONFIG: Record<
  Currency,
  { locale: string; currency: string; symbol: string }
> = {
  USD: { locale: "en-US", currency: "USD", symbol: "$" },
  EUR: { locale: "de-DE", currency: "EUR", symbol: "€" },
  MXN: { locale: "es-MX", currency: "MXN", symbol: "$" },
  BRL: { locale: "pt-BR", currency: "BRL", symbol: "R$" },
  COP: { locale: "es-CO", currency: "COP", symbol: "$" },
  CLP: { locale: "es-CL", currency: "CLP", symbol: "$" },
  PEN: { locale: "es-PE", currency: "PEN", symbol: "S/" },
};

const COUNTRY_CURRENCY: Record<string, Currency> = {
  US: "USD",
  MX: "MXN",
  BR: "BRL",
  CO: "COP",
  CL: "CLP",
  PE: "PEN",
  ES: "EUR",
  DE: "EUR",
  FR: "EUR",
  IT: "EUR",
  PT: "EUR",
  AR: "USD",
  EC: "USD",
  UY: "USD",
  CR: "USD",
  PA: "USD",
};

export function getCurrencyForCountry(country: string): Currency {
  return COUNTRY_CURRENCY[country] ?? "USD";
}

export function formatCurrency(
  amount: number,
  currency: Currency = "USD",
  compact = false
): string {
  const config = CURRENCY_CONFIG[currency];
  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: config.currency,
    notation: compact && Math.abs(amount) >= 1000000 ? "compact" : "standard",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getCurrencyOptions(): { value: Currency; label: string }[] {
  return [
    { value: "USD", label: "USD — Dólar estadounidense" },
    { value: "EUR", label: "EUR — Euro" },
    { value: "MXN", label: "MXN — Peso mexicano" },
    { value: "BRL", label: "BRL — Real brasileño" },
    { value: "COP", label: "COP — Peso colombiano" },
    { value: "CLP", label: "CLP — Peso chileno" },
    { value: "PEN", label: "PEN — Sol peruano" },
  ];
}