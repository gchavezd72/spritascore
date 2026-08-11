import type { Locale } from "@/types/calculator";

export const CALC05_ROUTES: Record<Locale, string> = {
  es: "/es/calculadora/05",
  en: "/en/calculadora/05",
  pt: "/pt/calculadora/05",
};

export function getCalc05Route(locale: Locale): string {
  return CALC05_ROUTES[locale] ?? CALC05_ROUTES.es;
}

export type Calc05Copy = {
  meta: { title: string; description: string; h1: string; ogDescription: string };
  hero: { badge: string; title: string; subtitle: string };
  currency: { label: string; brl: string; usd: string };
  steps: { of: string };
  questions: {
    q1: { label: string; hint: string; options: Record<string, string> };
    q2: { label: string; hint: string; options: Record<string, string> };
    q3: { label: string; hint: string; options: Record<string, string> };
    q4: { label: string; hint: string; options: Record<string, string> };
    q5: { label: string; hint: string; options: Record<string, string> };
    q6: { label: string; hint: string; options: Record<string, string> };
  };
  nav: { next: string; back: string; calculate: string; restart: string };
  result: {
    title: string;
    score_label: string;
    impact_label: string;
    impact_note: string;
    factors_title: string;
    classification: Record<"low" | "medium" | "high" | "critical", string>;
    cta_primary: string;
    disclaimer: string;
  };
  bullets: Record<string, string>;
};

const ES: Calc05Copy = {
  meta: {
    title: "Costo de Vulnerabilidad por Sector | SpritaScore",
    description:
      "Calcule el impacto financiero de una vulnerabilidad considerando su sector, regulación y madurez de seguridad.",
    h1: "¿Cuánto cuesta una vulnerabilidad en su sector?",
    ogDescription:
      "6 preguntas · 2–3 minutos · resultado inmediato en R$ o USD. Estime la exposición financiera por sector.",
  },
  hero: {
    badge: "CALCULADORA 05 · SEGURIDAD",
    title: "¿Cuánto cuesta una vulnerabilidad en su sector?",
    subtitle: "6 preguntas · 2–3 minutos · resultado inmediato en R$ o USD",
  },
  currency: {
    label: "Moneda del resultado",
    brl: "Reales (R$)",
    usd: "Dólares (USD)",
  },
  steps: { of: "de" },
  questions: {
    q1: {
      label: "¿Cuál es el sector principal de su organización?",
      hint: "Define el costo base por registro y los multiplicadores regulatorios.",
      options: {
        saude: "Salud & Hospitales",
        tech: "Tecnología & SaaS",
        fintech: "Fintech & Bancos",
        seguros: "Seguros",
        varejo: "Retail & E-commerce",
        industria: "Industria & Energía",
        publico: "Sector Público",
        outro: "Otro",
      },
    },
    q2: {
      label: "¿Cuántos registros de datos sensibles procesa su aplicación?",
      hint: "Incluye datos de usuarios, clientes, pacientes o transacciones.",
      options: {
        "1": "Menos de 10.000",
        "2": "10.000 a 100.000",
        "3": "100.000 a 1 millón",
        "4": "Más de 1 millón",
      },
    },
    q3: {
      label: "¿Su aplicación usa IA generativa o asistentes de código?",
      hint: "Ej: GitHub Copilot, ChatGPT, Cursor, Gemini en el ciclo de desarrollo.",
      options: {
        "3": "Sí — en producción y desarrollo",
        "2": "Sí — aún en fase de pruebas",
        "1": "No usamos IA en el ciclo de dev",
      },
    },
    q4: {
      label: "¿Tienen análisis automatizado de dependencias (SCA) en producción?",
      hint: "SCA rastrea CVEs en librerías de terceros y open source.",
      options: {
        "1": "Sí — automatizado e integrado al CI/CD",
        "2": "Hacemos revisiones, pero manualmente",
        "3": "No tenemos proceso formal de SCA",
      },
    },
    q5: {
      label: "¿Cómo describiría la madurez de seguridad de aplicaciones en su organización?",
      hint: "Evalúe con honestidad — el valor está en ver las brechas reales.",
      options: {
        "1": "Básica — sin proceso formal de seguridad",
        "2": "En desarrollo — estamos estructurando",
        "3": "Definida — tenemos políticas y algunas herramientas",
        "4": "Avanzada — DevSecOps integrado y automatizado",
      },
    },
    q6: {
      label: "En los últimos 24 meses, ¿sufrieron algún incidente de seguridad en aplicaciones?",
      hint: "Cualquier incidente confirmado o sospechoso, interno o externo.",
      options: {
        "2": "Sí — lo identificamos y gestionamos",
        "3": "No sabemos con certeza",
        "1": "No — sin incidentes conocidos",
      },
    },
  },
  nav: {
    next: "Continuar",
    back: "Atrás",
    calculate: "Calcular mi riesgo",
    restart: "Recalcular",
  },
  result: {
    title: "Su resultado",
    score_label: "SpritaScore",
    impact_label: "Su exposición estimada",
    impact_note: "basado en su perfil de sector y madurez actual",
    factors_title: "Factores de mayor peso",
    classification: {
      low: "Riesgo bajo",
      medium: "Riesgo medio",
      high: "Riesgo alto",
      critical: "Riesgo crítico",
    },
    cta_primary: "Solicitar diagnóstico técnico gratuito",
    disclaimer:
      "Estimación basada en benchmarks públicos del sector. No constituye auditoría técnica. © Sprita iT",
  },
  bullets: {
    ia_prod:
      "Uso de IA generativa sin trazabilidad de autoría — riesgo directo bajo el Art. 46 de la LGPD.",
    incident:
      "Historial de incidentes confirmado — aumenta 40% la probabilidad de reincidencia sin remediación estructural.",
    no_sca:
      "Ausencia de inventario de dependencias (SBOM) — componentes de terceros sin visibilidad de CVEs.",
    no_insight:
      "Falta de visibilidad sobre incidentes pasados — imposible remediar lo que no fue documentado.",
    high_vol: "Volumen de datos a escala — exposición regulatoria máxima ante la ANPD.",
    basic_mat:
      "Madurez de seguridad básica — sin proceso formal de AppSec ni políticas documentadas.",
    ia_dev:
      "IA en fase de pruebas ya genera superficie de ataque — riesgo antes de llegar a producción.",
    reg_sector: "Sector de alta regulación — la ANPD intensificó inspecciones técnicas en 2025.",
    generic: "Exposición a vulnerabilidades en el ciclo de desarrollo detectada.",
  },
};

