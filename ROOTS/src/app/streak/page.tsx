"use client";

import { Sidebar } from "../../components/layout/Sidebar";
import { StreakStatCard } from "../../components/streak/StreakStatCard";
import { ChatToggleButton } from "../../components/chat/ChatToggleButton";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useSession } from "../../hooks/useSession";

const FlameHero = dynamic(() => import("../../components/streak/FlameHero").then(mod => mod.FlameHero), {
  loading: () => <div className="h-64 animate-pulse bg-glass-card rounded-3xl" />,
  ssr: false
});

const HeatmapGrid = dynamic(() => import("../../components/streak/HeatmapGrid").then(mod => mod.HeatmapGrid), {
  loading: () => <div className="h-[400px] animate-pulse bg-glass-card rounded-3xl" />,
  ssr: false
});

const WeeklyBarChart = dynamic(() => import("../../components/streak/WeeklyBarChart").then(mod => mod.WeeklyBarChart), {
  loading: () => <div className="h-[400px] animate-pulse bg-glass-card rounded-3xl" />,
  ssr: false
});

const ChatPanel = dynamic(() => import("../../components/chat/ChatPanel").then(mod => mod.ChatPanel), {
  ssr: false
});

export default function StreakPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="flex h-screen bg-[var(--bg-deep)] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-[1000px] mx-auto space-y-8 pb-32">
          
          <FlameHero />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StreakStatCard icon="Flame" label="Longest Streak Ever" value={user?.longestStreak || 0} color="#f59e0b" suffix=" days" />
            <StreakStatCard icon="Zap" label="Total XP Earned" value={user?.totalXPEarned || 0} color="var(--accent-teal)" />
            <StreakStatCard icon="Calendar" label="Sessions This Month" value={user?.sessionsThisMonth || 0} color="var(--accent-green)" />
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
