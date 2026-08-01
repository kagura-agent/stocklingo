"use client";

import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { isSupabaseEnabled, downloadAndMerge } from "@/lib/sync";
import { createClient } from "@/lib/supabase/client";

export type SyncStatus = "idle" | "syncing" | "synced" | "error";

export function useSync() {
  const { user } = useAuth();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  const triggerSync = useCallback(async () => {
    if (!user || !isSupabaseEnabled()) return;
    setSyncStatus("syncing");
    try {
      const supabase = createClient();
      await downloadAndMerge(supabase, user.id);
      const now = new Date().toLocaleTimeString();
      setLastSyncTime(now);
      setSyncStatus("synced");
    } catch {
      setSyncStatus("error");
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      triggerSync();
    } else {
      setSyncStatus("idle");
      setLastSyncTime(null);
    }
  }, [user, triggerSync]);

  return { syncStatus, lastSyncTime, triggerSync };
}
