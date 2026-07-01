"use client";

import { useFormContext } from "react-hook-form";
import { HelpCircle } from "lucide-react";
import type { WizardField } from "@/types/calculator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface QuestionStepProps {
  fields: WizardField[];
}

export function QuestionStep({ fields }: QuestionStepProps) {
  const { register, setValue, watch, formState: { errors } } = useFormContext();

  if (fields.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-slate-600">
          Revise la información ingresada y presione &quot;Calcular resultado&quot; para obtener su estimación.
        </p>
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
                  {field.label}
                  {field.required && <span className="text-risk-critical ml-1">*</span>}
                </Label>
                {field.tooltip && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="text-slate-400 hover:text-brand-navy">
                        <HelpCircle className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>{field.tooltip}</TooltipContent>
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
                  options={field.options}
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
                    className="w-full accent-brand-orange"
                    {...register(field.name, { valueAsNumber: true })}
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>1 — Muy deficiente</span>
                    <span className="font-semibold text-brand-navy text-sm">
                      {value ?? field.defaultValue ?? 3}
                    </span>
                    <span>5 — Excelente</span>
                  </div>
                </div>
              )}

              {field.type === "checkbox" && (
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 accent-brand-orange"
                    {...register(field.name)}
                  />
                  <span className="text-sm text-slate-600">{field.label}</span>
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
                          isChecked ? "border-brand-orange bg-brand-orange/5" : "border-slate-200 hover:border-slate-300"
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
                          className="accent-brand-orange"
                        />
                        <span className="text-sm">{opt.label}</span>
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