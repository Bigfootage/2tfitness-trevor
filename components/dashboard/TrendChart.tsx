'use client';

import { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { DailyMetric, METRIC_DEFINITIONS } from '@/types/metrics';
import { format, parseISO } from 'date-fns';

interface TrendChartProps {
  data: DailyMetric[];
}

const DEFAULT_ACTIVE = new Set(['calls_booked', 'deals_closed', 'offers_to_book', 'booking_links_sent']);

export default function TrendChart({ data }: TrendChartProps) {
  const [active, setActive] = useState<Set<string>>(DEFAULT_ACTIVE);

  const chartData = [...data]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((row) => ({ ...row, _label: format(parseISO(row.date), 'MMM d') }));

  const toggle = (key: string) =>
    setActive((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {METRIC_DEFINITIONS.map((def) => (
          <button
            key={def.key}
            onClick={() => toggle(def.key)}
            className="px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all duration-150"
            style={
              active.has(def.key)
                ? { color: def.color, borderColor: `${def.color}60`, backgroundColor: `${def.color}20` }
                : { color: 'rgba(255,255,255,0.25)', borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'transparent' }
            }
          >
            {def.shortLabel}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="_label" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: 'rgba(15,15,15,0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10,
              fontSize: 12,
              color: '#fff',
            }}
            labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}
          />
          {METRIC_DEFINITIONS.filter((d) => active.has(d.key)).map((def) => (
            <Line
              key={def.key}
              type="monotone"
              dataKey={def.key}
              name={def.shortLabel}
              stroke={def.color}
              strokeWidth={2}
              dot={{ fill: def.color, r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
