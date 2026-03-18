"use client";

import { motion } from "framer-motion";

export const AvatarRing = ({ size = 80 }: { size?: number }) => {
  return (
    <div 
      className="relative flex items-center justify-center rounded-full"
      style={{ width: size, height: size }}
    >
      <motion.div
        className="absolute inset-0 rounded-full border border-dashed border-[var(--accent-green)]/30 backdrop-blur-sm"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
      />
      
      <motion.div
        className="absolute inset-[-4px] rounded-full border-t-2 border-r-2 border-transparent border-t-[var(--accent-green)]"
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
      />
      
      <div 
        className="relative bg-[var(--bg-surface)] rounded-full border-2 border-[var(--accent-green)] shadow-[var(--glow-green)] overflow-hidden z-10"
        style={{ width: size - 12, height: size - 12 }}
      >
        <div className="w-full h-full bg-gradient-to-br from-[#113620] to-[#0c2b33] flex items-center justify-center text-2xl font-bold text-[var(--accent-green)]">
          AC
        </div>
      </div>
    </div>
  );
};
