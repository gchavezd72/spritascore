"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, ClipboardCopy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { trackExecutiveEvent } from "@/lib/analytics";
import { downloadExecutiveScorePdf } from "@/lib/executivePdf";
import type { ExecutiveScoreResult } from "@/lib/calculateExecutiveRiskScore";
import type { ExecutiveAnswerId } from "@/data/executiveSoftwareRiskScore";
import { AuditOffer } from "@/components/AuditOffer";
import { ExecutiveLeadForm } from "@/components/executive/ExecutiveLeadForm";
import { EXECUTIVE_CARD } from "@/data/executiveSoftwareRiskScore";
import { auditPath } from "@/lib/auditRoutes";
import type { UtmParams } from "@/lib/executiveUtm";
import { formatExecutive, getExecutiveCopy } from "@/i18n/executive";
import type { Locale } from "@/types/calculator";
import { cn } from "@/lib/utils";

const LEVEL_COLORS: Record<ExecutiveScoreResult["level"], string> = {
  low: "text-risk-low",
  moderate: "text-risk-moderate",
  high: "text-risk-high",
  critical: "text-risk-critical",
};

interface ExecutiveSoftwareRiskResultProps {
  locale: Locale;
  route: string;
  result: ExecutiveScoreResult;
  answers: Record<string, ExecutiveAnswerId>;
  utm: UtmParams;
  onReview?: () => void;
}

export function ExecutiveSoftwareRiskResult({
  locale,
  route,
  result,
  answers,
  utm,
  onReview,
}: ExecutiveSoftwareRiskResultProps) {
  const copy = getExecutiveCopy(locale);
  const [pdfError, setPdfError] = useState("");
  const [pdfSaved, setPdfSaved] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const copySummary = async () => {
    const text = [
      `${copy.meta.h1} — SpritaScore`,
      `${copy.ui.riskExposureScore}: ${result.riskExposureScore} / 100`,
      `${copy.ui.executiveMaturity}: ${result.levelLabel}`,
      `${copy.ui.maturityPoints}: ${result.rawMaturityPoints} / 15`,
      result.interpretation,
    ].join("\n");
    await navigator.clipboard.writeText(text);
  };

  const handlePdfDownload = () => {
    setPdfLoading(true);
    setPdfError("");
    setPdfSaved(false);
    const ok = downloadExecutiveScorePdf(locale, answers, result);
    setPdfLoading(false);
    if (ok) setPdfSaved(true);
    else setPdfError(copy.ui.pdfError);
    trackExecutiveEvent("software_score_pdf_download", {
      riskExposureScore: result.riskExposureScore,
      route,
      language: locale,
    });
  };

  return (
    <div className="space-y-8">
      <Card className="border-brand-green/30">
        <CardHeader>
          <CardTitle className="text-2xl">{copy.ui.yourResults}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-sm tracking-wide text-muted-foreground mb-2">
              {copy.ui.riskExposureScore}
            </p>
            <p className={cn("text-5xl font-bold tracking-tight", LEVEL_COLORS[result.level])}>
              {result.riskExposureScore}
              <span className="text-2xl text-muted-foreground font-semibold"> / 100</span>
            </p>
            <Progress
              value={result.riskExposureScore}
              className="mt-4 h-3 max-w-md mx-auto"
              aria-label={copy.ui.riskExposureScore}
            />
            <p className="text-sm text-muted-foreground mt-3 max-w-md mx-auto">{copy.ui.zeroRiskNote}</p>
            <p className="font-semibold text-brand-navy mt-4">{result.levelLabel}</p>
            {`${result.exposureLabel} ${copy.ui.exposureSuffix}`.trim().toLowerCase() !== result.levelLabel.toLowerCase() && (
              <Badge
                variant={
                  result.level === "low"
                    ? "bajo"
                    : result.level === "moderate"
                      ? "moderado"
                      : result.level === "high"
                        ? "alto"
                        : "critico"
                }
                className="mt-2"
              >
                {result.exposureLabel} {copy.ui.exposureSuffix}
              </Badge>
            )}
            <p className="text-sm text-muted-foreground mt-3 max-w-xl mx-auto leading-relaxed">
              {result.interpretation}
            </p>
            <details className="mt-4 max-w-md mx-auto text-left text-sm text-muted-foreground">
              <summary className="cursor-pointer text-brand-navy">{copy.ui.maturityDetails}</summary>
              <p className="mt-3">
                {copy.ui.executiveMaturity}: {result.levelLabel}
              </p>
              <p className="mt-1">
                {copy.ui.maturityPoints}: {result.rawMaturityPoints} / 15
              </p>
              <p className="mt-1">
                {formatExecutive(copy.ui.maturityPercent, { percent: result.maturityPercent })}
              </p>
            </details>
          </div>

          {result.recommendations.length > 0 && (
            <div>
              <h3 className="font-semibold text-brand-navy mb-3">{copy.ui.topGaps}</h3>
              <ul className="space-y-3">
                {result.recommendations.map((rec) => (
                  <li
                    key={rec.category}
                    className="p-4 rounded-lg border border-border-hairline bg-surface text-sm leading-relaxed"
                  >
                    <span className="font-semibold text-brand-navy">{rec.label}</span>
                    <p className="text-muted-foreground mt-1">{rec.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1">
              <Link
                href={auditPath(locale, EXECUTIVE_CARD.id)}
                onClick={() => {
                  trackExecutiveEvent("software_score_assessment_click", {
                    riskExposureScore: result.riskExposureScore,
                    level: result.level,
                    language: locale,
                    ...utm,
                  });
                }}
              >
                {copy.ui.requestAssessment}
              </Link>
            </Button>
            {onReview && (
              <Button type="button" variant="outline" className="flex-1" onClick={onReview}>
                {copy.ui.reviewAnswers}
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handlePdfDownload}
              disabled={pdfLoading}
            >
              <Download className="h-4 w-4 mr-2" />
              {pdfLoading ? copy.ui.pdfGenerating : copy.ui.downloadPdf}
            </Button>
          </div>

          {pdfError && <p className="text-sm text-risk-critical text-center">{pdfError}</p>}
          {pdfSaved && <p className="text-sm text-center text-muted-foreground" role="status">{copy.ui.pdfSaved}</p>}

          <button
            type="button"
            onClick={copySummary}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-navy mx-auto"
          >
            <ClipboardCopy className="h-4 w-4" />
            {copy.ui.copyScore}
          </button>

          <p className="text-xs text-center text-muted-foreground max-w-2xl mx-auto">
            {copy.ui.disclaimer}
          </p>
        </CardContent>
      </Card>

      <AuditOffer calculatorId={EXECUTIVE_CARD.id} locale={locale} />
      <ExecutiveLeadForm locale={locale} result={result} utm={utm} />
    </div>
  );
}