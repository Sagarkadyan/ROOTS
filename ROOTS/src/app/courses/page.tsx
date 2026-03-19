"use client";

import { Sidebar } from "../../components/layout/Sidebar";
import { GlassCard } from "../../components/ui/GlassCard";
import { SectionTitle } from "../../components/ui/SectionTitle";
import { GlowButton } from "../../components/ui/GlowButton";
import { ChatToggleButton } from "../../components/chat/ChatToggleButton";
import dynamic from "next/dynamic";
import { useState } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";

const ChatPanel = dynamic(() => import("../../components/chat/ChatPanel").then(mod => mod.ChatPanel), {
  ssr: false
});

export default function CoursesPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const mockCourses = [
    { title: "Advanced CSS Grid & Flexbox", level: "Beginner", icon: "LayoutGrid" as keyof typeof Icons, hours: "15h", tag: "Design" },
    { title: "React State Management", level: "Intermediate", icon: "Code2" as keyof typeof Icons, hours: "24h", tag: "Web Dev" },
    { title: "Figma UI Prototyping", level: "Beginner", icon: "Figma" as keyof typeof Icons, hours: "12h", tag: "UI/UX" },
    { title: "Next.js App Router Masterclass", level: "Advanced", icon: "Server" as keyof typeof Icons, hours: "35h", tag: "Web Dev" },
    { title: "Python Data Analysis Basics", level: "Beginner", icon: "BarChart" as keyof typeof Icons, hours: "20h", tag: "Data Science" },
    { title: "Docker Containerization", level: "Intermediate", icon: "Box" as keyof typeof Icons, hours: "18h", tag: "DevOps" },
  ];

  return (
    <div className="flex h-screen bg-[var(--bg-deep)] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-[1200px] mx-auto pb-32">
          
          <div className="flex justify-between items-end mb-8">
            <SectionTitle icon="BookOpen">Available Courses</SectionTitle>
            <div className="flex gap-2">
              {["All", "Web Dev", "Design", "Data Science"].map(filter => (
                <button key={filter} className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${filter === "All" ? 'bg-[var(--accent-green)] text-[#050a0e] border-[var(--accent-green)]' : 'border-[var(--border-glass)] text-[var(--text-muted)] hover:border-[var(--accent-teal)] hover:text-white'}`}>
                  {filter}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCourses.map((course, idx) => {
              const IconCmp = Icons[course.icon] as React.ElementType;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="h-full"
                >
                  <GlassCard className="h-full flex flex-col hover:-translate-y-2 transition-transform duration-300 group cursor-pointer border-[rgba(255,255,255,0.05)] hover:border-[var(--accent-green)]">
                    <div className="w-14 h-14 rounded-xl bg-[rgba(74,222,128,0.1)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <IconCmp className="text-[var(--accent-green)] w-7 h-7" />
                    </div>
                    
                    <h3 className="font-display font-bold text-xl text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-green)] transition-colors">
                      {course.title}
                    </h3>
                    
                    <div className="flex items-center gap-3 mb-6 mt-auto">
                      <span className="text-xs px-2.5 py-1 rounded-md bg-[var(--bg-surface)] border border-[var(--border-glass)] text-[var(--accent-teal)]">
                        {course.tag}
                      </span>
                      <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                        <Icons.Clock className="w-3 h-3" /> {course.hours}
                      </span>
                      <span className="text-xs text-[var(--text-muted)] ml-auto">
                        • {course.level}
                      </span>
                    </div>

                    <GlowButton fullWidth variant="secondary" className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all absolute bottom-6 left-6 right-6 w-auto">
                      View Details
                    </GlowButton>
                    {/* Ghost space for button */}
                    <div className="h-12" />
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>

        </div>
      </main>

      <ChatToggleButton onClick={() => setIsChatOpen(!isChatOpen)} />
      {isChatOpen && <ChatPanel onClose={() => setIsChatOpen(false)} />}
    </div>
  );
}
