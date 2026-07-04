"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/components/LanguageProvider";

const CONSENT_KEY = "spritascore_cookie_consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslations();

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) setVisible(true);
  }, []);

  const respond = (value: "accepted" | "rejected") => {
    localStorage.setItem(CONSENT_KEY, value);
    setVisible(false);
  };

  if (!visible) return null;

  const [before, after] = t.cookieConsent.text.split("{privacyLink}");

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-border-hairline bg-surface/95 backdrop-blur-md px-4 py-4 shadow-[0_-4px_16px_rgba(0,0,0,0.3)]">
      <div className="container mx-auto flex max-w-7xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {before}
          <Link href="/privacidad" className="font-semibold text-brand-green hover:underline">
            {t.cookieConsent.privacyLinkText}
          </Link>
          {after}
        </p>
        <div className="flex shrink-0 gap-3">
          <Button variant="ghost" size="sm" onClick={() => respond("rejected")}>
            {t.cookieConsent.reject}
          </Button>
          <Button size="sm" onClick={() => respond("accepted")}>
            {t.cookieConsent.accept}
          </Button>
        </div>
      </div>
    </div>
  );
}
