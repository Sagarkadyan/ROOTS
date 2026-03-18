"use client";

import { motion } from "framer-motion";
import { TreePine } from "lucide-react";

export const ChatToggleButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-glass-card border border-[var(--accent-green)] shadow-[var(--glow-green)] flex items-center justify-center cursor-pointer overflow-visible"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-[var(--accent-green)]"
        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      />
      <TreePine className="text-[var(--accent-green)] w-6 h-6 z-10 relative" />
    </motion.button>
  );
};
