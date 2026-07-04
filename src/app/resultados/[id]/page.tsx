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
  const [result, setResult] = useState<CalculationResult | null>(null);
  const { t, locale } = useTranslations();

  useEffect(() => {
    const stored = getResult(id);
    setResult(stored);
  }, [id]);

  if (!result) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground mb-4">{t.notFound.resultNotFound}</p>
        <Link href="/" className="text-brand-green font-semibold hover:underline">
          {t.notFound.backHome}
        </Link>
      </div>
    );
  }

  const calc = getCalculatorById(result.calculatorId);

  return (
    <div className="py-12 bg-background min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          {t.notFound.backToCalculators}
        </Link>
        <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tight">{t.notFound.resultTitle}</h1>
        <p className="text-muted-foreground mb-8">{calc ? tr(calc.title, locale) : ""}</p>
        <ResultsView result={result} />
      </div>
    </div>
  );
}
