"use client";

import { useState } from "react";
import { Download, ClipboardCopy, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { trackEvent } from "@/lib/analytics";
import { downloadEuAiActPdf } from "@/lib/euAiActPdf";
import type { EuAiActResult as EuAiActResultType, EuAiActAnswers } from "@/lib/calculateEuAiAct";
import { EuAiActLeadForm } from "@/components/euaiact/EuAiActLeadForm";
import { getPersistedUtm } from "@/lib/executiveUtm";
import { getEuAiActCopy } from "@/i18n/euAiAct";
import type { GapPriority, ReadinessLevel } from "@/data/euAiAct";
import type { Locale } from "@/types/calculator";
import { cn } from "@/lib/utils";

const LEVEL_COLOR: Record<ReadinessLevel, string> = {
  critical: "text-risk-critical",
  initial: "text-risk-critical",
  developing: "text-risk-high",
  managed: "text-risk-moderate",
  advanced: "text-risk-low",
  "review-ready": "text-risk-low",
};

const PRIORITY_BADGE: Record<GapPriority, "critico" | "alto" | "moderado" | "bajo"> = {
  P0: "critico",
  P1: "alto",
  P2: "moderado",
  P3: "bajo",
};

interface EuAiActResultProps {
  locale: Locale;
  route: string;
  result: EuAiActResultType;
  answers: EuAiActAnswers;
}

export function EuAiActResult({ locale, route, result, answers }: EuAiActResultProps) {
  const copy = getEuAiActCopy(locale);
  const [pdfError, setPdfError] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);

  const verdict = copy.verdicts[result.verdict];
  const dateFmt = (iso: string) =>
    new Date(iso + "T00:00:00").toLocaleDateString(
      locale === "en" ? "en-US" : locale === "pt" ? "pt-BR" : "es-ES",
      { year: "numeric", month: "short", day: "numeric" }
    );

  const copySummary = async () => {
    const lines = [
      `${copy.meta.h1} — SpritaScore`,
      `${copy.ui.primaryClassification}: ${verdict.label}`,
      `${copy.ui.confidenceLabel}: ${copy.confidence[result.confidence].label}`,
    ];
    if (result.readinessScore != null) {
      lines.push(`${copy.ui.readinessScore}: ${result.readinessScore}/100 (${copy.levels[result.readinessLevel!].label})`);
      lines.push(`${copy.ui.evidenceCoverage}: ${result.evidenceCoverage}% (${copy.evidenceBands[result.evidenceBand]})`);
    }
    await navigator.clipboard.writeText(lines.join("\n"));
  };

  const handlePdf = () => {
    setPdfLoading(true);
    setPdfError("");
    const ok = downloadEuAiActPdf(locale, answers, result);
    setPdfLoading(false);
    if (!ok) setPdfError(copy.ui.pdfError);
    trackEvent("euaiact_pdf_download", { verdict: result.verdict, route, language: locale });
  };

  return (
    <div className="space-y-8">
      {/* Critical stop */}
      {result.criticalStop && (
        <Card className="border-risk-critical/40 bg-risk-critical/5">
          <CardContent className="pt-6 flex gap-4">
            <AlertTriangle className="h-6 w-6 text-risk-critical shrink-0" />
            <div>
              <p className="font-bold text-risk-critical">{copy.ui.criticalStopTitle}</p>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {copy.ui.criticalStopBody}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Classification */}
      <Card className="border-brand-green/30">
        <CardHeader>
          <CardTitle className="text-2xl">{copy.ui.yourResults}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
              {copy.ui.primaryClassification}
            </p>
            <h3 className="text-xl font-bold text-brand-navy">{verdict.label}</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{verdict.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-background border border-border-hairline">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {copy.ui.detectedRoles}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {result.roles.length > 0 ? (
                  result.roles.map((r) => (
                    <Badge key={r} variant="outline">
                      {copy.roles[r]}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-background border border-border-hairline">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {copy.ui.confidenceLabel}
              </p>
              <p className="font-semibold text-brand-navy mt-1">
                {copy.confidence[result.confidence].label}
              </p>
              <p className="text-sm text-muted-foreground mt-1 leading-snug">
                {copy.confidence[result.confidence].description}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-background border border-border-hairline">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {copy.ui.otherFlags}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {result.flags.filter((f) => f !== result.verdict).length > 0 ? (
                  result.flags
                    .filter((f) => f !== result.verdict)
                    .map((f) => (
                      <Badge key={f} variant="outline">
                        {copy.verdicts[f].label}
                      </Badge>
                    ))
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Obligations timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{copy.ui.obligationsHeading}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {result.obligations.length === 0 ? (
            <p className="text-sm text-muted-foreground">{copy.ui.noObligations}</p>
          ) : (
            result.obligations.map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border-hairline"
              >
                <div>
                  <p className="text-sm font-semibold text-brand-navy">{copy.obligations[o.id]}</p>
                  <p className="text-xs text-muted-foreground">
                    {o.legalSource} · {dateFmt(o.effectiveFrom)}
                  </p>
                </div>
                <Badge variant={o.status === "in-force" ? "alto" : "moderado"}>
                  {copy.obligationStatus[o.status]}
                </Badge>
              </div>
            ))
          )}
          {result.nextRelevantDate && (
            <p className="text-sm text-muted-foreground">
              {copy.ui.nextDate}: <strong>{dateFmt(result.nextRelevantDate)}</strong>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Readiness */}
      {!result.criticalStop && result.readinessScore != null && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{copy.ui.readinessHeading}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-xl bg-background border border-border-hairline">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  {copy.ui.readinessScore}
                </p>
                <p className={cn("text-4xl font-bold", LEVEL_COLOR[result.readinessLevel!])}>
                  {result.readinessScore}
                  <span className="text-xl text-muted-foreground font-semibold"> / 100</span>
                </p>
                <p className="text-sm font-semibold text-brand-navy mt-1">
                  {copy.levels[result.readinessLevel!].label}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {copy.levels[result.readinessLevel!].interpretation}
                </p>
              </div>
              <div className="text-center p-4 rounded-xl bg-background border border-border-hairline">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  {copy.ui.evidenceCoverage}
                </p>
                <p className="text-4xl font-bold text-brand-navy">
                  {result.evidenceCoverage}
                  <span className="text-xl text-muted-foreground font-semibold"> %</span>
                </p>
                <p className="text-sm font-semibold text-brand-navy mt-1">
                  {copy.evidenceBands[result.evidenceBand]}
                </p>
              </div>
            </div>

            {result.cappedAt != null && (
              <div className="text-sm text-risk-high bg-risk-high/5 border border-risk-high/20 rounded-lg p-3">
                <p className="font-semibold">{copy.ui.cappedNote}</p>
                <ul className="list-disc list-inside mt-1 text-muted-foreground">
                  {result.capReasons.map((r) => (
                    <li key={r}>{copy.capReasons[r]}</li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h4 className="text-sm font-semibold text-brand-navy mb-3">{copy.ui.domainBreakdown}</h4>
              <div className="space-y-2">
                {result.domainScores.map((d) => (
                  <div key={d.domain} className="flex items-center gap-3">
                    <span className="text-sm text-brand-navy w-1/2 shrink-0">
                      {copy.domains[d.domain]}
                    </span>
                    {d.applicable && d.score != null ? (
                      <>
                        <Progress value={d.score} className="h-2 flex-1" />
                        <span className="text-sm font-semibold text-brand-navy w-10 text-right">
                          {d.score}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground flex-1">
                        {copy.ui.notAssessed}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gaps / action plan */}
      {result.gaps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{copy.ui.criticalGaps}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.gaps.map((g, i) => (
              <div
                key={`${g.key}-${i}`}
                className="flex gap-3 p-3 rounded-lg border border-border-hairline"
              >
                <Badge variant={PRIORITY_BADGE[g.priority]} className="shrink-0 h-fit">
                  {g.priority}
                </Badge>
                <div>
                  <p className="text-sm text-brand-navy leading-relaxed">{copy.gaps[g.key]}</p>
                  {g.domain && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {copy.pdf.colOwner}: {copy.domainOwners[g.domain]}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Complementary + warnings */}
      {(result.complementary.length > 0 || result.warnings.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {result.complementary.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{copy.ui.complementaryHeading}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                  {result.complementary.map((c) => (
                    <li key={c}>{copy.complementary[c]}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          {result.warnings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{copy.ui.warningsHeading}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                  {[...new Set(result.warnings)].map((w) => (
                    <li key={w}>{copy.warnings[w]}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Actions */}
      <Card className="border-brand-green/30">
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="flex-1"
              onClick={() =>
                document.getElementById("euaiact-form")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              {copy.ui.requestReview}
            </Button>
            <Button variant="outline" className="flex-1" onClick={handlePdf} disabled={pdfLoading}>
              <Download className="h-4 w-4 mr-2" />
              {pdfLoading ? copy.ui.pdfGenerating : copy.ui.downloadPdf}
            </Button>
          </div>
          {pdfError && <p className="text-sm text-risk-critical text-center">{pdfError}</p>}
          <button
            type="button"
            onClick={copySummary}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-navy mx-auto"
          >
            <ClipboardCopy className="h-4 w-4" />
            {copy.ui.copySummary}
          </button>
          <p className="text-xs text-center text-muted-foreground max-w-2xl mx-auto">
            {copy.ui.disclaimer}
          </p>
        </CardContent>
      </Card>

      <EuAiActLeadForm locale={locale} result={result} utm={getPersistedUtm()} />
    </div>
  );
}
