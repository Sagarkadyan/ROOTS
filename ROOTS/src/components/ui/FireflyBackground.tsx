"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const FireflyBackground = ({ count = 25 }: { count?: number }) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; dur: number; del: number }>>([]);

  useEffect(() => {
    // Generate particles client-side only to avoid hydration mismatch
    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      dur: 4 + Math.random() * 10,
      del: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-1 h-1 rounded-full bg-[var(--accent-green)]"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: p.dur,
            delay: p.del,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};
