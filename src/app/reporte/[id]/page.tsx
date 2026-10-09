"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { CalculationResult } from "@/types/calculator";
import { getResult } from "@/lib/storage";
import { ReportPreview } from "@/components/ReportPreview";
import { useTranslations } from "@/components/LanguageProvider";

export default function ReportPage() {
  const params = useParams();
  const id = params.id as string;
  const [ready, setReady] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const { t } = useTranslations();

  useEffect(() => {
    const frame = window.setTimeout(() => {
      setResult(getResult(id));
      setReady(true);
    }, 0);
    return () => window.clearTimeout(frame);
  }, [id]);

  const pageTitle = !ready
    ? t.notFound.loading
    : result
      ? t.notFound.resultTitle
      : t.notFound.reportNotAvailable;

  useEffect(() => {
    const fullTitle = `${pageTitle} | SpritaScore`;
    let stopped = false;
    const apply = () => {
      if (stopped || document.title === fullTitle) return;
      document.title = fullTitle;
    };
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.head, { childList: true, subtree: true, characterData: true });
    const stop = window.setTimeout(() => {
      stopped = true;
      observer.disconnect();
    }, 1500);
    return () => {
      stopped = true;
      observer.disconnect();
      window.clearTimeout(stop);
    };
  });

  if (!ready) {
    return (
      <>
        <title>{`${pageTitle} | SpritaScore`}</title>
        <div className="py-20 text-center" aria-busy="true">
          <p className="text-muted-foreground">{t.notFound.loading}</p>
        </div>
      </>
    );
  }

  if (!result) {
    return (
      <div className="py-20 text-center">
        <title>{`${pageTitle} | SpritaScore`}</title>
        <h1 className="text-2xl font-bold text-foreground mb-3">{t.notFound.resultMissingTitle}</h1>
        <p className="text-muted-foreground mb-4">{t.notFound.reportNotAvailable}</p>
        <Link href="/" className="text-brand-green">{t.notFound.backHome}</Link>
      </div>
    );
  }

  return (
    <div className="py-8 bg-background min-h-screen print:py-0 print:bg-white">
      <title>{`${pageTitle} | SpritaScore`}</title>
      <div className="container mx-auto px-4 print:px-0">
        <div className="mb-6 print:hidden">
          <Link href={`/resultados/${id}`} className="text-sm text-brand-green hover:underline">
            {t.notFound.backToResults}
          </Link>
        </div>
        <div className="print:shadow-none shadow-2xl rounded-xl overflow-hidden">
          <ReportPreview result={result} />
        </div>
      </div>
    </div>
  );
}
