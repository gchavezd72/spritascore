"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  CLASSIFICATION_STAGES,
  READINESS_DOMAINS,
  ANNEX_III_AREAS,
  type ClassificationStage,
  type ClassAnswerId,
  type ReadinessAnswerId,
  type ReadinessDomain,
  type AnnexIIIArea,
} from "@/data/euAiAct";
import { calculateEuAiAct } from "@/lib/calculateEuAiAct";
import { trackEvent } from "@/lib/analytics";
import { getPersistedUtm } from "@/lib/executiveUtm";
import { EuAiActResult } from "@/components/euaiact/EuAiActResult";
import {
  getEuAiActCopy,
  getEuAiActClassQuestions,
  getEuAiActControls,
  formatEuAiAct,
} from "@/i18n/euAiAct";
import type { Locale } from "@/types/calculator";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "spritascore_euaiact_answers";
const CLASS_ORDER: ClassAnswerId[] = ["yes", "no", "not_sure", "na"];
const READINESS_ORDER: ReadinessAnswerId[] = [
  "implemented_evidence",
  "implemented_no_evidence",
  "partial",
  "planned",
  "not_implemented",
  "not_sure",
  "na",
];
const READINESS_GROUPS: ReadinessDomain[][] = [
  READINESS_DOMAINS.slice(0, 5) as ReadinessDomain[],
  READINESS_DOMAINS.slice(5) as ReadinessDomain[],
];

type Step =
  | { kind: "class"; stage: ClassificationStage }
  | { kind: "readiness"; domains: ReadinessDomain[]; label: string };

interface EuAiActCalculatorProps {
  locale: Locale;
  route: string;
}

