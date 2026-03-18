"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatMessage } from "./ChatMessage";
import { ChatTypingIndicator } from "./ChatTypingIndicator";
import { ChatInput } from "./ChatInput";
import { QuickPromptChips } from "./QuickPromptChips";
import { chatResponses } from "../../lib/chatResponses";
import * as Icons from "lucide-react";

export const ChatPanel = ({ onClose }: { onClose: () => void }) => {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>(chatResponses.initialMessages);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: "user", text }]);
    setIsTyping(true);

    setTimeout(() => {
      const response = chatResponses.responsePool[Math.floor(Math.random() * chatResponses.responsePool.length)];
      setMessages(prev => [...prev, { role: "assistant", text: response }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ y: 60, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 60, opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 150, damping: 25 }}
      className="fixed bottom-24 right-6 z-50 w-[380px] h-[540px] bg-glass-card rounded-3xl border border-[var(--border-glass)] flex flex-col shadow-2xl overflow-hidden"
    >
      <div className="flex justify-between items-center p-4 border-b border-[var(--border-glass)] bg-[#050a0e]/40 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-2">
          <Icons.TreePine className="text-[var(--accent-green)] w-5 h-5" />
          <span className="font-display font-bold text-lg text-gradient">ROOTS AI</span>
          <div className="w-2 h-2 rounded-full bg-[var(--accent-green)] shadow-[var(--glow-green)] relative ml-1">
            <div className="absolute inset-0 rounded-full animate-ping bg-[var(--accent-green)] opacity-75"></div>
          </div>
        </div>
        <button onClick={onClose} className="text-[var(--text-muted)] hover:text-white transition-colors">
          <Icons.Minus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} role={msg.role} text={msg.text} />
        ))}
        {isTyping && <ChatTypingIndicator />}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 bg-[#050a0e]/60 backdrop-blur-md border-t border-[var(--border-glass)] shrink-0">
        <QuickPromptChips onSelect={handleSend} />
        <ChatInput onSend={handleSend} />
      </div>
    </motion.div>
  );
};
