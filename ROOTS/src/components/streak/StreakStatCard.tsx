"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "../ui/GlassCard";
import * as Icons from "lucide-react";

interface StreakStatCardProps {
  icon: keyof typeof Icons;
  label: string;
  value: number;
  color: string;
  suffix?: string;
}

export const StreakStatCard = ({ icon, label, value, color, suffix = "" }: StreakStatCardProps) => {
  const IconCmp = Icons[icon] as React.ElementType;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let frameId: number;
    let start = 0;
    const end = value;
    const duration = 1500;
    let startTime: number | null = null;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const pct = Math.min(progress / duration, 1);
      const ease = 1 - Math.pow(1 - pct, 4);
      setDisplayValue(Math.floor(start + (end - start) * ease));
      if (pct < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [value]);

  return (
    <GlassCard className="flex items-center gap-6 py-6 hover:shadow-[var(--glow-green)] transition-all">
      <div 
        className="w-16 h-16 rounded-2xl flex items-center justify-center border shadow-xl"
        style={{ backgroundColor: `${color}15`, borderColor: `${color}40` }}
      >
        <IconCmp size={32} style={{ color }} className="filter drop-shadow-md" />
      </div>
      <div>
        <div className="font-display font-bold text-4xl mb-1 text-[var(--text-primary)]">
          {displayValue.toLocaleString()}{suffix}
        </div>
        <div className="text-[var(--text-muted)] text-sm font-medium uppercase tracking-wider">
          {label}
        </div>
      </div>
    </GlassCard>
  );
};
