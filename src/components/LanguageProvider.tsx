"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Locale } from "@/types/calculator";
import { getTranslations } from "@/i18n";

const LOCALE_KEY = "spritascore_locale";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: "es",
  setLocale: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es");

  useEffect(() => {
    const stored = localStorage.getItem(LOCALE_KEY) as Locale | null;
    if (stored === "es" || stored === "en" || stored === "pt") setLocaleState(stored);
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(LOCALE_KEY, next);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLocale() {
  return useContext(LanguageContext);
}

export function useTranslations() {
  const { locale, setLocale } = useContext(LanguageContext);
  return { t: getTranslations(locale), locale, setLocale };
}