const EN: Calc05Copy = {
  meta: {
    title: "Vulnerability Cost by Sector | SpritaScore",
    description:
      "Calculate the financial impact of a vulnerability considering your sector, regulation, and security maturity.",
    h1: "How much does a vulnerability cost in your sector?",
    ogDescription:
      "6 questions · 2–3 minutes · immediate result in BRL or USD. Estimate financial exposure by sector.",
  },
  hero: {
    badge: "CALCULATOR 05 · SECURITY",
    title: "How much does a vulnerability cost in your sector?",
    subtitle: "6 questions · 2–3 minutes · immediate result in BRL or USD",
  },
  currency: {
    label: "Result currency",
    brl: "Brazilian Real (R$)",
    usd: "US Dollar (USD)",
  },
  steps: { of: "of" },
  questions: {
    q1: {
      label: "What is your organization's primary sector?",
      hint: "Defines the base cost per record and regulatory multipliers.",
      options: {
        saude: "Healthcare & Hospitals",
        tech: "Technology & SaaS",
        fintech: "Fintech & Banking",
        seguros: "Insurance",
        varejo: "Retail & E-commerce",
        industria: "Industry & Energy",
        publico: "Public Sector",
        outro: "Other",
      },
    },
    q2: {
      label: "How many sensitive data records does your application process?",
      hint: "Includes user, customer, patient, or transaction data.",
      options: {
        "1": "Fewer than 10,000",
        "2": "10,000 to 100,000",
        "3": "100,000 to 1 million",
        "4": "More than 1 million",
      },
    },
    q3: {
      label: "Does your application use generative AI or coding assistants?",
      hint: "e.g. GitHub Copilot, ChatGPT, Cursor, Gemini in the development cycle.",
      options: {
        "3": "Yes — in production and development",
        "2": "Yes — still in testing phase",
        "1": "We do not use AI in our dev cycle",
      },
    },
    q4: {
      label: "Do you have automated dependency analysis (SCA) in production?",
      hint: "SCA tracks CVEs in third-party and open-source libraries.",
      options: {
        "1": "Yes — automated and integrated into CI/CD",
        "2": "We do manual reviews occasionally",
        "3": "We have no formal SCA process",
      },
    },
    q5: {
      label: "How would you describe your organization's application security maturity?",
      hint: "Be honest — the value is in seeing real gaps.",
      options: {
        "1": "Basic — no formal security process",
        "2": "Developing — we are structuring it",
        "3": "Defined — we have policies and some tools",
        "4": "Advanced — integrated and automated DevSecOps",
      },
    },
    q6: {
      label: "In the last 24 months, did you experience any application security incident?",
      hint: "Any confirmed or suspected incident, internal or external.",
      options: {
        "2": "Yes — we identified and managed it",
        "3": "We are not sure",
        "1": "No — no known incidents",
      },
    },
  },
  nav: {
    next: "Continue",
    back: "Back",
    calculate: "Calculate my risk",
    restart: "Recalculate",
  },
  result: {
    title: "Your result",
    score_label: "SpritaScore",
    impact_label: "Your estimated exposure",
    impact_note: "based on your sector profile and current maturity",
    factors_title: "Key risk factors",
    classification: {
      low: "Low risk",
      medium: "Medium risk",
      high: "High risk",
      critical: "Critical risk",
    },
    cta_primary: "Request a free technical diagnosis",
    disclaimer:
      "Estimate based on public industry benchmarks. Not a technical audit. © Sprita iT",
  },
  bullets: {
    ia_prod:
      "Generative AI in use without authorship traceability — direct risk under LGPD Art. 46.",
    incident:
      "Confirmed incident history — increases recurrence probability by 40% without structural remediation.",
    no_sca: "No dependency inventory (SBOM) — third-party components with no CVE visibility.",
    no_insight:
      "No visibility into past incidents — impossible to remediate what was not documented.",
    high_vol: "Data at scale — maximum regulatory exposure before the ANPD.",
    basic_mat: "Basic security maturity — no formal AppSec process or documented policies.",
    ia_dev: "AI in testing already creates attack surface — risk before reaching production.",
    reg_sector: "Highly regulated sector — ANPD intensified technical inspections in 2025.",
    generic: "Vulnerability exposure detected in the development cycle.",
  },
};

