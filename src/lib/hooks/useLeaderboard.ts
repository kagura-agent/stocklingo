"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export type TimeRange = "all" | "week" | "month";

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  xp: number;
  streak: number;
}

export function useLeaderboard(timeRange: TimeRange = "all") {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data: rows, error: rpcError } = await supabase.rpc(
        "get_leaderboard",
        { time_range: timeRange, limit_count: 50 }
      );
      if (rpcError) throw rpcError;
      setData(rows ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "加载排行榜失败");
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
