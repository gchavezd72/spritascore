import type { CalculatorId, Locale } from "@/types/calculator";
import type { AuditId } from "@/lib/auditRoutes";

interface AuditOfferCopy {
  title: string;
  body: string;
}

export interface AuditCopy {
  metaTitle: string;
  metaDescription: string;
  nav: string;
  eyebrow: string;
  h1: string;
  lead: string;
  disclaimer: string;
  levelsTitle: string;
  levels: { title: string; body: string }[];
  offersTitle: string;
  offers: Record<AuditId, AuditOfferCopy>;
  reasons: Record<CalculatorId, string>;
  cardEyebrow: string;
  cardCta: string;
  alsoLabel: string;
  notAFinding: string;
  formTitle: string;
  formLead: string;
  name: string;
  company: string;
  email: string;
  role: string;
  country: string;
  interest: string;
  consentService: string;
  consentMarketing: string;
  submit: string;
  submitting: string;
  success: string;
  error: string;
  corporateEmail: string;
  countries: { value: string; label: string }[];
}

const countries = {
  en: [
    { value: "US", label: "United States" },
    { value: "GB", label: "United Kingdom" },
    { value: "PR", label: "Puerto Rico" },
    { value: "MX", label: "Mexico" },
    { value: "BR", label: "Brazil" },
    { value: "ES", label: "Spain" },
    { value: "PT", label: "Portugal" },
    { value: "AR", label: "Argentina" },
    { value: "CL", label: "Chile" },
    { value: "CO", label: "Colombia" },
    { value: "OTHER", label: "Other" },
  ],
  es: [
    { value: "US", label: "Estados Unidos" },
    { value: "GB", label: "Reino Unido" },
    { value: "PR", label: "Puerto Rico" },
    { value: "MX", label: "México" },
    { value: "BR", label: "Brasil" },
    { value: "ES", label: "España" },
    { value: "PT", label: "Portugal" },
    { value: "AR", label: "Argentina" },
    { value: "CL", label: "Chile" },
    { value: "CO", label: "Colombia" },
    { value: "OTHER", label: "Otro" },
  ],
  pt: [
    { value: "US", label: "Estados Unidos" },
    { value: "GB", label: "Reino Unido" },
    { value: "PR", label: "Porto Rico" },
    { value: "MX", label: "México" },
    { value: "BR", label: "Brasil" },
    { value: "ES", label: "Espanha" },
    { value: "PT", label: "Portugal" },
    { value: "AR", label: "Argentina" },
    { value: "CL", label: "Chile" },
    { value: "CO", label: "Colômbia" },
    { value: "OTHER", label: "Outro" },
  ],
} as const;

