"use client";

import { useEffect, useState } from "react";
import ChapterCard from "@/components/ChapterCard";
import BottomNav from "@/components/BottomNav";
import { loadProgress, isLevelCompleted, isChapterUnlocked } from "@/lib/progress";
import { getMarketMetadata } from "@/lib/content";
import type { UserProgress } from "@/lib/types";

export default function MarketLearnClient({ market }: { market: string }) {
  const meta = getMarketMetadata(market);
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  function getCompletedLevels(chapterId: number, totalLevels: number): number {
    let count = 0;
    for (let l = 1; l <= totalLevels; l++) {
      if (isLevelCompleted(market, chapterId, l)) count++;
    }
    return count;
  }

  return (
    <>
      <div className="space-y-6 px-6 pt-10">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{meta.icon}</span>
          <div>
            <h1 className="text-2xl font-black dark:text-slate-100">{meta.name}</h1>
            <p className="text-sm text-duo-gray-300 dark:text-slate-400">
              {progress ? `${progress.xp} XP` : "加载中..."}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {meta.chapters.map((ch) => (
            <ChapterCard
              key={ch.id}
              market={market}
              id={ch.id}
              title={ch.title}
              titleEn={ch.titleEn}
              description={ch.description}
              levels={ch.levels}
              locked={!isChapterUnlocked(market, ch.id, ch.unlockCondition)}
              completedLevels={getCompletedLevels(ch.id, ch.levels)}
            />
          ))}
        </div>
      </div>
      <BottomNav />
    </>
  );
}
