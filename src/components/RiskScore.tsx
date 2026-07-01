"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import type { RiskLevel } from "@/types/calculator";
import { RISK_LEVELS } from "@/data/riskRanges";
import { Badge } from "@/components/ui/badge";

interface RiskScoreProps {
  score: number;
  riskLevel: RiskLevel;
  size?: "sm" | "lg";
}

export function RiskScore({ score, riskLevel, size = "lg" }: RiskScoreProps) {
  const config = RISK_LEVELS[riskLevel];
  const data = [
    { name: "score", value: score },
    { name: "remaining", value: 100 - score },
  ];

  const dim = size === "lg" ? 200 : 120;

  return (
    <div className="flex flex-col items-center gap-4">
      <div style={{ width: dim, height: dim }} className="relative">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={size === "lg" ? 70 : 40}
              outerRadius={size === "lg" ? 95 : 55}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
            >
              <Cell fill={config.color} />
              <Cell fill="#e2e8f0" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold text-brand-navy ${size === "lg" ? "text-4xl" : "text-2xl"}`}>
            {score}
          </span>
          <span className="text-xs text-slate-500">/ 100</span>
        </div>
      </div>
      <Badge variant={riskLevel} className="text-sm px-4 py-1.5">
        Riesgo {config.label}
      </Badge>
    </div>
  );
}