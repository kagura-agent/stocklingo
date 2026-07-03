"use client";

import Link from "next/link";

export default function ChapterCard({
  id,
  title,
  titleEn,
  description,
  levels,
  locked,
  completedLevels,
}: {
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
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="text-sm text-duo-gray-300">{titleEn}</p>
        </div>
        {locked && <span className="text-2xl">🔒</span>}
        {!locked && completedLevels === levels && (
          <span className="text-2xl">⭐</span>
        )}
      </div>
      <p className="text-sm text-duo-gray-400">{description}</p>
      {!locked && (
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: levels }, (_, i) => i + 1).map((level) => {
            const done = level <= completedLevels;
            const isBoss = level === levels;
            return (
              <Link
                key={level}
                href={`/learn/${id}/${level}`}
                className={`flex h-12 w-12 items-center justify-center rounded-full border-2 border-b-4 font-bold transition-all ${
                  done
                    ? "border-duo-green bg-duo-green text-white"
                    : isBoss
                      ? "border-duo-orange bg-orange-50 text-duo-orange"
                      : "border-duo-gray-200 bg-white text-duo-gray-400 hover:border-duo-green hover:text-duo-green"
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
