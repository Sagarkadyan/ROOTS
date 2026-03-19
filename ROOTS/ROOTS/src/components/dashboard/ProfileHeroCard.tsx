"use client";

import { AvatarRing } from "../ui/AvatarRing";
import { StatPill } from "../ui/StatPill";
import { useSession } from "../../hooks/useSession";

export const ProfileHeroCard = () => {
  const { data: session } = useSession();
  const user = session?.user;

  if (!user) return null;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[var(--border-glass)] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      {/* Animated gradient background check in globals.css animate-gradientShift */}
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
              {user.name}
            </h1>
            <p className="text-[var(--text-muted)] font-medium text-lg mb-1">
              {user.title || "Explorer"}
            </p>
            <p className="text-sm text-[var(--accent-teal)]">
              {user.memberSince || "New Seedling"}
            </p>
            {user.email && (
              <p className="text-xs text-[var(--text-muted)] mt-2 opacity-60 flex items-center gap-1.5 transition-all w-fit hover:opacity-100 group">
                <span className="grayscale group-hover:grayscale-0 transition-all">
                  📧
                </span>
                <a
                  href={`mailto:${user.email}`}
                  className="hover:text-[var(--text-primary)] hover:underline decoration-[var(--border-glass)] underline-offset-4"
                >
                  {user.email}
                </a>
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 justify-center mt-6 md:mt-0">
          <StatPill
            icon="Sprout"
            value={user.xp}
            label="Experience Points"
            color="var(--accent-green)"
          />
          <StatPill
            icon="CheckCircle2"
            value={0}
            label="Courses Completed"
            color="var(--accent-teal)"
          />
          <StatPill
            icon="Flame"
            value={user.streak}
            label="Day Streak"
            color="#f59e0b"
          />
        </div>
      </div>
    </div>
  );
};
