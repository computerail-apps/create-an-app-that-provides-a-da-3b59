import { useAppData } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, CenteredSpinner, Alert, AlertTitle, AlertDescription, Button } from '@/lib/ui';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface MacroSeries {
  unit: string;
  latest: { value: number; date: string };
  history: { date: string; value: number }[];
}

interface Props {
  dataKey: string;
  title: string;
  icon: React.ReactNode;
  mock: MacroSeries;
  higherIsBad?: boolean;
}

export function MacroSeriesCard({ dataKey, title, icon, mock, higherIsBad }: Props) {
  const { data, isLoading, error, refetch } = useAppData<MacroSeries>({
    key: dataKey,
    mock,
    fetchLive: async () => { throw new Error('not wired yet'); },
  });

  const trend = data && data.history.length >= 2
    ? data.history[data.history.length - 1].value - data.history[data.history.length - 2].value
    : 0;
  const isUp = trend > 0;
  const isFlat = trend === 0;
  const badgeVariant = isFlat ? 'default' : (isUp ? (higherIsBad ? 'destructive' : 'success') : (higherIsBad ? 'success' : 'destructive'));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>Latest reading and recent history</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <CenteredSpinner label={`Loading ${title}`} />
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Couldn't load {title}</AlertTitle>
            <AlertDescription className="flex items-center justify-between gap-4">
              <span>{(error as Error).message}</span>
              <Button size="sm" variant="outline" onClick={() => refetch()}>Retry</Button>
            </AlertDescription>
          </Alert>
        ) : !data ? null : (
          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-h1 tabular-nums">{data.latest.value.toFixed(1)}<span className="text-h3 text-muted-foreground ml-1">{data.unit}</span></div>
                <div className="text-micro text-muted-foreground">as of {data.latest.date}</div>
              </div>
              <Badge variant={badgeVariant as any}>
                {isFlat ? <Minus size={12} className="mr-1" /> : isUp ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
                {trend === 0 ? 'flat' : `${trend > 0 ? '+' : ''}${trend.toFixed(1)}`}
              </Badge>
            </div>
            <div className="flex items-end gap-1.5 h-16">
              {data.history.map((h) => {
                const max = Math.max(...data.history.map((x) => x.value));
                const min = Math.min(...data.history.map((x) => x.value));
                const range = max - min || 1;
                const pct = 15 + ((h.value - min) / range) * 85;
                return (
                  <div key={h.date} className="flex-1 flex flex-col items-center gap-1" title={`${h.date}: ${h.value}`}>
                    <div className="w-full rounded-sm bg-primary/70" style={{ height: `${pct}%` }} />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-micro text-muted-foreground tabular-nums">
              <span>{data.history[0]?.date}</span>
              <span>{data.history[data.history.length - 1]?.date}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
