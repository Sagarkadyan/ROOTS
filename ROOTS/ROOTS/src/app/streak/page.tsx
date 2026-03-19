"use client";

import { Sidebar } from "../../components/layout/Sidebar";
import { FlameHero } from "../../components/streak/FlameHero";
import { HeatmapGrid } from "../../components/streak/HeatmapGrid";
import { WeeklyBarChart } from "../../components/streak/WeeklyBarChart";
import { StreakStatCard } from "../../components/streak/StreakStatCard";
import { ChatToggleButton } from "../../components/chat/ChatToggleButton";
import { ChatPanel } from "../../components/chat/ChatPanel";
import { useState, useEffect } from "react";

interface UserData {
  name: string;
  streak: number;
  longestStreak: number;
  totalXPEarned: number;
  sessionsThisMonth: number;
}

export default function StreakPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/session")
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setUserData(data.user);
        }
      })
      .catch(err => console.error("Failed to fetch session", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen bg-[var(--bg-deep)] items-center justify-center">
        <div className="w-12 h-12 border-4 border-[var(--accent-green)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[var(--bg-deep)] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-[1000px] mx-auto space-y-8 pb-32">
          
          <FlameHero streak={userData?.streak || 0} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StreakStatCard icon="Flame" label="Longest Streak Ever" value={userData?.longestStreak || 0} color="#f59e0b" suffix=" days" />
            <StreakStatCard icon="Zap" label="Total XP Earned" value={userData?.totalXPEarned || 0} color="var(--accent-teal)" />
            <StreakStatCard icon="Calendar" label="Sessions This Month" value={userData?.sessionsThisMonth || 0} color="var(--accent-green)" />
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
