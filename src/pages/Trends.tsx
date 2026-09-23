import { useAppData } from '@/lib/data';
import { CenteredSpinner, Alert, AlertTitle, AlertDescription, Button, EmptyState, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/lib/ui';
import { TrendingUp, History } from 'lucide-react';
import { TrendSummaryCard } from '@/components/TrendSummaryCard';
import { WeeklyHistoryTable } from '@/components/WeeklyHistoryTable';

export interface WeeklyTrend {
  indicator: string;
  period_start: string;
  period_end: string;
  start_value: number;
  end_value: number;
  change_pct: number;
  unit: string;
  summary_text: string;
}

const computedMock: WeeklyTrend[] = [
  {
    indicator: 'Unemployment Rate',
    period_start: '2025-01-03',
    period_end: '2025-01-10',
    start_value: 4.2,
    end_value: 4.1,
    change_pct: -2.38,
    unit: '%',
    summary_text: 'Unemployment eased from 4.2% to 4.1% week over week, a 2.4% relative decline, suggesting continued labor market resilience heading into the new year.',
  },
  {
    indicator: 'CPI (YoY)',
    period_start: '2024-12-11',
    period_end: '2025-01-14',
    start_value: 3.0,
    end_value: 2.9,
    change_pct: -3.33,
    unit: '% YoY',
    summary_text: 'Headline CPI inflation cooled from 3.0% to 2.9% year-over-year, a 3.3% relative decline, extending the disinflation trend seen since mid-2024.',
  },
  {
    indicator: '10 Yr Treasury Yield',
    period_start: '2025-01-10',
    period_end: '2025-01-17',
    start_value: 4.58,
    end_value: 4.62,
    change_pct: 0.87,
    unit: '%',
    summary_text: '10-year Treasury yields rose from 4.58% to 4.62%, up 0.9% on the week, as markets priced in a slower pace of policy easing.',
  },
  {
    indicator: '2 Yr Treasury Yield',
    period_start: '2025-01-10',
    period_end: '2025-01-17',
    start_value: 4.29,
    end_value: 4.28,
    change_pct: -0.23,
    unit: '%',
    summary_text: '2-year yields held roughly flat, slipping from 4.29% to 4.28%, reflecting stable near-term rate expectations.',
  },
];

const historyMock: WeeklyTrend[] = [
  { indicator: 'Unemployment Rate', period_start: '2024-12-06', period_end: '2024-12-13', start_value: 4.1, end_value: 4.2, change_pct: 2.44, unit: '%', summary_text: 'Unemployment ticked up from 4.1% to 4.2%.' },
  { indicator: 'CPI (YoY)', period_start: '2024-11-13', period_end: '2024-12-11', start_value: 3.1, end_value: 3.0, change_pct: -3.23, unit: '% YoY', summary_text: 'CPI eased from 3.1% to 3.0% YoY.' },
  { indicator: '10 Yr Treasury Yield', period_start: '2025-01-03', period_end: '2025-01-10', start_value: 4.51, end_value: 4.58, change_pct: 1.55, unit: '%', summary_text: '10yr yields climbed from 4.51% to 4.58%.' },
  { indicator: '2 Yr Treasury Yield', period_start: '2025-01-03', period_end: '2025-01-10', start_value: 4.32, end_value: 4.29, change_pct: -0.69, unit: '%', summary_text: '2yr yields eased slightly from 4.32% to 4.29%.' },
  { indicator: 'Unemployment Rate', period_start: '2024-11-01', period_end: '2024-12-06', start_value: 4.1, end_value: 4.1, change_pct: 0.0, unit: '%', summary_text: 'Unemployment held steady at 4.1%.' },
  { indicator: 'CPI (YoY)', period_start: '2024-10-10', period_end: '2024-11-13', start_value: 3.2, end_value: 3.1, change_pct: -3.13, unit: '% YoY', summary_text: 'CPI cooled from 3.2% to 3.1% YoY.' },
  { indicator: '30 Yr Treasury Yield', period_start: '2025-01-10', period_end: '2025-01-17', start_value: 4.76, end_value: 4.79, change_pct: 0.63, unit: '%', summary_text: '30yr yields rose from 4.76% to 4.79%.' },
  { indicator: '30 Yr Treasury Yield', period_start: '2025-01-03', period_end: '2025-01-10', start_value: 4.73, end_value: 4.76, change_pct: 0.63, unit: '%', summary_text: '30yr yields rose from 4.73% to 4.76%.' },
];

export default function Trends() {
  const computed = useAppData<WeeklyTrend[]>({
    key: 'weekly-trends-computed',
    mock: computedMock,
    fetchLive: async () => { throw new Error('not wired yet'); },
  });

  const history = useAppData<WeeklyTrend[]>({
    key: 'weekly-summaries-history',
    mock: historyMock,
    fetchLive: async () => { throw new Error('not wired yet'); },
  });

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-display">Weekly Trends</h1>
        <p className="text-body text-muted-foreground max-w-2xl">
          Computed week-over-week percentage changes across BLS and Treasury series, with a narrative recap generated from the underlying numbers.
        </p>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} className="text-primary" />
          <h2 className="text-h2">This Week's Computed Changes</h2>
        </div>
        {computed.isLoading ? (
          <CenteredSpinner label="Computing weekly deltas" />
        ) : computed.error ? (
          <Alert variant="destructive">
            <AlertTitle>Couldn't compute this week's trends</AlertTitle>
            <AlertDescription className="flex items-center justify-between gap-4">
              <span>{(computed.error as Error).message}</span>
              <Button size="sm" variant="outline" onClick={() => computed.refetch()}>Retry</Button>
            </AlertDescription>
          </Alert>
        ) : !computed.data || computed.data.length === 0 ? (
          <EmptyState icon={<TrendingUp size={40} />} title="No computed trends yet" description="Weekly deltas will appear once enough history is available." />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {computed.data.map((t) => (
              <TrendSummaryCard key={t.indicator + t.period_end} trend={t} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <History size={18} className="text-muted-foreground" />
          <h2 className="text-h2">Stored Weekly Summaries</h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Historical comparison</CardTitle>
            <CardDescription>Previously computed weeks, persisted for week-over-week comparison.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {history.isLoading ? (
              <div className="py-12"><CenteredSpinner label="Loading stored summaries" /></div>
            ) : history.error ? (
              <div className="px-6 pb-6">
                <Alert variant="destructive">
                  <AlertTitle>Couldn't load history</AlertTitle>
                  <AlertDescription className="flex items-center justify-between gap-4">
                    <span>{(history.error as Error).message}</span>
                    <Button size="sm" variant="outline" onClick={() => history.refetch()}>Retry</Button>
                  </AlertDescription>
                </Alert>
              </div>
            ) : !history.data || history.data.length === 0 ? (
              <div className="px-6 pb-6">
                <EmptyState icon={<History size={40} />} title="No stored summaries yet" description="Weekly summaries will accumulate here over time." />
              </div>
            ) : (
              <WeeklyHistoryTable rows={history.data} />
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
