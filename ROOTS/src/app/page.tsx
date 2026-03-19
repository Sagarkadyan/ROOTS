"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { GlowButton } from "../components/ui/GlowButton";
import { Leaf, Smartphone, Mail, LoaderCircle } from "lucide-react";

const FireflyBackground = dynamic(() => import("../components/ui/FireflyBackground").then(mod => mod.FireflyBackground), {
  ssr: false
});

export default function AuthPage() {
  const [showForm, setShowForm] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup" | "otp">("login");
  const [isRedirecting, setIsRedirecting] = useState(false);
  
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

  useEffect(() => {
    // Check if session exists and redirect with a slight delay for aesthetic
    fetch("/api/session")
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.status === "success") {
          setIsRedirecting(true);
          setTimeout(() => {
            window.location.href = "/root";
          }, 1500);
        } else {
          setShowForm(true);
        }
      })
      .catch(() => {
        setShowForm(true);
      });
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
          setIsRedirecting(true);
          window.location.href = "/root";
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

  if (isRedirecting) {
    return (
      <main className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-[#050a0e]">
        <FireflyBackground count={15} />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6 z-10"
        >
          <div className="w-16 h-16 rounded-full border-4 border-[var(--accent-green)] border-t-transparent animate-spin mb-4" />
          <h1 className="font-display font-bold text-6xl text-gradient tracking-widest animate-pulse">
            ROOTS
          </h1>
          <p className="text-[var(--text-muted)] font-body tracking-widest uppercase text-sm">
            Entering the network...
          </p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-[#050a0e]">
      <FireflyBackground count={25} />
      
      {/* Background Stylized Tree Stem */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-end justify-center w-[600px] h-[500px] opacity-20 pointer-events-none">
        <svg viewBox="0 0 400 400" className="w-full h-full transform origin-bottom filter blur-sm">
           <motion.path 
             d="M 200 400 C 200 300 180 200 200 100" 
             fill="transparent" 
             stroke="var(--accent-green)" 
             strokeWidth="20" 
             initial={{ pathLength: 0 }} 
             animate={{ pathLength: 1 }} 
             transition={{ duration: 3, ease: "easeInOut" }} 
           />
           <motion.path 
             d="M 200 300 C 150 250 100 200 50 150" 
             fill="transparent" 
             stroke="var(--accent-teal)" 
             strokeWidth="8" 
             initial={{ pathLength: 0 }} 
             animate={{ pathLength: 1 }} 
             transition={{ duration: 3, delay: 0.5 }} 
           />
           <motion.path 
             d="M 200 250 C 250 200 300 150 350 100" 
             fill="transparent" 
             stroke="var(--accent-purple)" 
             strokeWidth="8" 
             initial={{ pathLength: 0 }} 
             animate={{ pathLength: 1 }} 
             transition={{ duration: 3, delay: 0.8 }} 
           />
        </svg>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="z-10 w-full max-w-[440px] px-4"
          >
            <div className="bg-glass-card p-10 flex flex-col items-center shadow-[0_0_50px_rgba(0,0,0,0.5)] border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[var(--accent-green)]/30 rounded-tl-xl transition-all group-hover:border-[var(--accent-green)]" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[var(--accent-green)]/30 rounded-tr-xl transition-all group-hover:border-[var(--accent-green)]" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[var(--accent-green)]/30 rounded-bl-xl transition-all group-hover:border-[var(--accent-green)]" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[var(--accent-green)]/30 rounded-br-xl transition-all group-hover:border-[var(--accent-green)]" />

              <motion.div
                initial={{ rotate: -10, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Leaf className="text-[var(--accent-green)] w-12 h-12 mb-4 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
              </motion.div>
              
              <h1 className="font-display font-bold text-5xl text-gradient mb-2 tracking-[0.2em] text-center drop-shadow-[0_0_15px_rgba(74,222,128,0.3)]">
                ROOTS
              </h1>
              <p className="text-[var(--text-muted)] text-center mb-8 font-body tracking-wider uppercase text-xs opacity-80">
                {authMode === "login" ? "Network Authentication" : authMode === "signup" ? "New Node Initialization" : "Identity Verification"}
              </p>

              {error && (
                <motion.p initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-red-400 text-sm mb-6 text-center bg-red-400/10 py-3 px-4 rounded-xl border border-red-400/20 w-full">
                  {error}
                </motion.p>
              )}

              <form onSubmit={handleSubmit} className="w-full space-y-4">
                {authMode === "signup" && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <input type="text" placeholder="Full Name" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[var(--bg-surface)]/50 border border-[var(--border-glass)] rounded-xl px-4 py-3.5 text-[#e2ffe8] focus:outline-none focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)]/30 transition-all placeholder:text-white/20" />
                    <input type="tel" placeholder="Phone Number" value={number} onChange={(e) => setNumber(e.target.value)} className="w-full bg-[var(--bg-surface)]/50 border border-[var(--border-glass)] rounded-xl px-4 py-3.5 text-[#e2ffe8] focus:outline-none focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)]/30 transition-all placeholder:text-white/20" />
                  </motion.div>
                )}
                
                {(authMode === "login" || (authMode === "otp" && !otpSent)) && (
                  <input type="text" placeholder="Identifier (Name or Email)" required value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="w-full bg-[var(--bg-surface)]/50 border border-[var(--border-glass)] rounded-xl px-4 py-3.5 text-[#e2ffe8] focus:outline-none focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)]/30 transition-all placeholder:text-white/20 shadow-inner" />
                )}

                {authMode === "signup" && (
                  <input type="email" placeholder="Access Email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[var(--bg-surface)]/50 border border-[var(--border-glass)] rounded-xl px-4 py-3.5 text-[#e2ffe8] focus:outline-none focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)]/30 transition-all placeholder:text-white/20" />
                )}
                
                {(authMode === "login" || authMode === "signup") && (
                  <input type="password" placeholder="Passkey" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[var(--bg-surface)]/50 border border-[var(--border-glass)] rounded-xl px-4 py-3.5 text-[#e2ffe8] focus:outline-none focus:border-[var(--accent-green)] focus:ring-1 focus:ring-[var(--accent-green)]/30 transition-all placeholder:text-white/20" />
                )}

                {authMode === "otp" && otpSent && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <input type="text" placeholder="● ● ● ● ● ●" required value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full bg-[var(--bg-surface)] border border-[var(--accent-green)]/50 rounded-xl px-4 py-4 text-[var(--accent-green)] focus:outline-none focus:border-[var(--accent-green)] transition-all text-center tracking-[1.5em] font-bold text-2xl shadow-[0_0_20px_rgba(74,222,128,0.2)]" maxLength={6} />
                    <p className="text-center text-xs text-[var(--text-muted)] mt-2">Check your device for the verification code</p>
                  </motion.div>
                )}
                
                <div className="pt-2">
                  <GlowButton fullWidth type="submit" disabled={loading}>
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <LoaderCircle className="w-4 h-4 animate-spin" />
                        <span>Synchronizing...</span>
                      </div>
                    ) : (
                      authMode === "otp" && !otpSent ? "Authorize via OTP →" : "Establish Connection →"
                    )}
                  </GlowButton>
                </div>

                <div className="flex flex-col gap-4 pt-6 border-t border-white/5">
                  <button type="button" onClick={() => { setAuthMode(authMode === "login" ? "signup" : "login"); setError(""); setOtpSent(false); }} className="text-xs font-bold tracking-widest text-[var(--accent-teal)] hover:text-[var(--text-primary)] transition-all uppercase flex items-center justify-center gap-2 group/btn">
                    <span>{authMode === "login" ? "New user? Create node" : "Existing user? Authenticate"}</span>
                    <span className="opacity-0 group-hover/btn:opacity-100 transition-all translate-x-[-10px] group-hover/btn:translate-x-0">»</span>
                  </button>
                  
                  <button type="button" onClick={() => { setAuthMode(authMode === "otp" ? "login" : "otp"); setError(""); setOtpSent(false); }} className="text-[10px] text-[var(--text-muted)] hover:text-[var(--accent-green)] flex items-center justify-center gap-2 transition-all uppercase tracking-tighter">
                    {authMode === "otp" ? <Mail size={12} /> : <Smartphone size={12} />}
                    {authMode === "otp" ? "Standard Passkey Protocol" : "Secondary OTP Protocol"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="absolute bottom-8 left-8 text-[8px] text-white/10 uppercase tracking-[0.5em] pointer-events-none">
        Secure Terminal // System v4.2.0-roots
      </div>
    </main>
  );
}
