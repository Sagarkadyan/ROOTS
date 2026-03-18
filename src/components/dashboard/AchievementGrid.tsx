"use client";

import { motion } from "framer-motion";
import { GlassCard } from "../ui/GlassCard";
import { SectionTitle } from "../ui/SectionTitle";
import { Lock } from "lucide-react";

export const AchievementGrid = () => {
  const achievements = [
    { title: "First Leaf", xp: 100, emoji: "🌱", unlocked: true },
    { title: "7-Day Streak", xp: 200, emoji: "🔥", unlocked: true },
    { title: "HTML Master", xp: 500, emoji: "🧱", unlocked: true },
    { title: "Night Owl", xp: 150, emoji: "🦉", unlocked: true },
    { title: "Branch Out", xp: 300, emoji: "🌿", unlocked: false },
    { title: "Century Streak", xp: 1000, emoji: "💯", unlocked: false },
    { title: "Full Stack", xp: 2000, emoji: "🏗️", unlocked: false },
    { title: "Tree Top", xp: 5000, emoji: "👑", unlocked: false },
  ];

  return (
    <GlassCard className="h-full">
      <SectionTitle icon="Trophy">Achievements</SectionTitle>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {achievements.map((acc, idx) => (
          <motion.div
            key={idx}
            whileHover={acc.unlocked ? { scale: 1.05 } : {}}
            className={`relative p-4 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
              acc.unlocked 
              ? "bg-[rgba(10,22,40,0.6)] border-[var(--border-glass)] shadow-[0_4px_12px_rgba(74,222,128,0.1)] hover:shadow-[var(--glow-green)] hover:border-[var(--accent-green)] cursor-pointer"
              : "bg-[rgba(10,22,40,0.3)] border-transparent grayscale brightness-50 cursor-not-allowed"
            }`}
          >
            {acc.unlocked && (
              <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[var(--accent-green)] flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#050a0e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            )}
            
            {!acc.unlocked && (
              <div className="absolute inset-0 flex items-center justify-center z-10 bg-[#050a0e]/20 rounded-2xl">
                <Lock className="text-[var(--text-muted)] w-8 h-8 opacity-50" />
              </div>
            )}

            <div className="text-4xl mb-3 filter drop-shadow hover:animate-pulse-glow transition-all">
              {acc.emoji}
            </div>
            <div className="font-bold text-[var(--text-primary)] text-sm mb-1 leading-tight">
              {acc.unlocked ? acc.title : "???"}
            </div>
            {acc.unlocked && (
              <div className="text-[10px] uppercase text-[var(--accent-teal)] font-bold tracking-wider">
                +{acc.xp} XP
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
};
