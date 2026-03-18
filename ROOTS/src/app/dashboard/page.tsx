"use client";

import { Sidebar } from "../../components/layout/Sidebar";
import { ProfileHeroCard } from "../../components/dashboard/ProfileHeroCard";
import { LearningPathCard } from "../../components/dashboard/LearningPathCard";
import { DailyGoalCard } from "../../components/dashboard/DailyGoalCard";
import { ActivityFeed } from "../../components/dashboard/ActivityFeed";
import { AchievementGrid } from "../../components/dashboard/AchievementGrid";
import { ChatToggleButton } from "../../components/chat/ChatToggleButton";
import { ChatPanel } from "../../components/chat/ChatPanel";
import { useState } from "react";

export default function DashboardPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[var(--bg-deep)] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-[1200px] mx-auto space-y-8 pb-32">
          
          <ProfileHeroCard />
          
          <div className="flex flex-col xl:flex-row gap-8">
            <div className="flex-[2] min-w-0">
              <LearningPathCard />
            </div>
            <div className="flex-[1] min-w-0">
              <DailyGoalCard />
            </div>
          </div>
          
          <div className="flex flex-col xl:flex-row gap-8">
            <div className="flex-1 min-w-0">
              <ActivityFeed />
            </div>
            <div className="flex-1 min-w-0">
              <AchievementGrid />
            </div>
          </div>

        </div>
      </main>

      <ChatToggleButton onClick={() => setIsChatOpen(!isChatOpen)} />
      {isChatOpen && <ChatPanel onClose={() => setIsChatOpen(false)} />}
    </div>
  );
}
