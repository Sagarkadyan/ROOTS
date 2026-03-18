"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, Home, Map, BookOpen, Flame, User } from "lucide-react";
import { mockUser } from "../../lib/mockUser";
import { motion } from "framer-motion";

export const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/home", icon: Home },
    { label: "My Path", href: "/path", icon: Map },
    { label: "Courses", href: "/courses", icon: BookOpen },
    { label: "Streak", href: "/streak", icon: Flame },
    { label: "Dashboard", href: "/dashboard", icon: User },
  ];

  return (
    <div className="w-[260px] h-screen bg-[#050a0e] border-r border-[var(--border-glass)] flex flex-col p-6 sticky top-0 shrink-0">
      <div className="flex items-center gap-3 mb-10 pl-2">
        <Leaf className="text-[var(--accent-green)] w-8 h-8" />
        <span className="font-display font-bold text-3xl tracking-wide text-gradient">ROOTS</span>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 5 }}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                  isActive 
                  ? "border-l-2 border-[var(--accent-green)] bg-[var(--bg-glass)] text-[var(--accent-green)]"
                  : "text-[var(--text-muted)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto bg-[var(--bg-surface)] rounded-xl p-4 border border-[var(--border-glass)]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full border-2 border-[var(--accent-green)] shadow-[var(--glow-green)] bg-[#1a2835] overflow-hidden" />
          <div>
            <div className="font-medium text-sm text-[var(--text-primary)]">{mockUser.name}</div>
            <div className="text-xs text-[var(--text-muted)]">Lv. 14</div>
          </div>
        </div>
        
        <div className="w-full bg-[#050a0e] rounded-full h-2 mb-1 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(mockUser.xp / mockUser.maxXP) * 100}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full bg-[var(--accent-green)] relative"
          >
             <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white/30 to-transparent blur-sm animate-pulse-glow" />
          </motion.div>
        </div>
        <div className="text-[10px] text-right text-[var(--text-muted)] mt-1">
          {mockUser.xp.toLocaleString()} / {mockUser.maxXP.toLocaleString()} XP
        </div>
      </div>
    </div>
  );
};
