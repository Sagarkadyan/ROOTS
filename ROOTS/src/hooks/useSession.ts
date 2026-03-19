import { useState, useEffect } from 'react';

export const useSession = () => {
  const [session, setSession] = useState<any>(null);
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  useEffect(() => {
    let isMounted = true;
    
    fetch("/api/session")
      .then(res => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then(data => {
        if (isMounted && data.status === "success") {
          setSession({ user: data.user });
          setStatus("authenticated");
        }
      })
      .catch(err => {
        if (isMounted) {
          setSession(null);
          setStatus("unauthenticated");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { data: session, status };
};
