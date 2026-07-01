export interface QualityDimension {
  id: string;
  name: string;
  nameEs: string;
  iso9126Mapping?: string;
  description: string;
  weight: number;
}

export const ISO_25010_DIMENSIONS: QualityDimension[] = [
  {
    id: "functional-suitability",
    name: "Functional Suitability",
    nameEs: "Adecuación funcional",
    iso9126Mapping: "Funcionalidad",
    description: "Grado en que el software proporciona funciones que satisfacen necesidades declaradas.",
    weight: 1.0,
  },
  {
    id: "performance-efficiency",
    name: "Performance Efficiency",
    nameEs: "Eficiencia de desempeño",
    iso9126Mapping: "Eficiencia",
    description: "Rendimiento relativo a cantidad de recursos utilizados.",
    weight: 1.1,
  },
  {
    id: "compatibility",
    name: "Compatibility",
    nameEs: "Compatibilidad",
    description: "Capacidad de intercambiar información con otros sistemas.",
    weight: 0.9,
  },
  {
    id: "usability",
    name: "Usability",
    nameEs: "Usabilidad",
    iso9126Mapping: "Usabilidad",
    description: "Facilidad de uso y aprendizaje para usuarios objetivo.",
    weight: 0.8,
  },
  {
    id: "reliability",
    name: "Reliability",
    nameEs: "Fiabilidad",
    iso9126Mapping: "Confiabilidad",
    description: "Capacidad de funcionar bajo condiciones especificadas por un período.",
    weight: 1.3,
  },
  {
    id: "security",
    name: "Security",
    nameEs: "Seguridad",
    description: "Protección contra accesos no autorizados y vulnerabilidades.",
    weight: 1.5,
  },
  {
    id: "maintainability",
    name: "Maintainability",
    nameEs: "Mantenibilidad",
    iso9126Mapping: "Mantenibilidad",
    description: "Facilidad de modificar, corregir y evolucionar el software.",
    weight: 1.4,
  },
  {
    id: "portability",
    name: "Portability",
    nameEs: "Portabilidad",
    iso9126Mapping: "Portabilidad",
    description: "Capacidad de transferirse de un entorno a otro.",
    weight: 0.9,
  },
];

export const CRITICALITY_FACTORS: Record<string, number> = {
  bajo: 1.0,
  medio: 1.3,
  alto: 1.7,
  critico: 2.2,
};

export const MATURITY_FACTORS: Record<string, number> = {
  alta: 0.8,
  media: 1.2,
  baja: 1.6,
  critica: 2.0,
};

export function getQualityMaturityLevel(avgScore: number): string {
  if (avgScore >= 4) return "alta";
  if (avgScore >= 3) return "media";
  if (avgScore >= 2) return "baja";
  return "critica";
}

export function dimensionRiskScore(rating: number, weight: number): number {
  // rating 1 = worst (5 risk), rating 5 = best (0 risk)
  return ((5 - rating) / 4) * 100 * weight;
}