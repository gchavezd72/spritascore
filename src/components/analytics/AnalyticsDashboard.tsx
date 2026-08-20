"use client";

import { useCallback, useMemo, useState } from "react";
import { FunnelViz } from "@/components/analytics/FunnelViz";
import { QualityRadar } from "@/components/analytics/QualityRadar";
import {
  applicationFindings,
  applicationFunnel,
  applySelection,
  componentFunnel,
  countBy,
  defaultSelection,
  distinct,
  executiveSnapshot,
  filePresence,
  formatEffort,
  hotspotFiles,
  improvementsByArea,
  qualityFindings,
  qualityRadar,
  totalEffort,
} from "@/lib/kiuwan/aggregate";
import { downloadAnalyticsBriefingPdf } from "@/lib/kiuwan/analyticsPdf";
import { loadDemoAnalysis } from "@/lib/kiuwan/demo";
import { allowedUpload } from "@/lib/kiuwan/classify";
import { MAX_FILE_BYTES, MAX_FILES, MAX_TOTAL_BYTES, parseKiuwanFiles } from "@/lib/kiuwan/parse";
import { priorityLabel } from "@/lib/kiuwan/normalize";
import type {
  AnalysisModel,
  Improvement,
  KiuwanFileKind,
  ParseWarning,
  Priority,
  Selection,
  SheetId,
} from "@/lib/kiuwan/types";

const SHEETS: Array<{ id: SheetId; label: string }> = [
  { id: "resumen", label: "Resumen" },
  { id: "seguridad", label: "Seguridad" },
  { id: "componentes", label: "Componentes" },
  { id: "calidad", label: "Calidad" },
];

const FILE_LABELS: Record<KiuwanFileKind, string> = {
  vulnerabilities: "Vulnerabilidades de aplicación",
  defects: "Defectos de calidad",
  "insight-security": "Seguridad SCA (CVEs)",
  "insight-components": "Componentes de terceros",
  "insight-license": "Licencias",
  "insight-obsolescence": "Obsolescencia",
  metrics: "Métricas por archivo",
  sarif: "SARIF",
  sbom: "SBOM CycloneDX",
  unknown: "No reconocido",
};

const EXPECTED: KiuwanFileKind[] = [
  "vulnerabilities",
  "defects",
  "insight-security",
  "insight-components",
  "insight-license",
  "insight-obsolescence",
  "metrics",
];

