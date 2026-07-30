"use client";

import { useEffect, useState } from "react";
import { loadProgress } from "@/lib/progress";
import type { UserProgress } from "@/lib/types";
import { generateProfileCard, shareCanvas } from "@/lib/shareCard";
import BottomNav from "@/components/BottomNav";

export default function ProfilePage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  if (!progress) {
    return (
      <div className="flex items-center justify-center pt-20">
        <div className="text-duo-gray-300">加载中...</div>
      </div>
    );
  }

  const completedCount = Object.keys(progress.completedLevels).length;

  function handleShare() {
    const canvas = generateProfileCard({
      totalXp: progress!.xp,
      streak: progress!.streak.count,
      completedLevels: completedCount,
    });
    shareCanvas(canvas);
  }

  return (
    <>
      <div className="space-y-6 px-6 pt-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black">我的</h1>
          <button
            onClick={handleShare}
            className="rounded-xl border-2 border-duo-green px-4 py-2 text-sm font-bold text-duo-green transition-colors hover:bg-duo-green hover:text-white"
          >
            分享成绩
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="card flex flex-col items-center gap-2 py-6">
            <span className="text-3xl font-black text-duo-orange">
              {progress.xp}
            </span>
            <span className="text-sm text-duo-gray-300">总经验值</span>
          </div>
          <div className="card flex flex-col items-center gap-2 py-6">
            <span className="text-3xl font-black text-duo-red">
              {progress.streak.count}
            </span>
            <span className="text-sm text-duo-gray-300">连续打卡</span>
          </div>
        </div>

        <div className="card space-y-3">
          <h2 className="font-bold">学习进度</h2>
          <div className="flex items-center justify-between text-sm">
            <span className="text-duo-gray-400">已完成关卡</span>
            <span className="font-bold">{completedCount} / 15</span>
          </div>
          <div className="h-3 w-full rounded-full bg-duo-gray-200">
            <div
              className="h-3 rounded-full bg-duo-green transition-all"
              style={{ width: `${(completedCount / 15) * 100}%` }}
            />
          </div>
        </div>

        <div className="card space-y-3">
          <h2 className="font-bold">成就</h2>
          <div className="flex gap-4 text-center">
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl">{completedCount > 0 ? "🌟" : "🔒"}</span>
              <span className="text-xs text-duo-gray-300">初学者</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl">{completedCount >= 5 ? "📈" : "🔒"}</span>
              <span className="text-xs text-duo-gray-300">行情通</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl">{completedCount >= 10 ? "🏆" : "🔒"}</span>
              <span className="text-xs text-duo-gray-300">老股民</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl">{completedCount >= 15 ? "👑" : "🔒"}</span>
              <span className="text-xs text-duo-gray-300">股神</span>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
