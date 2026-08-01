"use client";

import { useEffect, useState, useRef } from "react";
import { loadProgress } from "@/lib/progress";
import type { UserProgress } from "@/lib/types";
import { generateProfileCard, shareCanvas } from "@/lib/shareCard";
import { getMarkets } from "@/lib/content";
import { getActivities } from "@/lib/activity";
import { getSRSReviewCount } from "@/lib/srs-tracker";
import { exportData, importData } from "@/lib/backup";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import ThemeToggle from "@/components/ThemeToggle";
import ActivityHeatmap from "@/components/ActivityHeatmap";
import AccuracyChart from "@/components/AccuracyChart";
import { isSupabaseEnabled } from "@/lib/sync";

interface Achievement {
  emoji: string;
  lockedEmoji: string;
  label: string;
  check: (ctx: AchievementContext) => boolean;
}

interface AchievementContext {
  completedCount: number;
  streak: number;
  progress: UserProgress;
  activities: { score: number; total: number }[];
  srsReviewCount: number;
}

const achievements: Achievement[] = [
  { emoji: "🌟", lockedEmoji: "🔒", label: "初学者", check: (c) => c.completedCount >= 1 },
  { emoji: "📈", lockedEmoji: "🔒", label: "行情通", check: (c) => c.completedCount >= 5 },
  { emoji: "🏆", lockedEmoji: "🔒", label: "老股民", check: (c) => c.completedCount >= 10 },
  { emoji: "👑", lockedEmoji: "🔒", label: "股神", check: (c) => c.completedCount >= 15 },
  { emoji: "🔥", lockedEmoji: "🔒", label: "三天打鱼", check: (c) => c.streak >= 3 },
  { emoji: "⚡", lockedEmoji: "🔒", label: "周周不断", check: (c) => c.streak >= 7 },
  { emoji: "💎", lockedEmoji: "🔒", label: "月度坚持", check: (c) => c.streak >= 30 },
  {
    emoji: "💯", lockedEmoji: "🔒", label: "满分选手",
    check: (c) => Object.values(c.progress.completedLevels).some((l) => l.score === l.total),
  },
  {
    emoji: "🎯", lockedEmoji: "🔒", label: "精准射手",
    check: (c) => {
      const acts = c.activities;
      if (acts.length < 5) return false;
      for (let i = acts.length - 5; i < acts.length; i++) {
        if (acts[i].total === 0 || acts[i].score / acts[i].total < 0.8) return false;
      }
      return true;
    },
  },
  {
    emoji: "🌏", lockedEmoji: "🔒", label: "全球视野",
    check: (c) => {
      const keys = Object.keys(c.progress.completedLevels);
      const hasAShares = keys.some((k) => k.startsWith("a-shares-"));
      const hasHK = keys.some((k) => k.startsWith("hk-us-"));
      if (!hasAShares || !hasHK) return false;
      const aChapters = new Set(keys.filter((k) => k.startsWith("a-shares-")).map((k) => k.split("-")[2]));
      const hkChapters = new Set(keys.filter((k) => k.startsWith("hk-us-")).map((k) => k.split("-")[2]));
      return aChapters.size >= 1 && hkChapters.size >= 1;
    },
  },
  {
    emoji: "📚", lockedEmoji: "🔒", label: "学霸",
    check: (c) => {
      const markets = getMarkets();
      return markets.some((m) => {
        const totalLevels = m.chapters.reduce((s, ch) => s + ch.levels, 0);
        const completedInMarket = Object.keys(c.progress.completedLevels).filter(
          (k) => k.startsWith(`${m.market}-`)
        ).length;
        return completedInMarket >= totalLevels && totalLevels > 0;
      });
    },
  },
  { emoji: "🧠", lockedEmoji: "🔒", label: "温故知新", check: (c) => c.srsReviewCount >= 10 },
];

