"use client";

import { useFormContext } from "react-hook-form";
import { HelpCircle } from "lucide-react";
import type { WizardField } from "@/types/calculator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { formatTemplate, tr } from "@/lib/translate";
import { getCurrencyForCountry } from "@/lib/formatCurrency";
import { useTranslations } from "@/components/LanguageProvider";

interface QuestionStepProps {
  fields: WizardField[];
}

const MONEY_FIELD = /cost|revenue|rate|hourly/i;

export function QuestionStep({ fields }: QuestionStepProps) {
  const { register, setValue, watch, formState: { errors } } = useFormContext();
  const { t, locale } = useTranslations();
  const currencyCode = String(watch("currency") || "USD");

  if (fields.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-muted-foreground">{t.wizard.reviewPrompt}</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {fields.map((field) => {
          const error = errors[field.name]?.message as string | undefined;
          const value = watch(field.name);
          const money = MONEY_FIELD.test(field.name);
          const errorId = `${field.name}-error`;
          const label = tr(field.label, locale);

          return (
            <div key={field.name} className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor={field.name}>
                  {label}
                  {money ? <span className="text-muted-foreground font-normal"> ({currencyCode})</span> : null}
                  {field.required && <span className="text-risk-critical ml-1">*</span>}
                </Label>
                {field.tooltip && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-foreground"
                        aria-label={formatTemplate(t.wizard.helpLabel, { label })}
                      >
                        <HelpCircle className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>{tr(field.tooltip, locale)}</TooltipContent>
                  </Tooltip>
                )}
              </div>

              {field.type === "text" && (
                <Input
                  id={field.name}
                  placeholder={field.placeholder}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? errorId : undefined}
                  {...register(field.name)}
                />
              )}

              {field.type === "number" && (
                <Input
                  id={field.name}
                  type="number"
                  placeholder={field.placeholder}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? errorId : undefined}
                  {...register(field.name, { valueAsNumber: true })}
                />
              )}

              {field.type === "select" && field.options && (
                <Select
                  id={field.name}
                  options={field.options.map((o) => ({ value: o.value, label: tr(o.label, locale) }))}
                  placeholder={t.wizard.selectPlaceholder}
                  value={value ?? ""}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? errorId : undefined}
                  {...register(field.name, field.name === "country" ? {
                    onChange: (event) => {
                      const next = event.target.value;
                      if (next) setValue("currency", getCurrencyForCountry(next));
                    },
                  } : undefined)}
                />
              )}

              {field.type === "slider" && (
                <SliderField
                  name={field.name}
                  max={field.max ?? 5}
                  value={value}
                  error={error}
                  errorId={errorId}
                  worst={t.wizard.sliderWorst}
                  best={t.wizard.sliderBest}
                  unknown={t.wizard.sliderUnknown}
                  onChange={(next) => setValue(field.name, next, { shouldValidate: true, shouldDirty: true })}
                />
              )}

              {field.type === "checkbox" && (
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-border-strong accent-brand-green"
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? errorId : undefined}
                    {...register(field.name)}
                  />
                  <span className="text-sm text-muted-foreground">{label}</span>
                </label>
              )}

              {field.type === "multiselect" && field.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {field.options.map((opt) => {
                    const selected: string[] = Array.isArray(value) ? value : [];
                    const isChecked = selected.includes(opt.value);
                    return (
                      <label
                        key={opt.value}
                        className={cn(
                          "flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors",
                          isChecked ? "border-brand-green bg-brand-green/10" : "border-border-hairline hover:border-border-strong"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const current: string[] = Array.isArray(watch(field.name)) ? watch(field.name) : [];
                            const next = e.target.checked
                              ? [...current, opt.value]
                              : current.filter((v) => v !== opt.value);
                            setValue(field.name, next, { shouldValidate: true, shouldDirty: true });
                          }}
                          className="accent-brand-green"
                        />
                        <span className="text-sm">{tr(opt.label, locale)}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {error && (
                <p id={errorId} className="text-sm text-risk-critical" role="alert">
                  {error}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );
}

function SliderField({
  name,
  max,
  value,
  error,
  errorId,
  worst,
  best,
  unknown,
  onChange,
}: {
  name: string;
  max: number;
  value: unknown;
  error?: string;
  errorId: string;
  worst: string;
  best: string;
  unknown: string;
  onChange: (value: number) => void;
}) {
  const numeric = typeof value === "number" && !Number.isNaN(value) ? value : 0;
  const known = numeric >= 1;

  return (
    <div className="space-y-2">
      <input
        type="range"
        id={name}
        min={1}
        max={max}
        step={1}
        value={known ? numeric : 1}
        aria-valuemin={1}
        aria-valuemax={max}
        aria-valuenow={known ? numeric : undefined}
        aria-valuetext={known ? String(numeric) : unknown}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="w-full accent-brand-green"
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <div className="flex justify-between items-center gap-3 text-xs text-muted-foreground">
        <span>1 — {worst}</span>
        <span className="font-semibold text-foreground text-sm">{known ? numeric : unknown}</span>
        <span>{max} — {best}</span>
      </div>
      <button
        type="button"
        className={cn(
          "text-sm underline-offset-2 hover:underline",
          known ? "text-muted-foreground" : "text-foreground font-semibold"
        )}
        aria-pressed={!known}
        onClick={() => onChange(0)}
      >
        {unknown}
      </button>
    </div>
  );
}
