import type { LocalizedText } from "@/types/calculator";

export const DORA_MATURITY_SCALE = [
  {
    value: "1",
    label: {
      es: "1 — No implementado / Ausente",
      en: "1 — Not implemented / Absent",
      pt: "1 — Não implementado / Ausente",
    },
  },
  {
    value: "2",
    label: {
      es: "2 — Inicial o ad hoc",
      en: "2 — Initial or ad hoc",
      pt: "2 — Inicial ou ad hoc",
    },
  },
  {
    value: "3",
    label: {
      es: "3 — Parcialmente implementado",
      en: "3 — Partially implemented",
      pt: "3 — Parcialmente implementado",
    },
  },
  {
    value: "4",
    label: {
      es: "4 — Implementado y documentado",
      en: "4 — Implemented and documented",
      pt: "4 — Implementado e documentado",
    },
  },
  {
    value: "5",
    label: {
      es: "5 — Totalmente implementado, probado y revisado regularmente",
      en: "5 — Fully implemented, tested, and reviewed regularly",
      pt: "5 — Totalmente implementado, testado e revisado regularmente",
    },
  },
] as const;

export const DORA_ENTITY_TYPES = [
  {
    value: "credit-institution",
    label: {
      es: "Entidad de crédito",
      en: "Credit institution",
      pt: "Instituição de crédito",
    },
  },
  {
    value: "payment-institution",
    label: {
      es: "Entidad de pago / dinero electrónico",
      en: "Payment / e-money institution",
      pt: "Instituição de pagamento / dinheiro eletrônico",
    },
  },
  {
    value: "investment-firm",
    label: {
      es: "Empresa de inversión / gestión de activos",
      en: "Investment / asset management firm",
      pt: "Empresa de investimento / gestão de ativos",
    },
  },
  {
    value: "insurance",
    label: {
      es: "Compañía de seguros / reaseguros",
      en: "Insurance / reinsurance company",
      pt: "Companhia de seguros / resseguros",
    },
  },
  {
    value: "ict-provider",
    label: {
      es: "Proveedor crítico de servicios TIC (ICT third-party)",
      en: "Critical ICT third-party service provider",
      pt: "Provedor crítico de serviços TIC (terceiro ICT)",
    },
  },
  {
    value: "other-financial",
    label: {
      es: "Otra entidad financiera sujeta a DORA",
      en: "Other financial entity subject to DORA",
      pt: "Outra entidade financeira sujeita ao DORA",
    },
  },
] as const;

export interface DoraQuestion {
  id: number;
  field: string;
  label: LocalizedText;
  pillar: "governance" | "incidents" | "resilience" | "third-party" | "culture";
}

