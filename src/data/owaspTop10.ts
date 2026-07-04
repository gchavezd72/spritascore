import { LocalizedText } from "@/types/calculator";

export interface OwaspCategory {
  id: string;
  name: string;
  nameEs: string;
  description: LocalizedText;
  severityWeight: number;
  remediationHours: { min: number; max: number };
  complexityFactor: number;
}

export const OWASP_TOP10_2021: OwaspCategory[] = [
  {
    id: "A01",
    name: "Broken Access Control",
    nameEs: "Control de acceso roto",
    description: {
      es: "Restricciones de acceso mal implementadas que permiten acciones no autorizadas.",
      en: "Poorly implemented access restrictions that allow unauthorized actions.",
      pt: "Restrições de acesso mal implementadas que permitem ações não autorizadas.",
    },
    severityWeight: 9,
    remediationHours: { min: 40, max: 200 },
    complexityFactor: 1.5,
  },
  {
    id: "A02",
    name: "Cryptographic Failures",
    nameEs: "Fallos criptográficos",
    description: {
      es: "Fallas en protección de datos sensibles en tránsito o reposo.",
      en: "Failures in protecting sensitive data in transit or at rest.",
      pt: "Falhas na proteção de dados sensíveis em trânsito ou em repouso.",
    },
    severityWeight: 8,
    remediationHours: { min: 24, max: 120 },
    complexityFactor: 1.4,
  },
  {
    id: "A03",
    name: "Injection",
    nameEs: "Inyección",
    description: {
      es: "Datos hostiles enviados a intérprete como SQL, NoSQL, OS o LDAP.",
      en: "Hostile data sent to an interpreter such as SQL, NoSQL, OS, or LDAP.",
      pt: "Dados hostis enviados a um interpretador como SQL, NoSQL, SO ou LDAP.",
    },
    severityWeight: 9,
    remediationHours: { min: 16, max: 80 },
    complexityFactor: 1.3,
  },
  {
    id: "A04",
    name: "Insecure Design",
    nameEs: "Diseño inseguro",
    description: {
      es: "Fallas arquitectónicas que requieren rediseño de controles de seguridad.",
      en: "Architectural flaws that require redesigning security controls.",
      pt: "Falhas arquiteturais que exigem redesenho dos controles de segurança.",
    },
    severityWeight: 8,
    remediationHours: { min: 80, max: 400 },
    complexityFactor: 2.0,
  },
  {
    id: "A05",
    name: "Security Misconfiguration",
    nameEs: "Configuración insegura",
    description: {
      es: "Configuraciones por defecto inseguras, permisos excesivos o headers faltantes.",
      en: "Insecure default configurations, excessive permissions, or missing security headers.",
      pt: "Configurações padrão inseguras, permissões excessivas ou cabeçalhos de segurança ausentes.",
    },
    severityWeight: 7,
    remediationHours: { min: 8, max: 60 },
    complexityFactor: 1.1,
  },
  {
    id: "A06",
    name: "Vulnerable and Outdated Components",
    nameEs: "Componentes vulnerables y obsoletos",
    description: {
      es: "Dependencias con vulnerabilidades conocidas sin parches aplicados.",
      en: "Dependencies with known vulnerabilities that remain unpatched.",
      pt: "Dependências com vulnerabilidades conhecidas sem patches aplicados.",
    },
    severityWeight: 7,
    remediationHours: { min: 16, max: 100 },
    complexityFactor: 1.2,
  },
  {
    id: "A07",
    name: "Identification and Authentication Failures",
    nameEs: "Fallos de identificación y autenticación",
    description: {
      es: "Controles de autenticación débiles o mal implementados.",
      en: "Weak or poorly implemented authentication controls.",
      pt: "Controles de autenticação fracos ou mal implementados.",
    },
    severityWeight: 8,
    remediationHours: { min: 32, max: 160 },
    complexityFactor: 1.5,
  },
  {
    id: "A08",
    name: "Software and Data Integrity Failures",
    nameEs: "Fallos de integridad de software y datos",
    description: {
      es: "Código o infraestructura sin verificación de integridad en CI/CD.",
      en: "Code or infrastructure lacking integrity verification within CI/CD pipelines.",
      pt: "Código ou infraestrutura sem verificação de integridade nos pipelines de CI/CD.",
    },
    severityWeight: 7,
    remediationHours: { min: 40, max: 200 },
    complexityFactor: 1.6,
  },
  {
    id: "A09",
    name: "Security Logging and Monitoring Failures",
    nameEs: "Fallos de logging y monitoreo de seguridad",
    description: {
      es: "Detección, escalamiento y respuesta insuficientes ante incidentes.",
      en: "Insufficient detection, escalation, and response to security incidents.",
      pt: "Detecção, escalonamento e resposta insuficientes a incidentes de segurança.",
    },
    severityWeight: 6,
    remediationHours: { min: 24, max: 120 },
    complexityFactor: 1.3,
  },
  {
    id: "A10",
    name: "Server-Side Request Forgery",
    nameEs: "SSRF (Server-Side Request Forgery)",
    description: {
      es: "La aplicación obtiene recursos remotos sin validar URLs de destino.",
      en: "The application fetches remote resources without validating destination URLs.",
      pt: "A aplicação obtém recursos remotos sem validar as URLs de destino.",
    },
    severityWeight: 7,
    remediationHours: { min: 16, max: 80 },
    complexityFactor: 1.4,
  },
];

export function getOwaspCategory(id: string): OwaspCategory | undefined {
  return OWASP_TOP10_2021.find((c) => c.id === id);
}