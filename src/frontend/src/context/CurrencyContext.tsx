import type React from "react";
import { createContext, useCallback, useContext, useState } from "react";

export type Currency = "NGN" | "USD" | "GBP" | "EUR";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (priceCents: bigint | number) => string;
  convertPrice: (priceCents: bigint | number) => number;
}

const RATES: Record<Currency, number> = {
  NGN: 1,
  USD: 1 / 1650,
  GBP: 1 / 2100,
  EUR: 1 / 1800,
};

const SYMBOLS: Record<Currency, string> = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
  EUR: "€",
};

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("NGN");

  const convertPrice = useCallback(
    (priceCents: bigint | number) => {
      const cents =
        typeof priceCents === "bigint" ? Number(priceCents) : priceCents;
      const naira = cents / 100;
      return naira * RATES[currency];
    },
    [currency],
  );

  const formatPrice = useCallback(
    (priceCents: bigint | number) => {
      const amount = convertPrice(priceCents);
      const sym = SYMBOLS[currency];
      if (currency === "NGN") {
        return `${sym}${amount.toLocaleString("en-NG", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
      }
      return `${sym}${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    },
    [convertPrice, currency],
  );

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, formatPrice, convertPrice }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}

export { SYMBOLS };
