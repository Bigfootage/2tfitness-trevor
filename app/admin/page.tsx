'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import MetricForm from '@/components/admin/MetricForm';
import DataTable from '@/components/admin/DataTable';
import TrendChart from '@/components/dashboard/TrendChart';
import FunnelChart from '@/components/dashboard/FunnelChart';
import StatsRow from '@/components/dashboard/StatsRow';
import PeriodFilterBar from '@/components/ui/PeriodFilterBar';
import GlassCard from '@/components/ui/GlassCard';
import { fetchAllMetrics, fetchMetrics, aggregateMetrics } from '@/lib/metrics';
import { DailyMetric, PeriodFilter, AggregatedMetrics } from '@/types/metrics';

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

type Tab = 'entry' | 'data' | 'overview';

const TABS: { key: Tab; label: string }[] = [
  { key: 'entry', label: 'Add / Edit Entry' },
  { key: 'data', label: 'All Data' },
  { key: 'overview', label: 'Dashboard View' },
];

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('entry');
  const [allData, setAllData] = useState<DailyMetric[]>([]);
  const [filteredData, setFilteredData] = useState<DailyMetric[]>([]);
  const [period, setPeriod] = useState<PeriodFilter>('week');
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    try { setAllData(await fetchAllMetrics()); } catch (e) { console.error(e); }
  }, []);

  const loadFiltered = useCallback(async () => {
    setLoading(true);
    try { setFilteredData(await fetchMetrics(period)); } catch (e) { console.error(e); } finally { setLoading(false); }
  }, [period]);

  useEffect(() => { loadAll(); }, [loadAll]);
  useEffect(() => { loadFiltered(); }, [loadFiltered]);

  const refresh = () => { loadAll(); loadFiltered(); };
  const agg = filteredData.length ? aggregateMetrics(filteredData) : EMPTY;

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse 90% 45% at 50% -5%, rgba(120,0,0,0.15) 0%, transparent 55%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <motion.header
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10"
        >
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="The Lifestyle Method" width={180} height={60} className="h-12 w-auto object-contain" priority />
            <div className="h-5 w-px bg-white/15" />
            <span className="text-[11px] font-bold text-red-400 uppercase tracking-widest px-2.5 py-1 rounded-lg bg-red-950/40 border border-red-900/40">
              Admin
            </span>
          </div>
          <p className="text-sm text-white/30">DM Setter Control Panel</p>
        </motion.header>

        <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10 w-fit flex-wrap">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={[
                'px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                tab === t.key
                  ? 'bg-red-700 text-white shadow-[0_0_12px_rgba(185,28,28,0.5)]'
                  : 'text-white/45 hover:text-white/75 hover:bg-white/5',
              ].join(' ')}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'entry' && (
          <GlassCard delay={0.1} className="p-6 sm:p-8">
            <h2 className="text-base font-semibold text-white mb-1">Daily Entry</h2>
            <p className="text-sm text-white/35 mb-6">
              Enter metrics for a date. If an entry already exists it will be loaded automatically for editing.
            </p>
            <MetricForm onSuccess={refresh} />
          </GlassCard>
        )}

        {tab === 'data' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-semibold text-white">All Entries</h2>
              <p className="text-sm text-white/35">{allData.length} {allData.length === 1 ? 'day' : 'days'} tracked</p>
            </div>
            <DataTable data={allData} onRefresh={refresh} />
          </div>
        )}

        {tab === 'overview' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-white">Performance Overview</h2>
                <p className="text-sm text-white/35">Same view Trevor sees</p>
              </div>
              <PeriodFilterBar value={period} onChange={setPeriod} />
            </div>

            {loading ? (
              <div className="animate-pulse grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 rounded-xl bg-white/5" />)}
              </div>
            ) : (
              <>
                <StatsRow metrics={agg} dayCount={filteredData.length} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <GlassCard delay={0.15} className="p-6">
                    <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-5">Performance Trend</h3>
                    {filteredData.length > 1
                      ? <TrendChart data={filteredData} />
                      : <p className="text-sm text-white/25 py-16 text-center">Add more entries to see trends</p>
                    }
                  </GlassCard>
                  <GlassCard delay={0.25} className="p-6">
                    <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-5">Conversion Funnel</h3>
                    <FunnelChart metrics={agg} />
                  </GlassCard>
                </div>
              </>
            )}
          </div>
        )}

        <footer className="pt-6 border-t border-white/5 text-center">
          <p className="text-[10px] text-white/15 tracking-[0.2em] uppercase">
            The Lifestyle Method &nbsp;&middot;&nbsp; Admin Panel
          </p>
        </footer>
      </div>
    </div>
  );
}
