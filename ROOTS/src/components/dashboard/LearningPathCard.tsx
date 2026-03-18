"use client";

import { motion } from "framer-motion";
import { GlassCard } from "../ui/GlassCard";
import { SectionTitle } from "../ui/SectionTitle";
import { GlowButton } from "../ui/GlowButton";

export const LearningPathCard = () => {
  const steps = [
    { name: "HTML", progress: 100, color: "var(--accent-green)" },
    { name: "CSS", progress: 85, color: "var(--accent-green)" },
    { name: "JavaScript", progress: 60, color: "var(--accent-green)" },
    { name: "Frameworks", progress: 20, color: "var(--accent-teal)" },
  ];

  return (
    <GlassCard className="h-full flex flex-col justify-between">
      <div>
        <SectionTitle icon="Map">Your Current Path — Web Development</SectionTitle>
        <div className="flex justify-center my-6">
          <svg width="200" height="120" viewBox="0 0 200 120" className="opacity-80">
            {/* Trunk */}
            <path d="M 100 120 L 100 80" stroke="#4a3728" strokeWidth="6" fill="none" />
            <path d="M 100 80 Q 70 50 40 30" stroke="var(--accent-green)" strokeWidth="3" fill="none" />
            <path d="M 100 80 Q 130 50 160 30" stroke="var(--accent-teal)" strokeWidth="3" fill="none" />
            <path d="M 100 80 Q 100 40 100 10" stroke="var(--border-glass)" strokeWidth="3" fill="none" />
            {/* Nodes */}
            <circle cx="40" cy="30" r="10" fill="var(--accent-green)" />
            <circle cx="160" cy="30" r="10" fill="var(--accent-teal)" />
            <circle cx="100" cy="10" r="10" fill="var(--bg-surface)" stroke="var(--border-glass)" />
          </svg>
        </div>
        
        <div className="space-y-4 mb-6">
          {steps.map((step, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-primary)]">{step.name}</span>
                <span style={{ color: step.progress === 100 ? "var(--accent-green)" : "var(--text-muted)" }}>
                  {step.progress === 100 ? "Complete ✓" : `${step.progress}%`}
                </span>
              </div>
              <div className="w-full bg-[#050a0e] rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${step.progress}%` }}
                  transition={{ duration: 1, delay: idx * 0.2, ease: "easeOut" }}
                  className="h-full"
                  style={{ backgroundColor: step.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <GlowButton fullWidth>
        Continue Learning →
      </GlowButton>
    </GlassCard>
  );
};
