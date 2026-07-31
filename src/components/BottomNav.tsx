"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { getDueCount } from "@/lib/srs";

const tabs = [
  { href: "/", label: "首页", icon: "🏠" },
  { href: "/learn", label: "学习", icon: "📚" },
  { href: "/daily", label: "每日", icon: "📅" },
  { href: "/review", label: "复习", icon: "📝" },
  { href: "/glossary", label: "术语", icon: "📖" },
  { href: "/profile", label: "我的", icon: "👤" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [dueCount, setDueCount] = useState(0);

  useEffect(() => {
    setDueCount(getDueCount());
  }, []);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-duo-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
      <div className="mx-auto flex max-w-lg">
        {tabs.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium ${
                active ? "text-duo-green" : "text-duo-gray-300"
              }`}
            >
              <span className="relative text-xl">
                {tab.icon}
                {tab.href === "/review" && dueCount > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-duo-red text-white text-[10px] font-bold">
                    {dueCount > 99 ? "99+" : dueCount}
                  </span>
                )}
              </span>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
