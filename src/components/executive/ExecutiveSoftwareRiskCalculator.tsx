"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  EXECUTIVE_ANSWERS,
  EXECUTIVE_QUESTIONS,
  EXECUTIVE_SECTIONS,
} from "@/data/executiveSoftwareRiskScore";
import type { ExecutiveAnswerId } from "@/data/executiveSoftwareRiskScore";
import { calculateExecutiveRiskScore } from "@/lib/calculateExecutiveRiskScore";
import { trackExecutiveEvent } from "@/lib/analytics";
import { captureUtmFromSearch, getPersistedUtm, persistUtm } from "@/lib/executiveUtm";
import { ExecutiveSoftwareRiskResult } from "@/components/executive/ExecutiveSoftwareRiskResult";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "spritascore_executive_answers";

export function ExecutiveSoftwareRiskCalculator() {
  const [sectionIndex, setSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, ExecutiveAnswerId>>({});
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const utm = useMemo(() => getPersistedUtm(), [completed]);

  useEffect(() => {
    const captured = captureUtmFromSearch(window.location.search);
    persistUtm(captured);
    trackExecutiveEvent("software_score_view", {
      route: "/en/executive-software-risk-score",
      language: "en",
      ...captured,
      ...getPersistedUtm(),
    });

    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) setAnswers(JSON.parse(saved) as Record<string, ExecutiveAnswerId>);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
      /* ignore */
    }
  }, [answers]);

  const sectionId = EXECUTIVE_SECTIONS[sectionIndex];
  const sectionQuestions = EXECUTIVE_QUESTIONS.filter((q) => q.category === sectionId);
  const sectionLabel = sectionQuestions[0]?.categoryLabel ?? "";
  const answeredCount = EXECUTIVE_QUESTIONS.filter((q) => answers[q.id]).length;
  const progress = (answeredCount / EXECUTIVE_QUESTIONS.length) * 100;

  const firstUnansweredInSection = sectionQuestions.find((q) => !answers[q.id]);
  const sectionComplete = sectionQuestions.every((q) => answers[q.id]);

  const handleAnswer = (questionId: string, value: ExecutiveAnswerId) => {
    if (!started) {
      setStarted(true);
      trackExecutiveEvent("software_score_start", {
        route: "/en/executive-software-risk-score",
        timestamp: new Date().toISOString(),
      });
    }

    const question = EXECUTIVE_QUESTIONS.find((q) => q.id === questionId);
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
    const result = calculateExecutiveRiskScore(answers);
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
    const result = calculateExecutiveRiskScore(answers);
    return (
      <ExecutiveSoftwareRiskResult result={result} answers={answers} utm={getPersistedUtm()} />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm text-muted-foreground">
            Section {sectionIndex + 1} of {EXECUTIVE_SECTIONS.length} · Question{" "}
            {answeredCount + (firstUnansweredInSection ? 1 : 0)} of {EXECUTIVE_QUESTIONS.length}
          </p>
          <h2 className="text-xl font-bold text-brand-navy mt-1">{sectionLabel}</h2>
        </div>
        <Badge variant="outline">{Math.round(progress)}% complete</Badge>
      </div>

      <Progress value={progress} className="h-2" />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Answer each control visibility question</CardTitle>
          <CardDescription>
            No code upload required. No sensitive technical data required. Select the option that
            best reflects your organization today.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {sectionQuestions.map((question, idx) => (
            <fieldset key={question.id} className="space-y-3">
              <legend className="text-sm font-semibold text-brand-navy leading-relaxed">
                {EXECUTIVE_QUESTIONS.indexOf(question) + 1}. {question.text}
              </legend>
              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                role="radiogroup"
                aria-label={question.text}
              >
                {EXECUTIVE_ANSWERS.map((option) => {
                  const selected = answers[question.id] === option.id;
                  return (
                    <label
                      key={option.id}
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
                        value={option.id}
                        checked={selected}
                        onChange={() => handleAnswer(question.id, option.id)}
                        className="accent-brand-green h-4 w-4"
                      />
                      <span className="text-sm font-medium">{option.label}</span>
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
        <Button
          type="button"
          variant="outline"
          onClick={goBack}
          disabled={sectionIndex === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous section
        </Button>
        <Button type="button" onClick={goNext} disabled={!sectionComplete}>
          {sectionIndex === EXECUTIVE_SECTIONS.length - 1 ? "See my score" : "Next section"}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}