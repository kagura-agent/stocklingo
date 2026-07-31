"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, cycleTheme } = useTheme();

  const icon = theme === "dark" ? "🌙" : theme === "light" ? "☀️" : "💻";
  const label = theme === "dark" ? "深色" : theme === "light" ? "浅色" : "跟随系统";

  return (
    <button
      onClick={cycleTheme}
      className="flex items-center gap-1.5 rounded-xl border-2 border-duo-gray-200 dark:border-slate-600 px-3 py-2 text-sm font-medium text-duo-gray-400 dark:text-slate-300 transition-colors hover:border-duo-green dark:hover:border-duo-green"
      aria-label={`当前主题：${label}，点击切换`}
    >
      <span>{icon}</span>
      <span className="text-xs">{label}</span>
    </button>
  );
}