export function EuAiActCalculator({ locale, route }: EuAiActCalculatorProps) {
  const copy = getEuAiActCopy(locale);
  const questions = getEuAiActClassQuestions(locale);
  const controls = getEuAiActControls(locale);

  const [stepIndex, setStepIndex] = useState(0);
  const [classAnswers, setClassAnswers] = useState<Record<string, ClassAnswerId>>({});
  const [annexArea, setAnnexArea] = useState<AnnexIIIArea>("none");
  const [readinessAnswers, setReadinessAnswers] = useState<Record<string, ReadinessAnswerId>>({});
  const [completed, setCompleted] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    trackEvent("euaiact_view", { route, language: locale });
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setClassAnswers(parsed.classAnswers ?? {});
        setAnnexArea(parsed.annexArea ?? "none");
        setReadinessAnswers(parsed.readinessAnswers ?? {});
      }
    } catch {
      /* ignore */
    }
  }, [locale, route]);

  useEffect(() => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ classAnswers, annexArea, readinessAnswers })
      );
    } catch {
      /* ignore */
    }
  }, [classAnswers, annexArea, readinessAnswers]);

  const steps: Step[] = useMemo(() => {
    const classSteps: Step[] = CLASSIFICATION_STAGES.filter(
      (s) => s !== "exception" || annexArea !== "none"
    ).map((stage) => ({ kind: "class" as const, stage }));
    const readinessSteps: Step[] = READINESS_GROUPS.map((domains, i) => ({
      kind: "readiness" as const,
      domains,
      label: `${copy.readinessStage}${READINESS_GROUPS.length > 1 ? ` (${i + 1}/${READINESS_GROUPS.length})` : ""}`,
    }));
    return [...classSteps, ...readinessSteps];
  }, [annexArea, copy.readinessStage]);

  const step = steps[Math.min(stepIndex, steps.length - 1)];

  const markStarted = () => {
    if (!started) {
      setStarted(true);
      trackEvent("euaiact_start", { route, language: locale });
    }
  };

  const setClass = (id: string, value: ClassAnswerId) => {
    markStarted();
    setClassAnswers((prev) => ({ ...prev, [id]: value }));
  };
  const setReadiness = (id: string, value: ReadinessAnswerId) => {
    markStarted();
    setReadinessAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const stepQuestions =
    step.kind === "class" ? questions.filter((q) => q.stage === step.stage) : [];
  const stepControls =
    step.kind === "readiness" ? controls.filter((c) => step.domains.includes(c.domain)) : [];

  const stepComplete =
    step.kind === "class"
      ? stepQuestions.every((q) => classAnswers[q.id])
      : stepControls.every((c) => readinessAnswers[c.id]);

  const totalAnswered =
    Object.keys(classAnswers).length + Object.keys(readinessAnswers).length;
  const totalQuestions = questions.length + controls.length;
  const progress = Math.min(100, Math.round((totalAnswered / totalQuestions) * 100));

  const goNext = () => {
    if (!stepComplete) return;
    if (stepIndex < steps.length - 1) {
      setStepIndex((i) => i + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const result = calculateEuAiAct({ classification: classAnswers, annexArea, readiness: readinessAnswers });
    setCompleted(true);
    trackEvent("euaiact_completed", {
      verdict: result.verdict,
      readinessScore: result.readinessScore,
      confidence: result.confidence,
      route,
      language: locale,
      ...getPersistedUtm(),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    if (completed) {
      setCompleted(false);
      return;
    }
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (completed) {
    const result = calculateEuAiAct({ classification: classAnswers, annexArea, readiness: readinessAnswers });
    return (
      <EuAiActResult
        locale={locale}
        route={route}
        result={result}
        answers={{ classification: classAnswers, annexArea, readiness: readinessAnswers }}
      />
    );
  }

  const stepTitle =
    step.kind === "class" ? copy.stages[step.stage] : step.label;
  const isReadinessStep = step.kind === "readiness";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm text-muted-foreground">
            {formatEuAiAct(copy.ui.stageProgress, { current: stepIndex + 1, total: steps.length })}
            {" · "}
            <span className="font-medium">
              {isReadinessStep ? copy.ui.engineB : copy.ui.engineA}
            </span>
          </p>
          <h2 className="text-xl font-bold text-brand-navy mt-1">{stepTitle}</h2>
        </div>
        <Badge variant="outline">{formatEuAiAct(copy.ui.complete, { percent: progress })}</Badge>
      </div>

      <Progress value={progress} className="h-2" />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isReadinessStep ? copy.ui.readinessTitle : copy.ui.classificationTitle}
          </CardTitle>
          <CardDescription>
            {isReadinessStep ? copy.ui.readinessDescription : copy.ui.classificationDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Classification step */}
          {step.kind === "class" && (
            <>
              {step.stage === "high-risk-use" && (
                <div className="space-y-2 pb-4 border-b border-border-hairline">
                  <label className="text-sm font-semibold text-brand-navy leading-relaxed block">
                    {copy.areaQuestion}
                  </label>
                  <select
                    value={annexArea}
                    onChange={(e) => {
                      markStarted();
                      setAnnexArea(e.target.value as AnnexIIIArea);
                    }}
                    className="w-full rounded-lg border border-border-strong bg-background px-3 py-2.5 text-sm"
                  >
                    {ANNEX_III_AREAS.map((area) => (
                      <option key={area} value={area}>
                        {copy.areas[area]}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {stepQuestions.map((question) => (
                <fieldset key={question.id} className="space-y-3">
                  <legend className="text-sm font-semibold text-brand-navy leading-relaxed">
                    {question.text}
                  </legend>
                  <div
                    className="grid grid-cols-2 sm:grid-cols-4 gap-2"
                    role="radiogroup"
                    aria-label={question.text}
                  >
                    {CLASS_ORDER.map((answerId) => {
                      const selected = classAnswers[question.id] === answerId;
                      return (
                        <label
                          key={answerId}
                          className={cn(
                            "flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors min-h-[44px] text-sm",
                            selected
                              ? "border-brand-green bg-brand-green/5 ring-1 ring-brand-green/30"
                              : "border-border-strong hover:border-brand-navy/30"
                          )}
                        >
                          <input
                            type="radio"
                            name={question.id}
                            checked={selected}
                            onChange={() => setClass(question.id, answerId)}
                            className="accent-brand-green h-4 w-4 shrink-0"
                          />
                          <span className="font-medium">{copy.classAnswers[answerId]}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </>
          )}

          {/* Readiness step */}
          {step.kind === "readiness" &&
            step.domains.map((domain) => {
              const domainControls = stepControls.filter((c) => c.domain === domain);
              return (
                <div key={domain} className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-brand-green">
                    {copy.domains[domain]}
                  </h3>
                  {domainControls.map((control) => (
                    <div key={control.id} className="space-y-2">
                      <label
                        htmlFor={`ctl-${control.id}`}
                        className="text-sm font-medium text-brand-navy leading-relaxed block"
                      >
                        {control.text}
                      </label>
                      <select
                        id={`ctl-${control.id}`}
                        value={readinessAnswers[control.id] ?? ""}
                        onChange={(e) => setReadiness(control.id, e.target.value as ReadinessAnswerId)}
                        className="w-full rounded-lg border border-border-strong bg-background px-3 py-2.5 text-sm"
                      >
                        <option value="" disabled>
                          {copy.ui.selectPlaceholder}
                        </option>
                        {READINESS_ORDER.map((answerId) => (
                          <option key={answerId} value={answerId}>
                            {copy.readinessAnswers[answerId]}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              );
            })}
        </CardContent>
      </Card>

      <div className="flex justify-between gap-4">
        <Button type="button" variant="outline" onClick={goBack} disabled={stepIndex === 0}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {copy.ui.back}
        </Button>
        <Button type="button" onClick={goNext} disabled={!stepComplete}>
          {stepIndex === steps.length - 1 ? copy.ui.seeResults : copy.ui.next}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
