"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { CalculationResult } from "@/types/calculator";
import { getResult } from "@/lib/storage";
import { ResultsView } from "@/components/ResultsView";
import { getCalculatorById } from "@/data/calculatorConfigs";
import { tr } from "@/lib/translate";
import { useTranslations } from "@/components/LanguageProvider";

export default function ResultsPage() {
  const params = useParams();
  const id = params.id as string;
  const [ready, setReady] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const { t, locale } = useTranslations();

  useEffect(() => {
    const frame = window.setTimeout(() => {
      setResult(getResult(id));
      setReady(true);
    }, 0);
    return () => window.clearTimeout(frame);
  }, [id]);

  const calc = result ? getCalculatorById(result.calculatorId) : undefined;
  const calcTitle = calc ? tr(calc.title, locale) : "";
  const pageTitle = !ready
    ? t.notFound.loading
    : result
      ? `${t.notFound.resultTitle}${calcTitle ? ` — ${calcTitle}` : ""}`
      : t.notFound.resultMissingTitle;

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
        <p className="text-muted-foreground mb-4 max-w-lg mx-auto">{t.notFound.resultNotFound}</p>
        <Link href="/" className="text-brand-green font-semibold hover:underline">
          {t.notFound.backHome}
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 bg-background min-h-screen">
      <title>{`${pageTitle} | SpritaScore`}</title>
      <div className="container mx-auto px-4 max-w-5xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          {t.notFound.backToCalculators}
        </Link>
        <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tight">{t.notFound.resultTitle}</h1>
        <p className="text-muted-foreground mb-8">{calcTitle}</p>
        <ResultsView result={result} />
      </div>
    </div>
  );
}
