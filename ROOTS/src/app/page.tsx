"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FireflyBackground } from "../components/ui/FireflyBackground";
import { GlowButton } from "../components/ui/GlowButton";
import { Leaf } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowForm(true), 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
      <FireflyBackground count={25} />
      
      {/* Dynamic SVG Sapling */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-end justify-center w-[400px] h-[400px]">
        <svg viewBox="0 0 400 400" className="w-full h-full transform origin-bottom">
          {/* Roots */}
          <motion.path d="M 195 380 Q 180 400 160 395" fill="none" stroke="var(--accent-teal)" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: showForm ? 1 : 1 }} transition={{ duration: 1, delay: 0 }} />
          <motion.path d="M 205 380 Q 220 400 240 390" fill="none" stroke="var(--accent-teal)" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: showForm ? 1 : 1 }} transition={{ duration: 1, delay: 0.2 }} />
          <motion.path d="M 200 380 Q 200 400 210 410" fill="none" stroke="var(--accent-teal)" strokeWidth="4" initial={{ pathLength: 0 }} animate={{ pathLength: showForm ? 1 : 1 }} transition={{ duration: 1, delay: 0.1 }} />

          {/* Main Trunk */}
          <motion.path
            d="M 200 380 C 190 300 210 250 200 180"
            fill="transparent"
            stroke="url(#gradient)"
            strokeWidth="14"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: showForm ? 1 : 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          {/* Inner Trunk Texture */}
          <motion.path
            d="M 198 380 C 190 300 208 250 198 180"
            fill="transparent"
            stroke="rgba(74,222,128,0.2)"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: showForm ? 1 : 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />

          {/* Branches */}
          <motion.path
            d="M 202 260 C 230 240 250 220 280 230"
            fill="transparent"
            stroke="var(--accent-green)"
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
          />
          <motion.path
            d="M 260 238 Q 280 210 300 210"
            fill="transparent"
            stroke="var(--accent-green)"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 2.0, duration: 0.8 }}
          />
          <motion.path
            d="M 195 290 C 160 270 140 240 120 230"
            fill="transparent"
            stroke="var(--accent-green)"
            strokeWidth="7"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
          />
          <motion.path
            d="M 200 200 Q 240 160 260 140"
            fill="transparent"
            stroke="var(--accent-green)"
            strokeWidth="5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 1.8, duration: 1 }}
          />

          {/* Leaves (Organic Paths) */}
          {[
            { x: 280, y: 230, delay: 2.2, rotate: 15, scale: 0.8 },
            { x: 300, y: 210, delay: 2.5, rotate: 45, scale: 0.6 },
            { x: 120, y: 230, delay: 2.0, rotate: -30, scale: 0.9 },
            { x: 260, y: 140, delay: 2.4, rotate: 20, scale: 0.7 },
            { x: 200, y: 180, delay: 2.1, rotate: -10, scale: 1 },
          ].map((leaf, idx) => (
            <motion.path
              key={idx}
              d="M 0 0 C -15 -10, -15 -25, 0 -35 C 15 -25, 15 -10, 0 0 Z"
              fill="var(--accent-teal)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: leaf.scale, opacity: 1, rotate: leaf.rotate }}
              style={{ originX: "0px", originY: "0px", x: leaf.x, y: leaf.y }}
              transition={{ delay: leaf.delay, type: "spring", stiffness: 200 }}
            />
          ))}

          <defs>
            <linearGradient id="gradient" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#2d1b11" />
              <stop offset="30%" stopColor="#4a3728" />
              <stop offset="100%" stopColor="var(--accent-green)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="z-10 w-full max-w-[420px] px-4"
          >
            <div className="bg-glass-card p-10 flex flex-col items-center">
              <Leaf className="text-[var(--accent-green)] w-10 h-10 mb-4 animate-float" />
              <h1 className="font-display font-bold text-5xl text-gradient mb-2 tracking-wide">
                ROOTS
              </h1>
              <p className="text-[var(--text-muted)] text-center mb-8 font-body">
                Grow your knowledge. Explore your potential.
              </p>

              <div className="w-full space-y-4">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-glass)] rounded-xl px-4 py-3 text-[#e2ffe8] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-green)] focus:shadow-[var(--glow-green)] transition-all"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-[var(--bg-surface)] border border-[var(--border-glass)] rounded-xl px-4 py-3 text-[#e2ffe8] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-green)] focus:shadow-[var(--glow-green)] transition-all"
                />
                
                <Link href="/home" className="block w-full mt-6">
                  <GlowButton fullWidth>
                    Begin Growing →
                  </GlowButton>
                </Link>

                <div className="flex items-center gap-4 my-6">
                  <div className="h-px bg-[var(--border-glass)] flex-1"></div>
                  <span className="text-[var(--text-muted)] text-sm">or continue with</span>
                  <div className="h-px bg-[var(--border-glass)] flex-1"></div>
                </div>

                <button className="w-full bg-transparent border border-[var(--border-glass)] hover:bg-[var(--bg-surface)] hover:border-[var(--accent-teal)] rounded-xl px-4 py-3 flex items-center justify-center gap-3 transition-colors text-[#e2ffe8]">
                   <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4ade80"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#06b6d4"
                    />
                    <path
                      d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                      fill="#f59e0b"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      fill="#f43f5e"
                    />
                  </svg>
                  Sign in with Google
                </button>

                <div className="text-center mt-6">
                  <a href="#" className="flex justify-center flex-row gap-2 mt-2 group text-sm text-[var(--accent-teal)] hover:text-[var(--text-primary)] transition-colors">
                    Don&apos;t have an account? Plant your seed
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
