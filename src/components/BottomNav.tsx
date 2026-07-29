"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "首页", icon: "🏠" },
  { href: "/learn", label: "学习", icon: "📚" },
  { href: "/review", label: "错题本", icon: "📝" },
  { href: "/profile", label: "我的", icon: "👤" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-duo-gray-200 bg-white">
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
              className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium ${
                active ? "text-duo-green" : "text-duo-gray-300"
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
