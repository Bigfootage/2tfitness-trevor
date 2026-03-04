'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  onClick?: () => void;
  glow?: boolean;
}

export default function GlassCard({ children, className = '', delay = 0, onClick, glow = false }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
      onClick={onClick}
      className={[
        'relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md',
        glow ? 'shadow-[0_0_40px_rgba(180,0,0,0.12)]' : 'shadow-lg',
        onClick ? 'cursor-pointer hover:border-red-700/40 hover:bg-white/[0.07] transition-all duration-200' : '',
        className,
      ].join(' ')}
    >
      {glow && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-900/10 to-transparent pointer-events-none" />
      )}
      {children}
    </motion.div>
  );
}
