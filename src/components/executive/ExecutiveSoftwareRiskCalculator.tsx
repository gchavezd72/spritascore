"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { EXECUTIVE_SECTIONS } from "@/data/executiveSoftwareRiskScore";
import type { ExecutiveAnswerId } from "@/data/executiveSoftwareRiskScore";
import { calculateExecutiveRiskScore } from "@/lib/calculateExecutiveRiskScore";
import { trackExecutiveEvent } from "@/lib/analytics";
import { captureUtmFromSearch, getPersistedUtm, persistUtm } from "@/lib/executiveUtm";
import { ExecutiveSoftwareRiskResult } from "@/components/executive/ExecutiveSoftwareRiskResult";
import { formatExecutive, getExecutiveCopy, getExecutiveQuestions } from "@/i18n/executive";
import type { Locale } from "@/types/calculator";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "spritascore_executive_answers";

interface ExecutiveSoftwareRiskCalculatorProps {
  locale: Locale;
  route: string;
}

export function ExecutiveSoftwareRiskCalculator({ locale, route }: ExecutiveSoftwareRiskCalculatorProps) {
  const copy = getExecutiveCopy(locale);
  const questions = getExecutiveQuestions(locale);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, ExecutiveAnswerId>>({});
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const utm = useMemo(() => getPersistedUtm(), [completed]);

  useEffect(() => {
    const captured = captureUtmFromSearch(window.location.search);
    persistUtm(captured);
    trackExecutiveEvent("software_score_view", {
      route,
      language: locale,
      ...captured,
      ...getPersistedUtm(),
    });

    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) setAnswers(JSON.parse(saved) as Record<string, ExecutiveAnswerId>);
    } catch {
      /* ignore */
    }
  }, [locale, route]);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
      /* ignore */
    }
  }, [answers]);

  const sectionId = EXECUTIVE_SECTIONS[sectionIndex];
  const sectionQuestions = questions.filter((q) => q.category === sectionId);
  const sectionLabel = sectionQuestions[0]?.categoryLabel ?? "";
  const answeredCount = questions.filter((q) => answers[q.id]).length;
  const progress = (answeredCount / questions.length) * 100;
  const sectionComplete = sectionQuestions.every((q) => answers[q.id]);

  const handleAnswer = (questionId: string, value: ExecutiveAnswerId) => {
    if (!started) {
      setStarted(true);
      trackExecutiveEvent("software_score_start", { route, timestamp: new Date().toISOString() });
    }

    const question = questions.find((q) => q.id === questionId);
    setAnswers((prev) => ({ ...prev, [questionId]: value }));

    trackExecutiveEvent("software_score_question_answered", {
      question_id: questionId,
      category: question?.category,
      answer_value: value,
    });
  };

  const goNext = () => {
    if (!sectionComplete) return;
    if (sectionIndex < EXECUTIVE_SECTIONS.length - 1) {
      setSectionIndex((i) => i + 1);
      return;
    }
    const result = calculateExecutiveRiskScore(answers, locale);
    setCompleted(true);
    trackExecutiveEvent("software_score_completed", {
      riskExposureScore: result.riskExposureScore,
      maturityPercent: result.maturityPercent,
      level: result.level,
      topWeakCategories: result.topWeakCategories,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    if (completed) {
      setCompleted(false);
      return;
    }
    if (sectionIndex > 0) setSectionIndex((i) => i - 1);
  };

  if (completed) {
    const result = calculateExecutiveRiskScore(answers, locale);
    return (
      <ExecutiveSoftwareRiskResult
        locale={locale}
        route={route}
        result={result}
        answers={answers}
        utm={getPersistedUtm()}
      />
    );
  }

  const currentQuestionNum = Math.min(answeredCount + 1, questions.length);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm text-muted-foreground">
            {formatExecutive(copy.ui.sectionProgress, {
              current: sectionIndex + 1,
              total: EXECUTIVE_SECTIONS.length,
            })}
            {" · "}
            {formatExecutive(copy.ui.questionProgress, {
              current: currentQuestionNum,
              total: questions.length,
            })}
          </p>
          <h2 className="text-xl font-bold text-brand-navy mt-1">{sectionLabel}</h2>
        </div>
        <Badge variant="outline">
          {formatExecutive(copy.ui.complete, { percent: Math.round(progress) })}
        </Badge>
      </div>

      <Progress value={progress} className="h-2" />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{copy.ui.cardTitle}</CardTitle>
          <CardDescription>{copy.ui.cardDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {sectionQuestions.map((question, idx) => (
            <fieldset key={question.id} className="space-y-3">
              <legend className="text-sm font-semibold text-brand-navy leading-relaxed">
                {questions.indexOf(question) + 1}. {question.text}
              </legend>
              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                role="radiogroup"
                aria-label={question.text}
              >
                {(Object.keys(copy.answers) as ExecutiveAnswerId[]).map((answerId) => {
                  const selected = answers[question.id] === answerId;
                  return (
                    <label
                      key={answerId}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors min-h-[44px]",
                        selected
                          ? "border-brand-green bg-brand-green/5 ring-1 ring-brand-green/30"
                          : "border-border-strong hover:border-brand-navy/30"
                      )}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={answerId}
                        checked={selected}
                        onChange={() => handleAnswer(question.id, answerId)}
                        className="accent-brand-green h-4 w-4"
                      />
                      <span className="text-sm font-medium">{copy.answers[answerId]}</span>
                    </label>
                  );
                })}
              </div>
              {idx < sectionQuestions.length - 1 && (
                <hr className="border-border-hairline mt-6" />
              )}
            </fieldset>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-between gap-4">
        <Button type="button" variant="outline" onClick={goBack} disabled={sectionIndex === 0}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {copy.ui.previousSection}
        </Button>
        <Button type="button" onClick={goNext} disabled={!sectionComplete}>
          {sectionIndex === EXECUTIVE_SECTIONS.length - 1 ? copy.ui.seeScore : copy.ui.nextSection}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}