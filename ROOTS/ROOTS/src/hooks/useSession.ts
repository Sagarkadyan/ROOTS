import { useState, useEffect } from 'react';

export interface UserSession {
  name: string;
  email?: string;
  level: number;
  xp: number;
  maxXP: number;
  streak: number;
  longestStreak: number;
  totalXPEarned: number;
  sessionsThisMonth: number;
  title?: string;
  memberSince?: string;
}

export const useSession = () => {
  const [session, setSession] = useState<{ user: UserSession } | null>(null);
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  useEffect(() => {
    fetch("/api/session")
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setSession({ user: data.user });
          setStatus("authenticated");
        } else {
          setStatus("unauthenticated");
        }
      })
      .catch(err => {
        console.error("Session fetch failed", err);
        setStatus("unauthenticated");
      });
  }, []);

  return { data: session, status };
};
