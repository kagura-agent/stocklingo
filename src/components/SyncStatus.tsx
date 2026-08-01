"use client";

import { useAuth } from "@/components/AuthProvider";
import { useSyncContext } from "@/components/SyncProvider";

export default function SyncStatus() {
  const { user } = useAuth();
  const { syncStatus, lastSyncTime } = useSyncContext();

  if (!user) return null;

  return (
    <div className="flex items-center gap-1 text-xs">
      {syncStatus === "syncing" && (
        <span className="text-duo-gray-300 dark:text-slate-400 animate-spin">⟳</span>
      )}
      {syncStatus === "synced" && (
        <span className="text-green-500" title={`上次同步: ${lastSyncTime}`}>✓</span>
      )}
      {syncStatus === "error" && (
        <span className="text-red-500" title="同步失败">✗</span>
      )}
    </div>
  );
}
