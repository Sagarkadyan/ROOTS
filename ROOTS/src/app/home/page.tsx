"use client";

import { Sidebar } from "../../components/layout/Sidebar";
import dynamic from "next/dynamic";
import { ChatToggleButton } from "../../components/chat/ChatToggleButton";
import { ChatPanel } from "../../components/chat/ChatPanel";
import { useState } from "react";

const TreeCanvas = dynamic(() => import("../../components/tree/TreeCanvas"), {
  ssr: false,
});

export default function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[var(--bg-deep)] overflow-hidden">
      <Sidebar />
      <main className="flex-1 relative">
        <TreeCanvas />
      </main>
      <ChatToggleButton onClick={() => setIsChatOpen(!isChatOpen)} />
      {isChatOpen && <ChatPanel onClose={() => setIsChatOpen(false)} />}
    </div>
  );
}
