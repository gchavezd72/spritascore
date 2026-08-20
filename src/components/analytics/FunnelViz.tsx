"use client";

import type { FunnelStage } from "@/lib/kiuwan/types";

const COLORS = ["#3d6b8a", "#2f8f7a", "#2fbf6a", "#f5a524"];

interface FunnelVizProps {
  stages: FunnelStage[];
  activeId?: string | null;
  onSelect?: (stageId: string) => void;
}

export function FunnelViz({ stages, activeId, onSelect }: FunnelVizProps) {
  const max = Math.max(1, ...stages.map((stage) => stage.count));
  const height = 56;
  const gap = 8;
  const width = 360;
  const totalHeight = stages.length * height + (stages.length - 1) * gap;

  return (
    <svg
      viewBox={`0 0 ${width} ${totalHeight}`}
      role="img"
      aria-label="Embudo de hallazgos"
      className="w-full h-auto"
    >
      {stages.map((stage, index) => {
        const ratio = Math.max(0.22, stage.count / max);
        const next = stages[index + 1];
        const nextRatio = next ? Math.max(0.22, next.count / max) : Math.max(0.18, ratio * 0.55);
        const topW = width * ratio;
        const botW = width * (index === stages.length - 1 ? Math.min(ratio, 0.36) : nextRatio);
        const y = index * (height + gap);
        const topX = (width - topW) / 2;
        const botX = (width - botW) / 2;
        const points = `${topX},${y} ${topX + topW},${y} ${botX + botW},${y + height} ${botX},${y + height}`;
        const selected = activeId === stage.id;
        return (
          <g key={stage.id}>
            <polygon
              points={points}
              fill={COLORS[Math.min(index, COLORS.length - 1)]}
              opacity={selected ? 1 : 0.88}
              role={onSelect ? "button" : undefined}
              tabIndex={onSelect ? 0 : undefined}
              onClick={() => onSelect?.(stage.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") onSelect?.(stage.id);
              }}
              style={{ cursor: onSelect ? "pointer" : "default" }}
            >
              <title>{`${stage.label}: ${stage.count}. ${stage.hint}`}</title>
            </polygon>
            <text
              x={width / 2}
              y={y + height / 2 - 6}
              textAnchor="middle"
              fill="#071018"
              fontSize="13"
              fontWeight="800"
            >
              {stage.count}
            </text>
            <text
              x={width / 2}
              y={y + height / 2 + 11}
              textAnchor="middle"
              fill="#071018"
              fontSize="10"
              fontWeight="700"
            >
              {stage.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
