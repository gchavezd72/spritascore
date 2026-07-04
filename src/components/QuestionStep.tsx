"use client";

import { useFormContext } from "react-hook-form";
import { HelpCircle } from "lucide-react";
import type { WizardField } from "@/types/calculator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { tr } from "@/lib/translate";
import { useTranslations } from "@/components/LanguageProvider";

interface QuestionStepProps {
  fields: WizardField[];
}

export function QuestionStep({ fields }: QuestionStepProps) {
  const { register, setValue, watch, formState: { errors } } = useFormContext();
  const { t, locale } = useTranslations();

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

          return (
            <div key={field.name} className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor={field.name}>
                  {tr(field.label, locale)}
                  {field.required && <span className="text-risk-critical ml-1">*</span>}
                </Label>
                {field.tooltip && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="text-muted-foreground hover:text-foreground">
                        <HelpCircle className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>{tr(field.tooltip, locale)}</TooltipContent>
                  </Tooltip>
                )}
              </div>

              {field.type === "text" && (
                <Input id={field.name} placeholder={field.placeholder} {...register(field.name)} />
              )}

              {field.type === "number" && (
                <Input
                  id={field.name}
                  type="number"
                  placeholder={field.placeholder}
                  {...register(field.name, { valueAsNumber: true })}
                />
              )}

              {field.type === "select" && field.options && (
                <Select
                  id={field.name}
                  options={field.options.map((o) => ({ value: o.value, label: tr(o.label, locale) }))}
                  placeholder={t.wizard.selectPlaceholder}
                  value={value ?? ""}
                  {...register(field.name)}
                />
              )}

              {field.type === "slider" && (
                <div className="space-y-2">
                  <input
                    type="range"
                    id={field.name}
                    min={field.min ?? 1}
                    max={field.max ?? 5}
                    step={1}
                    className="w-full accent-brand-green"
                    {...register(field.name, { valueAsNumber: true })}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1 — {t.wizard.sliderWorst}</span>
                    <span className="font-semibold text-foreground text-sm">
                      {value ?? field.defaultValue ?? 3}
                    </span>
                    <span>5 — {t.wizard.sliderBest}</span>
                  </div>
                </div>
              )}

              {field.type === "checkbox" && (
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-border-strong accent-brand-green"
                    {...register(field.name)}
                  />
                  <span className="text-sm text-muted-foreground">{tr(field.label, locale)}</span>
                </label>
              )}

              {field.type === "multiselect" && field.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {field.options.map((opt) => {
                    const selected: string[] = value ?? [];
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
                            const current: string[] = watch(field.name) ?? [];
                            if (e.target.checked) {
                              setValue(field.name, [...current, opt.value]);
                            } else {
                              setValue(field.name, current.filter((v) => v !== opt.value));
                            }
                          }}
                          className="accent-brand-green"
                        />
                        <span className="text-sm">{tr(opt.label, locale)}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {error && <p className="text-sm text-risk-critical">{error}</p>}
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
