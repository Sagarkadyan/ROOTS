"use client";

import { Sidebar } from "../../components/layout/Sidebar";
import { GlassCard } from "../../components/ui/GlassCard";
import { SectionTitle } from "../../components/ui/SectionTitle";
import { ChatToggleButton } from "../../components/chat/ChatToggleButton";
import dynamic from "next/dynamic";
import { useState } from "react";
import { motion } from "framer-motion";

const ChatPanel = dynamic(() => import("../../components/chat/ChatPanel").then(mod => mod.ChatPanel), {
  ssr: false
});

export default function PathPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[var(--bg-deep)] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-[1200px] mx-auto pb-32">
          <SectionTitle icon="Map">My Learning Path</SectionTitle>
          
          <div className="mt-8 space-y-12">
            {[1, 2, 3].map((step, idx) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.2 }}
                className="relative pl-12"
              >
                {/* Timeline vertical line */}
                {idx !== 2 && (
                  <div className="absolute left-[20px] top-[40px] bottom-[-48px] w-0.5 bg-gradient-to-b from-[var(--accent-green)] to-[var(--border-glass)] shadow-[0_0_10px_var(--accent-green)] origin-top animate-pulse"></div>
                )}
                
                {/* Timeline node */}
                <div className="absolute left-0 top-2 w-10 h-10 rounded-full bg-[var(--bg-surface)] border-2 border-[var(--accent-green)] shadow-[var(--glow-green)] flex items-center justify-center text-[var(--accent-green)] font-bold z-10 font-display">
                  {step}
                </div>

                <GlassCard className="p-8">
                  <h3 className="text-2xl font-display font-bold text-gradient mb-2">
                    {step === 1 ? "Foundations of Web" : step === 2 ? "Interactive Logic" : "React Frameworks"}
                  </h3>
                  <p className="text-[var(--text-muted)] mb-6">
                    {step === 1 
                      ? "Master HTML semantic structure and CSS visual styling to build accessible and beautiful websites." 
                      : step === 2
                      ? "Dive into modern JavaScript and DOM manipulation to bring sites to life."
                      : "Learn React and Next.js to craft scalable frontend architectures."}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {["Topics Module", "Interactive Lab", "Final Project"].map((sub, i) => (
                      <div key={i} className="p-4 rounded-xl border border-[var(--border-glass)] bg-[#050a0e]/50 hover:border-[var(--accent-green)] transition-all cursor-pointer group">
                        <div className="font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-green)] transition-colors mb-1">{sub}</div>
                        <div className="text-xs text-[var(--text-muted)] flex items-center justify-between">
                          <span>~{Math.floor(Math.random() * 5) + 2} hours</span>
                          <span className="text-[var(--accent-teal)]">{step === 1 ? 'Completed' : 'Locked'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

        </div>
      </main>

      <ChatToggleButton onClick={() => setIsChatOpen(!isChatOpen)} />
      {isChatOpen && <ChatPanel onClose={() => setIsChatOpen(false)} />}
    </div>
  );
}
