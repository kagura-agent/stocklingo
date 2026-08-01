"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { useLeaderboard, TimeRange } from "@/lib/hooks/useLeaderboard";
import { isSupabaseEnabled } from "@/lib/sync";
import BottomNav from "@/components/BottomNav";

const TIME_TABS: { key: TimeRange; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "week", label: "本周" },
  { key: "month", label: "本月" },
];

function MedalIcon({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-2xl">🥇</span>;
  if (rank === 2) return <span className="text-2xl">🥈</span>;
  if (rank === 3) return <span className="text-2xl">🥉</span>;
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-duo-gray-200 dark:bg-slate-700 text-sm font-bold text-duo-gray-400 dark:text-slate-300">
      {rank}
    </span>
  );
}

export default function LeaderboardPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("all");
  const { user } = useAuth();
  const { data, loading, error } = useLeaderboard(timeRange);

  if (!isSupabaseEnabled()) {
    return (
      <>
        <div className="flex flex-col items-center justify-center gap-4 px-6 pt-20 pb-24">
          <span className="text-4xl">🏆</span>
          <p className="text-duo-gray-400 dark:text-slate-400 text-center">
            排行榜功能需要联网使用
          </p>
        </div>
        <BottomNav />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <div className="flex flex-col items-center justify-center gap-4 px-6 pt-20 pb-24">
          <span className="text-4xl">🏆</span>
          <p className="text-duo-gray-400 dark:text-slate-400 text-center">
            登录后可查看排行榜，与其他学员一较高下！
          </p>
          <Link
            href="/auth/login"
            className="rounded-xl bg-duo-green px-6 py-3 font-bold text-white transition-opacity hover:opacity-90"
          >
            去登录
          </Link>
        </div>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <div className="space-y-4 px-6 pt-10 pb-24">
        <h1 className="text-2xl font-black dark:text-slate-100">🏆 排行榜</h1>

        {/* Time range tabs */}
        <div className="flex gap-2">
          {TIME_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setTimeRange(tab.key)}
              className={`flex-1 rounded-xl py-2 text-sm font-bold transition-colors ${
                timeRange === tab.key
                  ? "bg-duo-green text-white"
                  : "bg-duo-gray-100 dark:bg-slate-800 text-duo-gray-400 dark:text-slate-400"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-duo-green border-t-transparent" />
          </div>
        )}

        {error && (
          <div className="card text-center text-duo-red py-6">{error}</div>
        )}

        {!loading && !error && data.length === 0 && (
          <div className="card flex flex-col items-center gap-3 py-8">
            <span className="text-3xl">📊</span>
            <p className="text-duo-gray-400 dark:text-slate-400">
              暂无排行数据，快去学习赚取经验值吧！
            </p>
          </div>
        )}

        {!loading && !error && data.length > 0 && (
          <div className="space-y-3">
            {data.map((entry, i) => {
              const isMe = entry.user_id === user.id;
              return (
                <div
                  key={entry.user_id}
                  className={`card flex items-center gap-3 px-4 py-3 opacity-0 animate-fade-in ${
                    isMe
                      ? "border-2 border-duo-green"
                      : ""
                  } ${entry.rank <= 3 ? "bg-gradient-to-r from-yellow-50/50 to-transparent dark:from-yellow-900/10" : ""}`}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <MedalIcon rank={entry.rank} />

                  {/* Avatar */}
                  {entry.avatar_url ? (
                    <img
                      src={entry.avatar_url}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-duo-blue/20 text-duo-blue font-bold">
                      {entry.display_name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                  )}

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-bold dark:text-slate-100">
                      {entry.display_name}
                      {isMe && (
                        <span className="ml-2 text-xs text-duo-green">(我)</span>
                      )}
                    </p>
                    {entry.streak > 0 && (
                      <p className="text-xs text-duo-gray-300 dark:text-slate-500">
                        🔥 {entry.streak} 天连续
                      </p>
                    )}
                  </div>

                  {/* XP */}
                  <span className="font-black text-duo-orange">
                    {entry.xp} XP
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <BottomNav />
    </>
  );
}
