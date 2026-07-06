import type { ExecutiveMaturityLevel } from "@/lib/calculateExecutiveRiskScore";
import type { ExecutiveWeakCategory } from "@/data/executiveSoftwareRiskScore";
import type { Locale } from "@/types/calculator";

export interface ActionPlanPhase {
  immediate: string[];
  shortTerm: string[];
  mediumTerm: string[];
}

export interface CategoryActionItem {
  category: ExecutiveWeakCategory;
  actions: string[];
}

const LEVEL_PLANS: Record<Locale, Record<ExecutiveMaturityLevel, ActionPlanPhase>> = {
  en: {
    critical: {
      immediate: [
        "Assign an executive owner for software risk visibility and reporting.",
        "Publish a same-day inventory of business-critical applications and owners.",
        "Block production releases when critical vulnerabilities lack accountable owners.",
      ],
      shortTerm: [
        "Validate vendor-delivered code independently before accepting releases.",
        "Enable CVE alerting for open-source components used in production.",
        "Define a mandatory review gate for AI-assisted or AI-generated code.",
      ],
      mediumTerm: [
        "Institutionalize audit evidence: risk trends, remediation SLAs, and release controls.",
        "Integrate SAST/DAST/SCA signals into executive dashboards.",
        "Request a no-cost Sprita iT Software Risk Assessment for a prioritized roadmap.",
      ],
    },
    high: {
      immediate: [
        "Confirm ownership and inventory coverage for all critical applications.",
        "Identify the top 3 domains with No / Not sure answers and assign remediation owners.",
        "Document current release-blocking criteria for critical vulnerabilities.",
      ],
      shortTerm: [
        "Close gaps in vendor code validation and dependency visibility.",
        "Establish periodic executive reporting beyond raw vulnerability counts.",
        "Pilot automated code analysis on internally developed release candidates.",
      ],
      mediumTerm: [
        "Operationalize evidence collection for audits, clients, and regulators.",
        "Measure technical debt and maintainability for critical applications.",
        "Schedule a Sprita iT assessment to quantify Top 10 risks and defects.",
      ],
    },
    moderate: {
      immediate: [
        "Review weak domains from this assessment with AppSec and engineering leads.",
        "Confirm AI-assisted code and vendor code paths have defined controls.",
        "Validate that CVE alerting covers all production-critical dependencies.",
      ],
      shortTerm: [
        "Strengthen release gates and remediation timeframes for critical findings.",
        "Expand periodic review of applications already in production.",
        "Align software risk metrics with management reporting cadence.",
      ],
      mediumTerm: [
        "Benchmark controls against peer financial services organizations.",
        "Automate evidence for risk trends and remediation status.",
        "Use Sprita iT for an executive report with prioritized remediation.",
      ],
    },
    low: {
      immediate: [
        "Maintain current controls and revalidate ownership quarterly.",
        "Share this score with risk and audit committees as a baseline.",
      ],
      shortTerm: [
        "Stress-test vendor and AI-assisted code controls against new delivery volume.",
        "Refresh dependency inventory and license risk reviews.",
      ],
      mediumTerm: [
        "Pursue continuous improvement on release-blocking automation.",
        "Consider Sprita iT for independent validation and benchmark comparison.",
      ],
    },
  },
  es: {
    critical: {
      immediate: [
        "Asigne un responsable ejecutivo de visibilidad y reporte de riesgo de software.",
        "Publique de inmediato un inventario de aplicaciones críticas y sus owners.",
        "Bloquee releases a producción cuando vulnerabilidades críticas no tengan responsable.",
      ],
      shortTerm: [
        "Valide de forma independiente el código entregado por proveedores antes de aceptar releases.",
        "Active alertas CVE para componentes open source usados en producción.",
        "Defina un gate obligatorio de revisión para código asistido o generado por IA.",
      ],
      mediumTerm: [
        "Institucionalice evidencia de auditoría: tendencias de riesgo, SLAs de remediación y controles de release.",
        "Integre señales SAST/DAST/SCA en tableros ejecutivos.",
        "Solicite una evaluación de riesgo de software sin costo de Sprita iT.",
      ],
    },
    high: {
      immediate: [
        "Confirme ownership e inventario de todas las aplicaciones críticas.",
        "Identifique los 3 dominios con respuestas No / No estoy seguro y asigne responsables.",
        "Documente criterios actuales de bloqueo de release por vulnerabilidades críticas.",
      ],
      shortTerm: [
        "Cierre brechas en validación de código de proveedores y visibilidad de dependencias.",
        "Establezca reportes ejecutivos periódicos más allá del conteo de vulnerabilidades.",
        "Pilote análisis automático de código en candidatos a release internos.",
      ],
      mediumTerm: [
        "Operacionalice recolección de evidencia para auditorías, clientes y reguladores.",
        "Mida deuda técnica y mantenibilidad en aplicaciones críticas.",
        "Agende una evaluación Sprita iT para cuantificar Top 10 riesgos y defectos.",
      ],
    },
    moderate: {
      immediate: [
        "Revise dominios débiles de esta evaluación con líderes de AppSec e ingeniería.",
        "Confirme que código IA y de proveedores tienen controles definidos.",
        "Valide que las alertas CVE cubren dependencias críticas en producción.",
      ],
      shortTerm: [
        "Fortalezca gates de release y plazos de remediación para hallazgos críticos.",
        "Amplíe la revisión periódica de aplicaciones ya en operación.",
        "Alinee métricas de riesgo de software con la cadencia de reporte a dirección.",
      ],
      mediumTerm: [
        "Compare controles con organizaciones financieras similares.",
        "Automatice evidencia de tendencias de riesgo y estado de remediación.",
        "Use Sprita iT para un informe ejecutivo con remediación priorizada.",
      ],
    },
    low: {
      immediate: [
        "Mantenga los controles actuales y revalide ownership trimestralmente.",
        "Comparta este puntaje con comités de riesgo y auditoría como línea base.",
      ],
      shortTerm: [
        "Pruebe controles de código IA y de proveedores ante mayor volumen de entrega.",
        "Actualice inventario de dependencias y revisiones de licencias.",
      ],
      mediumTerm: [
        "Busque mejora continua en automatización de bloqueo de releases.",
        "Considere Sprita iT para validación independiente y benchmark.",
      ],
    },
  },
  pt: {
    critical: {
      immediate: [
        "Designe um responsável executivo por visibilidade e relatório de risco de software.",
        "Publique imediatamente um inventário de aplicações críticas e seus owners.",
        "Bloqueie releases em produção quando vulnerabilidades críticas não tiverem responsável.",
      ],
      shortTerm: [
        "Valide de forma independente o código entregue por fornecedores antes de aceitar releases.",
        "Ative alertas CVE para componentes open source usados em produção.",
        "Defina um gate obrigatório de revisão para código assistido ou gerado por IA.",
      ],
      mediumTerm: [
        "Institucionalize evidência de auditoria: tendências de risco, SLAs de remediação e controles de release.",
        "Integre sinais SAST/DAST/SCA em dashboards executivos.",
        "Solicite uma avaliação de risco de software sem custo da Sprita iT.",
      ],
    },
    high: {
      immediate: [
        "Confirme ownership e inventário de todas as aplicações críticas.",
        "Identifique os 3 domínios com respostas Não / Não tenho certeza e designe responsáveis.",
        "Documente critérios atuais de bloqueio de release para vulnerabilidades críticas.",
      ],
      shortTerm: [
        "Feche lacunas em validação de código de fornecedores e visibilidade de dependências.",
        "Estabeleça relatórios executivos periódicos além da contagem de vulnerabilidades.",
        "Pilote análise automática de código em candidatos a release internos.",
      ],
      mediumTerm: [
        "Operacionalize coleta de evidência para auditorias, clientes e reguladores.",
        "Meça dívida técnica e manutenibilidade em aplicações críticas.",
        "Agende uma avaliação Sprita iT para quantificar Top 10 riscos e defeitos.",
      ],
    },
    moderate: {
      immediate: [
        "Revise domínios fracos desta avaliação com líderes de AppSec e engenharia.",
        "Confirme que código IA e de fornecedores têm controles definidos.",
        "Valide que alertas CVE cobrem dependências críticas em produção.",
      ],
      shortTerm: [
        "Fortaleça gates de release e prazos de remediação para achados críticos.",
        "Amplie a revisão periódica de aplicações já em operação.",
        "Alinhe métricas de risco de software com a cadência de reporte à direção.",
      ],
      mediumTerm: [
        "Compare controles com organizações financeiras similares.",
        "Automatize evidência de tendências de risco e status de remediação.",
        "Use a Sprita iT para um relatório executivo com remediação priorizada.",
      ],
    },
    low: {
      immediate: [
        "Mantenha os controles atuais e revalide ownership trimestralmente.",
        "Compartilhe esta pontuação com comitês de risco e auditoria como linha de base.",
      ],
      shortTerm: [
        "Teste controles de código IA e de fornecedores com maior volume de entrega.",
        "Atualize inventário de dependências e revisões de licenças.",
      ],
      mediumTerm: [
        "Busque melhoria contínua na automação de bloqueio de releases.",
        "Considere a Sprita iT para validação independente e benchmark.",
      ],
    },
  },
};

