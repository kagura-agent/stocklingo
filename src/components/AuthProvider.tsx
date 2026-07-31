"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  enabled: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: false,
  enabled: false,
});

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const enabled = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    import("@/lib/supabase/client").then(({ createClient }) => {
      const supabase = createClient();

      supabase.auth.getUser().then(({ data: { user } }) => {
        setUser(user);
        setLoading(false);
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

      return () => subscription.unsubscribe();
    });
  }, [enabled]);

  return (
    <AuthContext.Provider value={{ user, loading, enabled }}>
      {children}
    </AuthContext.Provider>
  );
}
