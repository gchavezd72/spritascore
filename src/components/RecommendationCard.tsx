import type { Locale, Recommendation } from "@/types/calculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getTranslations } from "@/i18n";
import { tr } from "@/lib/translate";
import { useTranslations } from "@/components/LanguageProvider";

const PRIORITY_VARIANTS = {
  critica: "critico" as const,
  alta: "alto" as const,
  media: "moderado" as const,
  baja: "bajo" as const,
};

interface RecommendationCardProps {
  recommendation: Recommendation;
  reportLocale?: Locale;
}

export function RecommendationCard({ recommendation, reportLocale }: RecommendationCardProps) {
  const { locale: uiLocale } = useTranslations();
  const locale = reportLocale ?? uiLocale;
  const rc = getTranslations(locale).recommendationCard;

  return (
    <Card className="lift hover:border-brand-green/30">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant={PRIORITY_VARIANTS[recommendation.priority]}>
            {rc.priorityLabels[recommendation.priority]}
          </Badge>
          <Badge variant="outline">{rc.timeframeLabels[recommendation.timeframe]}</Badge>
          <Badge variant="outline">{rc.areaLabels[recommendation.area]}</Badge>
        </div>
        <CardTitle className="text-base">{tr(recommendation.title, locale)}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">{tr(recommendation.description, locale)}</p>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span>{rc.effort}: <strong>{rc.effortLabels[recommendation.effort]}</strong></span>
          <span>{rc.impact}: <strong>{rc.impactLabels[recommendation.impact]}</strong></span>
          <span>{rc.type}: <strong>{rc.typeLabels[recommendation.type]}</strong></span>
        </div>
      </CardContent>
    </Card>
  );
}
