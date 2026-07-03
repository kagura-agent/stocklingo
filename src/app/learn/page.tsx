"use client";

import { useEffect, useState } from "react";
import ChapterCard from "@/components/ChapterCard";
import BottomNav from "@/components/BottomNav";
import { loadProgress, isLevelCompleted, isChapterUnlocked } from "@/lib/progress";
import type { ChapterMeta, UserProgress } from "@/lib/types";

const chapters: ChapterMeta[] = [
  {
    id: 1,
    title: "股票是什么",
    titleEn: "What is a Stock",
    description: "从零开始，搞懂股票的本质和A股的基本规则",
    levels: 5,
    unlockCondition: null,
  },
  {
    id: 2,
    title: "看懂行情",
    titleEn: "Reading the Market",
    description: "K线、成交量、估值指标——看懂市场在说什么",
    levels: 5,
    unlockCondition: { chapter: 1, minScore: 0.6 },
  },
  {
    id: 3,
    title: "牛熊往事",
    titleEn: "Bulls & Bubbles",
    description: "穿越A股20年，在历史事件中学会生存",
    levels: 5,
    unlockCondition: { chapter: 2, minScore: 0.6 },
  },
];

export default function LearnPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  function getCompletedLevels(chapterId: number, totalLevels: number): number {
    let count = 0;
    for (let l = 1; l <= totalLevels; l++) {
      if (isLevelCompleted(chapterId, l)) count++;
    }
    return count;
  }

  return (
    <>
      <div className="space-y-6 px-6 pt-10">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🇨🇳</span>
          <div>
            <h1 className="text-2xl font-black">A股市场</h1>
            <p className="text-sm text-duo-gray-300">
              {progress ? `${progress.xp} XP` : "加载中..."}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {chapters.map((ch) => (
            <ChapterCard
              key={ch.id}
              id={ch.id}
              title={ch.title}
              titleEn={ch.titleEn}
              description={ch.description}
              levels={ch.levels}
              locked={!isChapterUnlocked(ch.id, ch.unlockCondition)}
              completedLevels={getCompletedLevels(ch.id, ch.levels)}
            />
          ))}
        </div>
      </div>
      <BottomNav />
    </>
  );
}
