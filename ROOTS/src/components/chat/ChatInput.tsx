"use client";

import { useState } from "react";
import * as Icons from "lucide-react";

export const ChatInput = ({ onSend }: { onSend: (text: string) => void }) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask your guide anything..."
        className="flex-1 bg-[var(--bg-surface)] border border-[var(--border-glass)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-green)] transition-colors placeholder-[var(--text-muted)]"
      />
      <button 
        type="submit"
        disabled={!input.trim()}
        className="w-11 h-11 shrink-0 bg-[var(--accent-green)] rounded-full flex items-center justify-center text-[#050a0e] hover:shadow-[var(--glow-green)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <Icons.Send className="w-5 h-5 -ml-0.5" />
      </button>
    </form>
  );
};
