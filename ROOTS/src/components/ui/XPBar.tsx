"use client";
import { motion } from "framer-motion";
export const XPBar = ({ xp = 4820, maxXP = 5000 }) => {
  return (
    <div className="w-full bg-[#050a0e] rounded-full h-2 mb-1 overflow-hidden relative border border-[var(--border-glass)]">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${(xp / maxXP) * 100}%` }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-0 left-0 bottom-0 bg-[var(--accent-green)]"
      >
        <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white/30 to-transparent blur-sm animate-pulse-glow" />
      </motion.div>
    </div>
  );
};
