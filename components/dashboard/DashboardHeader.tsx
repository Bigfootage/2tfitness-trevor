'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function DashboardHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10"
    >
      <Image
        src="/logo.png"
        alt="The Lifestyle Method"
        width={200}
        height={67}
        className="h-14 w-auto object-contain"
        priority
      />
      <div className="sm:text-right">
        <p className="text-[10px] text-white/25 uppercase tracking-[0.2em]">DM Performance Dashboard</p>
        <p className="text-sm text-white/45 mt-0.5">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
    </motion.header>
  );
}
