"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import type { ImpactMatrix as ImpactMatrixType } from "@/types/calculator";

interface ImpactMatrixProps {
  matrix: ImpactMatrixType;
}

export function ImpactMatrix({ matrix }: ImpactMatrixProps) {
  const data = [
    { dimension: "Financiero", value: matrix.financial },
    { dimension: "Técnico", value: matrix.technical },
    { dimension: "Operativo", value: matrix.operational },
    { dimension: "Regulatorio", value: matrix.regulatory },
    { dimension: "Reputacional", value: matrix.reputational },
  ];

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 12, fill: "#475569" }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
          <Radar
            name="Impacto"
            dataKey="value"
            stroke="#f97316"
            fill="#f97316"
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}