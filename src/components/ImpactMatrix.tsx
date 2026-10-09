"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import type { ImpactMatrix as ImpactMatrixType, Locale } from "@/types/calculator";
import { getTranslations } from "@/i18n";
import { useTranslations } from "@/components/LanguageProvider";

interface ImpactMatrixProps {
  matrix: ImpactMatrixType;
  reportLocale?: Locale;
}

export function ImpactMatrix({ matrix, reportLocale }: ImpactMatrixProps) {
  const { locale: uiLocale } = useTranslations();
  const labels = getTranslations(reportLocale ?? uiLocale).impactMatrixLabels;
  const data = [
    { dimension: labels.financial, value: matrix.financial },
    { dimension: labels.technical, value: matrix.technical },
    { dimension: labels.operational, value: matrix.operational },
    { dimension: labels.regulatory, value: matrix.regulatory },
    { dimension: labels.reputational, value: matrix.reputational },
  ];

  return (
    <div>
      <div className="h-80" aria-hidden="true" inert>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} margin={{ top: 28, right: 48, bottom: 28, left: 48 }}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11, fill: "#475569" }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9, fill: "#94a3b8" }} />
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
      <table className="w-full text-sm mt-2">
        <caption className="sr-only">{labels.financial}, {labels.technical}, {labels.operational}, {labels.regulatory}, {labels.reputational}</caption>
        <tbody>
          {data.map((row) => (
            <tr key={row.dimension} className="border-t border-border-hairline">
              <th scope="row" className="py-1.5 text-left font-medium text-foreground">{row.dimension}</th>
              <td className="py-1.5 text-right tabular-nums text-muted-foreground">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}