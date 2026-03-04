'use client';

import { PeriodFilter } from '@/types/metrics';

interface PeriodFilterBarProps {
  value: PeriodFilter;
  onChange: (v: PeriodFilter) => void;
}

const OPTIONS: { value: PeriodFilter; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'all', label: 'All Time' },
];

export default function PeriodFilterBar({ value, onChange }: PeriodFilterBarProps) {
  return (
    <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10 w-fit flex-wrap">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={[
            'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            value === opt.value
              ? 'bg-red-700 text-white shadow-[0_0_12px_rgba(185,28,28,0.5)]'
              : 'text-white/50 hover:text-white/80 hover:bg-white/5',
          ].join(' ')}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
