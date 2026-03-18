"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const ProgressRing = ({ percentage = 0, size = 120, strokeWidth = 8, color = "#4ade80" }) => {
  const [offset, setOffset] = useState(0);
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const progressOffset = circumference - (percentage / 100) * circumference;
    setOffset(progressOffset);
  }, [percentage, circumference]);

  return (
    <div className="relative flex items-center justify-center font-display" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="var(--bg-surface)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ filter: "drop-shadow(0 0 6px rgba(74, 222, 128, 0.4))" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[#4ade80] to-[#06b6d4]">
          {percentage}%
        </span>
      </div>
    </div>
  );
};
