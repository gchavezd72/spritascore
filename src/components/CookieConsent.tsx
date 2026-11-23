"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/components/LanguageProvider";
import { updateAnalyticsConsent } from "@/lib/gtm";

const CONSENT_KEY = "spritascore_cookie_consent";
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function consentMissing() {
  return localStorage.getItem(CONSENT_KEY) == null;
}

function emitConsent() {
  listeners.forEach((listener) => listener());
}

export function CookieConsent() {
  const visible = useSyncExternalStore(subscribe, consentMissing, () => false);
  const { t } = useTranslations();

  const respond = (value: "accepted" | "rejected") => {
    localStorage.setItem(CONSENT_KEY, value);
    updateAnalyticsConsent(value === "accepted" ? "granted" : "denied");
    emitConsent();
  };

  if (!visible) return null;

  const [before, after] = t.cookieConsent.text.split("{privacyLink}");

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] border-t border-border-hairline bg-surface/95 backdrop-blur-md px-4 py-4 shadow-[0_-4px_16px_rgba(0,0,0,0.3)]">
      <div className="container mx-auto flex max-w-7xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {before}
          <Link href="/privacidad" className="font-semibold text-brand-green underline underline-offset-2">
            {t.cookieConsent.privacyLinkText}
          </Link>
          {after}
        </p>
        <div className="flex shrink-0 gap-3">
          <Button variant="ghost" onClick={() => respond("rejected")}>
            {t.cookieConsent.reject}
          </Button>
          <Button onClick={() => respond("accepted")}>
            {t.cookieConsent.accept}
          </Button>
        </div>
      </div>
    </div>
  );
}
