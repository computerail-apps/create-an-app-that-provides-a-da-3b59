import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/lib/ui';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { WeeklyTrend } from '@/pages/Trends';

export function TrendSummaryCard({ trend }: { trend: WeeklyTrend }) {
  const isUp = trend.change_pct > 0;
  const isFlat = trend.change_pct === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{trend.indicator}</span>
          <Badge variant={isFlat ? 'default' : isUp ? 'success' : 'destructive'}>
            {isFlat ? <Minus size={12} className="mr-1" /> : isUp ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
            {isFlat ? 'flat' : `${trend.change_pct > 0 ? '+' : ''}${trend.change_pct.toFixed(2)}%`}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-4 text-body tabular-nums">
          <span className="text-muted-foreground">{trend.start_value.toFixed(2)}{trend.unit}</span>
          <span className="text-muted-foreground">→</span>
          <span className="text-foreground font-medium">{trend.end_value.toFixed(2)}{trend.unit}</span>
          <span className="ml-auto text-micro text-muted-foreground">{trend.period_start} – {trend.period_end}</span>
        </div>
        <p className="text-small text-muted-foreground leading-relaxed">{trend.summary_text}</p>
      </CardContent>
    </Card>
  );
}
