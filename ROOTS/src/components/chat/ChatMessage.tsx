"use client";

import { motion } from "framer-motion";

export const ChatMessage = ({ role, text }: { role: string; text: string }) => {
  const isAssistant = role === "assistant";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex w-full ${isAssistant ? "justify-start" : "justify-end"}`}
    >
      <div 
        className={`max-w-[85%] text-sm px-4 py-3 shadow-md ${
          isAssistant
            ? "bg-glass-card border-l-2 border-[var(--accent-green)] rounded-br-2xl rounded-tr-2xl rounded-tl-sm text-[var(--text-primary)]"
            : "bg-[rgba(74,222,128,0.15)] border border-[rgba(74,222,128,0.2)] rounded-tl-3xl rounded-tr-sm rounded-bl-3xl rounded-br-3xl text-[#e2ffe8]"
        }`}
      >
        {text}
      </div>
    </motion.div>
  );
};
