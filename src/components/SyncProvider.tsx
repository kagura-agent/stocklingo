"use client";

import { createContext, useContext } from "react";
import { useSync, type SyncStatus } from "@/lib/hooks/useSync";

interface SyncContextValue {
  syncStatus: SyncStatus;
  lastSyncTime: string | null;
  triggerSync: () => void;
}

const SyncContext = createContext<SyncContextValue>({
  syncStatus: "idle",
  lastSyncTime: null,
  triggerSync: () => {},
});

export function useSyncContext() {
  return useContext(SyncContext);
}

export default function SyncProvider({ children }: { children: React.ReactNode }) {
  const sync = useSync();

  return (
    <SyncContext.Provider value={sync}>
      {children}
    </SyncContext.Provider>
  );
}