const PT: Calc05Copy = {
  meta: {
    title: "Custo de Vulnerabilidade por Setor | SpritaScore",
    description:
      "Calcule o impacto financeiro de uma vulnerabilidade considerando seu setor, regulamentação LGPD e maturidade de segurança.",
    h1: "Quanto custa uma vulnerabilidade no seu setor?",
    ogDescription:
      "6 perguntas · 2–3 minutos · resultado imediato em R$ ou USD. Estime a exposição financeira por setor.",
  },
  hero: {
    badge: "CALCULADORA 05 · SEGURANÇA",
    title: "Quanto custa uma vulnerabilidade no seu setor?",
    subtitle: "6 perguntas · 2–3 minutos · resultado imediato em R$ ou USD",
  },
  currency: {
    label: "Moeda do resultado",
    brl: "Reais (R$)",
    usd: "Dólares (USD)",
  },
  steps: { of: "de" },
  questions: {
    q1: {
      label: "Qual é o setor principal da sua organização?",
      hint: "Define o custo base por registro e os multiplicadores regulatórios.",
      options: {
        saude: "Saúde & Hospitais",
        tech: "Tecnologia & SaaS",
        fintech: "Fintech & Bancos",
        seguros: "Seguros",
        varejo: "Varejo & E-commerce",
        industria: "Indústria & Energia",
        publico: "Setor Público",
        outro: "Outro",
      },
    },
    q2: {
      label: "Quantos registros de dados sensíveis sua aplicação processa?",
      hint: "Inclui dados de usuários, clientes, pacientes ou transações.",
      options: {
        "1": "Menos de 10.000",
        "2": "10.000 a 100.000",
        "3": "100.000 a 1 milhão",
        "4": "Mais de 1 milhão",
      },
    },
    q3: {
      label: "Sua aplicação usa IA generativa ou assistentes de código?",
      hint: "Ex: GitHub Copilot, ChatGPT, Cursor, Gemini no ciclo de desenvolvimento.",
      options: {
        "3": "Sim — em produção e desenvolvimento",
        "2": "Sim — ainda em fase de testes",
        "1": "Não usamos IA no ciclo de dev",
      },
    },
    q4: {
      label: "Vocês têm análise automatizada de dependências (SCA) em produção?",
      hint: "SCA rastreia CVEs em bibliotecas de terceiros e open source.",
      options: {
        "1": "Sim — automatizada e integrada ao CI/CD",
        "2": "Fazemos revisões, mas manualmente",
        "3": "Não temos processo formal de SCA",
      },
    },
    q5: {
      label: "Como descreveria a maturidade de segurança de aplicações na sua organização?",
      hint: "Avalie com honestidade — o valor está em ver as lacunas reais.",
      options: {
        "1": "Básica — sem processo formal de segurança",
        "2": "Em desenvolvimento — estamos estruturando",
        "3": "Definida — temos políticas e algumas ferramentas",
        "4": "Avançada — DevSecOps integrado e automatizado",
      },
    },
    q6: {
      label: "Nos últimos 24 meses, sofreram algum incidente de segurança em aplicações?",
      hint: "Qualquer incidente confirmado ou suspeito, interno ou externo.",
      options: {
        "2": "Sim — identificamos e gerenciamos",
        "3": "Não sabemos ao certo",
        "1": "Não — sem incidentes conhecidos",
      },
    },
  },
  nav: {
    next: "Continuar",
    back: "Voltar",
    calculate: "Calcular meu risco",
    restart: "Recalcular",
  },
  result: {
    title: "Seu resultado",
    score_label: "SpritaScore",
    impact_label: "Sua exposição estimada",
    impact_note: "baseado no seu perfil de setor e maturidade atual",
    factors_title: "Fatores de maior peso",
    classification: {
      low: "Baixo risco",
      medium: "Risco médio",
      high: "Risco alto",
      critical: "Risco crítico",
    },
    cta_primary: "Solicitar diagnóstico técnico gratuito",
    disclaimer:
      "Estimativa baseada em benchmarks públicos do setor. Não constitui auditoria técnica. © Sprita iT",
  },
  bullets: {
    ia_prod:
      "Uso de IA generativa sem rastreabilidade de autoria — risco direto perante o Art. 46 da LGPD.",
    incident:
      "Histórico de incidentes confirmado — aumenta 40% a probabilidade de reincidência sem remediação estrutural.",
    no_sca:
      "Ausência de inventário de dependências (SBOM) — componentes de terceiros sem visibilidade de CVEs.",
    no_insight:
      "Falta de visibilidade sobre incidentes passados — impossível remediar o que não foi documentado.",
    high_vol: "Volume de dados em escala — exposição regulatória máxima perante a ANPD.",
    basic_mat:
      "Maturidade de segurança básica — sem processo formal de AppSec nem políticas documentadas.",
    ia_dev:
      "IA em fase de testes já gera superfície de ataque — risco antes mesmo de chegar à produção.",
    reg_sector: "Setor de alta regulação — a ANPD intensificou inspeções técnicas em 2025.",
    generic: "Exposição a vulnerabilidades no ciclo de desenvolvimento detectada.",
  },
};

const COPIES: Record<Locale, Calc05Copy> = { es: ES, en: EN, pt: PT };

export function getCalc05Copy(locale: Locale): Calc05Copy {
  return COPIES[locale] ?? COPIES.es;
}
