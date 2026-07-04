"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { CalculationResult } from "@/types/calculator";
import { getResult } from "@/lib/storage";
import { ReportPreview } from "@/components/ReportPreview";
import { ReportUnlockModal } from "@/components/ReportUnlockModal";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/components/LanguageProvider";

export default function ReportPage() {
  const params = useParams();
  const id = params.id as string;
  const [result, setResult] = useState<CalculationResult | null>(null);
  const { t } = useTranslations();

  useEffect(() => {
    setResult(getResult(id));
  }, [id]);

  if (!result) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">{t.notFound.reportNotAvailable}</p>
        <Link href="/" className="text-brand-green">{t.notFound.backHome}</Link>
      </div>
    );
  }

  const locked = !result.leadCaptured;

  return (
    <div className="py-8 bg-background min-h-screen print:py-0 print:bg-white">
      {locked && (
        <ReportUnlockModal result={result} onUnlocked={(updated) => setResult(updated)} />
      )}
      <div className="container mx-auto px-4 print:px-0">
        <div className="mb-6 print:hidden">
          <Link href={`/resultados/${id}`} className="text-sm text-brand-green hover:underline">
            {t.notFound.backToResults}
          </Link>
        </div>
        <div className={cn(locked && "pointer-events-none select-none blur-sm", "print:shadow-none shadow-2xl rounded-xl overflow-hidden")} aria-hidden={locked}>
          <ReportPreview result={result} />
        </div>
      </div>
    </div>
  );
}
