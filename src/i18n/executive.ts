import type { Locale } from "@/types/calculator";
import type { ExecutiveAnswerId, ExecutiveWeakCategory } from "@/data/executiveSoftwareRiskScore";
import { EXECUTIVE_QUESTION_META, EXECUTIVE_SECTIONS } from "@/data/executiveSoftwareRiskScore";

export { EXECUTIVE_ROUTES } from "@/data/executiveSoftwareRiskScore";

type ExecutiveCopy = {
  meta: {
    title: string;
    description: string;
    ogDescription: string;
    h1: string;
    kicker: string;
    subtitle: string;
    intro: string;
    trustLine: string;
    brandLine: string;
    privacy: string;
  };
  sections: Record<(typeof EXECUTIVE_SECTIONS)[number], string>;
  questions: Record<string, string>;
  answers: Record<ExecutiveAnswerId, string>;
  weakCategories: Record<ExecutiveWeakCategory, string>;
  recommendations: Record<ExecutiveWeakCategory, string>;
  levels: Record<
    "low" | "moderate" | "high" | "critical",
    { label: string; exposure: string; interpretation: string }
  >;
  ui: {
    sectionProgress: string;
    questionProgress: string;
    complete: string;
    cardTitle: string;
    cardDescription: string;
    previousSection: string;
    nextSection: string;
    seeScore: string;
    reviewAnswers: string;
    yourResults: string;
    riskExposureScore: string;
    executiveMaturity: string;
    maturityPoints: string;
    maturityPercent: string;
    interpretation: string;
    maturityDetails: string;
    exposureSuffix: string;
    topGaps: string;
    requestAssessment: string;
    downloadPdf: string;
    copyScore: string;
    disclaimer: string;
    pdfGenerating: string;
    pdfError: string;
    pdfSaved: string;
    zeroRiskNote: string;
  };
  form: {
    title: string;
    description: string;
    firstName: string;
    company: string;
    email: string;
    submit: string;
    submitting: string;
    successTitle: string;
    successBody: string;
    disposableEmail: string;
    submitError: string;
    privacyPrefix: string;
    privacySuffix: string;
    firstNameRequired: string;
    emailInvalid: string;
    companyRequired: string;
  };
  pdf: {
    title: string;
    subtitle: string;
    preparedBy: string;
    riskScore: string;
    maturity: string;
    points: string;
    executiveSummary: string;
    topGaps: string;
    noGaps: string;
    recommendationsTitle: string;
    actionPlanTitle: string;
    phaseImmediate: string;
    phaseShort: string;
    phaseMedium: string;
    categoryBreakdown: string;
    colDomain: string;
    colScore: string;
    colStatus: string;
    statusStrong: string;
    statusPartial: string;
    statusWeak: string;
    responses: string;
    colNum: string;
    colCategory: string;
    colQuestion: string;
    colAnswer: string;
    nextStepsTitle: string;
    nextStepsBody: string;
    contactLine: string;
    page: string;
    priority: string;
    disclaimer: string;
    filename: string;
  };
};