export default function ProfilePage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  if (!progress) {
    return (
      <div className="flex items-center justify-center pt-20">
        <div className="text-duo-gray-300 dark:text-slate-400">加载中...</div>
      </div>
    );
  }

  const completedCount = Object.keys(progress.completedLevels).length;
  const totalLevels = getMarkets().reduce(
    (sum, m) => sum + m.chapters.reduce((s, ch) => s + ch.levels, 0),
    0
  );

  const achievementCtx: AchievementContext = {
    completedCount,
    streak: progress.streak.count,
    progress,
    activities: getActivities(),
    srsReviewCount: getSRSReviewCount(),
  };

  function handleShare() {
    const canvas = generateProfileCard({
      totalXp: progress!.xp,
      streak: progress!.streak.count,
      completedLevels: completedCount,
    });
    shareCanvas(canvas);
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await importData(file);
      setImportMsg("导入成功！");
      setProgress(loadProgress());
    } catch (err) {
      setImportMsg(err instanceof Error ? err.message : "导入失败");
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <>
      <div className="space-y-6 px-6 pt-10 pb-24">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black dark:text-slate-100">我的</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={handleShare}
              className="rounded-xl border-2 border-duo-green px-4 py-2 text-sm font-bold text-duo-green transition-colors hover:bg-duo-green hover:text-white"
            >
              分享成绩
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="card flex flex-col items-center gap-2 py-6">
            <span className="text-3xl font-black text-duo-orange">
              {progress.xp}
            </span>
            <span className="text-sm text-duo-gray-300 dark:text-slate-400">总经验值</span>
          </div>
          <div className="card flex flex-col items-center gap-2 py-6">
            <span className="text-3xl font-black text-duo-red">
              {progress.streak.count}
            </span>
            <span className="text-sm text-duo-gray-300 dark:text-slate-400">连续打卡</span>
          </div>
        </div>

        <div className="card space-y-3">
          <h2 className="font-bold dark:text-slate-100">学习进度</h2>
          <div className="flex items-center justify-between text-sm">
            <span className="text-duo-gray-400 dark:text-slate-400">已完成关卡</span>
            <span className="font-bold">{completedCount} / {totalLevels}</span>
          </div>
          <div className="h-3 w-full rounded-full bg-duo-gray-200 dark:bg-slate-700">
            <div
              className="h-3 rounded-full bg-duo-green transition-all"
              style={{ width: `${(completedCount / totalLevels) * 100}%` }}
            />
          </div>
        </div>

        <ActivityHeatmap />
        <AccuracyChart />

        <div className="card space-y-3">
          <h2 className="font-bold dark:text-slate-100">成就</h2>
          <div className="grid grid-cols-4 gap-3 text-center">
            {achievements.map((a) => {
              const unlocked = a.check(achievementCtx);
              return (
                <div key={a.label} className="flex flex-col items-center gap-1">
                  <span className="text-2xl">{unlocked ? a.emoji : a.lockedEmoji}</span>
                  <span className="text-xs text-duo-gray-300 dark:text-slate-400">{a.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {isSupabaseEnabled() && (
          <Link
            href="/leaderboard"
            className="card flex items-center justify-between px-4 py-4 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏆</span>
              <span className="font-bold dark:text-slate-100">查看排行榜</span>
            </div>
            <span className="text-duo-gray-300 dark:text-slate-500">→</span>
          </Link>
        )}

        <div className="card space-y-3">
          <h2 className="font-bold dark:text-slate-100">数据管理</h2>
          <div className="flex gap-3">
            <button
              onClick={exportData}
              className="flex-1 rounded-xl bg-duo-green px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              导出数据
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 rounded-xl border-2 border-duo-green px-4 py-2 text-sm font-bold text-duo-green transition-colors hover:bg-duo-green hover:text-white"
            >
              导入数据
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </div>
          {importMsg && (
            <p className="text-sm text-duo-gray-400 dark:text-slate-400">{importMsg}</p>
          )}
        </div>
      </div>
      <BottomNav />
    </>
  );
}
