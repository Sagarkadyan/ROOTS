"use client";

import { motion } from "framer-motion";

export const ChatTypingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="bg-glass-card border-l-2 border-[var(--accent-green)] rounded-br-2xl rounded-tr-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1 shadow-md">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)]"
            animate={{ y: [0, -6, 0] }}
            transition={{
              repeat: Infinity,
              duration: 0.6,
              delay: i * 0.15,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};
