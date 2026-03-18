"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface GlowButtonProps {
  children: ReactNode;
  onClick?: () => void;
  fullWidth?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}

export const GlowButton = ({
  children,
  onClick,
  fullWidth = false,
  variant = "primary",
  className = "",
}: GlowButtonProps) => {
  let baseClasses = "rounded-xl py-3 px-6 font-medium transition-all duration-300 flex items-center justify-center gap-2";
  
  if (variant === "primary") {
    baseClasses += " bg-[var(--accent-green)] text-[#050a0e] hover:shadow-[var(--glow-green)]";
  } else if (variant === "secondary") {
    baseClasses += " bg-[var(--bg-surface)] border border-[var(--border-glass)] hover:border-[var(--accent-teal)] text-[var(--text-primary)]";
  } else if (variant === "ghost") {
    baseClasses += " bg-transparent hover:bg-[var(--bg-surface)] text-[var(--text-primary)]";
  }

  if (fullWidth) {
    baseClasses += " w-full";
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`${baseClasses} ${className}`}
    >
      {children}
    </motion.button>
  );
};
