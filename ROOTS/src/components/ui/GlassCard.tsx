"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "green" | "teal" | "gold" | "purple" | "emerald" | "none";
  hoverable?: boolean;
}

export const GlassCard = ({
  children,
  className = "",
  glowColor = "none",
  hoverable = false,
}: GlassCardProps) => {
  const glowClass = glowColor !== "none" ? `hover:shadow-[var(--glow-${glowColor})]` : "";
  const hoverClass = hoverable ? "transition-all duration-300 hover:scale-[1.02]" : "";
  
  return (
    <div
      className={`bg-glass-card p-6 ${glowClass} ${hoverClass} ${className}`}
    >
      {children}
    </div>
  );
};
