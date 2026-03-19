"use client";

import { Sidebar } from "../../components/layout/Sidebar";
import { GlassCard } from "../../components/ui/GlassCard";
import { SectionTitle } from "../../components/ui/SectionTitle";
import { GlowButton } from "../../components/ui/GlowButton";
import { ChatToggleButton } from "../../components/chat/ChatToggleButton";
import { ChatPanel } from "../../components/chat/ChatPanel";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";

interface Course {
  platform: string;
  title: string;
  url: string;
}

export default function CoursesPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [enrolledCourses, setEnrolledCourses] = useState<Set<string>>(new Set());

  const fetchCourses = async (topic?: string) => {
    setLoading(true);
    try {
      const url = topic && topic !== "All" 
        ? `/api/courses?topic=${encodeURIComponent(topic)}` 
        : "/api/courses";
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === "success") {
        setCourses(data.courses);
      }
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    // Load enrolled courses from localStorage
    const saved = localStorage.getItem("enrolledCourses");
    if (saved) {
      try {
        setEnrolledCourses(new Set(JSON.parse(saved)));
      } catch (e) {
        console.error("Failed to parse enrolled courses", e);
      }
    }
  }, []);

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    fetchCourses(filter);
  };

  const toggleEnroll = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newEnrolled = new Set(enrolledCourses);
    if (newEnrolled.has(url)) {
      newEnrolled.delete(url);
    } else {
      newEnrolled.add(url);
    }
    setEnrolledCourses(newEnrolled);
    localStorage.setItem("enrolledCourses", JSON.stringify(Array.from(newEnrolled)));
  };

  // Helper to map platform/tag to a relevant icon
  const getIconForCourse = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("css") || t.includes("flexbox") || t.includes("grid")) return Icons.LayoutGrid;
    if (t.includes("react") || t.includes("js") || t.includes("javascript") || t.includes("web")) return Icons.Code2;
    if (t.includes("figma") || t.includes("design") || t.includes("ui") || t.includes("ux")) return Icons.Figma;
    if (t.includes("next") || t.includes("server")) return Icons.Server;
    if (t.includes("python") || t.includes("data") || t.includes("analysis")) return Icons.BarChart;
    if (t.includes("docker") || t.includes("container") || t.includes("devops")) return Icons.Box;
    return Icons.BookOpen;
  };

  return (
    <div className="flex h-screen bg-[var(--bg-deep)] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-[1200px] mx-auto pb-32">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <SectionTitle icon="BookOpen">Available Courses</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {["All", "Web Dev", "Design", "Data Science", "Python", "React"].map(filter => (
                <button 
                  key={filter} 
                  onClick={() => handleFilterClick(filter)}
                  className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${activeFilter === filter ? 'bg-[var(--accent-green)] text-[#050a0e] border-[var(--accent-green)]' : 'border-[var(--border-glass)] text-[var(--text-muted)] hover:border-[var(--accent-teal)] hover:text-white'}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-[var(--accent-green)] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[var(--text-muted)] animate-pulse">Growing the branch list...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {courses.length > 0 ? (
                  courses.map((course, idx) => {
                    const IconCmp = getIconForCourse(course.title);
                    const isEnrolled = enrolledCourses.has(course.url);
                    return (
                      <motion.div
                        key={course.url}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: idx * 0.05 }}
                        className="h-full"
                      >
                        <GlassCard className={`h-full flex flex-col hover:-translate-y-2 transition-transform duration-300 group cursor-pointer border-[rgba(255,255,255,0.05)] ${isEnrolled ? 'border-[var(--accent-teal)] shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'hover:border-[var(--accent-green)]'}`}>
                          <div className="flex justify-between items-start mb-6">
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${isEnrolled ? 'bg-[rgba(6,182,212,0.1)]' : 'bg-[rgba(74,222,128,0.1)]'}`}>
                              <IconCmp className={`${isEnrolled ? 'text-[var(--accent-teal)]' : 'text-[var(--accent-green)]'} w-7 h-7`} />
                            </div>
                            <button 
                              onClick={(e) => toggleEnroll(course.url, e)}
                              className={`p-2 rounded-lg border transition-all ${isEnrolled ? 'bg-[var(--accent-teal)] border-[var(--accent-teal)] text-[#050a0e]' : 'border-[var(--border-glass)] text-[var(--text-muted)] hover:text-white hover:border-[var(--accent-teal)]'}`}
                              title={isEnrolled ? "Enrolled" : "Enroll in course"}
                            >
                              {isEnrolled ? <Icons.Check className="w-5 h-5" /> : <Icons.Plus className="w-5 h-5" />}
                            </button>
                          </div>
                          
                          <h3 className={`font-display font-bold text-xl text-[var(--text-primary)] mb-2 transition-colors ${isEnrolled ? 'text-[var(--accent-teal)]' : 'group-hover:text-[var(--accent-green)]'} line-clamp-2`}>
                            {course.title}
                          </h3>
                          
                          <div className="flex items-center gap-3 mb-6 mt-auto">
                            <span className={`text-xs px-2.5 py-1 rounded-md bg-[var(--bg-surface)] border border-[var(--border-glass)] ${isEnrolled ? 'text-[var(--accent-teal)] border-[var(--accent-teal)]/30' : 'text-[var(--accent-teal)]'}`}>
                              {course.platform}
                            </span>
                            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                              <Icons.ExternalLink className="w-3 h-3" /> Source
                            </span>
                          </div>

                          <GlowButton 
                            fullWidth 
                            variant={isEnrolled ? "primary" : "secondary"}
                            className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all absolute bottom-6 left-6 right-6 w-auto"
                            onClick={() => window.open(course.url, '_blank')}
                          >
                            Start Learning →
                          </GlowButton>
                          {/* Ghost space for button */}
                          <div className="h-12" />
                        </GlassCard>
                      </motion.div>
                    );
                  })
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full py-20 text-center"
                  >
                    <Icons.SearchX className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
                    <h3 className="text-xl font-bold">No courses found</h3>
                    <p className="text-[var(--text-muted)] mt-2">Try a different filter or check back later.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

        </div>
      </main>

      <ChatToggleButton onClick={() => setIsChatOpen(!isChatOpen)} />
      {isChatOpen && <ChatPanel onClose={() => setIsChatOpen(false)} />}
    </div>
  );
}
