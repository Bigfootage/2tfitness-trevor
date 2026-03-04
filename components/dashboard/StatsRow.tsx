'use client';

import { motion } from 'framer-motion';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import { AggregatedMetrics } from '@/types/metrics';
import { totalReach, conversionRate } from '@/lib/metrics';

interface StatsRowProps {
  metrics: AggregatedMetrics;
  dayCount: number;
}

export default function StatsRow({ metrics, dayCount }: StatsRowProps) {
  const reach = totalReach(metrics);
  const rate = conversionRate(metrics);

  const stats = [
    { label: 'Total Reached', value: reach },
    { label: 'Calls Booked', value: metrics.calls_booked },
    { label: 'Deals Closed', value: metrics.deals_closed },
    { label: 'Days Tracked', value: dayCount },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: i * 0.06 }}
          className="rounded-xl border border-red-900/30 bg-red-950/20 backdrop-blur-sm p-4 text-center"
        >
          <div className="text-3xl font-bold text-white tabular-nums">
            <AnimatedNumber value={s.value} />
          </div>
          <div className="text-xs text-white/40 mt-1 uppercase tracking-wider">{s.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