export function AnalyticsDashboard() {
  const [model, setModel] = useState<AnalysisModel | null>(null);
  const [warnings, setWarnings] = useState<ParseWarning[]>([]);
  const [selection, setSelection] = useState<Selection>(defaultSelection());
  const [sheet, setSheet] = useState<SheetId>("resumen");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [over, setOver] = useState(false);
  const [qualityArea, setQualityArea] = useState("Maintainability");
  const [printing, setPrinting] = useState(false);

  const ingest = useCallback(async (files: File[]) => {
    setError(null);
    const accepted = files.filter((file) => allowedUpload(file.name));
    if (accepted.length === 0) {
      setError("Solo se aceptan CSV, SARIF y JSON (Kiuwan / CycloneDX).");
      return;
    }
    if (accepted.length > MAX_FILES) {
      setError(`Máximo ${MAX_FILES} archivos por análisis.`);
      return;
    }
    const total = accepted.reduce((sum, file) => sum + file.size, 0);
    if (total > MAX_TOTAL_BYTES) {
      setError("El volumen total supera 40 MB.");
      return;
    }
    setBusy(true);
    try {
      const sources = await Promise.all(
        accepted.map(async (file) => ({
          name: file.name.slice(0, 200),
          size: file.size > MAX_FILE_BYTES ? MAX_FILE_BYTES + 1 : file.size,
          text: file.size > MAX_FILE_BYTES ? "" : await file.text(),
        }))
      );
      const result = parseKiuwanFiles(sources);
      setModel(result.model);
      setWarnings(result.warnings);
      setSelection(defaultSelection());
      setSheet("resumen");
    } catch {
      setError("No se pudieron leer los archivos.");
    } finally {
      setBusy(false);
    }
  }, []);

  const loadDemo = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const demo = await loadDemoAnalysis();
      setModel(demo.model);
      setWarnings(demo.warnings);
      setSelection(defaultSelection());
      setSheet("resumen");
    } catch {
      setError("No se pudo cargar el ejemplo.");
    } finally {
      setBusy(false);
    }
  }, []);

  const findings = useMemo(() => (model ? applySelection(model, selection) : []), [model, selection]);
  const presence = model ? filePresence(model.files) : null;
  const appFunnel = useMemo(() => applicationFunnel(findings), [findings]);
  const scaFunnel = useMemo(() => (model ? componentFunnel(model) : null), [model]);
  const radar = useMemo(() => (model ? qualityRadar(model, findings) : []), [model, findings]);
  const improvements = useMemo(() => improvementsByArea(findings), [findings]);
  const snapshot = useMemo(() => (model ? executiveSnapshot(model, findings) : null), [model, findings]);
  const app = applicationFindings(findings);
  const quality = qualityFindings(findings);
  const languages = model ? distinct(model.findings, (item) => item.language || "—") : [];
  const characteristics = model ? distinct(model.findings, (item) => item.characteristic || "Sin clasificar") : [];
  const types = model ? distinct(model.findings, (item) => item.vulnerabilityType || "—") : [];
  const priorities = useMemo(() => {
    if (!model) return [];
    const present = new Set(model.findings.map((item) => item.priority));
    return (["very-high", "high", "medium", "low", "very-low", "unknown"] as Priority[]).filter((item) =>
      present.has(item)
    );
  }, [model]);

  const onFiles = (list: FileList | File[] | null) => {
    if (!list) return;
    void ingest(Array.from(list));
  };

  const toggleValue = (key: "priorities" | "languages" | "characteristics" | "types", value: string) => {
    setSelection((current) => {
      const list = current[key] as string[];
      const exists = list.includes(value);
      const next = exists ? list.filter((item) => item !== value) : [...list, value];
      return { ...current, [key]: next } as Selection;
    });
  };

  const activeChips = [
    ...selection.priorities.map((item) => ({
      key: `p-${item}`,
      label: priorityLabel(item),
      clear: () => toggleValue("priorities", item),
    })),
    ...selection.languages.map((item) => ({ key: `l-${item}`, label: item, clear: () => toggleValue("languages", item) })),
    ...selection.characteristics.map((item) => ({
      key: `c-${item}`,
      label: item,
      clear: () => toggleValue("characteristics", item),
    })),
    ...selection.types.map((item) => ({ key: `t-${item}`, label: item, clear: () => toggleValue("types", item) })),
  ];

  return (
    <div className="sa sa-shell">
      <header className="sa-top">
        <div className="sa-brand">
          <div className="sa-brand-mark" aria-hidden>
            S
          </div>
          <div>
            <h1>Sprita iT Analytics</h1>
            <p>Kiuwan · CSV · SARIF · SBOM</p>
          </div>
        </div>
        <div className="sa-sheets" role="tablist" aria-label="Hojas del análisis">
          {SHEETS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={sheet === item.id}
              onClick={() => setSheet(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="sa-actions">
          <label className="sa-btn sa-btn-primary">
            Cargar archivos
            <input
              type="file"
              accept=".csv,.json,.sarif,application/json,text/csv"
              multiple
              className="sr-only"
              onChange={(event) => {
                onFiles(event.target.files);
                event.target.value = "";
              }}
            />
          </label>
          <button type="button" className="sa-btn" onClick={() => void loadDemo()} disabled={busy}>
            Ejemplo
          </button>
          <button
            type="button"
            className="sa-btn"
            disabled={!model || printing}
            onClick={() => {
              if (!model) return;
              setPrinting(true);
              setError(null);
              void downloadAnalyticsBriefingPdf({ model, findings }).then((ok) => {
                if (!ok) setError("No se pudo generar el PDF. Reintente o use un navegador reciente.");
                setPrinting(false);
              });
            }}
          >
            {printing ? "Generando PDF…" : "Imprimir PDF"}
          </button>
          <a className="sa-btn" href="https://sprita-it.com" target="_blank" rel="noopener noreferrer">
            sprita-it.com
          </a>
        </div>
      </header>

      <div className="sa-selection" aria-live="polite">
        <span>Selección</span>
        {selection.hideBuildArtifacts && (
          <span className="sa-chip">
            Sin artefactos de build
            <button type="button" aria-label="Mostrar artefactos" onClick={() => setSelection((c) => ({ ...c, hideBuildArtifacts: false }))}>
              ×
            </button>
          </span>
        )}
        {activeChips.map((chip) => (
          <span key={chip.key} className="sa-chip">
            {chip.label}
            <button type="button" aria-label={`Quitar ${chip.label}`} onClick={chip.clear}>
              ×
            </button>
          </span>
        ))}
        {activeChips.length === 0 && !selection.hideBuildArtifacts && <span>Ningún filtro activo — todos los hallazgos visibles.</span>}
        {(activeChips.length > 0 || !selection.hideBuildArtifacts) && (
          <button type="button" className="sa-btn" onClick={() => setSelection(defaultSelection())}>
            Limpiar
          </button>
        )}
      </div>

      <div className="sa-body">
        <aside className="sa-rail">
          <label
            className="sa-drop"
            data-over={over}
            onDragOver={(event) => {
              event.preventDefault();
              setOver(true);
            }}
            onDragLeave={() => setOver(false)}
            onDrop={(event) => {
              event.preventDefault();
              setOver(false);
              onFiles(event.dataTransfer.files);
            }}
          >
            Arrastre CSV, SARIF o JSON de Kiuwan.
            <input
              type="file"
              accept=".csv,.json,.sarif,application/json,text/csv"
              multiple
              className="sr-only"
              onChange={(event) => {
                onFiles(event.target.files);
                event.target.value = "";
              }}
            />
          </label>

          <div className="sa-panel">
            <h2>Archivos</h2>
            {EXPECTED.map((kind) => {
              const file = model?.files.find((item) => item.kind === kind);
              const state = !file ? "off" : file.rowCount === 0 ? "empty" : "on";
              return (
                <div key={kind} className="sa-file">
                  <span className={`sa-dot ${state}`} aria-hidden />
                  <div>
                    <strong>{FILE_LABELS[kind]}</strong>
                    <em>{file ? file.name : "No cargado"}</em>
                  </div>
                  <span className="sa-mono">{file ? file.rowCount : "—"}</span>
                </div>
              );
            })}
            {model?.files
              .filter((file) => file.kind === "sarif" || file.kind === "sbom")
              .map((file) => (
                <div key={file.name} className="sa-file">
                  <span className="sa-dot on" aria-hidden />
                  <div>
                    <strong>{FILE_LABELS[file.kind]}</strong>
                    <em>{file.name}</em>
                  </div>
                  <span className="sa-mono">{file.rowCount}</span>
                </div>
              ))}
          </div>

          {model && (
            <>
              <label className="sa-check">
                <input
                  type="checkbox"
                  checked={selection.hideBuildArtifacts}
                  onChange={(event) => setSelection((current) => ({ ...current, hideBuildArtifacts: event.target.checked }))}
                />
                Ocultar artefactos de build
              </label>
              <ListBox
                title="Prioridad"
                options={priorities.map((item) => ({
                  id: item,
                  label: priorityLabel(item),
                  count: model.findings.filter((finding) => finding.priority === item).length,
                }))}
                selected={selection.priorities}
                onToggle={(id) => toggleValue("priorities", id)}
              />
              <ListBox
                title="Lenguaje"
                options={languages.map((item) => ({
                  id: item,
                  label: item,
                  count: model.findings.filter((finding) => (finding.language || "—") === item).length,
                }))}
                selected={selection.languages}
                onToggle={(id) => toggleValue("languages", id)}
              />
              <ListBox
                title="Característica"
                options={characteristics.map((item) => ({
                  id: item,
                  label: item,
                  count: model.findings.filter((finding) => (finding.characteristic || "Sin clasificar") === item).length,
                }))}
                selected={selection.characteristics}
                onToggle={(id) => toggleValue("characteristics", id)}
              />
              {types.some((item) => item !== "—") && (
                <ListBox
                  title="Tipo de vulnerabilidad"
                  options={types.map((item) => ({
                    id: item,
                    label: item,
                    count: model.findings.filter((finding) => (finding.vulnerabilityType || "—") === item).length,
                  }))}
                  selected={selection.types}
                  onToggle={(id) => toggleValue("types", id)}
                />
              )}
            </>
          )}
        </aside>

        <main className="sa-main">
          {error && <p className="sa-warn">{error}</p>}
          {busy && <p className="sa-ok">Leyendo archivos… el análisis no sale del navegador.</p>}
          {warnings.map((warning) => (
            <p key={`${warning.file}-${warning.message}`} className="sa-warn">
              {warning.file}: {warning.message}
            </p>
          ))}

          {!model && !busy && (
            <div className="sa-empty">
              <h2>Convierta un análisis Kiuwan en decisiones.</h2>
              <p>
                Cargue los CSV rfc_4180, SARIF y el SBOM JSON. Los hallazgos no se envían a ningún servidor: todo se
                calcula en su navegador, con la marca Sprita iT.
              </p>
            </div>
          )}

          {model && snapshot && presence && sheet === "resumen" && (
            <ResumenSheet
              snapshot={snapshot}
              appFunnel={appFunnel}
              scaFunnel={scaFunnel}
              radar={radar}
              appCount={app.length}
              qualityCount={quality.length}
              components={model.components.length}
              effort={formatEffort(totalEffort(findings))}
            />
          )}

          {model && sheet === "seguridad" && (
            <SeguridadSheet
              present={presence?.vulnerabilities || model.findings.some((item) => item.kind === "vulnerability")}
              funnel={appFunnel}
              findings={app}
            />
          )}

          {model && scaFunnel && sheet === "componentes" && (
            <ComponentesSheet model={model} funnel={scaFunnel} securityPresent={Boolean(presence?.["insight-security"])} />
          )}

          {model && sheet === "calidad" && (
            <CalidadSheet
              radar={radar}
              improvements={improvements}
              area={qualityArea}
              onArea={setQualityArea}
              hotspots={hotspotFiles(quality, 8)}
              languages={countBy(quality.map((item) => item.language || "—"))}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function ListBox({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: Array<{ id: string; label: string; count: number }>;
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="sa-panel">
      <h2>{title}</h2>
      <div className="sa-listbox">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className="sa-opt"
            data-on={selected.includes(option.id)}
            onClick={() => onToggle(option.id)}
          >
            <span>{option.label}</span>
            <small>{option.count}</small>
          </button>
        ))}
      </div>
    </div>
  );
}

function ResumenSheet({
  snapshot,
  appFunnel,
  scaFunnel,
  radar,
  appCount,
  qualityCount,
  components,
  effort,
}: {
  snapshot: ReturnType<typeof executiveSnapshot>;
  appFunnel: ReturnType<typeof applicationFunnel>;
  scaFunnel: ReturnType<typeof componentFunnel> | null;
  radar: ReturnType<typeof qualityRadar>;
  appCount: number;
  qualityCount: number;
  components: number;
  effort: string;
}) {
  return (
    <div className="sa-grid">
      <div className={snapshot.securityFile.present ? (snapshot.securityFile.empty ? "sa-ok" : "sa-ok") : "sa-warn"}>
        {snapshot.securityFile.present
          ? snapshot.securityFile.empty
            ? `Archivo de seguridad SCA presente (${snapshot.securityFile.name}): Kiuwan no reportó CVEs de terceros.`
            : `Archivo de seguridad SCA presente: ${snapshot.componentCves} CVE.`
          : "No se cargó INSIGHT_SECURITY. El embudo de componentes de terceros queda incompleto."}
      </div>

      <div className="sa-kpis">
        <div className="sa-kpi" data-tone={snapshot.score < 60 ? "crit" : snapshot.score < 80 ? "high" : "ok"}>
          <b>{snapshot.score}</b>
          <span>Postura {snapshot.label}</span>
        </div>
        <div className="sa-kpi" data-tone={appCount > 0 ? "high" : "ok"}>
          <b>{appCount}</b>
          <span>Vulns. de aplicación</span>
        </div>
        <div className="sa-kpi" data-tone={snapshot.componentCves > 0 ? "crit" : "ok"}>
          <b>{snapshot.componentCves}</b>
          <span>CVEs de terceros</span>
        </div>
        <div className="sa-kpi" data-tone="info">
          <b>{snapshot.qualityIndex}</b>
          <span>Índice de calidad</span>
        </div>
        <div className="sa-kpi">
          <b>{effort}</b>
          <span>Esfuerzo estimado</span>
        </div>
      </div>

      <p className="sa-card" style={{ margin: 0 }}>
        {snapshot.narrative} Componentes inventariados: {components}. Defectos de calidad visibles: {qualityCount}.
      </p>

      <div className="sa-split">
        <section className="sa-card">
          <div className="sa-card-head">
            <h2>Embudo · aplicación</h2>
            <p>La parte más delgada son las 10 vulnerabilidades más críticas</p>
          </div>
          <FunnelViz stages={appFunnel.stages} />
        </section>
        <section className="sa-card">
          <div className="sa-card-head">
            <h2>Embudo · terceros</h2>
            <p>Inventario SCA, riesgo y CVEs</p>
          </div>
          {scaFunnel ? <FunnelViz stages={scaFunnel.stages} /> : <p>Sin componentes.</p>}
        </section>
      </div>

      <div className="sa-split">
        <section className="sa-card">
          <div className="sa-card-head">
            <h2>Radar de calidad</h2>
            <p>Cinco indicadores Kiuwan ponderados por LOC</p>
          </div>
          <QualityRadar attributes={radar} />
        </section>
        <section className="sa-card">
          <div className="sa-card-head">
            <h2>10 críticas de aplicación</h2>
            <p>Ordenadas por severidad y volumen</p>
          </div>
          <TopList items={appFunnel.top10} />
        </section>
      </div>
    </div>
  );
}

function SeguridadSheet({
  present,
  funnel,
  findings,
}: {
  present: boolean;
  funnel: ReturnType<typeof applicationFunnel>;
  findings: ReturnType<typeof applicationFindings>;
}) {
  if (!present) {
    return (
      <div className="sa-warn">
        No hay archivo de vulnerabilidades de aplicación (Vulnerabilities CSV o SARIF). Cárguelo para ver el embudo.
      </div>
    );
  }

  return (
    <div className="sa-grid">
      <div className="sa-split">
        <section className="sa-card">
          <div className="sa-card-head">
            <h2>Embudo de vulnerabilidades</h2>
            <p>De todo el volumen a las 10 más críticas</p>
          </div>
          <FunnelViz stages={funnel.stages} />
        </section>
        <section className="sa-card">
          <div className="sa-card-head">
            <h2>Las 10 más críticas</h2>
            <p>Reglas que cierran el embudo</p>
          </div>
          <TopList items={funnel.top10} />
        </section>
      </div>
      <section className="sa-card">
        <div className="sa-card-head">
          <h2>Hallazgos de aplicación</h2>
          <p>{findings.length} filas visibles</p>
        </div>
        <FindingsTable findings={findings} />
      </section>
    </div>
  );
}

function ComponentesSheet({
  model,
  funnel,
  securityPresent,
}: {
  model: AnalysisModel;
  funnel: ReturnType<typeof componentFunnel>;
  securityPresent: boolean;
}) {
  return (
    <div className="sa-grid">
      {!securityPresent && (
        <div className="sa-warn">Falta INSIGHT_SECURITY. Se muestra el inventario de componentes, no el detalle CVE.</div>
      )}
      {securityPresent && model.componentCves.length === 0 && (
        <div className="sa-ok">INSIGHT_SECURITY está presente y vacío: no hay CVEs de terceros en este análisis.</div>
      )}
      <div className="sa-split">
        <section className="sa-card">
          <div className="sa-card-head">
            <h2>Embudo de componentes</h2>
            <p>La parte más delgada son los 10 más críticos</p>
          </div>
          <FunnelViz stages={funnel.stages} />
        </section>
        <section className="sa-card">
          <div className="sa-card-head">
            <h2>10 componentes a revisar</h2>
            <p>Riesgo de seguridad, licencia y obsolescencia</p>
          </div>
          <ol className="sa-improve">
            {funnel.top10.map((item) => (
              <article key={`${item.rank}-${item.name}`}>
                <span className="sa-rank">{item.rank}</span>
                <div>
                  <strong>{shortName(item.name)}</strong>
                  <div className="sa-mono">
                    {item.version || "sin versión"} · sec {item.securityRisk} · lic {item.licenseRisk} · obs{" "}
                    {item.obsolescenceRisk}
                  </div>
                </div>
                <span>{item.vulnerabilityCount} CVE</span>
              </article>
            ))}
          </ol>
        </section>
      </div>
      <section className="sa-card">
        <div className="sa-card-head">
          <h2>Licencias</h2>
          <p>{model.licenses.length} detectadas</p>
        </div>
        {model.licenses.length === 0 ? (
          <p>Sin archivo de licencias.</p>
        ) : (
          <div className="sa-table-wrap">
            <table className="sa-table">
              <thead>
                <tr>
                  <th>Licencia</th>
                  <th>Componente</th>
                  <th>Tipo</th>
                  <th>Riesgo</th>
                </tr>
              </thead>
              <tbody>
                {model.licenses.map((license) => (
                  <tr key={`${license.license}-${license.component}`}>
                    <td>{license.license}</td>
                    <td className="sa-mono">{shortName(license.component)}</td>
                    <td>{license.type}</td>
                    <td>{license.risk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function CalidadSheet({
  radar,
  improvements,
  area,
  onArea,
  hotspots,
  languages,
}: {
  radar: ReturnType<typeof qualityRadar>;
  improvements: Record<string, Improvement[]>;
  area: string;
  onArea: (area: string) => void;
  hotspots: ReturnType<typeof hotspotFiles>;
  languages: ReturnType<typeof countBy>;
}) {
  const areas = Object.keys(improvements);
  const current = improvements[area] ?? improvements[areas[0]] ?? [];

  return (
    <div className="sa-grid">
      <div className="sa-split">
        <section className="sa-card">
          <div className="sa-card-head">
            <h2>Cinco atributos</h2>
            <p>Eficiencia, mantenibilidad, portabilidad, fiabilidad, seguridad</p>
          </div>
          <QualityRadar attributes={radar} />
          <div className="sa-kpis" style={{ marginTop: 8, gridTemplateColumns: "repeat(5, minmax(0,1fr))" }}>
            {radar.map((item) => (
              <div key={item.key} className="sa-kpi" data-tone={item.score < 70 ? "high" : "ok"}>
                <b>{item.score}</b>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="sa-card">
          <div className="sa-card-head">
            <h2>10 mejoras por área</h2>
            <p>Reglas con más impacto de calidad</p>
          </div>
          <div className="sa-tabs-area">
            {areas.map((item) => (
              <button key={item} type="button" data-on={item === area} onClick={() => onArea(item)}>
                {item} ({improvements[item]?.length ?? 0})
              </button>
            ))}
          </div>
          {current.length === 0 ? (
            <p>Sin defectos en {area}.</p>
          ) : (
            <ol className="sa-improve">
              {current.map((item) => (
                <article key={`${item.area}-${item.ruleCode}`}>
                  <span className="sa-rank">{item.rank}</span>
                  <div>
                    <strong>{item.rule}</strong>
                    <div className="sa-mono">
                      {item.count} hallazgos · {item.files} archivos · {formatEffort(item.effortMinutes)}
                    </div>
                  </div>
                  <span className={`sa-prio ${item.priority}`}>{priorityLabel(item.priority)}</span>
                </article>
              ))}
            </ol>
          )}
        </section>
      </div>
      <div className="sa-split">
        <section className="sa-card">
          <h2>Archivos calientes</h2>
          <ol className="sa-improve">
            {hotspots.map((item, index) => (
              <article key={item.file}>
                <span className="sa-rank">{index + 1}</span>
                <div>
                  <strong className="sa-mono">{item.file}</strong>
                  <div>
                    {item.count} defectos · {formatEffort(item.effort)}
                  </div>
                </div>
                <span />
              </article>
            ))}
          </ol>
        </section>
        <section className="sa-card">
          <h2>Lenguajes en calidad</h2>
          <ol className="sa-improve">
            {languages.map((item, index) => (
              <article key={item.name}>
                <span className="sa-rank">{index + 1}</span>
                <div>
                  <strong>{item.name}</strong>
                </div>
                <span>{item.value}</span>
              </article>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}

function TopList({ items }: { items: ReturnType<typeof applicationFunnel>["top10"] }) {
  if (items.length === 0) return <p>Sin vulnerabilidades en la selección actual.</p>;
  return (
    <ol className="sa-improve">
      {items.map((item) => (
        <article key={item.ruleCode || item.rule}>
          <span className="sa-rank">{item.rank}</span>
          <div>
            <strong>{item.rule}</strong>
            <div className="sa-mono">
              {item.cwe.join(", ") || "Sin CWE"} · {item.count} × · {item.files} archivos · {formatEffort(item.effortMinutes)}
            </div>
          </div>
          <span className={`sa-prio ${item.priority}`}>{priorityLabel(item.priority)}</span>
        </article>
      ))}
    </ol>
  );
}

function FindingsTable({ findings }: { findings: ReturnType<typeof applicationFindings> }) {
  const rows = findings.slice(0, 250);
  return (
    <div className="sa-table-wrap">
      <table className="sa-table">
        <thead>
          <tr>
            <th>Prioridad</th>
            <th>Regla</th>
            <th>CWE</th>
            <th>Archivo</th>
            <th>Lenguaje</th>
            <th>Esfuerzo</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((finding) => (
            <tr key={finding.id}>
              <td>
                <span className={`sa-prio ${finding.priority}`}>{priorityLabel(finding.priority)}</span>
              </td>
              <td>{finding.rule}</td>
              <td className="sa-mono">{finding.cwe.join(", ") || "—"}</td>
              <td className="sa-mono">
                {finding.file}
                {finding.line ? `:${finding.line}` : ""}
              </td>
              <td>{finding.language || "—"}</td>
              <td>{formatEffort(finding.effortMinutes)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {findings.length > 250 && <p>Mostrando 250 de {findings.length}. Ajuste los filtros para acotar.</p>}
    </div>
  );
}

function shortName(name: string): string {
  if (name.length < 48) return name;
  if (/^[a-f0-9]{32,}/i.test(name)) return `${name.slice(0, 12)}…`;
  return `${name.slice(0, 44)}…`;
}
