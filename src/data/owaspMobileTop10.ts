import { LocalizedText } from "@/types/calculator";

export interface OwaspMobileCategory {
  id: string;
  name: string;
  nameEs: string;
  description: LocalizedText;
  severityWeight: number;
  remediationHours: { min: number; max: number };
  platformRisk: { ios: number; android: number };
}

export const OWASP_MOBILE_TOP10_2024: OwaspMobileCategory[] = [
  {
    id: "M1",
    name: "Improper Credential Usage",
    nameEs: "Uso inadecuado de credenciales",
    description: {
      es: "Credenciales hardcodeadas, almacenadas inseguramente o reutilizadas.",
      en: "Hardcoded credentials, insecurely stored credentials, or credential reuse.",
    },
    severityWeight: 9,
    remediationHours: { min: 24, max: 120 },
    platformRisk: { ios: 1.2, android: 1.4 },
  },
  {
    id: "M2",
    name: "Inadequate Supply Chain Security",
    nameEs: "Seguridad inadecuada de la cadena de suministro",
    description: {
      es: "SDKs, librerías y dependencias móviles sin validación de seguridad.",
      en: "Mobile SDKs, libraries, and dependencies lacking security validation.",
    },
    severityWeight: 8,
    remediationHours: { min: 40, max: 200 },
    platformRisk: { ios: 1.3, android: 1.5 },
  },
  {
    id: "M3",
    name: "Insecure Authentication/Authorization",
    nameEs: "Autenticación/autorización insegura",
    description: {
      es: "Controles de identidad débiles en apps móviles.",
      en: "Weak identity controls in mobile applications.",
    },
    severityWeight: 9,
    remediationHours: { min: 32, max: 160 },
    platformRisk: { ios: 1.2, android: 1.3 },
  },
  {
    id: "M4",
    name: "Insufficient Input/Output Validation",
    nameEs: "Validación insuficiente de entrada/salida",
    description: {
      es: "Datos de usuario no validados en cliente y APIs móviles.",
      en: "Unvalidated user data on the client and mobile APIs.",
    },
    severityWeight: 8,
    remediationHours: { min: 24, max: 100 },
    platformRisk: { ios: 1.1, android: 1.2 },
  },
  {
    id: "M5",
    name: "Insecure Communication",
    nameEs: "Comunicación insegura",
    description: {
      es: "Tráfico sin cifrado adecuado o certificados mal validados.",
      en: "Traffic without adequate encryption or improperly validated certificates.",
    },
    severityWeight: 8,
    remediationHours: { min: 16, max: 80 },
    platformRisk: { ios: 1.1, android: 1.3 },
  },
  {
    id: "M6",
    name: "Inadequate Privacy Controls",
    nameEs: "Controles de privacidad inadecuados",
    description: {
      es: "Recolección y uso de datos sin controles de privacidad apropiados.",
      en: "Data collection and use without appropriate privacy controls.",
    },
    severityWeight: 7,
    remediationHours: { min: 32, max: 150 },
    platformRisk: { ios: 1.4, android: 1.2 },
  },
  {
    id: "M7",
    name: "Insufficient Binary Protections",
    nameEs: "Protecciones binarias insuficientes",
    description: {
      es: "App vulnerable a ingeniería inversa, tampering o debugging.",
      en: "App vulnerable to reverse engineering, tampering, or debugging.",
    },
    severityWeight: 7,
    remediationHours: { min: 40, max: 200 },
    platformRisk: { ios: 1.2, android: 1.5 },
  },
  {
    id: "M8",
    name: "Security Misconfiguration",
    nameEs: "Configuración insegura",
    description: {
      es: "Permisos excesivos, debug habilitado o configuración insegura.",
      en: "Excessive permissions, debugging enabled, or insecure configuration.",
    },
    severityWeight: 6,
    remediationHours: { min: 8, max: 60 },
    platformRisk: { ios: 1.1, android: 1.2 },
  },
  {
    id: "M9",
    name: "Insecure Data Storage",
    nameEs: "Almacenamiento inseguro de datos",
    description: {
      es: "Datos sensibles almacenados sin cifrado en el dispositivo.",
      en: "Sensitive data stored without encryption on the device.",
    },
    severityWeight: 9,
    remediationHours: { min: 24, max: 120 },
    platformRisk: { ios: 1.2, android: 1.4 },
  },
  {
    id: "M10",
    name: "Insufficient Cryptography",
    nameEs: "Criptografía insuficiente",
    description: {
      es: "Algoritmos débiles, implementación incorrecta o claves expuestas.",
      en: "Weak algorithms, incorrect implementation, or exposed keys.",
    },
    severityWeight: 8,
    remediationHours: { min: 32, max: 140 },
    platformRisk: { ios: 1.2, android: 1.3 },
  },
];

export function getMobileCategory(id: string): OwaspMobileCategory | undefined {
  return OWASP_MOBILE_TOP10_2024.find((c) => c.id === id);
}