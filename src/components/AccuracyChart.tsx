"use client";

import { useMemo } from "react";
import { getActivities } from "@/lib/activity";

export default function AccuracyChart() {
  const points = useMemo(() => {
    const activities = getActivities();
    const recent = activities.slice(-20);
    return recent.map((a) =>
      a.total > 0 ? Math.round((a.score / a.total) * 100) : 0
    );
  }, []);

  if (points.length === 0) {
    return (
      <div className="card space-y-3">
        <h2 className="font-bold dark:text-slate-100">正确率趋势</h2>
        <p className="text-sm text-duo-gray-300 dark:text-slate-400">完成关卡后显示趋势图</p>
      </div>
    );
  }

  const width = 300;
  const height = 150;
  const padX = 30;
  const padY = 20;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;

  const xStep = points.length > 1 ? chartW / (points.length - 1) : 0;
  const pathPoints = points.map((p, i) => ({
    x: padX + i * xStep,
    y: padY + chartH - (p / 100) * chartH,
  }));

  const pathD = pathPoints
    .map((pt, i) => `${i === 0 ? "M" : "L"} ${pt.x} ${pt.y}`)
    .join(" ");

  return (
    <div className="card space-y-3">
      <h2 className="font-bold dark:text-slate-100">正确率趋势</h2>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-sm mx-auto">
          {[0, 25, 50, 75, 100].map((v) => {
            const y = padY + chartH - (v / 100) * chartH;
            return (
              <g key={v}>
                <line
                  x1={padX}
                  y1={y}
                  x2={width - padX}
                  y2={y}
                  className="stroke-duo-gray-200 dark:stroke-slate-700"
                  strokeWidth={0.5}
                />
                <text
                  x={padX - 4}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-duo-gray-300 dark:fill-slate-500 text-[8px]"
                >
                  {v}%
                </text>
              </g>
            );
          })}
          <path
            d={pathD}
            fill="none"
            className="stroke-duo-green"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {pathPoints.map((pt, i) => (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r={3}
              className="fill-duo-green"
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
