"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ArrowRight, Calculator } from "lucide-react";
import type { CalculatorConfig, Currency } from "@/types/calculator";
import { QuestionStep } from "@/components/QuestionStep";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { calculate } from "@/lib/calculateCost";
import { saveResult } from "@/lib/storage";
import { trackEvent } from "@/lib/analytics";
import { getCurrencyForCountry } from "@/lib/formatCurrency";

interface CalculatorWizardProps {
  config: CalculatorConfig;
}

function buildSchema(config: CalculatorConfig) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const step of config.steps) {
    for (const field of step.fields) {
      if (!field.required) continue;
      switch (field.type) {
        case "number":
        case "slider":
          shape[field.name] = z.coerce.number().min(field.min ?? 0);
          break;
        case "multiselect":
          shape[field.name] = z.array(z.string()).min(1, "Seleccione al menos una opción");
          break;
        case "checkbox":
          shape[field.name] = z.union([
            z.literal(true),
            z.string().transform((v) => v === "on" || v === "true"),
          ]).refine((v) => v === true, { message: "Debe aceptar para continuar" });
          break;
        default:
          shape[field.name] = z.string().min(1, "Campo requerido");
      }
    }
  }
  return z.object(shape);
}

export function CalculatorWizard({ config }: CalculatorWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const schema = buildSchema(config);
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
  const progress = ((currentStep + 1) / steps.length) * 100;
  const step = steps[currentStep];

  const validateCurrentStep = async () => {
    const fieldNames = step.fields.map((f) => f.name);
    return methods.trigger(fieldNames);
  };

  const handleNext = async () => {
    const valid = await validateCurrentStep();
    if (!valid) return;

    const country = methods.getValues("country");
    if (country && currentStep === 0 && !methods.getValues("currency")) {
      methods.setValue("currency", getCurrencyForCountry(country as string));
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      handleCalculate();
    }
  };

  const handleCalculate = () => {
    const values = methods.getValues();
    const currency = (values.currency as Currency) || "USD";

    if (currentStep === 0) {
      trackEvent("calculator_started", { calculator: config.id });
    }

    const result = calculate(config.id, values as Record<string, unknown>, currency);
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
          <div className="flex justify-between text-sm text-slate-500 mb-2">
            <span>Paso {currentStep + 1} de {steps.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{step.title}</CardTitle>
            <CardDescription>{step.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <QuestionStep fields={step.fields} />
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          <Button
            variant="ghost"
            onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4" />
            Anterior
          </Button>
          <Button onClick={handleNext}>
            {currentStep === steps.length - 1 ? (
              <>
                <Calculator className="h-4 w-4" />
                Calcular resultado
              </>
            ) : (
              <>
                Siguiente
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </FormProvider>
  );
}