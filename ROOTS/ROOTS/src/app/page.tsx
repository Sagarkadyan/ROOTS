"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FireflyBackground } from "../components/ui/FireflyBackground";
import { GlowButton } from "../components/ui/GlowButton";
import { Leaf, Smartphone, Mail, Key } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [showForm, setShowForm] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup" | "otp">("login");
  
  // Form States
  const [identifier, setIdentifier] = useState(""); 
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); 
  const [email, setEmail] = useState(""); 
  const [number, setNumber] = useState(""); 
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setShowForm(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    let endpoint = "";
    let body = {};

    if (authMode === "login") {
      endpoint = "/login";
      body = { identifier, password };
    } else if (authMode === "signup") {
      endpoint = "/signup";
      body = { name, email, password, number };
    } else if (authMode === "otp") {
      if (!otpSent) {
        endpoint = "/otp-request";
        body = { identifier };
      } else {
        endpoint = "/otp-verify";
        body = { otp };
      }
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.status === "success") {
        if (authMode === "otp" && !otpSent) {
          setOtpSent(true);
          setLoading(false);
        } else {
          router.push("/root");
        }
      } else {
        setError(data.message || "An error occurred");
        setLoading(false);
      }
    } catch (err) {
      setError("Failed to connect to the server.");
      setLoading(false);
    }
  };

  return (
    <main className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
      <FireflyBackground count={25} />
      
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-end justify-center w-[400px] h-[400px] opacity-40 pointer-events-none">
        <svg viewBox="0 0 400 400" className="w-full h-full transform origin-bottom">
           <motion.path d="M 200 380 C 190 300 210 250 200 180" fill="transparent" stroke="var(--accent-green)" strokeWidth="10" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2 }} />
        </svg>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="z-10 w-full max-w-[420px] px-4"
          >
            <div className="bg-glass-card p-10 flex flex-col items-center">
              <Leaf className="text-[var(--accent-green)] w-10 h-10 mb-4" />
              <h1 className="font-display font-bold text-5xl text-gradient mb-2 tracking-wide text-center">
                ROOTS
              </h1>
              <p className="text-[var(--text-muted)] text-center mb-8 font-body">
                {authMode === "login" ? "Grow your knowledge." : authMode === "signup" ? "Plant your seed today." : "Instant Access via OTP"}
              </p>

              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm mb-4 text-center bg-red-400/10 py-2 px-4 rounded-lg w-full">
                  {error}
                </motion.p>
              )}

              <form onSubmit={handleSubmit} className="w-full space-y-4">
                {authMode === "signup" && (
                  <>
                    <input type="text" placeholder="Full Name" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[var(--bg-surface)] border border-[var(--border-glass)] rounded-xl px-4 py-3 text-[#e2ffe8] focus:outline-none focus:border-[var(--accent-green)] transition-all" />
                    <input type="tel" placeholder="Phone Number" value={number} onChange={(e) => setNumber(e.target.value)} className="w-full bg-[var(--bg-surface)] border border-[var(--border-glass)] rounded-xl px-4 py-3 text-[#e2ffe8] focus:outline-none focus:border-[var(--accent-green)] transition-all" />
                  </>
                )}
                
                {(authMode === "login" || (authMode === "otp" && !otpSent)) && (
                  <input type="text" placeholder="Name or Email" required value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="w-full bg-[var(--bg-surface)] border border-[var(--border-glass)] rounded-xl px-4 py-3 text-[#e2ffe8] focus:outline-none focus:border-[var(--accent-green)] transition-all" />
                )}

                {authMode === "signup" && (
                  <input type="email" placeholder="your@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[var(--bg-surface)] border border-[var(--border-glass)] rounded-xl px-4 py-3 text-[#e2ffe8] focus:outline-none focus:border-[var(--accent-green)] transition-all" />
                )}
                
                {(authMode === "login" || authMode === "signup") && (
                  <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[var(--bg-surface)] border border-[var(--border-glass)] rounded-xl px-4 py-3 text-[#e2ffe8] focus:outline-none focus:border-[var(--accent-green)] transition-all" />
                )}

                {authMode === "otp" && otpSent && (
                  <input type="text" placeholder="Enter 6-digit OTP" required value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full bg-[var(--bg-surface)] border border-[var(--border-glass)] rounded-xl px-4 py-3 text-[#e2ffe8] focus:outline-none focus:border-[var(--accent-green)] transition-all text-center tracking-[1em] font-bold" maxLength={6} />
                )}
                
                <GlowButton fullWidth type="submit" disabled={loading}>
                  {loading ? "Processing..." : (authMode === "otp" && !otpSent ? "Send OTP →" : "Continue →")}
                </GlowButton>

                <div className="flex flex-col gap-3 pt-4">
                  <button type="button" onClick={() => { setAuthMode(authMode === "login" ? "signup" : "login"); setError(""); setOtpSent(false); }} className="text-sm text-[var(--accent-teal)] hover:text-[var(--text-primary)] transition-colors">
                    {authMode === "login" ? "Don't have an account? Plant your seed" : "Already have an account? Sign in"}
                  </button>
                  
                  <button type="button" onClick={() => { setAuthMode(authMode === "otp" ? "login" : "otp"); setError(""); setOtpSent(false); }} className="text-sm text-[var(--text-muted)] hover:text-[var(--accent-green)] flex items-center justify-center gap-2 transition-colors">
                    {authMode === "otp" ? <Mail size={14} /> : <Smartphone size={14} />}
                    {authMode === "otp" ? "Back to Password Login" : "Login with OTP instead"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
