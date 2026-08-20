"use client";

import { useMemo, useState } from "react";
import {
  defectsByCategoryAndSeverity,
  effortByCategoryAndSeverity,
  formatEffort,
  rankVulnerabilities,
} from "@/lib/kiuwan/aggregate";
import { priorityLabel } from "@/lib/kiuwan/normalize";
import { SeverityStackedBar } from "@/components/analytics/SeverityStackedBar";
import type { Finding } from "@/lib/kiuwan/types";

interface QualityBoardProps {
  findings: Finding[];
}

export function QualityBoard({ findings }: QualityBoardProps) {
  const [groupBy, setGroupBy] = useState<"category" | "language">("category");
  const [metric, setMetric] = useState<"count" | "effort">("count");

  const highCritical = findings.filter((item) => item.priority === "very-high" || item.priority === "high").length;
  const files = new Set(findings.map((item) => item.file).filter(Boolean)).size;
  const effort = findings.reduce((sum, item) => sum + item.effortMinutes, 0);
  const top = rankVulnerabilities(findings).slice(0, 5);

  const rows = useMemo(
    () =>
      metric === "effort"
        ? effortByCategoryAndSeverity(findings, groupBy)
        : defectsByCategoryAndSeverity(findings, groupBy),
    [findings, groupBy, metric]
  );

  return (
    <section className="sa-paper">
      <header className="sa-paper-head">
        <h2>Calidad del codigo</h2>
      </header>
      <div className="sa-paper-kpis">
        <div>
          <b>{findings.length}</b>
          <span>Defectos</span>
        </div>
        <div>
          <b>{highCritical}</b>
          <span>Alta / critica</span>
        </div>
        <div>
          <b>{files}</b>
          <span>Archivos</span>
        </div>
        <div>
          <b>{formatEffort(effort)}</b>
          <span>Deuda estimada</span>
        </div>
      </div>

      <h3>Defectos por categoria y severidad</h3>
      <p className="sa-paper-lead">
        Las categorias con mayor concentracion de defectos prioritarios aparecen primero.
      </p>
      <div className="sa-paper-controls">
        <span>
          Agrupar por:{" "}
          <button type="button" data-on={groupBy === "category"} onClick={() => setGroupBy("category")}>
            Categoria
          </button>
          <button type="button" data-on={groupBy === "language"} onClick={() => setGroupBy("language")}>
            Lenguaje
          </button>
        </span>
        <span>
          Metrica:{" "}
          <button type="button" data-on={metric === "count"} onClick={() => setMetric("count")}>
            Cantidad
          </button>
          <button type="button" data-on={metric === "effort"} onClick={() => setMetric("effort")}>
            Esfuerzo
          </button>
        </span>
      </div>
      <SeverityStackedBar rows={rows} metricLabel={metric === "effort" ? "Minutos" : "Cantidad"} />

      <h3>Top prioridades</h3>
      {top.length === 0 ? (
        <p className="sa-paper-empty">Sin defectos de calidad visibles.</p>
      ) : (
        <ol className="sa-paper-top">
          {top.map((item) => (
            <li key={item.ruleCode || item.rule}>
              <span>
                {item.rank}. {item.rule}
              </span>
              <em>{priorityLabel(item.priority)}</em>
              <b>{item.count}</b>
              <small>{formatEffort(item.effortMinutes)}</small>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
