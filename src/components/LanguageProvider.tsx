"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Locale } from "@/types/calculator";
import { getTranslations } from "@/i18n";
import { localeFromPath } from "@/lib/calculatorPath";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  localeFromCookieHeader,
  readLocaleCookie,
  writeLocaleCookie,
} from "@/lib/localePreference";

const LOCALE_KEY = LOCALE_COOKIE;

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale, options?: { persist?: boolean }) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
});

export function LanguageProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    const frame = window.setTimeout(() => {
      const fromPath = localeFromPath(window.location.pathname);
      if (fromPath) {
        setLocaleState(fromPath);
        return;
      }
      const stored = localStorage.getItem(LOCALE_KEY);
      const fromCookie = localeFromCookieHeader(document.cookie);
      const next = readLocaleCookie(stored ?? fromCookie);
      setLocaleState(next);
      localStorage.setItem(LOCALE_KEY, next);
      writeLocaleCookie(next);
    }, 0);
    return () => window.clearTimeout(frame);
  }, []);

  const setLocale = useCallback((next: Locale, options?: { persist?: boolean }) => {
    setLocaleState(next);
    if (options?.persist === false) return;
    localStorage.setItem(LOCALE_KEY, next);
    writeLocaleCookie(next);
  }, []);

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
