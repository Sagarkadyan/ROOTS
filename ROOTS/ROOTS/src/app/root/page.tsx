"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "../../components/layout/Sidebar";
import { ChatToggleButton } from "../../components/chat/ChatToggleButton";
import { ChatPanel } from "../../components/chat/ChatPanel";
import { GlassCard } from "../../components/ui/GlassCard";
import { GlowButton } from "../../components/ui/GlowButton";
import * as Icons from "lucide-react";

interface Subtopic {
  id: string;
  label: string;
}

interface RootCategory {
  id: string;
  label: string;
  color: string;
  icon: keyof typeof Icons;
  subtopics: Subtopic[];
}

interface Course {
  platform: string;
  title: string;
  url: string;
}

const CATEGORIES: RootCategory[] = [
  {
    id: "web-dev",
    label: "Web Development",
    color: "#4ade80", // Green
    icon: "Globe",
    subtopics: [
      { id: "html", label: "HTML" },
      { id: "css", label: "CSS" },
      { id: "js", label: "JavaScript" },
    ],
  },
  {
    id: "data-science",
    label: "Data Science",
    color: "#06b6d4", // Cyan/Blue
    icon: "Database",
    subtopics: [
      { id: "python", label: "Python" },
      { id: "pandas", label: "Pandas" },
      { id: "numpy", label: "NumPy" },
      { id: "neural", label: "Neural Networks" },
    ],
  },
  {
    id: "ui-ux",
    label: "UI/UX Design",
    color: "#f59e0b", // Yellow/Orange
    icon: "Palette",
    subtopics: [
      { id: "figma", label: "Figma" },
      { id: "typography", label: "Typography" },
      { id: "color", label: "Color Theory" },
    ],
  },
  {
    id: "devops",
    label: "DevOps",
    color: "#a78bfa", // Purple
    icon: "Server",
    subtopics: [
      { id: "docker", label: "Docker" },
      { id: "k8s", label: "Kubernetes" },
      { id: "cicd", label: "CI/CD" },
      { id: "cloud", label: "Cloud" },
    ],
  },
  {
    id: "cyber",
    label: "Cybersecurity",
    color: "#f43f5e", // Red/Pink
    icon: "Shield",
    subtopics: [
      { id: "networking", label: "Networking" },
      { id: "hacking", label: "Ethical Hacking" },
      { id: "crypto", label: "Cryptography" },
    ],
  },
];

