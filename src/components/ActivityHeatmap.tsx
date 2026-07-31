"use client";

import { useMemo } from "react";
import { getActivities } from "@/lib/activity";

export default function ActivityHeatmap() {
  const data = useMemo(() => {
    const activities = getActivities();
    const counts: Record<string, number> = {};
    for (const a of activities) {
      const date = a.timestamp.split("T")[0];
      counts[date] = (counts[date] || 0) + 1;
    }

    const today = new Date();
    const dayOfWeek = (today.getDay() + 6) % 7; // Mon=0
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - dayOfWeek));

    const cells: { date: string; count: number; col: number; row: number }[] = [];
    for (let week = 0; week < 12; week++) {
      for (let day = 0; day < 7; day++) {
        const d = new Date(endOfWeek);
        d.setDate(endOfWeek.getDate() - (11 - week) * 7 - (6 - day));
        if (d > today) continue;
        const dateStr = d.toISOString().split("T")[0];
        cells.push({ date: dateStr, count: counts[dateStr] || 0, col: week, row: day });
      }
    }
    return cells;
  }, []);

  function getColor(count: number): string {
    if (count === 0) return "fill-duo-gray-200 dark:fill-slate-700";
    if (count === 1) return "fill-green-300 dark:fill-green-800";
    if (count <= 3) return "fill-green-500 dark:fill-green-600";
    return "fill-green-700 dark:fill-green-400";
  }

  const cellSize = 14;
  const gap = 3;

  return (
    <div className="card space-y-3">
      <h2 className="font-bold dark:text-slate-100">学习活动</h2>
      <div className="overflow-x-auto">
        <svg
          width={12 * (cellSize + gap)}
          height={7 * (cellSize + gap)}
          className="mx-auto"
        >
          {data.map((cell) => (
            <rect
              key={cell.date}
              x={cell.col * (cellSize + gap)}
              y={cell.row * (cellSize + gap)}
              width={cellSize}
              height={cellSize}
              rx={3}
              className={getColor(cell.count)}
            />
          ))}
        </svg>
      </div>
      <div className="flex items-center justify-end gap-1 text-xs text-duo-gray-300 dark:text-slate-400">
        <span>少</span>
        <svg width={52} height={12}>
          {[0, 1, 2, 4].map((c, i) => (
            <rect
              key={i}
              x={i * 13}
              y={0}
              width={10}
              height={10}
              rx={2}
              className={getColor(c)}
            />
          ))}
        </svg>
        <span>多</span>
      </div>
    </div>
  );
}
