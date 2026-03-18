"use client";

import { Sidebar } from "../../components/layout/Sidebar";
import { FlameHero } from "../../components/streak/FlameHero";
import { HeatmapGrid } from "../../components/streak/HeatmapGrid";
import { WeeklyBarChart } from "../../components/streak/WeeklyBarChart";
import { StreakStatCard } from "../../components/streak/StreakStatCard";
import { ChatToggleButton } from "../../components/chat/ChatToggleButton";
import { ChatPanel } from "../../components/chat/ChatPanel";
import { useState } from "react";
import { mockUser } from "../../lib/mockUser";

export default function StreakPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[var(--bg-deep)] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-[1000px] mx-auto space-y-8 pb-32">
          
          <FlameHero />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StreakStatCard icon="Flame" label="Longest Streak Ever" value={mockUser.longestStreak} color="#f59e0b" suffix=" days" />
            <StreakStatCard icon="Zap" label="Total XP Earned" value={mockUser.totalXPEarned} color="var(--accent-teal)" />
            <StreakStatCard icon="Calendar" label="Sessions This Month" value={mockUser.sessionsThisMonth} color="var(--accent-green)" />
          </div>
          
          <div className="flex flex-col xl:flex-row gap-8">
            <div className="flex-[2] min-w-0">
              <HeatmapGrid />
            </div>
            <div className="flex-[1] min-w-0">
              <WeeklyBarChart />
            </div>
          </div>

        </div>
      </main>

      <ChatToggleButton onClick={() => setIsChatOpen(!isChatOpen)} />
      {isChatOpen && <ChatPanel onClose={() => setIsChatOpen(false)} />}
    </div>
  );
}
