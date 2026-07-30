"use client";

import Link from "next/link";
import { generateLevelCard, shareCanvas } from "@/lib/shareCard";
import { getMetadata } from "@/lib/content";

export default function LevelSummary({
  score,
  total,
  xpEarned,
  chapter,
}: {
  score: number;
  total: number;
  xpEarned: number;
  chapter: number;
}) {
  const pct = Math.round((score / total) * 100);
  const passed = pct >= 60;

  function handleShare() {
    const meta = getMetadata();
    const chapterMeta = meta.chapters.find((c) => c.id === chapter);
    const chapterName = chapterMeta ? chapterMeta.title : `第${chapter}章`;
    const canvas = generateLevelCard({ chapterName, score, total, xpEarned });
    shareCanvas(canvas);
  }

  return (
    <div className="flex flex-col items-center gap-6 py-10">
      <div
        className={`text-6xl font-black ${passed ? "text-duo-green" : "text-duo-red"}`}
      >
        {pct}%
      </div>
      <p className="text-lg text-duo-gray-400">
        {score}/{total} 题正确
      </p>
      <div className="text-2xl font-bold text-duo-orange">+{xpEarned} XP</div>
      <p className="text-duo-gray-300">
        {passed ? "太棒了！继续前进！" : "再接再厉，重新挑战！"}
      </p>
      <div className="mt-4 flex gap-3">
        <Link href="/learn" className="btn-primary inline-block">
          返回学习
        </Link>
        <button
          onClick={handleShare}
          className="rounded-xl border-2 border-duo-green px-6 py-3 font-bold text-duo-green transition-colors hover:bg-duo-green hover:text-white"
        >
          分享成绩
        </button>
      </div>
    </div>
  );
}
