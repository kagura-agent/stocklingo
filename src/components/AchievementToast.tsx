"use client";

import { useEffect, useState } from "react";
import type { Achievement } from "@/lib/achievements";

const TIER_COLORS: Record<string, string> = {
  bronze: "#CD7F32",
  silver: "#C0C0C0",
  gold: "#FFD700",
};

export default function AchievementToast({ achievements }: { achievements: Achievement[] }) {
  const [visible, setVisible] = useState<Achievement[]>([]);

  useEffect(() => {
    if (achievements.length === 0) return;
    setVisible(achievements);
    const timer = setTimeout(() => setVisible([]), 3000);
    return () => clearTimeout(timer);
  }, [achievements]);

  if (visible.length === 0) return null;

  return (
    <div className="fixed bottom-20 left-0 right-0 z-50 flex flex-col items-center gap-2 pointer-events-none">
      {visible.map((a) => (
        <div
          key={a.id}
          className="achievement-toast-enter rounded-2xl bg-white dark:bg-slate-800 px-5 py-3 shadow-lg flex items-center gap-3 pointer-events-auto"
          style={{ borderLeft: `4px solid ${TIER_COLORS[a.tier]}` }}
        >
          <span className="text-3xl">{a.emoji}</span>
          <div>
            <div className="font-bold text-sm dark:text-slate-100">{a.label}</div>
            <div className="text-xs text-duo-gray-300 dark:text-slate-400">{a.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
