"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";
import type { CostBreakdown as CostBreakdownType } from "@/types/calculator";
import type { Currency } from "@/types/calculator";
import { formatCurrency } from "@/lib/formatCurrency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "@/components/LanguageProvider";

interface CostBreakdownProps {
  cost: CostBreakdownType;
  currency: Currency;
}

const COLORS = ["#1fbf6c", "#3b6fe0", "#8b5cf6", "#ef4444", "#0ea5a0", "#eab308", "#64748b"];

export function CostBreakdown({ cost, currency }: CostBreakdownProps) {
  const { t } = useTranslations();
  const cb = t.costBreakdown;
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
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-muted-foreground mb-1">{cb.minScenario}</p>
              <p className="text-xl font-bold text-foreground">{formatCurrency(cost.min, currency)}</p>
            </CardContent>
          </Card>
        )}
        <Card className="border-brand-green/30 bg-brand-green/[0.06]">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">{cb.probableScenario}</p>
            <p className="text-2xl font-bold text-brand-green">
              {formatCurrency(cost.probable ?? cost.annual ?? 0, currency)}
            </p>
          </CardContent>
        </Card>
        {cost.max !== undefined && (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-muted-foreground mb-1">{cb.highScenario}</p>
              <p className="text-xl font-bold text-risk-critical">{formatCurrency(cost.max, currency)}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {cost.monthly !== undefined && (
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{cb.monthlyCost}</p>
              <p className="text-lg font-bold text-foreground">{formatCurrency(cost.monthly, currency)}</p>
            </CardContent>
          </Card>
          {cost.perDeveloper !== undefined && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">{cb.perDeveloperCost}</p>
                <p className="text-lg font-bold text-foreground">{formatCurrency(cost.perDeveloper, currency)}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{cb.breakdownTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" tickFormatter={(v) => formatCurrency(v, currency, true)} tick={{ fontSize: 11, fill: "#64748b" }} stroke="#e2e8f0" />
                  <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11, fill: "#64748b" }} stroke="#e2e8f0" />
                  <Tooltip
                    cursor={{ fill: "rgba(18,33,59,0.04)" }}
                    contentStyle={{ background: "#ffffff", border: "1px solid #e6e9ef", borderRadius: 8, color: "#12213b", boxShadow: "0 8px 24px -12px rgba(18,33,59,0.25)" }}
                    labelStyle={{ color: "#12213b" }}
                    itemStyle={{ color: "#12213b" }}
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