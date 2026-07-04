"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import type { ImpactMatrix as ImpactMatrixType } from "@/types/calculator";
import { useTranslations } from "@/components/LanguageProvider";

interface ImpactMatrixProps {
  matrix: ImpactMatrixType;
}

export function ImpactMatrix({ matrix }: ImpactMatrixProps) {
  const { t } = useTranslations();
  const labels = t.impactMatrixLabels;
  const data = [
    { dimension: labels.financial, value: matrix.financial },
    { dimension: labels.technical, value: matrix.technical },
    { dimension: labels.operational, value: matrix.operational },
    { dimension: labels.regulatory, value: matrix.regulatory },
    { dimension: labels.reputational, value: matrix.reputational },
  ];

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 12, fill: "#475569" }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: "#94a3b8" }} />
          <Radar
            name="Impacto"
            dataKey="value"
            stroke="#1fbf6c"
            fill="#1fbf6c"
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}