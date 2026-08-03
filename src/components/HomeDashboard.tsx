"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadProgress } from "@/lib/progress";
import { getWrongAnswers } from "@/lib/wrong-answers";
import { getDueCount } from "@/lib/srs";
import { isDailyCompleted } from "@/lib/daily";
import { getMarkets } from "@/lib/content";
import type { UserProgress } from "@/lib/types";

const TOTAL_LEVELS = 60;

interface WeakTag {
  tag: string;
  count: number;
  market: string;
  chapter: number;
}

function getNextUncompletedLevel(progress: UserProgress): { market: string; chapter: number; level: number } | null {
  const markets = getMarkets();
  for (const m of markets) {
    for (let ch = 1; ch <= m.chapters.length; ch++) {
      for (let lv = 1; lv <= 5; lv++) {
        const key = `${m.market}-${ch}-${lv}`;
        if (!progress.completedLevels[key]) {
          return { market: m.market, chapter: ch, level: lv };
        }
      }
    }
  }
  return null;
}

function getWeakTags(limit = 3): WeakTag[] {
  const wrongAnswers = getWrongAnswers();
  const tagCounts: Record<string, WeakTag> = {};

  for (const wa of wrongAnswers) {
    for (const tag of wa.question.tags) {
      if (!tagCounts[tag]) {
        tagCounts[tag] = { tag, count: 0, market: wa.market, chapter: wa.chapter };
      }
      tagCounts[tag].count++;
    }
  }

  return Object.values(tagCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export default function HomeDashboard() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [dueCount, setDueCount] = useState(0);
  const [dailyDone, setDailyDone] = useState(false);
  const [weakTags, setWeakTags] = useState<WeakTag[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const p = loadProgress();
    setProgress(p);
    setDueCount(getDueCount());
    setDailyDone(isDailyCompleted());
    setWeakTags(getWeakTags());
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const completedCount = progress ? Object.keys(progress.completedLevels).length : 0;
  const isNewUser = completedCount === 0;

  if (isNewUser) {
    return <WelcomeView />;
  }

  const nextLevel = progress ? getNextUncompletedLevel(progress) : null;

  return (
    <div className="flex flex-col gap-6 px-5 pt-10 pb-24">
      <h1 className="text-3xl font-black text-duo-green">StockLingo</h1>

      {/* Stats overview */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard emoji="🔥" value={progress!.streak.count} label="连续天数" />
        <StatCard emoji="⚡" value={progress!.xp} label="总 XP" />
        <StatCard emoji="📊" value={`${completedCount}/${TOTAL_LEVELS}`} label="完成进度" />
      </div>

      {/* Quick actions */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-duo-gray-300 dark:text-slate-400">
          快捷操作
        </h2>

        <Link
          href="/daily"
          className="card flex items-center gap-4 border-duo-green hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
        >
          <span className="text-3xl">{dailyDone ? "✅" : "📝"}</span>
          <div>
            <h3 className="font-bold dark:text-slate-100">今日一题</h3>
            <p className="text-sm text-duo-gray-300 dark:text-slate-400">
              {dailyDone ? "今天已完成！" : "每天一题，保持手感"}
            </p>
          </div>
        </Link>

        {nextLevel && (
          <Link
            href={`/learn/${nextLevel.market}/${nextLevel.chapter}/${nextLevel.level}`}
            className="card flex items-center gap-4 border-duo-blue hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            <span className="text-3xl">🚀</span>
            <div>
              <h3 className="font-bold dark:text-slate-100">继续学习</h3>
              <p className="text-sm text-duo-gray-300 dark:text-slate-400">
                第{nextLevel.chapter}章 · 第{nextLevel.level}关
              </p>
            </div>
          </Link>
        )}

        {dueCount > 0 && (
          <Link
            href="/review"
            className="card flex items-center gap-4 border-duo-orange hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
          >
            <span className="text-3xl">🧠</span>
            <div>
              <h3 className="font-bold dark:text-slate-100">待复习</h3>
              <p className="text-sm text-duo-gray-300 dark:text-slate-400">
                {dueCount} 道题目到期
              </p>
            </div>
          </Link>
        )}
      </div>

      {/* Weak areas */}
      {weakTags.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-duo-gray-300 dark:text-slate-400">
            薄弱环节
          </h2>
          <div className="space-y-2">
            {weakTags.map((wt) => (
              <Link
                key={wt.tag}
                href={`/learn/${wt.market}/${wt.chapter}`}
                className="card flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-duo-red/30"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚠️</span>
                  <span className="font-medium dark:text-slate-100">{wt.tag}</span>
                </div>
                <span className="text-sm text-duo-red font-bold">{wt.count}次出错</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Market selection */}
      <div className="space-y-3 pt-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-duo-gray-300 dark:text-slate-400">
          探索更多
        </h2>
        <MarketLinks />
      </div>
    </div>
  );
}

function StatCard({ emoji, value, label }: { emoji: string; value: string | number; label: string }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-slate-800 border border-duo-gray-200 dark:border-slate-700 p-4 text-center shadow-sm">
      <div className="text-2xl">{emoji}</div>
      <div className="text-xl font-black text-duo-gray-500 dark:text-slate-100">{value}</div>
      <div className="text-xs text-duo-gray-300 dark:text-slate-400">{label}</div>
    </div>
  );
}

function WelcomeView() {
  return (
    <div className="flex flex-col items-center gap-8 px-6 pt-16 pb-24">
      <h1 className="text-4xl font-black text-duo-green">StockLingo</h1>
      <p className="text-center text-duo-gray-400 dark:text-slate-400">
        用游戏化方式学炒股
        <br />
        像学语言一样学投资
      </p>
      <div className="w-full space-y-4 pt-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-duo-gray-300 dark:text-slate-400">
          选择市场开始学习
        </h2>
        <MarketLinks />
      </div>
    </div>
  );
}

function MarketLinks() {
  const markets = getMarkets();
  return (
    <div className="space-y-3">
      {markets.map((m) => (
        <Link
          key={m.market}
          href={`/learn/${m.market}`}
          className="card flex items-center gap-4 border-duo-green hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
        >
          <span className="text-4xl">{m.icon}</span>
          <div>
            <h3 className="text-lg font-bold dark:text-slate-100">{m.name}</h3>
            <p className="text-sm text-duo-gray-300 dark:text-slate-400">
              {m.chapters.length}章 · {m.chapters.length * 5}关
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
