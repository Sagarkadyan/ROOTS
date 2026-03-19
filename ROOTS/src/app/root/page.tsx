"use client";

import { Sidebar } from "../../components/layout/Sidebar";
import dynamic from "next/dynamic";
import { ChatToggleButton } from "../../components/chat/ChatToggleButton";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FireflyBackground = dynamic(() => import("../../components/ui/FireflyBackground").then(mod => mod.FireflyBackground), {
  ssr: false
});

const TreeCanvas = dynamic(() => import("../../components/tree/TreeCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#050a0e]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-[var(--accent-green)] border-t-transparent animate-spin" />
        <p className="text-[var(--text-muted)] font-body animate-pulse">Growing the roots...</p>
      </div>
    </div>
  ),
});

const ChatPanel = dynamic(() => import("../../components/chat/ChatPanel").then(mod => mod.ChatPanel), {
  ssr: false
});

export default function RootPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#050a0e] overflow-hidden relative">
      <Sidebar />
      
      <main className="flex-1 relative overflow-hidden bg-[#050a0e] h-full">
        <FireflyBackground count={20} />
        
        <div className="w-full h-full relative z-0">
          <TreeCanvas />
        </div>
        
        {/* Futuristic Header */}
        <div className="absolute top-12 left-12 z-10 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="font-body font-bold text-5xl text-[var(--accent-green)] tracking-tighter drop-shadow-[0_0_15px_rgba(74,222,128,0.4)] uppercase">
              The Living Roots
            </h1>
            <p className="text-[var(--text-muted)] text-lg mt-2 font-body tracking-wide">
              Expand the roots to explore topics
            </p>
          </motion.div>
        </div>
      </main>

      <ChatToggleButton onClick={() => setIsChatOpen(!isChatOpen)} />
      
      <AnimatePresence>
        {isChatOpen && <ChatPanel onClose={() => setIsChatOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