export const DORA_QUESTIONS: DoraQuestion[] = [
  {
    id: 1,
    field: "q1",
    pillar: "governance",
    label: {
      es: "¿La entidad cuenta con un marco de gestión de riesgos de TIC integral, documentado, aprobado por el órgano de administración y revisado periódicamente, que incluya identificación, protección, detección, respuesta y recuperación?",
      en: "Does the entity have a comprehensive ICT risk management framework that is documented, approved by the management body, and periodically reviewed, covering identification, protection, detection, response, and recovery?",
      pt: "A entidade dispõe de um framework integral de gestão de riscos de TIC, documentado, aprovado pelo órgão de administração e revisado periodicamente, incluindo identificação, proteção, detecção, resposta e recuperação?",
    },
  },
  {
    id: 2,
    field: "q2",
    pillar: "governance",
    label: {
      es: "¿Se realiza un inventario actualizado y clasificado por criticidad de todos los activos de TIC (hardware, software, datos y dependencias)?",
      en: "Is there an up-to-date inventory of all ICT assets (hardware, software, data, and dependencies), classified by criticality?",
      pt: "Existe um inventário atualizado e classificado por criticidade de todos os ativos de TIC (hardware, software, dados e dependências)?",
    },
  },
  {
    id: 3,
    field: "q3",
    pillar: "governance",
    label: {
      es: "¿Existen políticas y controles para minimizar el impacto de riesgos, incluyendo segmentación de redes, gestión de actualizaciones y principios de confianza cero?",
      en: "Are there policies and controls to minimize risk impact, including network segmentation, patch management, and zero-trust principles?",
      pt: "Existem políticas e controles para minimizar o impacto dos riscos, incluindo segmentação de redes, gestão de atualizações e princípios de confiança zero?",
    },
  },
  {
    id: 4,
    field: "q4",
    pillar: "governance",
    label: {
      es: "¿El órgano de administración supervisa activamente el marco de riesgos y asigna responsabilidades claras a una función de control independiente?",
      en: "Does the management body actively oversee the risk framework and assign clear responsibilities to an independent control function?",
      pt: "O órgão de administração supervisiona ativamente o framework de riscos e atribui responsabilidades claras a uma função de controle independente?",
    },
  },
  {
    id: 5,
    field: "q5",
    pillar: "incidents",
    label: {
      es: "¿Existe un plan formal de respuesta a incidentes que incluya detección temprana, contención, notificación interna y procedimientos de recuperación?",
      en: "Is there a formal incident response plan that includes early detection, containment, internal notification, and recovery procedures?",
      pt: "Existe um plano formal de resposta a incidentes que inclua detecção precoce, contenção, notificação interna e procedimentos de recuperação?",
    },
  },
  {
    id: 6,
    field: "q6",
    pillar: "incidents",
    label: {
      es: "¿Se clasifican y reportan los incidentes mayores a las autoridades competentes dentro de los plazos establecidos?",
      en: "Are major incidents classified and reported to competent authorities within the required timeframes?",
      pt: "Os incidentes maiores são classificados e reportados às autoridades competentes dentro dos prazos estabelecidos?",
    },
  },
  {
    id: 7,
    field: "q7",
    pillar: "incidents",
    label: {
      es: "¿Se realizan revisiones de lecciones aprendidas después de incidentes y se actualiza el marco de riesgos?",
      en: "Are lessons-learned reviews conducted after incidents and is the risk framework updated accordingly?",
      pt: "São realizadas revisões de lições aprendidas após incidentes e o framework de riscos é atualizado?",
    },
  },
  {
    id: 8,
    field: "q8",
    pillar: "resilience",
    label: {
      es: "¿La entidad realiza pruebas regulares de resiliencia (escaneos de vulnerabilidades y pruebas de penetración avanzadas) en sistemas críticos?",
      en: "Does the entity conduct regular resilience testing (vulnerability scans and advanced penetration tests) on critical systems?",
      pt: "A entidade realiza testes regulares de resiliência (varreduras de vulnerabilidades e testes de penetração avançados) em sistemas críticos?",
    },
  },
  {
    id: 9,
    field: "q9",
    pillar: "resilience",
    label: {
      es: "¿Los resultados de las pruebas se documentan, remedian en plazos definidos y se integran al marco general de riesgos?",
      en: "Are test results documented, remediated within defined timeframes, and integrated into the overall risk framework?",
      pt: "Os resultados dos testes são documentados, remediados em prazos definidos e integrados ao framework geral de riscos?",
    },
  },
  {
    id: 10,
    field: "q10",
    pillar: "third-party",
    label: {
      es: "¿Se mantiene un registro completo de contratos con proveedores de TIC, incluyendo cláusulas específicas de resiliencia?",
      en: "Is there a complete register of ICT provider contracts, including specific resilience clauses?",
      pt: "Existe um registro completo de contratos com provedores de TIC, incluindo cláusulas específicas de resiliência?",
    },
  },
  {
    id: 11,
    field: "q11",
    pillar: "third-party",
    label: {
      es: "¿Se realiza evaluación continua y monitoreo de riesgos de concentración en proveedores críticos?",
      en: "Is there continuous assessment and monitoring of concentration risk in critical providers?",
      pt: "É realizada avaliação contínua e monitoramento de riscos de concentração em provedores críticos?",
    },
  },
  {
    id: 12,
    field: "q12",
    pillar: "third-party",
    label: {
      es: "¿Los riesgos asociados a proveedores se integran plenamente al marco general de gestión de riesgos?",
      en: "Are provider-related risks fully integrated into the overall risk management framework?",
      pt: "Os riscos associados a provedores estão plenamente integrados ao framework geral de gestão de riscos?",
    },
  },
  {
    id: 13,
    field: "q13",
    pillar: "culture",
    label: {
      es: "¿La entidad participa en arreglos de intercambio de información e inteligencia sobre amenazas cibernéticas?",
      en: "Does the entity participate in cyber threat information and intelligence-sharing arrangements?",
      pt: "A entidade participa de arranjos de compartilhamento de informações e inteligência sobre ameaças cibernéticas?",
    },
  },
  {
    id: 14,
    field: "q14",
    pillar: "culture",
    label: {
      es: "¿Existen mecanismos de gobernanza que aseguren la alineación entre estrategia de negocio, TIC y resiliencia operativa?",
      en: "Are there governance mechanisms ensuring alignment between business strategy, ICT, and operational resilience?",
      pt: "Existem mecanismos de governança que assegurem o alinhamento entre estratégia de negócio, TIC e resiliência operacional?",
    },
  },
  {
    id: 15,
    field: "q15",
    pillar: "culture",
    label: {
      es: "¿Se capacita y sensibiliza regularmente al personal y al órgano de administración sobre mejores prácticas de ciberseguridad y resiliencia?",
      en: "Are staff and the management body regularly trained and sensitized on cybersecurity and resilience best practices?",
      pt: "O pessoal e o órgão de administração são regularmente capacitados e sensibilizados sobre melhores práticas de cibersegurança e resiliência?",
    },
  },
];

export function doraFieldFromQuestion(q: DoraQuestion) {
  return {
    name: q.field,
    label: q.label,
    type: "select" as const,
    options: [...DORA_MATURITY_SCALE],
    required: true,
  };
}