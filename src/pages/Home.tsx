import { useMemo } from 'react';
import { useAppData } from '@/lib/data';
import { Newspaper, TrendingUp, Landmark, Globe2, Briefcase, RefreshCw } from 'lucide-react';
import { CenteredSpinner, Alert, AlertTitle, AlertDescription, Button, EmptyState } from '@/lib/ui';
import { NewsThemeSection } from '@/components/NewsThemeSection';

export interface Article {
  title: string;
  url: string;
  domain: string;
  seendate: string;
  theme: 'inflation' | 'central_banks' | 'trade' | 'jobs' | 'growth';
}

const now = Date.now();
const hoursAgo = (h: number) => new Date(now - h * 3600 * 1000).toISOString();

const mockArticles: Article[] = [
  { title: 'US core inflation eases to 3.1% as shelter costs cool', url: 'https://www.reuters.com/markets/us/', domain: 'reuters.com', seendate: hoursAgo(2), theme: 'inflation' },
  { title: 'Eurozone inflation ticks up on energy base effects', url: 'https://www.ft.com/content/eurozone-inflation', domain: 'ft.com', seendate: hoursAgo(4), theme: 'inflation' },
  { title: 'Japan inflation holds above BOJ target for 18th month', url: 'https://www.bloomberg.com/asia/inflation', domain: 'bloomberg.com', seendate: hoursAgo(7), theme: 'inflation' },
  { title: 'Fed officials signal patience on rate cuts amid sticky prices', url: 'https://www.wsj.com/economy/fed', domain: 'wsj.com', seendate: hoursAgo(1), theme: 'central_banks' },
  { title: 'ECB holds rates steady, Lagarde flags data-dependent path', url: 'https://www.reuters.com/business/ecb', domain: 'reuters.com', seendate: hoursAgo(5), theme: 'central_banks' },
  { title: 'Bank of England splits 5-4 on hold decision', url: 'https://www.bbc.com/news/business', domain: 'bbc.com', seendate: hoursAgo(9), theme: 'central_banks' },
  { title: 'PBOC injects liquidity to support slowing credit growth', url: 'https://www.scmp.com/economy/china', domain: 'scmp.com', seendate: hoursAgo(12), theme: 'central_banks' },
  { title: 'US-EU trade talks resume on steel tariff exemptions', url: 'https://www.politico.eu/trade', domain: 'politico.eu', seendate: hoursAgo(3), theme: 'trade' },
  { title: 'China exports rebound as global demand firms', url: 'https://www.cnbc.com/china-exports', domain: 'cnbc.com', seendate: hoursAgo(6), theme: 'trade' },
  { title: 'Red Sea shipping disruptions push freight rates higher', url: 'https://www.reuters.com/business/shipping', domain: 'reuters.com', seendate: hoursAgo(10), theme: 'trade' },
  { title: 'US job openings fall to three-year low, signaling cooling demand', url: 'https://www.bls.gov/news.release/jolts', domain: 'bls.gov', seendate: hoursAgo(2), theme: 'jobs' },
  { title: 'Weekly jobless claims tick higher but remain historically low', url: 'https://www.marketwatch.com/jobs', domain: 'marketwatch.com', seendate: hoursAgo(8), theme: 'jobs' },
  { title: 'Eurozone unemployment holds at record low 6.4%', url: 'https://www.euronews.com/business', domain: 'euronews.com', seendate: hoursAgo(14), theme: 'jobs' },
  { title: 'IMF trims global growth outlook on trade friction', url: 'https://www.imf.org/en/news', domain: 'imf.org', seendate: hoursAgo(3), theme: 'growth' },
  { title: 'China Q4 GDP beats estimates on stimulus-driven demand', url: 'https://www.bloomberg.com/china-gdp', domain: 'bloomberg.com', seendate: hoursAgo(11), theme: 'growth' },
  { title: 'US Q4 GDP growth revised up to 3.2% annualized', url: 'https://www.reuters.com/markets/us-gdp', domain: 'reuters.com', seendate: hoursAgo(16), theme: 'growth' },
];

const THEME_META: Record<Article['theme'], { label: string; icon: React.ReactNode }> = {
  inflation: { label: 'Inflation', icon: <TrendingUp size={16} /> },
  central_banks: { label: 'Central Banks', icon: <Landmark size={16} /> },
  trade: { label: 'Trade', icon: <Globe2 size={16} /> },
  jobs: { label: 'Jobs', icon: <Briefcase size={16} /> },
  growth: { label: 'Growth', icon: <RefreshCw size={16} /> },
};

const THEME_ORDER: Article['theme'][] = ['inflation', 'central_banks', 'trade', 'jobs', 'growth'];

export default function Home() {
  const { data, isLoading, error, refetch } = useAppData<Article[]>({
    key: 'gdelt-daily-news',
    mock: mockArticles,
    fetchLive: async () => { throw new Error('not wired yet'); },
  });

  const grouped = useMemo(() => {
    const map = new Map<Article['theme'], Article[]>();
    for (const t of THEME_ORDER) map.set(t, []);
    (data ?? []).forEach((a) => { map.get(a.theme)?.push(a); });
    return map;
  }, [data]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-display">Today's Global Economic Digest</h1>
        <p className="text-body text-muted-foreground max-w-2xl">
          Live headlines from GDELT DOC 2.0, grouped by macro theme. Refreshed continuously across the day.
        </p>
      </div>

      {isLoading ? (
        <CenteredSpinner label="Fetching latest headlines" />
      ) : error ? (
        <Alert variant="destructive">
          <AlertTitle>Couldn't load the news digest</AlertTitle>
          <AlertDescription className="flex items-center justify-between gap-4">
            <span>{(error as Error).message}</span>
            <Button size="sm" variant="outline" onClick={() => refetch()}>Retry</Button>
          </AlertDescription>
        </Alert>
      ) : !data || data.length === 0 ? (
        <EmptyState icon={<Newspaper size={40} />} title="No headlines yet" description="Check back shortly for today's coverage." />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {THEME_ORDER.map((theme) => (
            <NewsThemeSection
              key={theme}
              label={THEME_META[theme].label}
              icon={THEME_META[theme].icon}
              articles={grouped.get(theme) ?? []}
            />
          ))}
        </div>
      )}
    </div>
  );
}
