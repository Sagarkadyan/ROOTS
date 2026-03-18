"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

export const QuickPromptChips = ({ onSelect }: { onSelect: (text: string) => void }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const chips = [
    "Suggest a path",
    "What to learn first?",
    "Show roadmap",
    "My weak spots"
  ];

  return (
    <div 
      ref={scrollRef}
      className="flex overflow-x-auto gap-2 pb-3 mb-1 custom-scrollbar w-full"
    >
      {chips.map((chip, idx) => (
        <motion.button
          key={idx}
          whileHover={{ scale: 1.05, backgroundColor: "var(--bg-surface)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(chip)}
          className="shrink-0 px-3 py-1.5 rounded-full border border-[var(--border-glass)] text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--accent-teal)] transition-colors whitespace-nowrap bg-[rgba(10,22,40,0.4)]"
        >
          {chip}
        </motion.button>
      ))}
    </div>
  );
};
