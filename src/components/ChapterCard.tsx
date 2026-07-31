"use client";

import Link from "next/link";

export default function ChapterCard({
  market,
  id,
  title,
  titleEn,
  description,
  levels,
  locked,
  completedLevels,
}: {
  market: string;
  id: number;
  title: string;
  titleEn: string;
  description: string;
  levels: number;
  locked: boolean;
  completedLevels: number;
}) {
  return (
    <div className={`card ${locked ? "opacity-50" : ""} space-y-4`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold dark:text-slate-100">{title}</h2>
          <p className="text-sm text-duo-gray-300 dark:text-slate-400">{titleEn}</p>
        </div>
        {locked && <span className="text-2xl">🔒</span>}
        {!locked && completedLevels === levels && (
          <span className="text-2xl">⭐</span>
        )}
      </div>
      <p className="text-sm text-duo-gray-400 dark:text-slate-400">{description}</p>
      {!locked && (
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: levels }, (_, i) => i + 1).map((level) => {
            const done = level <= completedLevels;
            const isBoss = level === levels;
            return (
              <Link
                key={level}
                href={`/learn/${market}/${id}/${level}`}
                className={`flex h-12 w-12 items-center justify-center rounded-full border-2 border-b-4 font-bold transition-all ${
                  done
                    ? "border-duo-green bg-duo-green text-white"
                    : isBoss
                      ? "border-duo-orange bg-orange-50 dark:bg-orange-900/20 text-duo-orange"
                      : "border-duo-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-duo-gray-400 dark:text-slate-400 hover:border-duo-green hover:text-duo-green"
                }`}
              >
                {isBoss ? "👑" : level}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
