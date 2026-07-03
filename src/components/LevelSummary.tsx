"use client";

import Link from "next/link";

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
      <Link href="/learn" className="btn-primary mt-4 inline-block">
        返回学习
      </Link>
    </div>
  );
}
