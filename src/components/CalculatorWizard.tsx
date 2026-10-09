"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ArrowRight, Calculator, RotateCcw } from "lucide-react";
import type { CalculatorConfig, Currency, WizardField } from "@/types/calculator";
import { QuestionStep } from "@/components/QuestionStep";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { calculate } from "@/lib/calculateCost";
import { getResult, saveResult } from "@/lib/storage";
import { trackEvent } from "@/lib/analytics";
import { formatTemplate, tr } from "@/lib/translate";
import { useTranslations } from "@/components/LanguageProvider";
import type { TranslationKeys } from "@/i18n/es";

interface CalculatorWizardProps {
  config: CalculatorConfig;
}

function emptyToUndefined(value: unknown): unknown {
  if (value === "" || value == null) return undefined;
  if (typeof value === "number" && Number.isNaN(value)) return undefined;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? value : parsed;
  }
  return value;
}

function numericField(field: WizardField, t: TranslationKeys) {
  const min = field.min ?? 0;
  const max = field.max;
  const rangeMessage =
    max === undefined
      ? formatTemplate(t.wizard.validation.numberMin, { min })
      : formatTemplate(t.wizard.validation.numberRange, { min, max });
  const bounded = z
    .number({ error: t.wizard.validation.numberRequired })
    .min(min, rangeMessage);
  const schema = max === undefined ? bounded : bounded.max(max, rangeMessage);
  return z.preprocess(emptyToUndefined, schema);
}

function buildSchema(config: CalculatorConfig, t: TranslationKeys) {
  const shape: Record<string, z.ZodType> = {};
  for (const step of config.steps) {
    for (const field of step.fields) {
      if (!field.required) continue;
      switch (field.type) {
        case "number":
        case "slider":
          shape[field.name] = numericField(field, t);
          break;
        case "multiselect":
          shape[field.name] = z.preprocess(
            (value) => (Array.isArray(value) ? value : []),
            z.array(z.string()).min(1, t.wizard.validation.selectAtLeastOne)
          );
          break;
        case "checkbox":
          shape[field.name] = z.preprocess(
            (value) => value === true || value === "on" || value === "true",
            z.boolean().refine((value) => value === true, { message: t.wizard.validation.mustAccept })
          );
          break;
        default:
          shape[field.name] = z.string().min(1, t.wizard.validation.fieldRequired);
      }
    }
  }
  return z.object(shape);
}

export function CalculatorWizard({ config }: CalculatorWizardProps) {
  const router = useRouter();
  const { t, locale } = useTranslations();
  const [currentStep, setCurrentStep] = useState(0);
  const schema = buildSchema(config, t);
  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      currency: "USD",
      ...Object.fromEntries(
        config.steps.flatMap((s) =>
          s.fields
            .filter((f) => f.defaultValue !== undefined)
            .map((f) => [f.name, f.defaultValue])
        )
      ),
    },
    mode: "onChange",
  });

  const steps = config.steps;
  const progress = (currentStep / steps.length) * 100;
  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const stepsRemaining = steps.length - 1 - currentStep;

  useEffect(() => {
    const editId = new URLSearchParams(window.location.search).get("edit");
    if (!editId) return;
    const stored = getResult(editId);
    if (!stored || stored.calculatorId !== config.id) return;
    const frame = window.setTimeout(() => {
      methods.reset({
        currency: stored.currency ?? "USD",
        ...stored.inputs,
      });
      setCurrentStep(0);
    }, 0);
    return () => window.clearTimeout(frame);
  }, [config.id, methods]);

  const validateCurrentStep = async () => {
    const fieldNames = step.fields.map((f) => f.name);
    return methods.trigger(fieldNames);
  };

  const handleNext = async () => {
    const valid = await validateCurrentStep();
    if (!valid) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      handleCalculate();
    }
  };

  const handleCalculate = () => {
    const values = methods.getValues();
    const currency = (values.currency as Currency) || "USD";

    trackEvent("calculator_started", { calculator: config.id });

    const result = calculate(config.id, values as Record<string, unknown>, currency, locale);
    saveResult(result);
    trackEvent("calculator_completed", {
      calculator: config.id,
      score: result.score,
      riskLevel: result.riskLevel,
      cost: result.cost.probable ?? result.cost.annual,
    });
    router.push(`/resultados/${result.id}`);
  };

  return (
    <FormProvider {...methods}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2" aria-live="polite">
            <span id="wizard-progress-label">
              {t.wizard.step} {currentStep + 1} {t.wizard.of} {steps.length}
              {isLastStep
                ? ` — ${t.wizard.lastStep}`
                : stepsRemaining === 1
                  ? ` — ${t.wizard.oneStepLeft}`
                  : ""}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} aria-labelledby="wizard-progress-label" />
        </div>

        <Card key={currentStep} className="animate-[fadeInStep_0.3s_ease-out]">
          <CardHeader>
            <CardTitle>{tr(step.title, locale)}</CardTitle>
            <CardDescription>{tr(step.description, locale)}</CardDescription>
          </CardHeader>
          <CardContent>
            <QuestionStep fields={step.fields} />
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6 gap-3">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="h-4 w-4" />
              {t.wizard.previous}
            </Button>
            <Button variant="ghost" onClick={() => setCurrentStep(0)}>
              <RotateCcw className="h-4 w-4" />
              {t.wizard.restart}
            </Button>
          </div>
          <Button onClick={handleNext}>
            {isLastStep ? (
              <>
                <Calculator className="h-4 w-4" />
                {t.wizard.calculate}
              </>
            ) : (
              <>
                {t.wizard.next}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </FormProvider>
  );
}
