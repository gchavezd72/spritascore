export interface OwaspMobileCategory {
  id: string;
  name: string;
  nameEs: string;
  description: string;
  severityWeight: number;
  remediationHours: { min: number; max: number };
  platformRisk: { ios: number; android: number };
}

export const OWASP_MOBILE_TOP10_2024: OwaspMobileCategory[] = [
  {
    id: "M1",
    name: "Improper Credential Usage",
    nameEs: "Uso inadecuado de credenciales",
    description: "Credenciales hardcodeadas, almacenadas inseguramente o reutilizadas.",
    severityWeight: 9,
    remediationHours: { min: 24, max: 120 },
    platformRisk: { ios: 1.2, android: 1.4 },
  },
  {
    id: "M2",
    name: "Inadequate Supply Chain Security",
    nameEs: "Seguridad inadecuada de la cadena de suministro",
    description: "SDKs, librerías y dependencias móviles sin validación de seguridad.",
    severityWeight: 8,
    remediationHours: { min: 40, max: 200 },
    platformRisk: { ios: 1.3, android: 1.5 },
  },
  {
    id: "M3",
    name: "Insecure Authentication/Authorization",
    nameEs: "Autenticación/autorización insegura",
    description: "Controles de identidad débiles en apps móviles.",
    severityWeight: 9,
    remediationHours: { min: 32, max: 160 },
    platformRisk: { ios: 1.2, android: 1.3 },
  },
  {
    id: "M4",
    name: "Insufficient Input/Output Validation",
    nameEs: "Validación insuficiente de entrada/salida",
    description: "Datos de usuario no validados en cliente y APIs móviles.",
    severityWeight: 8,
    remediationHours: { min: 24, max: 100 },
    platformRisk: { ios: 1.1, android: 1.2 },
  },
  {
    id: "M5",
    name: "Insecure Communication",
    nameEs: "Comunicación insegura",
    description: "Tráfico sin cifrado adecuado o certificados mal validados.",
    severityWeight: 8,
    remediationHours: { min: 16, max: 80 },
    platformRisk: { ios: 1.1, android: 1.3 },
  },
  {
    id: "M6",
    name: "Inadequate Privacy Controls",
    nameEs: "Controles de privacidad inadecuados",
    description: "Recolección y uso de datos sin controles de privacidad apropiados.",
    severityWeight: 7,
    remediationHours: { min: 32, max: 150 },
    platformRisk: { ios: 1.4, android: 1.2 },
  },
  {
    id: "M7",
    name: "Insufficient Binary Protections",
    nameEs: "Protecciones binarias insuficientes",
    description: "App vulnerable a ingeniería inversa, tampering o debugging.",
    severityWeight: 7,
    remediationHours: { min: 40, max: 200 },
    platformRisk: { ios: 1.2, android: 1.5 },
  },
  {
    id: "M8",
    name: "Security Misconfiguration",
    nameEs: "Configuración insegura",
    description: "Permisos excesivos, debug habilitado o configuración insegura.",
    severityWeight: 6,
    remediationHours: { min: 8, max: 60 },
    platformRisk: { ios: 1.1, android: 1.2 },
  },
  {
    id: "M9",
    name: "Insecure Data Storage",
    nameEs: "Almacenamiento inseguro de datos",
    description: "Datos sensibles almacenados sin cifrado en el dispositivo.",
    severityWeight: 9,
    remediationHours: { min: 24, max: 120 },
    platformRisk: { ios: 1.2, android: 1.4 },
  },
  {
    id: "M10",
    name: "Insufficient Cryptography",
    nameEs: "Criptografía insuficiente",
    description: "Algoritmos débiles, implementación incorrecta o claves expuestas.",
    severityWeight: 8,
    remediationHours: { min: 32, max: 140 },
    platformRisk: { ios: 1.2, android: 1.3 },
  },
];

export function getMobileCategory(id: string): OwaspMobileCategory | undefined {
  return OWASP_MOBILE_TOP10_2024.find((c) => c.id === id);
}