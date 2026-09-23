import { Badge } from '@/lib/ui';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { WeeklyTrend } from '@/pages/Trends';

export function WeeklyHistoryTable({ rows }: { rows: WeeklyTrend[] }) {
  return (
    <ul className="divide-y divide-border">
      {rows.map((r, i) => {
        const isUp = r.change_pct > 0;
        const isFlat = r.change_pct === 0;
        return (
          <li key={r.indicator + r.period_end + i} className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex-1 min-w-0">
              <div className="text-body text-foreground">{r.indicator}</div>
              <div className="text-micro text-muted-foreground">{r.period_start} – {r.period_end}</div>
            </div>
            <div className="text-small tabular-nums text-muted-foreground">
              {r.start_value.toFixed(2)}{r.unit} → {r.end_value.toFixed(2)}{r.unit}
            </div>
            <Badge variant={isFlat ? 'default' : isUp ? 'success' : 'destructive'}>
              {isFlat ? <Minus size={12} className="mr-1" /> : isUp ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
              {isFlat ? 'flat' : `${r.change_pct > 0 ? '+' : ''}${r.change_pct.toFixed(2)}%`}
            </Badge>
          </li>
        );
      })}
    </ul>
  );
}
