"use client";

import { GlassCard } from "../ui/GlassCard";
import { ProgressRing } from "../ui/ProgressRing";
import { SectionTitle } from "../ui/SectionTitle";

export const DailyGoalCard = () => {
  return (
    <GlassCard className="h-full flex flex-col justify-between">
      <div>
        <SectionTitle icon="Target">Daily Goal</SectionTitle>
        <div className="flex flex-col items-center mt-6">
          <ProgressRing percentage={72} size={160} strokeWidth={10} color="var(--accent-green)" />
          <h3 className="font-display font-bold text-xl mt-6">Today&apos;s Goal: 45 min</h3>
          <div className="flex flex-col items-center mt-2 space-y-1">
            <span className="text-[var(--accent-green)] font-medium">32 min studied</span>
            <span className="text-[var(--text-muted)] text-sm">13 min remaining</span>
          </div>
        </div>
      </div>

      <p className="text-center text-sm font-body italic text-[var(--text-muted)] border-t border-[var(--border-glass)] pt-6 mt-6">
         &quot;Trees that are slow to grow bear the best fruit.&quot;
      </p>
    </GlassCard>
  );
};
