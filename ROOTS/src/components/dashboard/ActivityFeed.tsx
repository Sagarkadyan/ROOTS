"use client";

import { motion } from "framer-motion";
import { GlassCard } from "../ui/GlassCard";
import { SectionTitle } from "../ui/SectionTitle";
import { mockActivity } from "../../lib/mockActivity";
import * as Icons from "lucide-react";

export const ActivityFeed = () => {
  return (
    <GlassCard className="h-full">
      <SectionTitle icon="List">Recent Activity</SectionTitle>
      
      <div className="space-y-4 mt-6">
        {mockActivity.map((activity, idx) => {
          const IconCmp = Icons[activity.icon as keyof typeof Icons] as React.ElementType;
          
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="flex items-start gap-4 p-3 rounded-xl hover:bg-[var(--bg-surface)] transition-colors border border-transparent hover:border-[var(--border-glass)]"
            >
              <div className="w-10 h-10 rounded-full bg-[rgba(74,222,128,0.1)] flex items-center justify-center shrink-0">
                <IconCmp className="w-5 h-5 text-[var(--accent-green)]" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[var(--text-primary)] truncate">
                  {activity.title}
                </p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  {activity.time}
                </p>
              </div>
              
              <div className="shrink-0 bg-[rgba(74,222,128,0.15)] text-[var(--accent-green)] text-xs font-bold px-2.5 py-1 rounded-full border border-[rgba(74,222,128,0.2)]">
                {activity.xp}
              </div>
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
};
