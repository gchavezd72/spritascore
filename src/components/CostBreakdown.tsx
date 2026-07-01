"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";
import type { CostBreakdown as CostBreakdownType } from "@/types/calculator";
import type { Currency } from "@/types/calculator";
import { formatCurrency } from "@/lib/formatCurrency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CostBreakdownProps {
  cost: CostBreakdownType;
  currency: Currency;
}

const COLORS = ["#1e3a5f", "#f97316", "#3b82f6", "#ef4444", "#8b5cf6", "#22c55e", "#eab308"];

export function CostBreakdown({ cost, currency }: CostBreakdownProps) {
  const chartData = cost.items.map((item, i) => ({
    name: item.label.length > 20 ? item.label.slice(0, 18) + "…" : item.label,
    fullName: item.label,
    value: item.value,
    fill: COLORS[i % COLORS.length],
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cost.min !== undefined && (
          <Card className="border-slate-200">
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-slate-500 mb-1">Escenario mínimo</p>
              <p className="text-xl font-bold text-brand-navy">{formatCurrency(cost.min, currency)}</p>
            </CardContent>
          </Card>
        )}
        <Card className="border-brand-orange/30 bg-brand-orange/5">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-slate-500 mb-1">Escenario probable</p>
            <p className="text-2xl font-bold text-brand-orange">
              {formatCurrency(cost.probable ?? cost.annual ?? 0, currency)}
            </p>
          </CardContent>
        </Card>
        {cost.max !== undefined && (
          <Card className="border-slate-200">
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-slate-500 mb-1">Escenario alto</p>
              <p className="text-xl font-bold text-risk-critical">{formatCurrency(cost.max, currency)}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {cost.monthly !== undefined && (
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-slate-500">Costo mensual</p>
              <p className="text-lg font-bold">{formatCurrency(cost.monthly, currency)}</p>
            </CardContent>
          </Card>
          {cost.perDeveloper !== undefined && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-slate-500">Costo por desarrollador</p>
                <p className="text-lg font-bold">{formatCurrency(cost.perDeveloper, currency)}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Desglose de costos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" tickFormatter={(v) => formatCurrency(v, currency, true)} />
                  <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value), currency)}
                    labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ""}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}