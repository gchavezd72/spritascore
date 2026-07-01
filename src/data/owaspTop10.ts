export interface OwaspCategory {
  id: string;
  name: string;
  nameEs: string;
  description: string;
  severityWeight: number;
  remediationHours: { min: number; max: number };
  complexityFactor: number;
}

export const OWASP_TOP10_2021: OwaspCategory[] = [
  {
    id: "A01",
    name: "Broken Access Control",
    nameEs: "Control de acceso roto",
    description: "Restricciones de acceso mal implementadas que permiten acciones no autorizadas.",
    severityWeight: 9,
    remediationHours: { min: 40, max: 200 },
    complexityFactor: 1.5,
  },
  {
    id: "A02",
    name: "Cryptographic Failures",
    nameEs: "Fallos criptográficos",
    description: "Fallas en protección de datos sensibles en tránsito o reposo.",
    severityWeight: 8,
    remediationHours: { min: 24, max: 120 },
    complexityFactor: 1.4,
  },
  {
    id: "A03",
    name: "Injection",
    nameEs: "Inyección",
    description: "Datos hostiles enviados a intérprete como SQL, NoSQL, OS o LDAP.",
    severityWeight: 9,
    remediationHours: { min: 16, max: 80 },
    complexityFactor: 1.3,
  },
  {
    id: "A04",
    name: "Insecure Design",
    nameEs: "Diseño inseguro",
    description: "Fallas arquitectónicas que requieren rediseño de controles de seguridad.",
    severityWeight: 8,
    remediationHours: { min: 80, max: 400 },
    complexityFactor: 2.0,
  },
  {
    id: "A05",
    name: "Security Misconfiguration",
    nameEs: "Configuración insegura",
    description: "Configuraciones por defecto inseguras, permisos excesivos o headers faltantes.",
    severityWeight: 7,
    remediationHours: { min: 8, max: 60 },
    complexityFactor: 1.1,
  },
  {
    id: "A06",
    name: "Vulnerable and Outdated Components",
    nameEs: "Componentes vulnerables y obsoletos",
    description: "Dependencias con vulnerabilidades conocidas sin parches aplicados.",
    severityWeight: 7,
    remediationHours: { min: 16, max: 100 },
    complexityFactor: 1.2,
  },
  {
    id: "A07",
    name: "Identification and Authentication Failures",
    nameEs: "Fallos de identificación y autenticación",
    description: "Controles de autenticación débiles o mal implementados.",
    severityWeight: 8,
    remediationHours: { min: 32, max: 160 },
    complexityFactor: 1.5,
  },
  {
    id: "A08",
    name: "Software and Data Integrity Failures",
    nameEs: "Fallos de integridad de software y datos",
    description: "Código o infraestructura sin verificación de integridad en CI/CD.",
    severityWeight: 7,
    remediationHours: { min: 40, max: 200 },
    complexityFactor: 1.6,
  },
  {
    id: "A09",
    name: "Security Logging and Monitoring Failures",
    nameEs: "Fallos de logging y monitoreo de seguridad",
    description: "Detección, escalamiento y respuesta insuficientes ante incidentes.",
    severityWeight: 6,
    remediationHours: { min: 24, max: 120 },
    complexityFactor: 1.3,
  },
  {
    id: "A10",
    name: "Server-Side Request Forgery",
    nameEs: "SSRF (Server-Side Request Forgery)",
    description: "La aplicación obtiene recursos remotos sin validar URLs de destino.",
    severityWeight: 7,
    remediationHours: { min: 16, max: 80 },
    complexityFactor: 1.4,
  },
];

export function getOwaspCategory(id: string): OwaspCategory | undefined {
  return OWASP_TOP10_2021.find((c) => c.id === id);
}