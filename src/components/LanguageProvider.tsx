"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Locale } from "@/types/calculator";
import { getTranslations } from "@/i18n";
import { localizedSibling } from "@/lib/calculatorPath";
import { LOCALE_COOKIE, localeCookieString, readLocaleCookie } from "@/lib/localePreference";

const LOCALE_KEY = LOCALE_COOKIE;

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
    const frame = window.setTimeout(() => {
      if (localizedSibling(window.location.pathname, "es")) return;
      const stored = localStorage.getItem(LOCALE_KEY);
      const fromCookie = document.cookie
        .split("; ")
        .find((part) => part.startsWith(`${LOCALE_COOKIE}=`))
        ?.split("=")[1];
      const next = readLocaleCookie(stored ?? fromCookie);
      setLocaleState(next);
      localStorage.setItem(LOCALE_KEY, next);
      document.cookie = localeCookieString(next);
    }, 0);
    return () => window.clearTimeout(frame);
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(LOCALE_KEY, next);
    document.cookie = localeCookieString(next);
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
