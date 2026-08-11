"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {
  calcular,
  impactBucket,
  type Calc05Input,
  type Currency,
  type Sector,
} from "@/lib/calc05";
import { mapCalc05ToCalculationResult } from "@/lib/mapCalc05Result";
import { saveResult } from "@/lib/storage";
import type { Calc05Copy } from "@/i18n/calc05";
import type { Locale } from "@/types/calculator";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface Calc05Props {
  copy: Calc05Copy;
  locale: Locale;
  initialSector?: Sector;
}

const QUESTIONS = [
  { id: "q1", field: "sector" },
  { id: "q2", field: "vol" },
  { id: "q3", field: "ia" },
  { id: "q4", field: "sca" },
  { id: "q5", field: "mat" },
  { id: "q6", field: "hist" },
] as const;

const Q1_OPTIONS: Sector[] = [
  "saude",
  "tech",
  "fintech",
  "seguros",
  "varejo",
  "industria",
  "publico",
  "outro",
];
const Q2_OPTIONS = [1, 2, 3, 4] as const;
const Q3_OPTIONS = [3, 2, 1] as const;
const Q4_OPTIONS = [1, 2, 3] as const;
const Q5_OPTIONS = [1, 2, 3, 4] as const;
const Q6_OPTIONS = [2, 3, 1] as const;

