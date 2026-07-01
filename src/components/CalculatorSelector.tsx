"use client";

import Link from "next/link";
import { Clock, BarChart3, Shield, Smartphone, Building2 } from "lucide-react";
import { CALCULATOR_CONFIGS } from "@/data/calculatorConfigs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ICONS = {
  "iso-quality": BarChart3,
  "owasp-web": Shield,
  "owasp-mobile": Smartphone,
  sector: Building2,
};

const COMPLEXITY_COLORS = {
  baja: "outline" as const,
  media: "moderado" as const,
  alta: "alto" as const,
};

export function CalculatorSelector() {
  return (
    <section id="calculadoras" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-navy mb-4">
            Seleccione su calculadora de riesgo
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Cuatro modelos especializados para traducir riesgos técnicos en impacto financiero ejecutivo.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CALCULATOR_CONFIGS.map((calc) => {
            const Icon = ICONS[calc.id];
            return (
              <Card key={calc.id} className="hover:shadow-lg transition-shadow border-slate-200 group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-brand-navy/5 text-brand-navy group-hover:bg-brand-orange/10 group-hover:text-brand-orange transition-colors">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{calc.title}</CardTitle>
                        <div className="flex gap-2 mt-2">
                          <Badge variant={COMPLEXITY_COLORS[calc.complexity]}>
                            Complejidad {calc.complexity}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {calc.estimatedTime}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-6 leading-relaxed">
                    {calc.shortDescription}
                  </CardDescription>
                  <Link href={`/calculadora/${calc.slug}`}>
                    <Button className="w-full">Iniciar cálculo</Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}