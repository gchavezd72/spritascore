import type { Recommendation } from "@/types/calculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PRIORITY_VARIANTS = {
  critica: "critico" as const,
  alta: "alto" as const,
  media: "moderado" as const,
  baja: "bajo" as const,
};

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  return (
    <Card className="border-slate-200 hover:border-brand-navy/20 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant={PRIORITY_VARIANTS[recommendation.priority]}>
            {recommendation.priority.charAt(0).toUpperCase() + recommendation.priority.slice(1)}
          </Badge>
          <Badge variant="outline">{recommendation.timeframe.replace("-", " ")}</Badge>
          <Badge variant="outline">{recommendation.area}</Badge>
        </div>
        <CardTitle className="text-base">{recommendation.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600 mb-3">{recommendation.description}</p>
        <div className="flex gap-4 text-xs text-slate-500">
          <span>Esfuerzo: <strong>{recommendation.effort}</strong></span>
          <span>Impacto: <strong>{recommendation.impact}</strong></span>
          <span>Tipo: <strong>{recommendation.type}</strong></span>
        </div>
      </CardContent>
    </Card>
  );
}