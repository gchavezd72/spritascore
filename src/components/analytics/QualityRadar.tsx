"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import type { QualityAttribute } from "@/lib/kiuwan/types";

interface QualityRadarProps {
  attributes: QualityAttribute[];
}

export function QualityRadar({ attributes }: QualityRadarProps) {
  const data = attributes.map((item) => ({
    axis: item.label,
    score: item.score,
  }));

  return (
    <div className="h-72" role="img" aria-label="Radar de cinco atributos de calidad">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="72%">
          <PolarGrid stroke="rgba(232,237,245,0.14)" />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fill: "#c5d0e0", fontSize: 12, fontWeight: 600 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: "#6b778c", fontSize: 10 }}
            stroke="rgba(232,237,245,0.12)"
          />
          <Radar
            name="Calidad"
            dataKey="score"
            stroke="#2fbf6a"
            fill="#2fbf6a"
            fillOpacity={0.28}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
