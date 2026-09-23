import { Briefcase, Percent, Landmark } from 'lucide-react';
import { MacroSeriesCard } from '@/components/MacroSeriesCard';
import { TreasuryYieldCard } from '@/components/TreasuryYieldCard';
import type { MacroSeries } from '@/components/MacroSeriesCard';
import type { TreasuryData } from '@/components/TreasuryYieldCard';

const unemploymentMock: MacroSeries = {
  unit: '%',
  latest: { value: 4.1, date: '2025-01-10' },
  history: [
    { date: '2024-08-02', value: 4.2 },
    { date: '2024-09-06', value: 4.2 },
    { date: '2024-10-04', value: 4.1 },
    { date: '2024-11-01', value: 4.1 },
    { date: '2024-12-06', value: 4.2 },
    { date: '2025-01-10', value: 4.1 },
  ],
};

const cpiMock: MacroSeries = {
  unit: '% YoY',
  latest: { value: 2.9, date: '2025-01-14' },
  history: [
    { date: '2024-08-14', value: 3.4 },
    { date: '2024-09-11', value: 3.3 },
    { date: '2024-10-10', value: 3.2 },
    { date: '2024-11-13', value: 3.1 },
    { date: '2024-12-11', value: 3.0 },
    { date: '2025-01-14', value: 2.9 },
  ],
};

const treasuryMock: TreasuryData = {
  asOf: '2025-01-17',
  maturities: [
    { label: '2 Yr', latest: 4.28, history: [4.35, 4.32, 4.30, 4.29, 4.28] },
    { label: '10 Yr', latest: 4.62, history: [4.48, 4.51, 4.55, 4.58, 4.62] },
    { label: '30 Yr', latest: 4.79, history: [4.68, 4.70, 4.73, 4.76, 4.79] },
  ],
};

export default function Macro() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-display">U.S. Macroeconomic Dashboard</h1>
        <p className="text-body text-muted-foreground max-w-2xl">
          Latest readings sourced directly from BLS and the U.S. Treasury Fiscal Data API, with short historical trails.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <MacroSeriesCard
          dataKey="bls-unemployment-rate"
          title="Unemployment Rate"
          icon={<Briefcase size={18} />}
          mock={unemploymentMock}
          higherIsBad
        />
        <MacroSeriesCard
          dataKey="bls-cpi-yoy"
          title="CPI (YoY)"
          icon={<Percent size={18} />}
          mock={cpiMock}
          higherIsBad
        />
      </div>

      <TreasuryYieldCard dataKey="treasury-yield-curve" icon={<Landmark size={18} />} mock={treasuryMock} />
    </div>
  );
}