export default function LivingRootsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isCoursesLoading, setIsCoursesLoading] = useState(false);

  const handleSubtopicClick = async (label: string) => {
    setSelectedTopic(label);
    setIsCoursesLoading(true);
    setCourses([]);
    
    try {
      const response = await fetch(`/api/courses?topic=${encodeURIComponent(label)}`);
      const data = await response.json();
      if (data.status === "success") {
        setCourses(data.courses);
      }
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    } finally {
      setIsCoursesLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#050a0e] overflow-hidden text-[#e2ffe8] font-sans selection:bg-[rgba(74,222,128,0.3)] relative">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050a0e] via-[#0a1a24] to-[#050a0e] z-0" />
      
      <Sidebar />
      
      <main className="flex-1 relative z-10 flex flex-col items-center overflow-y-auto custom-scrollbar">
        {/* Background Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[var(--accent-teal)] rounded-full opacity-20"
              initial={{ 
                x: Math.random() * 100 + "%", 
                y: Math.random() * 100 + "%",
              }}
              animate={{ 
                y: [null, "-20%"],
                opacity: [0.1, 0.4, 0.1]
              }}
              transition={{ 
                duration: 10 + Math.random() * 20, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            />
          ))}
        </div>

        {/* Header Section */}
        <div className="z-10 pt-14 text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-display font-bold text-gradient drop-shadow-[0_0_15px_rgba(74,222,128,0.3)] mb-5"
          >
            The Living Roots
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-[var(--text-muted)] text-xl tracking-wide"
          >
            Expand the roots to explore topics
          </motion.p>
        </div>

        {/* Tree Trunk at Center Top */}
        <motion.div 
          initial={{ scale: 1 }}
          animate={{ scale: 1.38 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full max-w-5xl flex flex-col items-center px-10 pb-40"
        >
          <div className="absolute top-[-48px] left-1/2 -translate-x-1/2 w-10 h-28 bg-gradient-to-b from-[#1b120d] to-[#2b221b] rounded-t-full blur-[1px]" />
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 w-full">
            {CATEGORIES.map((cat, idx) => {
              const isExpanded = expandedId === cat.id;
              const IconCmp = Icons[cat.icon] as React.ElementType;

              return (
                <div key={cat.id} className="flex flex-col items-center relative">
                  {/* Root SVG Connection */}
                  <svg className="absolute top-[-72px] left-1/2 -translate-x-1/2 w-56 h-24 pointer-events-none overflow-visible">
                    <motion.path
                      d={`M 112 0 C 112 36, ${112 + (idx - 2) * 24} 48, ${112 + (idx - 2) * 6} 96`}
                      fill="none"
                      stroke={cat.color}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.4 }}
                      transition={{ duration: 1.5, delay: idx * 0.1 }}
                    />
                    <motion.circle
                      cx={112 + (idx - 2) * 6}
                      cy={96}
                      r="5"
                      fill={cat.color}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.4 + idx * 0.1 }}
                      className="shadow-lg"
                      style={{ filter: `drop-shadow(0 0 8px ${cat.color})` }}
                    />
                  </svg>

                  {/* Category Node */}
                  <motion.button
                    layout
                    onClick={() => setExpandedId(isExpanded ? null : cat.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="z-10 group relative mt-5"
                  >
                    <div 
                      className="absolute inset-0 rounded-2xl blur-lg transition-opacity duration-300 opacity-20 group-hover:opacity-60"
                      style={{ backgroundColor: cat.color }}
                    />
                    <div 
                      className={`relative bg-[#0a1628]/80 backdrop-blur-xl border-2 rounded-2xl p-7 flex flex-col items-center gap-4 transition-all duration-300 ${isExpanded ? 'shadow-[0_0_36px_rgba(255,255,255,0.1)]' : ''}`}
                      style={{ borderColor: isExpanded ? cat.color : 'rgba(255,255,255,0.1)' }}
                    >
                      <IconCmp 
                        className="w-10 h-10 transition-colors duration-300" 
                        style={{ color: isExpanded ? cat.color : '#e2ffe8' }}
                      />
                      <span className="font-bold text-base text-center whitespace-nowrap">
                        {cat.label}
                      </span>
                    </div>
                  </motion.button>

                  {/* Subtopics */}
                  <div className="w-full mt-5 flex flex-col items-center">
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={{
                            visible: { transition: { staggerChildren: 0.1 } },
                            hidden: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
                          }}
                          className="flex flex-col items-center gap-2.5"
                        >
                          {cat.subtopics.map((sub, subIdx) => (
                            <motion.div
                              key={sub.id}
                              variants={{
                                visible: { opacity: 1, y: 0, scale: 1 },
                                hidden: { opacity: 0, y: -10, scale: 0.9 }
                              }}
                              className="relative"
                            >
                              {/* Connection Line to Subtopic */}
                              <div 
                                className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-[1.5px] h-3 opacity-30" 
                                style={{ backgroundColor: cat.color }}
                              />
                              
                              <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: `${cat.color}20` }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleSubtopicClick(sub.label)}
                                className="px-5 py-2.5 rounded-full border text-sm font-medium whitespace-nowrap transition-colors"
                                style={{ 
                                  borderColor: `${cat.color}40`,
                                  color: cat.color
                                }}
                              >
                                {sub.label}
                              </motion.button>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Courses Overlay Panel */}
        <AnimatePresence>
          {selectedTopic && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#050a0e]/80 backdrop-blur-sm"
              onClick={() => setSelectedTopic(null)}
            >
              <div 
                className="w-full max-w-4xl max-h-[80vh] bg-glass-card rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-[var(--border-glass)]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-[var(--border-glass)] flex justify-between items-center bg-[#0a1628]/60">
                  <div>
                    <h2 className="text-3xl font-display font-bold text-gradient">
                      Courses: {selectedTopic}
                    </h2>
                    <p className="text-[var(--text-muted)] text-sm mt-1">
                      Choose a branch to start growing your knowledge
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedTopic(null)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <Icons.X className="w-6 h-6 text-[var(--text-muted)]" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                  {isCoursesLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                      <div className="w-12 h-12 border-4 border-[var(--accent-green)] border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-[var(--text-muted)] animate-pulse">Searching through the web roots...</p>
                    </div>
                  ) : courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {courses.map((course, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <GlassCard className="h-full flex flex-col group border-[rgba(255,255,255,0.05)] hover:border-[var(--accent-green)] transition-all">
                            <div className="flex justify-between items-start mb-4">
                              <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded bg-[var(--accent-green)]/10 text-[var(--accent-green)]">
                                {course.platform}
                              </span>
                              <Icons.ExternalLink className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent-green)] transition-colors" />
                            </div>
                            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6 group-hover:text-[var(--accent-green)] transition-colors line-clamp-2">
                              {course.title}
                            </h3>
                            <GlowButton 
                              fullWidth 
                              onClick={() => window.open(course.url, '_blank')}
                              className="mt-auto"
                            >
                              Study Course →
                            </GlowButton>
                          </GlassCard>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <Icons.SearchX className="w-16 h-16 text-[var(--text-muted)] mb-4" />
                      <h3 className="text-xl font-bold">No courses found yet</h3>
                      <p className="text-[var(--text-muted)] mt-2">Try selecting another subtopic or check back later while our scraper expands its branches.</p>
                      <GlowButton 
                        variant="secondary" 
                        className="mt-6"
                        onClick={() => setSelectedTopic(null)}
                      >
                        Go Back
                      </GlowButton>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <ChatToggleButton onClick={() => setIsChatOpen(!isChatOpen)} />
      {isChatOpen && <ChatPanel onClose={() => setIsChatOpen(false)} />}
    </div>
  );
}