export function Calc05({ copy, locale, initialSector }: Calc05Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [currency, setCurrency] = useState<Currency>("BRL");
  const [answers, setAnswers] = useState<Partial<Omit<Calc05Input, "currency">>>({
    sector: initialSector,
  });
  const [redirecting, setRedirecting] = useState(false);

  const totalSteps = QUESTIONS.length;
  const currentQ = step >= 1 && step <= 6 ? QUESTIONS[step - 1] : null;

  const handleCurrencySelect = (c: Currency) => {
    setCurrency(c);
    setStep(1);
    trackEvent("calculator_started", {
      calculator: "sector",
      calculator_id: "sector",
      locale,
      currency: c,
    });
  };

  const handleAnswer = useCallback((field: string, value: number | string) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleNext = () => {
    if (step < 6) {
      setStep((s) => s + 1);
      return;
    }

    const input = { ...answers, currency } as Calc05Input;
    const res = calcular(input);
    const bulletTexts = res.bullets.map((key) => copy.bullets[key] ?? key);
    const mapped = mapCalc05ToCalculationResult(input, res, locale, bulletTexts);
    saveResult(mapped);

    trackEvent("calculator_completed", {
      calculator: "sector",
      calculator_id: "sector",
      sector: res.sector,
      score: mapped.score,
      sprita_score: res.score,
      impact_bucket: impactBucket(res.impactBRL),
      currency: res.currency,
      locale,
      classification: res.classification,
      resultId: mapped.id,
    });

    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "calc_completed", {
        sector: res.sector,
        score: res.score,
        impact_bucket: impactBucket(res.impactBRL),
        currency: res.currency,
        locale,
      });
    }

    setRedirecting(true);
    router.push(`/resultados/${mapped.id}`);
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
    else setStep(0);
  };

  const currentAnswer = currentQ
    ? answers[currentQ.field as keyof typeof answers]
    : undefined;
  const canProceed = currentAnswer !== undefined && currentAnswer !== null;

  if (redirecting) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="h-10 w-10 rounded-full border-2 border-brand-green border-t-transparent animate-spin mb-4" />
        <p className="text-brand-navy font-semibold">
          {locale === "en"
            ? "Preparing your results…"
            : locale === "pt"
              ? "Preparando seus resultados…"
              : "Preparando sus resultados…"}
        </p>
        <p className="text-sm text-muted-foreground mt-2">spritascore.com</p>
      </div>
    );
  }

  if (step === 0) {
    return (
      <div className="flex flex-col items-center px-1 py-4">
        <div className="max-w-2xl w-full text-center mb-10">
          <span className="inline-block text-xs font-semibold tracking-widest text-brand-green bg-brand-green/10 border border-brand-green/30 rounded-full px-3 py-1 mb-6">
            {copy.hero.badge}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4 leading-tight tracking-tight">
            {copy.hero.title}
          </h1>
          <p className="text-lg text-muted-foreground">{copy.hero.subtitle}</p>
        </div>

        <div className="max-w-lg w-full">
          <p className="text-sm font-medium text-brand-navy text-center mb-4">
            {copy.currency.label}
          </p>
          <div className="grid grid-cols-2 gap-4">
            {(["BRL", "USD"] as Currency[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => handleCurrencySelect(c)}
                className="group flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-border-hairline bg-surface p-6 hover:border-brand-green hover:bg-brand-green/5 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-green/40"
              >
                <span className="text-3xl" aria-hidden>
                  {c === "BRL" ? "🇧🇷" : "🇺🇸"}
                </span>
                <span className="font-semibold text-brand-navy group-hover:text-brand-green">
                  {c === "BRL" ? copy.currency.brl : copy.currency.usd}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!currentQ) return null;

  const optionsMap: Record<string, readonly (number | string)[]> = {
    q1: Q1_OPTIONS,
    q2: Q2_OPTIONS,
    q3: Q3_OPTIONS,
    q4: Q4_OPTIONS,
    q5: Q5_OPTIONS,
    q6: Q6_OPTIONS,
  };
  const options = optionsMap[currentQ.id];
  const qCopy = copy.questions[currentQ.id];

  return (
    <div className="flex flex-col items-center px-1 py-4">
      <div className="max-w-xl w-full">
        <div className="flex items-center gap-3 mb-10">
          <div className="flex-1 bg-border-hairline rounded-full h-1.5">
            <div
              className="bg-brand-green h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
            {step} {copy.steps.of} {totalSteps}
          </span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-brand-navy mb-2 leading-snug tracking-tight">
          {qCopy.label}
        </h2>
        <p className="text-sm text-muted-foreground mb-8">{qCopy.hint}</p>

        <div className="space-y-3 mb-10">
          {options.map((opt) => {
            const isSelected = answers[currentQ.field as keyof typeof answers] == opt;
            return (
              <button
                key={String(opt)}
                type="button"
                onClick={() => handleAnswer(currentQ.field, opt)}
                className={cn(
                  "w-full text-left rounded-2xl border-2 px-5 py-4 text-sm font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-green/40",
                  isSelected
                    ? "border-brand-green bg-brand-green/10 text-brand-navy"
                    : "border-border-hairline bg-surface text-brand-navy/80 hover:border-brand-green/40 hover:bg-brand-green/5"
                )}
              >
                <span
                  className={cn(
                    "mr-3 inline-flex h-5 w-5 items-center justify-center rounded-full border-2 shrink-0 align-middle",
                    isSelected ? "border-brand-green bg-brand-green" : "border-border-strong"
                  )}
                >
                  {isSelected && (
                    <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 12 12" aria-hidden>
                      <path d="M4.5 8.5L2 6l-.7.7L4.5 10l7-7-.7-.7z" />
                    </svg>
                  )}
                </span>
                {qCopy.options[String(opt)]}
              </button>
            );
          })}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="flex-1 rounded-2xl border-2 border-border-hairline bg-surface text-brand-navy/70 font-semibold py-3 hover:border-border-strong transition-colors duration-150"
          >
            {copy.nav.back}
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed}
            className={cn(
              "flex-[2] rounded-2xl font-semibold py-3 transition-all duration-150",
              canProceed
                ? "bg-brand-green hover:bg-brand-green/90 text-white"
                : "bg-brand-gray-light text-muted-foreground cursor-not-allowed"
            )}
          >
            {step === 6 ? copy.nav.calculate : copy.nav.next}
          </button>
        </div>
      </div>
    </div>
  );
}
