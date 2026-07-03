"use client";

import Link from "next/link";

export default function ProgressBar({
  current,
  total,
  onClose,
}: {
  current: number;
  total: number;
  onClose?: string;
}) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="flex items-center gap-3">
      {onClose && (
        <Link
          href={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full text-duo-gray-300 hover:bg-duo-gray-200 hover:text-duo-gray-500 transition-colors"
          aria-label="Exit quiz"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M12 4L4 12M4 4l8 8"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </Link>
      )}
      <div className="flex-1">
        <div className="h-4 w-full rounded-full bg-duo-gray-200 overflow-hidden">
          <div
            className="h-4 rounded-full bg-duo-green transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <span className="text-sm font-bold text-duo-gray-300 tabular-nums min-w-[3rem] text-right">
        {current}/{total}
      </span>
    </div>
  );
}
