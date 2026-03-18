import { useState, useEffect } from 'react';
import { mockUser } from '@/lib/mockUser';

export const useSession = () => {
  const [session, setSession] = useState<{ user: typeof mockUser } | null>(null);
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  useEffect(() => {
    // Simulate fetching from an authenticated user session dynamically
    const timer = setTimeout(() => {
      setSession({ user: mockUser });
      setStatus("authenticated");
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return { data: session, status };
};