const offers: Record<Locale, Record<AuditId, AuditOfferCopy>> = {
  en: {
    "AUD-01": {
      title: "Code health and maintainability",
      body: "A sample of real code, to measure quality and maintenance friction. SpritaScore only heard how you described the rework.",
    },
    "AUD-02": {
      title: "Application security",
      body: "A review of the security controls on an agreed application. It does not prove that a vulnerability already exists.",
    },
    "AUD-03": {
      title: "Dependencies and supply chain",
      body: "An inventory of components, licenses and known issues for the scope you agree. SpritaScore did not inspect your libraries.",
    },
    "AUD-04": {
      title: "AI-assisted code governance",
      body: "How a team reviews code written with assistants: policy, human review and what reaches production.",
    },
    "AUD-05": {
      title: "Legacy software: keep, refactor or modernize",
      body: "A feasibility look at an aging system. The calculator did not measure complexity.",
    },
    "AUD-06": {
      title: "Evidence and assurance",
      body: "What a customer, regulator or audit would ask to see, limited to the asset you choose.",
    },
    "AUD-07": {
      title: "Portfolio baseline",
      body: "Which applications deserve a review first, when the inventory or the owner is unclear.",
    },
  },
  es: {
    "AUD-01": {
      title: "Salud y mantenibilidad del código",
      body: "Una muestra de código real para medir calidad y fricción de mantenimiento. SpritaScore solo escuchó cómo describió el retrabajo.",
    },
    "AUD-02": {
      title: "Seguridad de aplicaciones",
      body: "Una revisión de los controles de seguridad de una aplicación acordada. No demuestra que ya exista una vulnerabilidad.",
    },
    "AUD-03": {
      title: "Dependencias y cadena de suministro",
      body: "Un inventario de componentes, licencias y problemas conocidos del alcance que usted acuerde. SpritaScore no inspeccionó sus librerías.",
    },
    "AUD-04": {
      title: "Gobernanza del código asistido por IA",
      body: "Cómo el equipo revisa el código escrito con asistentes: política, revisión humana y qué llega a producción.",
    },
    "AUD-05": {
      title: "Software heredado: mantener, refactorizar o modernizar",
      body: "Una mirada de viabilidad sobre un sistema antiguo. La calculadora no midió la complejidad.",
    },
    "AUD-06": {
      title: "Evidencias y aseguramiento",
      body: "Qué pediría un cliente, un regulador o una auditoría, limitado al activo que usted elija.",
    },
    "AUD-07": {
      title: "Línea base del portafolio",
      body: "Qué aplicaciones conviene revisar primero, cuando el inventario o el responsable no están claros.",
    },
  },
  pt: {
    "AUD-01": {
      title: "Saúde e manutenibilidade do código",
      body: "Uma amostra de código real para medir qualidade e atrito de manutenção. O SpritaScore só ouviu como você descreveu o retrabalho.",
    },
    "AUD-02": {
      title: "Segurança de aplicações",
      body: "Uma revisão dos controles de segurança de uma aplicação combinada. Não prova que já exista uma vulnerabilidade.",
    },
    "AUD-03": {
      title: "Dependências e cadeia de suprimentos",
      body: "Um inventário de componentes, licenças e problemas conhecidos do escopo que você combinar. O SpritaScore não inspecionou as bibliotecas.",
    },
    "AUD-04": {
      title: "Governança do código assistido por IA",
      body: "Como a equipe revisa o código escrito com assistentes: política, revisão humana e o que chega à produção.",
    },
    "AUD-05": {
      title: "Software legado: manter, refatorar ou modernizar",
      body: "Um olhar de viabilidade sobre um sistema antigo. A calculadora não mediu a complexidade.",
    },
    "AUD-06": {
      title: "Evidências e garantia",
      body: "O que um cliente, um regulador ou uma auditoria pediria para ver, limitado ao ativo que você escolher.",
    },
    "AUD-07": {
      title: "Linha de base do portfólio",
      body: "Quais aplicações convém revisar primeiro, quando o inventário ou o responsável não estão claros.",
    },
  },
};

const reasons: Record<Locale, Record<CalculatorId, string>> = {
  en: {
    "executive-software-risk-score":
      "Your answers describe the portfolio, not the code. The useful next step is to choose which application to verify first.",
    "iso-quality":
      "You priced rework and quality. A maintainability review would measure a real sample, instead of the hours you entered.",
    "owasp-web":
      "You estimated web exposure from declared controls. A review would check those controls. It would not confirm a vulnerability.",
    "owasp-mobile":
      "You estimated mobile risk. A review can cover the app and its dependencies, only inside the scope you agree.",
    sector:
      "Industry changes priority. It does not prove a loss or a finding. The review is designed around one or a few assets.",
    "aspm-cost":
      "You described triage load. If evidence is missing, start with a baseline. If evidence already exists, review how findings are handled.",
    "cra-compliance":
      "Declared readiness is not conformity. A technical review would look at inventory, vulnerability handling and evidence for one product.",
    "dora-compliance":
      "Uncertainty about ICT evidence is not a DORA assessment. The review can be limited to one application or one provider.",
    "eu-ai-act-compliance":
      "An indicative classification is not a legal opinion. Where there is a software asset, its governance and controls can be reviewed.",
  },
  es: {
    "executive-software-risk-score":
      "Sus respuestas describen el portafolio, no el código. El paso útil es elegir qué aplicación se verifica primero.",
    "iso-quality":
      "Puso precio al retrabajo y a la calidad. Una revisión de mantenibilidad mediría una muestra real, en lugar de las horas que declaró.",
    "owasp-web":
      "Estimó la exposición web a partir de controles declarados. Una revisión comprobaría esos controles. No confirmaría una vulnerabilidad.",
    "owasp-mobile":
      "Estimó el riesgo móvil. Una revisión puede cubrir la app y sus dependencias, solo dentro del alcance que usted acuerde.",
    sector:
      "El sector cambia la prioridad. No demuestra una pérdida ni un hallazgo. La revisión se diseña sobre uno o pocos activos.",
    "aspm-cost":
      "Describió la carga de triaje. Si faltan evidencias, el primer paso es una línea base. Si ya existen, se revisa cómo se gestionan los hallazgos.",
    "cra-compliance":
      "La preparación declarada no es conformidad. Una revisión técnica miraría inventario, gestión de vulnerabilidades y evidencias de un producto.",
    "dora-compliance":
      "La incertidumbre sobre evidencias TIC no es una evaluación DORA. La revisión puede limitarse a una aplicación o a un proveedor.",
    "eu-ai-act-compliance":
      "Una clasificación orientativa no es un dictamen legal. Si hay un activo de software, se pueden revisar su gobernanza y sus controles.",
  },
  pt: {
    "executive-software-risk-score":
      "Suas respostas descrevem o portfólio, não o código. O passo útil é escolher qual aplicação verificar primeiro.",
    "iso-quality":
      "Você precificou o retrabalho e a qualidade. Uma revisão de manutenibilidade mediria uma amostra real, em vez das horas declaradas.",
    "owasp-web":
      "Você estimou a exposição web a partir de controles declarados. Uma revisão verificaria esses controles. Não confirmaria uma vulnerabilidade.",
    "owasp-mobile":
      "Você estimou o risco móvel. Uma revisão pode cobrir o app e as dependências, apenas dentro do escopo que você combinar.",
    sector:
      "O setor muda a prioridade. Não prova uma perda nem um achado. A revisão é desenhada sobre um ou poucos ativos.",
    "aspm-cost":
      "Você descreveu a carga de triagem. Se faltam evidências, o primeiro passo é uma linha de base. Se já existem, revisa-se como os achados são tratados.",
    "cra-compliance":
      "A preparação declarada não é conformidade. Uma revisão técnica olharia inventário, gestão de vulnerabilidades e evidências de um produto.",
    "dora-compliance":
      "A incerteza sobre evidências de TIC não é uma avaliação DORA. A revisão pode limitar-se a uma aplicação ou a um fornecedor.",
    "eu-ai-act-compliance":
      "Uma classificação indicativa não é um parecer jurídico. Se houver um ativo de software, a governança e os controles podem ser revisados.",
  },
};

