"use client";

import { GlassCard } from "../ui/GlassCard";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { SectionTitle } from "../ui/SectionTitle";

export const HeatmapGrid = () => {
  const [data, setData] = useState<any[]>([]);
  const [hoveredCell, setHoveredCell] = useState<{ x: number, y: number, data: any } | null>(null);

  useEffect(() => {
    fetch("/api/heatmap")
      .then(res => res.ok ? res.json() : Promise.reject("Fetch failed"))
      .then(raw => {
        if (Array.isArray(raw)) {
          const parsed = raw.map((item: any) => ({
            ...item,
            date: new Date(item.date)
          }));
          setData(parsed);
        }
      })
      .catch(err => console.error("Failed to fetch heatmap data", err));
  }, []);

  const getColor = (activity: number) => {
    switch(activity) {
      case 0: return "var(--bg-surface)";
      case 1: return "#166534";
      case 2: return "#16a34a";
      case 3: return "#22c55e";
      case 4: return "#4ade80";
      default: return "var(--bg-surface)";
    }
  };

  // Convert to 7 rows by 52 columns
  const weeks = [];
  if (data.length > 0) {
    for (let i = 0; i < 52; i++) {
      const week = data.slice(i * 7, (i + 1) * 7);
      weeks.push(week);
    }
  }

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <GlassCard className="w-full relative overflow-hidden pb-8">
      <SectionTitle icon="CalendarDays">Contribution Graph</SectionTitle>
      
      <div className="mt-6 overflow-x-auto custom-scrollbar pb-6 relative">
        <div className="min-w-[800px]">
          {/* Month Header */}
          <div className="flex text-xs text-[var(--text-muted)] mb-2 pl-8">
            {months.map((m, i) => (
              <div key={i} className="flex-1 min-w-[60px]">{m}</div>
            ))}
          </div>

          <div className="flex relative">
            {/* Days Y-axis */}
            <div className="flex flex-col gap-[3px] text-[10px] text-[var(--text-muted)] mr-2 mt-1">
              <span className="h-[14px]"></span>
              <span className="h-[14px] leading-[14px]">Mon</span>
              <span className="h-[14px]"></span>
              <span className="h-[14px] leading-[14px]">Wed</span>
              <span className="h-[14px]"></span>
              <span className="h-[14px] leading-[14px]">Fri</span>
              <span className="h-[14px]"></span>
            </div>

            {/* Grid */}
            <div className="flex gap-[3px]" onMouseLeave={() => setHoveredCell(null)}>
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-[3px]">
                  {week.map((day, dIdx) => (
                    <motion.div
                      key={dIdx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: (wIdx * 7 + dIdx) * 0.001, duration: 0.2 }}
                      className="w-[14px] h-[14px] rounded-[2px] cursor-crosshair transition-all hover:ring-1 hover:ring-white border border-[#ffffff0a]"
                      style={{ backgroundColor: getColor(day?.activity || 0) }}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHoveredCell({
                          x: rect.left,
                          y: rect.top,
                          data: day
                        });
                      }}
                    />
                  ))}
                </div>
              ))}
              {weeks.length === 0 && (
                <div className="flex items-center justify-center w-full py-12 text-[var(--text-muted)] animate-pulse">
                  Mapping your roots...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 absolute bottom-6 right-6 text-xs text-[var(--text-muted)]">
        <span>Less</span>
        <div className="flex gap-[3px]">
          {[0, 1, 2, 3, 4].map(v => (
            <div key={v} className="w-3 h-3 rounded-sm" style={{ backgroundColor: getColor(v) }} />
          ))}
        </div>
        <span>More</span>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredCell && hoveredCell.data && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed z-50 pointer-events-none bg-glass-card px-3 py-2 text-xs text-[#e2ffe8] border border-[var(--border-glass)] shadow-xl rounded-lg whitespace-nowrap transform -translate-x-1/2 -translate-y-[120%]"
            style={{ 
              left: hoveredCell.x + 7,
              top: hoveredCell.y
            }}
          >
            <div className="font-bold flex items-center justify-between gap-4 mb-1">
              <span>{hoveredCell.data.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <span className="text-[var(--accent-teal)]">+{hoveredCell.data.xp} XP</span>
            </div>
            <div className="text-[var(--text-muted)]">
              {hoveredCell.data.sessions > 0 
                ? `${hoveredCell.data.sessions} session${hoveredCell.data.sessions > 1 ? 's' : ''}`
                : "No activity"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
};
