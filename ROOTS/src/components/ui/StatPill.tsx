"use client";

import { useEffect, useState } from "react";
import * as Icons from "lucide-react";

interface StatPillProps {
  icon: keyof typeof Icons;
  value: number;
  label: string;
  color: string;
}

export const StatPill = ({ icon, value, label, color }: StatPillProps) => {
  const IconCmp = Icons[icon] as React.ElementType;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    
    // animate up over 1s
    const duration = 1000;
    let startTime: number | null = null;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const pct = Math.min(progress / duration, 1);
      // easeOutQuart
      const ease = 1 - Math.pow(1 - pct, 4);
      setDisplayValue(Math.floor(start + (end - start) * ease));
      if (pct < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);

  return (
    <div className="bg-glass-card px-5 py-4 min-w-[140px] flex flex-col items-center justify-center text-center">
      <IconCmp size={24} style={{ color }} className="mb-2 opacity-90 shadow-lg" />
      <span className="font-display font-bold text-2xl text-[var(--text-primary)]">
        {displayValue.toLocaleString()}
      </span>
      <span className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] mt-1 font-semibold">
        {label}
      </span>
    </div>
  );
};
