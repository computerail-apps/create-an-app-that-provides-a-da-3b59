import { useAppData } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CenteredSpinner, Alert, AlertTitle, AlertDescription, Button } from '@/lib/ui';

export interface TreasuryData {
  asOf: string;
  maturities: { label: string; latest: number; history: number[] }[];
}

interface Props {
  dataKey: string;
  icon: React.ReactNode;
  mock: TreasuryData;
}

export function TreasuryYieldCard({ dataKey, icon, mock }: Props) {
  const { data, isLoading, error, refetch } = useAppData<TreasuryData>({
    key: dataKey,
    mock,
    fetchLive: async () => { throw new Error('not wired yet'); },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          Treasury Yield Curve
        </CardTitle>
        <CardDescription>{data ? `As of ${data.asOf}` : 'Latest par yields across maturities'}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <CenteredSpinner label="Loading yield curve" />
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Couldn't load Treasury yields</AlertTitle>
            <AlertDescription className="flex items-center justify-between gap-4">
              <span>{(error as Error).message}</span>
              <Button size="sm" variant="outline" onClick={() => refetch()}>Retry</Button>
            </AlertDescription>
          </Alert>
        ) : !data ? null : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {data.maturities.map((m) => {
              const prev = m.history[m.history.length - 2] ?? m.latest;
              const delta = m.latest - prev;
              const max = Math.max(...m.history);
              const min = Math.min(...m.history);
              const range = max - min || 1;
              return (
                <div key={m.label} className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-small text-muted-foreground">{m.label}</span>
                    <span className={`text-micro tabular-nums ${delta > 0 ? 'text-success' : delta < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {delta === 0 ? '—' : `${delta > 0 ? '+' : ''}${delta.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="text-h2 tabular-nums">{m.latest.toFixed(2)}%</div>
                  <div className="flex items-end gap-1 h-10">
                    {m.history.map((v, i) => {
                      const pct = 15 + ((v - min) / range) * 85;
                      return <div key={i} className="flex-1 rounded-sm bg-primary/60" style={{ height: `${pct}%` }} />;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
