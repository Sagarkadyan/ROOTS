"use client";

import { AvatarRing } from "../ui/AvatarRing";
import { StatPill } from "../ui/StatPill";
import { useSession } from "../../hooks/useSession";

export const ProfileHeroCard = () => {
  const { data: session, status } = useSession();
  const user = session?.user;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[var(--border-glass)] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      <div
        className="absolute inset-0 z-0 opacity-40 bg-[length:200%_200%]"
        style={{
          background:
            "linear-gradient(-45deg, #050a0e, #0a1628, #113620, #0c2b33)",
          animation: "gradientShift 15s ease infinite",
        }}
      />
      <div className="absolute inset-0 bg-[#050a0e]/60 backdrop-blur-md z-0" />

      <div className="relative z-10 p-8 flex flex-col md:flex-row items-center gap-8 justify-between">
        <div className="flex items-center gap-6">
          <AvatarRing size={80} />
          <div>
            <h1 className="font-display font-bold text-3xl text-[var(--text-primary)] mb-1">
              {status === "loading" ? "..." : user?.name || "Explorer"}
            </h1>
            <p className="text-[var(--text-muted)] font-medium text-lg mb-1">
              {user?.title || "Aspiring Developer"}
            </p>
            <p className="text-sm text-[var(--accent-teal)]">
              {user?.memberSince || "New Member"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 justify-center mt-6 md:mt-0">
          <StatPill
            icon="Sprout"
            value={user?.xp || 0}
            label="Experience Points"
            color="var(--accent-green)"
          />
          <StatPill
            icon="CheckCircle2"
            value={user?.completedCourses || 0}
            label="Courses Completed"
            color="var(--accent-teal)"
          />
          <StatPill
            icon="Flame"
            value={user?.streakTracker || 0}
            label="Day Streak"
            color="#f59e0b"
          />
        </div>
      </div>
    </div>
  );
};