const COPY: Record<Locale, ExecutiveCopy> = {
  en: {
    meta: {
      title: "Executive software risk score",
      description:
        "A 15-question software risk self-assessment for CIO, CISO, Risk and Technology teams. Identify gaps across AI-assisted code, vendor code, open-source dependencies and release controls.",
      ogDescription:
        "15 questions. 3 minutes. No code upload. Identify software risk visibility gaps before audit, examiner, or operational pressure.",
      h1: "Executive software risk score",
      kicker: "Executive diagnostic · SpritaScore by Sprita iT",
      subtitle: "15 questions · 3 minutes · For CIO, CISO, Risk and Technology teams",
      intro:
        "No code upload required. No sensitive technical data required. Results can remain local in the browser unless you request a report. This assessment surfaces visibility gaps across internal code, vendor code, AI-assisted code, open-source dependencies, release controls, audit evidence, and remediation discipline.",
      trustLine: "SpritaScore is a brand of",
      brandLine: "Sprita iT",
      privacy: "Privacy policy",
    },
    sections: {
      "software-governance": "Software governance",
      "secure-development": "Secure development",
      "dependencies-supply-chain": "Dependencies and supply chain",
      "quality-continuity": "Quality and continuity",
      "compliance-audit-evidence": "Compliance and audit evidence",
    },
    questions: {
      q1: "There is an up-to-date inventory of all business-critical applications.",
      q2: "Each critical application has a clearly identified business and technical owner.",
      q3: "Management receives periodic indicators of software risk, not only vulnerability counts.",
      q4: "Internally developed code is automatically analyzed before release.",
      q5: "Code delivered by vendors or external development partners is independently validated.",
      q6: "AI-assisted or AI-generated code is reviewed before it reaches production.",
      q7: "The organization knows which open-source libraries and third-party components are used by critical applications.",
      q8: "The organization receives alerts when critical CVEs affect components used in production.",
      q9: "Open-source license risk is reviewed before components are approved or released.",
      q10: "Technical debt and maintainability are measured for critical applications.",
      q11: "Critical vulnerabilities can automatically block or stop a production release.",
      q12: "Critical applications already in operation are reviewed periodically, not only before release.",
      q13: "The organization can produce objective evidence for internal audits, clients, examiners, or regulators.",
      q14: "The organization can show software risk trends over time using metrics.",
      q15: "Critical vulnerabilities have defined remediation timeframes and accountable owners.",
    },
    answers: { yes: "Yes", partially: "Partially", no: "No", not_sure: "Not sure" },
    weakCategories: {
      "ai-assisted-code": "AI-assisted code",
      "vendor-delivered-code": "Vendor-delivered code",
      "open-source-dependencies": "Open-source dependencies",
      "release-controls": "Release controls",
      "audit-evidence": "Audit evidence",
      "software-governance": "Software governance",
    },
    recommendations: {
      "ai-assisted-code": "Define a review gate for AI-assisted code before it reaches production.",
      "vendor-delivered-code": "Validate vendor-delivered code independently before accepting releases.",
      "open-source-dependencies": "Maintain dependency visibility and CVE alerting for critical applications.",
      "release-controls": "Define release-blocking rules for critical vulnerabilities and policy violations.",
      "audit-evidence": "Preserve objective evidence that shows risk evolution and remediation status over time.",
      "software-governance": "Establish ownership, inventory, and executive reporting for business-critical applications.",
    },
    levels: {
      low: { label: "Mature visibility", exposure: "Low", interpretation: "Software risk appears governed with mature controls and evidence." },
      moderate: { label: "Partial visibility", exposure: "Moderate", interpretation: "Controls exist, but blind spots remain across ownership, evidence, AI code, vendor code, or dependencies." },
      high: { label: "High exposure", exposure: "High", interpretation: "Significant weaknesses may affect audit readiness, operational resilience, or remediation discipline." },
      critical: { label: "Critical blind spots", exposure: "Critical", interpretation: "The organization likely lacks sufficient visibility into software-related risk." },
    },
    ui: {
      sectionProgress: "Section {current} of {total}",
      questionProgress: "Question {current} of {total}",
      complete: "{percent}% complete",
      cardTitle: "Answer each control visibility question",
      cardDescription: "No code upload required. No sensitive technical data required. Select the option that best reflects your organization today.",
      previousSection: "Previous section",
      nextSection: "Next section",
      seeScore: "See my score",
      reviewAnswers: "Review answers",
      yourResults: "Your results",
      riskExposureScore: "Your risk exposure score",
      executiveMaturity: "Executive maturity",
      maturityPoints: "Maturity points",
      maturityPercent: "{percent}% maturity",
      interpretation: "Interpretation",
      maturityDetails: "Maturity detail",
      exposureSuffix: "exposure",
      topGaps: "Top visibility gaps",
      requestAssessment: "Request a scope review",
      downloadPdf: "Download PDF version",
      copyScore: "Prefer not to submit anything? Copy your score and review it internally.",
      disclaimer: "This score is an executive self-assessment and prioritization aid. It does not constitute legal advice, audit certification, or proof of compliance.",
      pdfGenerating: "Generating PDF…",
      pdfError: "Could not generate the PDF. Please try again or use Print to PDF from your browser.",
      pdfSaved: "PDF downloaded in this browser.",
      zeroRiskNote: "0 is the best answer on this questionnaire and 100 is the worst. A score of 0 does not claim that real-world risk is zero.",
    },
    form: {
      title: "Request a scope review",
      description: "A later technical assessment can review critical vulnerabilities and priority quality defects. It requires application access, a defined scope, and time after this questionnaire.",
      firstName: "First name",
      company: "Company",
      email: "Business email",
      submit: "Request a scope review",
      submitting: "Submitting…",
      successTitle: "Thank you. We received your request.",
      successBody: "A Sprita iT specialist will follow up about the scope of a review.",
      disposableEmail: "Please use a business email address.",
      submitError: "Could not submit your request. Please try again or email info@sprita-it.com.",
      privacyPrefix: "By submitting, you agree to our ",
      privacySuffix: ". This score is informational and does not constitute legal, regulatory, audit, or technical certification.",
      firstNameRequired: "First name is required",
      emailInvalid: "Enter a valid business email",
      companyRequired: "Company is required",
    },
    pdf: {
      title: "Executive software risk score",
      subtitle: "Executive self-assessment report",
      preparedBy: "Prepared by SpritaScore · Sprita iT",
      riskScore: "Risk exposure score",
      maturity: "Executive maturity",
      points: "Maturity points",
      executiveSummary: "Executive summary",
      topGaps: "Priority visibility gaps",
      noGaps: "No critical gaps identified in this self-assessment.",
      recommendationsTitle: "Recommendations",
      actionPlanTitle: "90-day action plan",
      phaseImmediate: "0-30 days - Immediate priorities",
      phaseShort: "30-60 days - Stabilize controls",
      phaseMedium: "60-90 days - Institutionalize evidence",
      categoryBreakdown: "Visibility by domain",
      colDomain: "Domain",
      colScore: "Score",
      colStatus: "Status",
      statusStrong: "Strong",
      statusPartial: "Partial",
      statusWeak: "Weak",
      responses: "Detailed questionnaire responses",
      colNum: "#",
      colCategory: "Category",
      colQuestion: "Question",
      colAnswer: "Answer",
      nextStepsTitle: "Recommended next step",
      nextStepsBody:
        "Request a scope review from Sprita iT. A later technical assessment can review critical vulnerabilities and priority quality defects once access, scope, and timing are defined. This questionnaire does not produce that list.",
      contactLine: "spritascore.com · sprita-it.com · info@sprita-it.com",
      page: "Page",
      priority: "Priority",
      disclaimer:
        "This score is an executive self-assessment and prioritization aid. It does not constitute legal advice, audit certification, or proof of compliance.",
      filename: "spritascore-executive-risk-score",
    },
  },
  es: {
    meta: {
      title: "Puntaje ejecutivo de riesgo de software",
      description:
        "Autoevaluación de riesgo de software en 15 preguntas para equipos de CIO, CISO, Riesgo y Tecnología. Identifique brechas en código asistido por IA, código de proveedores, dependencias de código abierto y controles de liberación.",
      ogDescription:
        "15 preguntas. 3 minutos. Sin subir código. Identifique brechas de visibilidad antes de presión de auditoría, examinador u operaciones.",
      h1: "Puntaje ejecutivo de riesgo de software",
      kicker: "Diagnóstico ejecutivo · SpritaScore de Sprita iT",
      subtitle: "15 preguntas · 3 minutos · Para equipos de CIO, CISO, Riesgo y Tecnología",
      intro:
        "No se requiere subir código ni datos técnicos sensibles. Los resultados pueden permanecer en el navegador hasta que solicite un informe. Esta evaluación revela brechas de visibilidad en código interno, código de proveedores, código asistido por IA, dependencias de código abierto, controles de liberación, evidencia de auditoría y disciplina de remediación.",
      trustLine: "SpritaScore es una marca de",
      brandLine: "Sprita iT",
      privacy: "Política de privacidad",
    },
    sections: {
      "software-governance": "Gobernanza de software",
      "secure-development": "Desarrollo seguro",
      "dependencies-supply-chain": "Dependencias y cadena de suministro",
      "quality-continuity": "Calidad y continuidad",
      "compliance-audit-evidence": "Cumplimiento y evidencia de auditoría",
    },
    questions: {
      q1: "Existe un inventario actualizado de todas las aplicaciones críticas para el negocio.",
      q2: "Cada aplicación crítica tiene un responsable de negocio y técnico claramente identificado.",
      q3: "La dirección recibe indicadores periódicos de riesgo de software, no solo conteos de vulnerabilidades.",
      q4: "El código desarrollado internamente se analiza automáticamente antes de la liberación.",
      q5: "El código entregado por proveedores o partners externos se valida de forma independiente.",
      q6: "El código asistido o generado por IA se revisa antes de llegar a producción.",
      q7: "La organización conoce qué bibliotecas de código abierto y componentes de terceros usan las aplicaciones críticas.",
      q8: "La organización recibe alertas cuando CVEs críticos afectan componentes en producción.",
      q9: "El riesgo de las licencias de código abierto se revisa antes de aprobar o liberar componentes.",
      q10: "La deuda técnica y la mantenibilidad se miden para aplicaciones críticas.",
      q11: "Las vulnerabilidades críticas pueden bloquear o detener automáticamente una liberación a producción.",
      q12: "Las aplicaciones críticas en operación se revisan periódicamente, no solo antes de la liberación.",
      q13: "La organización puede producir evidencia objetiva para auditorías internas, clientes, examinadores o reguladores.",
      q14: "La organización puede mostrar tendencias de riesgo de software en el tiempo con métricas.",
      q15: "Las vulnerabilidades críticas tienen plazos de remediación definidos y responsables asignados.",
    },
    answers: { yes: "Sí", partially: "Parcialmente", no: "No", not_sure: "No estoy seguro" },
    weakCategories: {
      "ai-assisted-code": "Código asistido por IA",
      "vendor-delivered-code": "Código de proveedores",
      "open-source-dependencies": "Dependencias de código abierto",
      "release-controls": "Controles de liberación",
      "audit-evidence": "Evidencia de auditoría",
      "software-governance": "Gobernanza de software",
    },
    recommendations: {
      "ai-assisted-code": "Defina un punto de revisión para el código asistido por IA antes de que llegue a producción.",
      "vendor-delivered-code": "Valide de forma independiente el código entregado por proveedores antes de aceptar una liberación.",
      "open-source-dependencies": "Mantenga visibilidad de dependencias y alertas CVE para aplicaciones críticas.",
      "release-controls": "Defina reglas que bloqueen la liberación cuando haya vulnerabilidades críticas o incumplimientos de política.",
      "audit-evidence": "Preserve evidencia objetiva que muestre la evolución del riesgo y el estado de remediación.",
      "software-governance": "Establezca responsables, un inventario y reportes ejecutivos para las aplicaciones críticas.",
    },
    levels: {
      low: { label: "Visibilidad madura", exposure: "Exposición baja", interpretation: "El riesgo de software parece gobernado con controles y evidencia maduros." },
      moderate: { label: "Visibilidad parcial", exposure: "Exposición moderada", interpretation: "Existen controles, pero persisten puntos ciegos en la responsabilidad, la evidencia, el código de IA, los proveedores o las dependencias." },
      high: { label: "Alta exposición", exposure: "Alta exposición", interpretation: "Debilidades significativas pueden afectar la preparación para auditoría, la resiliencia operativa o la disciplina de remediación." },
      critical: { label: "Puntos ciegos críticos", exposure: "Exposición crítica", interpretation: "La organización probablemente carece de visibilidad suficiente sobre el riesgo relacionado con software." },
    },
    ui: {
      sectionProgress: "Sección {current} de {total}",
      questionProgress: "Pregunta {current} de {total}",
      complete: "{percent}% completado",
      cardTitle: "Responda cada pregunta de visibilidad de controles",
      cardDescription: "No se requiere subir código ni datos técnicos sensibles. Seleccione la opción que mejor refleje su organización hoy.",
      previousSection: "Sección anterior",
      nextSection: "Siguiente sección",
      seeScore: "Ver mi puntaje",
      reviewAnswers: "Revisar respuestas",
      yourResults: "Sus resultados",
      riskExposureScore: "Su puntaje de exposición al riesgo",
      executiveMaturity: "Madurez ejecutiva",
      maturityPoints: "Puntos de madurez",
      maturityPercent: "{percent}% de madurez",
      interpretation: "Interpretación",
      maturityDetails: "Detalle de madurez",
      exposureSuffix: "",
      topGaps: "Principales brechas de visibilidad",
      requestAssessment: "Solicitar revisión de alcance",
      downloadPdf: "Descargar versión PDF",
      copyScore: "¿Prefiere no enviar datos? Copie su puntaje y revíselo internamente.",
      disclaimer: "Este puntaje es una autoevaluación ejecutiva y una ayuda de priorización. No constituye asesoría legal, certificación de auditoría ni prueba de cumplimiento.",
      pdfGenerating: "Generando PDF…",
      pdfError: "No se pudo generar el PDF. Intente de nuevo o use Imprimir como PDF en su navegador.",
      pdfSaved: "PDF descargado en este navegador.",
      zeroRiskNote: "0 es la mejor respuesta de este cuestionario y 100 la peor. Un 0 no afirma que el riesgo real sea cero.",
    },
    form: {
      title: "Solicitar revisión de alcance",
      description: "Una evaluación técnica posterior puede revisar vulnerabilidades críticas y defectos de calidad prioritarios. Requiere acceso a la aplicación, un alcance definido y un plazo después de este cuestionario.",
      firstName: "Nombre",
      company: "Empresa",
      email: "Correo corporativo",
      submit: "Solicitar revisión de alcance",
      submitting: "Enviando…",
      successTitle: "Gracias. Recibimos su solicitud.",
      successBody: "Un especialista de Sprita iT dará seguimiento sobre el alcance de una revisión.",
      disposableEmail: "Use un correo corporativo válido.",
      submitError: "No se pudo enviar la solicitud. Intente de nuevo o escriba a info@sprita-it.com.",
      privacyPrefix: "Al enviar, acepta nuestra ",
      privacySuffix: ". Este puntaje es informativo y no constituye certificación legal, regulatoria, de auditoría ni técnica.",
      firstNameRequired: "El nombre es obligatorio",
      emailInvalid: "Ingrese un correo corporativo válido",
      companyRequired: "La empresa es obligatoria",
    },
    pdf: {
      title: "Puntaje ejecutivo de riesgo de software",
      subtitle: "Informe de autoevaluación ejecutiva",
      preparedBy: "Preparado por SpritaScore · Sprita iT",
      riskScore: "Puntaje de exposición al riesgo",
      maturity: "Madurez ejecutiva",
      points: "Puntos de madurez",
      executiveSummary: "Resumen ejecutivo",
      topGaps: "Brechas de visibilidad prioritarias",
      noGaps: "No se identificaron brechas críticas en esta autoevaluación.",
      recommendationsTitle: "Recomendaciones",
      actionPlanTitle: "Plan de acción a 90 días",
      phaseImmediate: "0-30 días. Prioridades inmediatas",
      phaseShort: "30-60 días. Estabilizar controles",
      phaseMedium: "60-90 días. Institucionalizar evidencia",
      categoryBreakdown: "Visibilidad por dominio",
      colDomain: "Dominio",
      colScore: "Puntaje",
      colStatus: "Estado",
      statusStrong: "Fuerte",
      statusPartial: "Parcial",
      statusWeak: "Débil",
      responses: "Respuestas detalladas del cuestionario",
      colNum: "#",
      colCategory: "Categoría",
      colQuestion: "Pregunta",
      colAnswer: "Respuesta",
      nextStepsTitle: "Siguiente paso recomendado",
      nextStepsBody:
        "Solicite una revisión de alcance a Sprita iT. Una evaluación técnica posterior puede revisar vulnerabilidades críticas y defectos de calidad prioritarios cuando haya acceso, alcance y plazo. Este cuestionario no produce esa lista.",
      contactLine: "spritascore.com · sprita-it.com · info@sprita-it.com",
      page: "Página",
      priority: "Prioridad",
      disclaimer:
        "Este puntaje es una autoevaluación ejecutiva y una ayuda de priorización. No constituye asesoría legal, certificación de auditoría ni prueba de cumplimiento.",
      filename: "spritascore-puntaje-ejecutivo-riesgo",
    },
  },
  pt: {
    meta: {
      title: "Pontuação executiva de risco de software",
      description:
        "Autoavaliação de risco de software em 15 perguntas para equipes de CIO, CISO, Risco e Tecnologia. Identifique lacunas em código assistido por IA, código de fornecedores, dependências de código aberto e controles de liberação.",
      ogDescription:
        "15 perguntas. 3 minutos. Sem enviar código. Identifique lacunas de visibilidade antes da pressão de uma auditoria ou da operação.",
      h1: "Pontuação executiva de risco de software",
      kicker: "Diagnóstico executivo · SpritaScore da Sprita iT",
      subtitle: "15 perguntas · 3 minutos · Para equipes de CIO, CISO, Risco e Tecnologia",
      intro:
        "Não é necessário enviar código nem dados técnicos sensíveis. Os resultados podem permanecer no navegador até que você solicite um relatório. Esta avaliação revela lacunas de visibilidade em código interno, código de fornecedores, código assistido por IA, dependências de código aberto, controles de liberação, evidência de auditoria e disciplina de remediação.",
      trustLine: "SpritaScore é uma marca da",
      brandLine: "Sprita iT",
      privacy: "Política de privacidade",
    },
    sections: {
      "software-governance": "Governança de software",
      "secure-development": "Desenvolvimento seguro",
      "dependencies-supply-chain": "Dependências e cadeia de suprimentos",
      "quality-continuity": "Qualidade e continuidade",
      "compliance-audit-evidence": "Conformidade e evidência de auditoria",
    },
    questions: {
      q1: "Existe um inventário atualizado de todas as aplicações críticas para o negócio.",
      q2: "Cada aplicação crítica tem um responsável de negócio e técnico claramente identificado.",
      q3: "A direção recebe indicadores periódicos de risco de software, não apenas contagens de vulnerabilidades.",
      q4: "O código desenvolvido internamente é analisado automaticamente antes da liberação.",
      q5: "O código entregue por fornecedores ou parceiros externos é validado de forma independente.",
      q6: "O código assistido ou gerado por IA é revisado antes de chegar à produção.",
      q7: "A organização sabe quais bibliotecas de código aberto e componentes de terceiros são usados pelas aplicações críticas.",
      q8: "A organização recebe alertas quando CVEs críticos afetam componentes em produção.",
      q9: "O risco das licenças de código aberto é revisado antes de aprovar ou liberar componentes.",
      q10: "A dívida técnica e a manutenibilidade são medidas para aplicações críticas.",
      q11: "Vulnerabilidades críticas podem bloquear ou interromper automaticamente uma liberação para produção.",
      q12: "Aplicações críticas em operação são revisadas periodicamente, não apenas antes da liberação.",
      q13: "A organização pode produzir evidência objetiva para auditorias internas, clientes, examinadores ou reguladores.",
      q14: "A organização pode mostrar tendências de risco de software ao longo do tempo com métricas.",
      q15: "Vulnerabilidades críticas têm prazos de remediação definidos e responsáveis designados.",
    },
    answers: { yes: "Sim", partially: "Parcialmente", no: "Não", not_sure: "Não tenho certeza" },
    weakCategories: {
      "ai-assisted-code": "Código assistido por IA",
      "vendor-delivered-code": "Código de fornecedores",
      "open-source-dependencies": "Dependências de código aberto",
      "release-controls": "Controles de liberação",
      "audit-evidence": "Evidência de auditoria",
      "software-governance": "Governança de software",
    },
    recommendations: {
      "ai-assisted-code": "Defina um ponto de revisão para o código assistido por IA antes de chegar à produção.",
      "vendor-delivered-code": "Valide de forma independente o código entregue por fornecedores antes de aceitar uma liberação.",
      "open-source-dependencies": "Mantenha visibilidade de dependências e alertas de CVE para aplicações críticas.",
      "release-controls": "Defina regras que bloqueiem a liberação quando houver vulnerabilidades críticas ou descumprimentos de política.",
      "audit-evidence": "Preserve evidência objetiva que mostre a evolução do risco e o status de remediação.",
      "software-governance": "Estabeleça responsáveis, um inventário e relatórios executivos para as aplicações críticas.",
    },
    levels: {
      low: { label: "Visibilidade madura", exposure: "Exposição baixa", interpretation: "O risco de software parece governado, com controles maduros e evidência suficiente." },
      moderate: { label: "Visibilidade parcial", exposure: "Exposição moderada", interpretation: "Existem controles, mas persistem pontos cegos na responsabilidade, na evidência, no código de IA, nos fornecedores ou nas dependências." },
      high: { label: "Alta exposição", exposure: "Alta exposição", interpretation: "Fraquezas significativas podem afetar a prontidão para auditoria, a resiliência operacional ou a disciplina de remediação." },
      critical: { label: "Pontos cegos críticos", exposure: "Exposição crítica", interpretation: "A organização provavelmente não tem visibilidade suficiente sobre o risco relacionado a software." },
    },
    ui: {
      sectionProgress: "Seção {current} de {total}",
      questionProgress: "Pergunta {current} de {total}",
      complete: "{percent}% concluído",
      cardTitle: "Responda cada pergunta de visibilidade de controles",
      cardDescription: "Não é necessário enviar código nem dados técnicos sensíveis. Selecione a opção que melhor reflete sua organização hoje.",
      previousSection: "Seção anterior",
      nextSection: "Próxima seção",
      seeScore: "Ver minha pontuação",
      reviewAnswers: "Rever respostas",
      yourResults: "Seus resultados",
      riskExposureScore: "Sua pontuação de exposição ao risco",
      executiveMaturity: "Maturidade executiva",
      maturityPoints: "Pontos de maturidade",
      maturityPercent: "{percent}% de maturidade",
      interpretation: "Interpretação",
      maturityDetails: "Detalhe de maturidade",
      exposureSuffix: "",
      topGaps: "Principais lacunas de visibilidade",
      requestAssessment: "Solicitar revisão de escopo",
      downloadPdf: "Baixar versão PDF",
      copyScore: "Prefere não enviar dados? Copie sua pontuação e revise internamente.",
      disclaimer: "Esta pontuação é uma autoavaliação executiva e auxílio de priorização. Não constitui assessoria legal, certificação de auditoria nem prova de conformidade.",
      pdfGenerating: "Gerando PDF…",
      pdfError: "Não foi possível gerar o PDF. Tente novamente ou use Imprimir como PDF no navegador.",
      pdfSaved: "PDF baixado neste navegador.",
      zeroRiskNote: "0 é a melhor resposta deste questionário e 100 a pior. Um 0 não afirma que o risco real seja zero.",
    },
    form: {
      title: "Solicitar revisão de escopo",
      description: "Uma avaliação técnica posterior pode revisar vulnerabilidades críticas e defeitos de qualidade prioritários. Ela exige acesso à aplicação, um escopo definido e um prazo depois deste questionário.",
      firstName: "Nome",
      company: "Empresa",
      email: "E-mail corporativo",
      submit: "Solicitar revisão de escopo",
      submitting: "Enviando…",
      successTitle: "Obrigado. Recebemos sua solicitação.",
      successBody: "Um especialista da Sprita iT dará seguimento sobre o escopo de uma revisão.",
      disposableEmail: "Use um e-mail corporativo válido.",
      submitError: "Não foi possível enviar a solicitação. Tente novamente ou escreva para info@sprita-it.com.",
      privacyPrefix: "Ao enviar, você aceita nossa ",
      privacySuffix: ". Esta pontuação é informativa e não constitui certificação legal, regulatória, de auditoria nem técnica.",
      firstNameRequired: "O nome é obrigatório",
      emailInvalid: "Insira um e-mail corporativo válido",
      companyRequired: "A empresa é obrigatória",
    },
    pdf: {
      title: "Pontuação executiva de risco de software",
      subtitle: "Relatório de autoavaliação executiva",
      preparedBy: "Preparado por SpritaScore · Sprita iT",
      riskScore: "Pontuação de exposição ao risco",
      maturity: "Maturidade executiva",
      points: "Pontos de maturidade",
      executiveSummary: "Resumo executivo",
      topGaps: "Lacunas de visibilidade prioritárias",
      noGaps: "Nenhuma lacuna crítica identificada nesta autoavaliação.",
      recommendationsTitle: "Recomendações",
      actionPlanTitle: "Plano de ação de 90 dias",
      phaseImmediate: "0-30 dias. Prioridades imediatas",
      phaseShort: "30-60 dias. Estabilizar controles",
      phaseMedium: "60-90 dias. Institucionalizar evidência",
      categoryBreakdown: "Visibilidade por domínio",
      colDomain: "Domínio",
      colScore: "Pontuação",
      colStatus: "Status",
      statusStrong: "Forte",
      statusPartial: "Parcial",
      statusWeak: "Fraco",
      responses: "Respostas detalhadas do questionário",
      colNum: "#",
      colCategory: "Categoria",
      colQuestion: "Pergunta",
      colAnswer: "Resposta",
      nextStepsTitle: "Próximo passo recomendado",
      nextStepsBody:
        "Solicite uma revisão de escopo à Sprita iT. Uma avaliação técnica posterior pode revisar vulnerabilidades críticas e defeitos de qualidade prioritários quando houver acesso, escopo e prazo. Este questionário não produz essa lista.",
      contactLine: "spritascore.com · sprita-it.com · info@sprita-it.com",
      page: "Página",
      priority: "Prioridade",
      disclaimer:
        "Esta pontuação é uma autoavaliação executiva e um auxílio de priorização. Não constitui assessoria legal, certificação de auditoria nem prova de conformidade.",
      filename: "spritascore-pontuacao-executiva-risco",
    },
  },
};

export function getExecutiveCopy(locale: Locale): ExecutiveCopy {
  return COPY[locale] ?? COPY.en;
}

export function getExecutiveQuestions(locale: Locale) {
  const copy = getExecutiveCopy(locale);
  return EXECUTIVE_QUESTION_META.map((meta) => ({
    ...meta,
    categoryLabel: copy.sections[meta.category],
    text: copy.questions[meta.id],
  }));
}

export function formatExecutive(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ""));
}