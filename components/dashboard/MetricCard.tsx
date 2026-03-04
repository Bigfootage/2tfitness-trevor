'use client';

import { motion } from 'framer-motion';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import { MetricDefinition } from '@/types/metrics';

interface MetricCardProps {
  definition: MetricDefinition;
  value: number;
  index: number;
}

export default function MetricCard({ definition, value, index }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.055, ease: 'easeOut' }}
      className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 flex flex-col gap-3 hover:scale-[1.02] hover:border-white/20 transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <div
          className="w-3 h-3 rounded-full mt-0.5 flex-shrink-0"
          style={{ backgroundColor: definition.color, boxShadow: `0 0 8px ${definition.color}80` }}
        />
        <div
          className="text-[11px] font-semibold px-2 py-0.5 rounded-full border"
          style={{
            color: definition.color,
            borderColor: `${definition.color}40`,
            backgroundColor: `${definition.color}15`,
          }}
        >
          TOTAL
        </div>
      </div>

      <AnimatedNumber value={value} className="text-4xl font-bold text-white tabular-nums" />

      <div>
        <p className="text-sm font-medium text-white/70 leading-snug">{definition.label}</p>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
      <p className="text-xs text-white/30">{definition.description}</p>
    </motion.div>
  );
}
