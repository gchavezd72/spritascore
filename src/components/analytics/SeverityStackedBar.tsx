"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { CategorySeverityRow } from "@/lib/kiuwan/aggregate";

const COLORS = {
  critical: "#5B8DEF",
  high: "#3DBA6E",
  medium: "#E08A5A",
  low: "#E8C547",
};

interface SeverityStackedBarProps {
  rows: CategorySeverityRow[];
  metricLabel?: string;
}

export function SeverityStackedBar({ rows, metricLabel = "Cantidad" }: SeverityStackedBarProps) {
  if (rows.length === 0) {
    return <p className="sa-paper-empty">No hay defectos en la seleccion actual.</p>;
  }

  return (
    <div className="sa-paper-chart" role="img" aria-label="Defectos por categoria y severidad">
      <ResponsiveContainer width="100%" height={Math.max(220, rows.length * 42 + 48)}>
        <BarChart layout="vertical" data={rows} margin={{ top: 8, right: 16, left: 8, bottom: 8 }} barCategoryGap="28%">
          <CartesianGrid stroke="#e6e8ec" horizontal={false} />
          <XAxis type="number" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={{ stroke: "#d7dbe2" }} />
          <YAxis
            type="category"
            dataKey="category"
            width={128}
            tick={{ fill: "#374151", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{ borderRadius: 10, border: "1px solid #e5e7eb", fontSize: 12 }}
            formatter={(value, name) => [`${Number(value ?? 0)} ${metricLabel}`, labelOf(String(name))]}
          />
          <Legend formatter={(value) => labelOf(String(value))} />
          <Bar dataKey="critical" stackId="sev" fill={COLORS.critical} radius={[0, 0, 0, 0]} />
          <Bar dataKey="high" stackId="sev" fill={COLORS.high} />
          <Bar dataKey="medium" stackId="sev" fill={COLORS.medium} />
          <Bar dataKey="low" stackId="sev" fill={COLORS.low} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function labelOf(key: string): string {
  if (key === "critical") return "Critica";
  if (key === "high") return "Alta";
  if (key === "medium") return "Media";
  if (key === "low") return "Baja";
  return key;
}