const CATEGORY_ACTIONS: Record<Locale, Record<ExecutiveWeakCategory, string[]>> = {
  en: {
    "ai-assisted-code": [
      "Document which teams use AI coding tools and which repos are in scope.",
      "Require human review and security checks before merging AI-assisted changes.",
    ],
    "vendor-delivered-code": [
      "Add independent SAST/SCA validation to vendor acceptance criteria.",
      "Contractually require vulnerability disclosure and remediation SLAs from vendors.",
    ],
    "open-source-dependencies": [
      "Deploy SBOM or dependency inventory for critical applications.",
      "Subscribe to CVE feeds mapped to production component usage.",
    ],
    "release-controls": [
      "Define policy violations and critical severities that block release.",
      "Automate gate enforcement in CI/CD pipelines.",
    ],
    "audit-evidence": [
      "Store objective artifacts: scan results, approvals, remediation timestamps.",
      "Report risk trend metrics monthly to executive stakeholders.",
    ],
    "software-governance": [
      "Maintain a living application inventory with business and technical owners.",
      "Replace vulnerability-only reporting with software risk KPIs.",
    ],
  },
  es: {
    "ai-assisted-code": [
      "Documente qué equipos usan herramientas de código IA y qué repos están en alcance.",
      "Exija revisión humana y controles de seguridad antes de merge de cambios asistidos por IA.",
    ],
    "vendor-delivered-code": [
      "Agregue validación SAST/SCA independiente a criterios de aceptación de proveedores.",
      "Exija contractualmente divulgación de vulnerabilidades y SLAs de remediación.",
    ],
    "open-source-dependencies": [
      "Despliegue SBOM o inventario de dependencias para aplicaciones críticas.",
      "Suscríbase a feeds CVE mapeados al uso de componentes en producción.",
    ],
    "release-controls": [
      "Defina violaciones de política y severidades críticas que bloqueen release.",
      "Automatice el gate en pipelines CI/CD.",
    ],
    "audit-evidence": [
      "Almacene artefactos objetivos: resultados de escaneo, aprobaciones, timestamps de remediación.",
      "Reporte métricas de tendencia de riesgo mensualmente a stakeholders ejecutivos.",
    ],
    "software-governance": [
      "Mantenga inventario vivo de aplicaciones con owners de negocio y técnicos.",
      "Reemplace reportes solo de vulnerabilidades por KPIs de riesgo de software.",
    ],
  },
  pt: {
    "ai-assisted-code": [
      "Documente quais equipes usam ferramentas de código IA e quais repos estão no escopo.",
      "Exija revisão humana e controles de segurança antes do merge de mudanças assistidas por IA.",
    ],
    "vendor-delivered-code": [
      "Adicione validação SAST/SCA independente aos critérios de aceitação de fornecedores.",
      "Exija contratualmente divulgação de vulnerabilidades e SLAs de remediação.",
    ],
    "open-source-dependencies": [
      "Implante SBOM ou inventário de dependências para aplicações críticas.",
      "Assine feeds CVE mapeados ao uso de componentes em produção.",
    ],
    "release-controls": [
      "Defina violações de política e severidades críticas que bloqueiem release.",
      "Automatize o gate em pipelines CI/CD.",
    ],
    "audit-evidence": [
      "Armazene artefatos objetivos: resultados de varredura, aprovações, timestamps de remediação.",
      "Reporte métricas de tendência de risco mensalmente a stakeholders executivos.",
    ],
    "software-governance": [
      "Mantenha inventário vivo de aplicações com owners de negócio e técnicos.",
      "Substitua relatórios apenas de vulnerabilidades por KPIs de risco de software.",
    ],
  },
};

export function getLevelActionPlan(locale: Locale, level: ExecutiveMaturityLevel): ActionPlanPhase {
  return LEVEL_PLANS[locale]?.[level] ?? LEVEL_PLANS.en[level];
}

export function getCategoryActions(
  locale: Locale,
  categories: ExecutiveWeakCategory[]
): CategoryActionItem[] {
  const actions = CATEGORY_ACTIONS[locale] ?? CATEGORY_ACTIONS.en;
  return categories.map((category) => ({
    category,
    actions: actions[category] ?? [],
  }));
}