const copy: Record<Locale, Omit<AuditCopy, "offers" | "reasons" | "countries">> = {
  en: {
    metaTitle: "Request a software audit scope",
    metaDescription:
      "SpritaScore estimates from your answers. A Sprita iT audit checks an agreed application. Request a scope. No code upload and no scan starts.",
    nav: "Audits",
    eyebrow: "Sprita iT software audit",
    h1: "The estimate shows where to look. The audit checks what is there.",
    lead: "Use the calculators with no signup. When a result points at a real decision, ask Sprita iT to define the scope of a technical audit. Nothing is scanned from this page.",
    disclaimer: "Based on your answers, not on scanned code. This request does not start an audit and does not promise findings, dates or certification.",
    levelsTitle: "Three different statements",
    levels: [
      { title: "Self-assessment", body: "Your answers and a documented model. It can say what is worth reviewing." },
      { title: "Scope conversation", body: "Which asset, which question and which constraints. Still no findings." },
      { title: "Contracted audit", body: "Specialists and evidence, outside this site, after you authorize access." },
    ],
    offersTitle: "What can be scoped",
    cardEyebrow: "What an audit would verify",
    cardCta: "Request this scope",
    alsoLabel: "Also relevant",
    notAFinding: "This is not a technical finding.",
    formTitle: "Request an audit scope",
    formLead: "Tell us who to reply to and which review you want. Do not paste code, secrets or customer data.",
    name: "Name",
    company: "Company",
    email: "Work email",
    role: "Role",
    country: "Country",
    interest: "Review you want",
    consentService: "Sprita iT may reply about this request. This does not start an audit.",
    consentMarketing: "I also want occasional notes about software risk. Optional.",
    submit: "Send the request",
    submitting: "Sending…",
    success: "We received the request. We will reply in writing to clarify the scope. No analysis has started.",
    error: "The request was not saved. Try again or write to info@sprita-it.com.",
    corporateEmail: "Disposable inboxes are not accepted for this request.",
  },
  es: {
    metaTitle: "Solicitar alcance de una auditoría de software",
    metaDescription:
      "SpritaScore estima a partir de sus respuestas. Una auditoría de Sprita iT revisa una aplicación acordada. Solicite el alcance. Sin subir código y sin iniciar un análisis.",
    nav: "Auditorías",
    eyebrow: "Auditoría de software de Sprita iT",
    h1: "La estimación muestra dónde mirar. La auditoría comprueba lo que hay.",
    lead: "Use las calculadoras sin registrarse. Cuando un resultado apunta a una decisión real, pida a Sprita iT que defina el alcance de una auditoría técnica. Desde esta página no se escanea nada.",
    disclaimer: "Basado en sus respuestas, no en código analizado. Esta solicitud no inicia una auditoría y no promete hallazgos, fechas ni certificación.",
    levelsTitle: "Tres afirmaciones distintas",
    levels: [
      { title: "Autodiagnóstico", body: "Sus respuestas y un modelo documentado. Puede decir qué conviene revisar." },
      { title: "Conversación de alcance", body: "Qué activo, qué pregunta y qué restricciones. Todavía no hay hallazgos." },
      { title: "Auditoría contratada", body: "Especialistas y evidencia, fuera de este sitio, después de que usted autorice el acceso." },
    ],
    offersTitle: "Qué se puede acotar",
    cardEyebrow: "Qué verificaría una auditoría",
    cardCta: "Solicitar este alcance",
    alsoLabel: "También relevante",
    notAFinding: "Esto no es un hallazgo técnico.",
    formTitle: "Solicitar alcance de auditoría",
    formLead: "Díganos a quién responder y qué revisión quiere. No pegue código, secretos ni datos de clientes.",
    name: "Nombre",
    company: "Empresa",
    email: "Correo de trabajo",
    role: "Cargo",
    country: "País",
    interest: "Revisión que quiere",
    consentService: "Sprita iT puede responder esta solicitud. Esto no inicia una auditoría.",
    consentMarketing: "También quiero notas ocasionales sobre riesgo de software. Opcional.",
    submit: "Enviar la solicitud",
    submitting: "Enviando…",
    success: "Recibimos la solicitud. Responderemos por escrito para aclarar el alcance. No se ha iniciado ningún análisis.",
    error: "La solicitud no se guardó. Inténtelo de nuevo o escriba a info@sprita-it.com.",
    corporateEmail: "No aceptamos correos desechables para esta solicitud.",
  },
  pt: {
    metaTitle: "Solicitar escopo de uma auditoria de software",
    metaDescription:
      "O SpritaScore estima a partir das suas respostas. Uma auditoria da Sprita iT revisa uma aplicação combinada. Solicite o escopo. Sem enviar código e sem iniciar uma análise.",
    nav: "Auditorias",
    eyebrow: "Auditoria de software da Sprita iT",
    h1: "A estimativa mostra onde olhar. A auditoria verifica o que existe.",
    lead: "Use as calculadoras sem cadastro. Quando um resultado aponta para uma decisão real, peça à Sprita iT que defina o escopo de uma auditoria técnica. Desta página nada é escaneado.",
    disclaimer: "Baseado nas suas respostas, não em código analisado. Este pedido não inicia uma auditoria e não promete achados, datas nem certificação.",
    levelsTitle: "Três afirmações diferentes",
    levels: [
      { title: "Autodiagnóstico", body: "As suas respostas e um modelo documentado. Pode dizer o que convém revisar." },
      { title: "Conversa de escopo", body: "Qual ativo, qual pergunta e quais restrições. Ainda não há achados." },
      { title: "Auditoria contratada", body: "Especialistas e evidência, fora deste site, depois que você autorizar o acesso." },
    ],
    offersTitle: "O que pode ser delimitado",
    cardEyebrow: "O que uma auditoria verificaria",
    cardCta: "Solicitar este escopo",
    alsoLabel: "Também relevante",
    notAFinding: "Isto não é um achado técnico.",
    formTitle: "Solicitar escopo de auditoria",
    formLead: "Diga a quem responder e qual revisão você quer. Não cole código, segredos nem dados de clientes.",
    name: "Nome",
    company: "Empresa",
    email: "E-mail de trabalho",
    role: "Cargo",
    country: "País",
    interest: "Revisão desejada",
    consentService: "A Sprita iT pode responder a este pedido. Isto não inicia uma auditoria.",
    consentMarketing: "Também quero notas ocasionais sobre risco de software. Opcional.",
    submit: "Enviar o pedido",
    submitting: "Enviando…",
    success: "Recebemos o pedido. Responderemos por escrito para esclarecer o escopo. Nenhuma análise foi iniciada.",
    error: "O pedido não foi salvo. Tente de novo ou escreva para info@sprita-it.com.",
    corporateEmail: "Não aceitamos e-mails descartáveis para este pedido.",
  },
};

export function getAuditCopy(locale: Locale): AuditCopy {
  const language = locale === "es" || locale === "pt" ? locale : "en";
  return {
    ...copy[language],
    offers: offers[language],
    reasons: reasons[language],
    countries: [...countries[language]],
  };
}
