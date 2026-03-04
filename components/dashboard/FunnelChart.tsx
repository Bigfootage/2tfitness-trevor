'use client';

import { motion } from 'framer-motion';
import { AggregatedMetrics } from '@/types/metrics';
import { totalReach } from '@/lib/metrics';

interface FunnelChartProps {
  metrics: AggregatedMetrics;
}

export default function FunnelChart({ metrics }: FunnelChartProps) {
  const reach = totalReach(metrics);
  const max = Math.max(reach, 1);

  const stages = [
    { label: 'Total Reached', value: reach, color: '#DC2626' },
    { label: 'Follow-Ups', value: metrics.follow_ups, color: '#EF4444' },
    { label: 'Offers to Book', value: metrics.offers_to_book, color: '#F97316' },
    { label: 'Booking Links', value: metrics.booking_links_sent, color: '#FDBA74' },
    { label: 'Calls Booked', value: metrics.calls_booked, color: '#4ADE80' },
    { label: 'Deals Closed', value: metrics.deals_closed, color: '#22C55E' },
  ];

  return (
    <div className="flex flex-col gap-3">
      {stages.map((stage, i) => {
        const barWidth = Math.max((stage.value / max) * 100, stage.value > 0 ? 3 : 0);
        const pct = reach > 0 ? Math.round((stage.value / reach) * 100) : 0;

        return (
          <div key={stage.label} className="flex items-center gap-3">
            <div className="w-28 shrink-0 text-right">
              <span className="text-xs text-white/45">{stage.label}</span>
            </div>
            <div className="flex-1 h-8 bg-white/5 rounded-lg overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${barWidth}%` }}
                transition={{ duration: 0.75, delay: i * 0.09, ease: 'easeOut' }}
                className="h-full rounded-lg absolute inset-y-0 left-0"
                style={{ backgroundColor: stage.color, boxShadow: `0 0 12px ${stage.color}40` }}
              />
              <div className="absolute inset-0 flex items-center justify-between px-3">
                <span className="text-xs font-semibold text-white/90 z-10">
                  {stage.value.toLocaleString()}
                </span>
                {i > 0 && (
                  <span className="text-[10px] text-white/35 z-10">{pct}%</span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
