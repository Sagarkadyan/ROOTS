"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "../ui/GlassCard";
import { motion } from "framer-motion";
import { mockUser } from "../../lib/mockUser";

export const FlameHero = () => {
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    let frameId: number;
    let start = 0;
    const end = mockUser.streakTracker;
    const duration = 1500;
    let startTime: number | null = null;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const pct = Math.min(progress / duration, 1);
      const ease = 1 - Math.pow(1 - pct, 4);
      setDisplayCount(Math.floor(start + (end - start) * ease));
      if (pct < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <GlassCard className="w-full relative overflow-hidden py-16 flex flex-col items-center justify-center text-center">
      {/* Background glow */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.2)__0%,rgba(0,0,0,0)_70%)] blur-2xl animate-pulse-glow" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated SVGs */}
        <div className="relative w-32 h-40 mb-2">
          <motion.svg viewBox="0 0 100 120" className="absolute inset-0 w-full h-full drop-shadow-[0_0_15px_rgba(245,158,11,0.8)] filter">
            <defs>
              <linearGradient id="flame-grad1" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#ea580c" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#fef08a" />
              </linearGradient>
            </defs>
            <motion.path
              d="M50 110 C30 110, 20 80, 40 50 C45 40, 50 20, 50 10 C50 20, 60 40, 65 50 C80 80, 70 110, 50 110 Z"
              fill="url(#flame-grad1)"
              style={{ transformOrigin: "50% 100%" }}
              animate={{ 
                scaleY: [1, 1.1, 0.95, 1.05, 1],
                scaleX: [1, 0.95, 1.05, 0.95, 1],
                opacity: [0.9, 1, 0.8, 1, 0.9] 
              }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
            />
          </motion.svg>
          <motion.svg viewBox="0 0 100 120" className="absolute inset-0 w-full h-full mix-blend-overlay">
            <defs>
              <linearGradient id="flame-grad2" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#c2410c" />
                <stop offset="100%" stopColor="#fde047" />
              </linearGradient>
            </defs>
            <motion.path
              d="M50 110 C40 110, 35 90, 45 70 C48 65, 50 50, 50 40 C50 50, 55 65, 58 70 C65 90, 60 110, 50 110 Z"
              fill="url(#flame-grad2)"
              style={{ transformOrigin: "50% 100%" }}
              animate={{ 
                scaleY: [1, 1.15, 0.9, 1.1, 1],
                scaleX: [1, 0.9, 1.1, 0.9, 1] 
              }}
              transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.2 }}
            />
          </motion.svg>
        </div>

        <h1 className="font-display font-bold text-8xl bg-clip-text text-transparent bg-gradient-to-t from-[#ea580c] via-[#f59e0b] to-[#fef08a] leading-none mb-2 drop-shadow-lg">
          {displayCount}
        </h1>
        <h2 className="text-2xl text-[var(--text-muted)] font-bold mb-4">
          Day Streak
        </h2>
        <p className="italic text-[var(--text-primary)] font-body">
          You&apos;re on fire. Don&apos;t break the chain.
        </p>
      </div>
    </GlassCard>
  );
};
