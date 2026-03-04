'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  className?: string;
}

export default function AnimatedNumber({ value, duration = 1000, className = '' }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const startRef = useRef(0);

  useEffect(() => {
    if (!inView) return;
    const from = startRef.current;
    const to = value;
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (to - from) * ease));
      if (p < 1) requestAnimationFrame(step);
      else startRef.current = to;
    };
    requestAnimationFrame(step);
  }, [value, inView, duration]);

  return <span ref={ref} className={className}>{display.toLocaleString()}</span>;
}
