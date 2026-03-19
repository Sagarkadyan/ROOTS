"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { GlassCard } from "../ui/GlassCard";
import { SectionTitle } from "../ui/SectionTitle";

const data = [
  { day: "Mon", hours: 0 },
  { day: "Tue", hours: 0 },
  { day: "Wed", hours: 0 },
  { day: "Thu", hours: 0 },
  { day: "Fri", hours: 0 },
  { day: "Sat", hours: 0 },
  { day: "Sun", hours: 0 }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-glass-card px-4 py-3 border border-[var(--border-glass)] rounded-xl shadow-[var(--glow-green)]">
        <p className="font-bold text-[var(--accent-green)]">{`${payload[0].value} hours`}</p>
        <p className="text-[var(--text-muted)] text-sm">on {label}</p>
      </div>
    );
  }
  return null;
};

export const WeeklyBarChart = () => {
  return (
    <GlassCard className="h-full flex flex-col">
      <SectionTitle icon="BarChart2">This Week&apos;s Study Hours</SectionTitle>
      
      <div className="flex-1 mt-6 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-muted)", fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-muted)", fontSize: 12 }}
            />
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ fill: "var(--bg-surface)", opacity: 0.5 }} 
            />
            <Bar 
              dataKey="hours" 
              radius={[6, 6, 0, 0]}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={"var(--accent-green)"} 
                  className="hover:brightness-125 transition-all duration-300"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
};
