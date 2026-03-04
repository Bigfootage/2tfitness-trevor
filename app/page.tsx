'use client';

import { useEffect, useState, useCallback } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MetricCard from '@/components/dashboard/MetricCard';
import StatsRow from '@/components/dashboard/StatsRow';
import TrendChart from '@/components/dashboard/TrendChart';
import FunnelChart from '@/components/dashboard/FunnelChart';
import PeriodFilterBar from '@/components/ui/PeriodFilterBar';
import GlassCard from '@/components/ui/GlassCard';
import { fetchMetrics, aggregateMetrics } from '@/lib/metrics';
import { DailyMetric, METRIC_DEFINITIONS, PeriodFilter, AggregatedMetrics } from '@/types/metrics';

const EMPTY: AggregatedMetrics = {
  lifestyle_commenters_reached: 0,
  story_poll_voters_reached: 0,
  engaged_followers_reached: 0,
  new_followers_reached: 0,
  follow_ups: 0,
  offers_to_book: 0,
  booking_links_sent: 0,
  calls_booked: 0,
  deals_closed: 0,
};

export default function DashboardPage() {
  const [period, setPeriod] = useState<PeriodFilter>('week');
  const [data, setData] = useState<DailyMetric[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await fetchMetrics(period));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => { load(); }, [load]);

  const agg = data.length ? aggregateMetrics(data) : EMPTY;

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse 90% 45% at 50% -5%, rgba(139,0,0,0.2) 0%, transparent 55%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <DashboardHeader />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-white/90">Performance Overview</h1>
            <p className="text-sm text-white/35 mt-0.5">DM outreach &amp; conversion metrics</p>
          </div>
          <PeriodFilterBar value={period} onChange={setPeriod} />
        </div>

        {loading ? (
          <Skeleton />
        ) : (
          <>
            <StatsRow metrics={agg} dayCount={data.length} />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {METRIC_DEFINITIONS.map((def, i) => (
                <MetricCard key={def.key} definition={def} value={agg[def.key]} index={i} />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlassCard delay={0.3} className="p-6">
                <h2 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-5">Performance Trend</h2>
                {data.length > 1
                  ? <TrendChart data={data} />
                  : <p className="text-sm text-white/25 py-16 text-center">Add more entries to see trends</p>
                }
              </GlassCard>

              <GlassCard delay={0.4} className="p-6">
                <h2 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-5">Conversion Funnel</h2>
                <FunnelChart metrics={agg} />
              </GlassCard>
            </div>
          </>
        )}

        <footer className="pt-6 border-t border-white/5 text-center">
          <p className="text-[10px] text-white/15 tracking-[0.2em] uppercase">
            The Lifestyle Method &nbsp;&middot;&nbsp; DM Performance Tracker
          </p>
        </footer>
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 rounded-xl bg-white/5" />)}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => <div key={i} className="h-36 rounded-2xl bg-white/5" />)}
      </div>
    </div>
  );
}
