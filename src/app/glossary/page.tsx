"use client";

import { useState, useMemo } from "react";
import BottomNav from "@/components/BottomNav";
import { getGlossaryEntries, searchGlossary, groupByChapter } from "@/lib/glossary";

export default function GlossaryPage() {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const allEntries = useMemo(() => getGlossaryEntries(), []);
  const filtered = useMemo(() => searchGlossary(allEntries, query), [allEntries, query]);
  const grouped = useMemo(() => groupByChapter(filtered), [filtered]);

  return (
    <>
      <div className="px-6 pt-10 pb-24">
        <h1 className="text-2xl font-black mb-4 dark:text-slate-100">术语表</h1>

        <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 py-3">
          <input
            type="text"
            placeholder="搜索术语..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border-2 border-duo-gray-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 px-4 py-3 text-sm outline-none focus:border-duo-green transition-colors"
          />
          <p className="mt-2 text-xs text-duo-gray-300 dark:text-slate-400">
            共 {filtered.length} 个术语
          </p>
        </div>

        <div className="mt-4 space-y-6">
          {Object.entries(grouped).map(([group, entries]) => (
            <section key={group}>
              <h2 className="text-sm font-bold text-duo-gray-400 dark:text-slate-400 mb-2">{group}</h2>
              <div className="space-y-2">
                {entries.map((entry) => {
                  const isOpen = expanded === entry.title;
                  return (
                    <button
                      key={entry.title}
                      onClick={() => setExpanded(isOpen ? null : entry.title)}
                      className="card w-full text-left transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-bold text-sm dark:text-slate-100">{entry.title}</h3>
                          {!isOpen && (
                            <p className="text-xs text-duo-gray-300 dark:text-slate-400 mt-1 line-clamp-1">
                              {entry.content}
                            </p>
                          )}
                        </div>
                        <span className="text-duo-gray-300 dark:text-slate-500 text-xs shrink-0">
                          {isOpen ? "▲" : "▼"}
                        </span>
                      </div>
                      {isOpen && (
                        <div className="mt-3 space-y-2 text-sm">
                          <p className="text-duo-gray-400 dark:text-slate-300">{entry.content}</p>
                          {entry.funFact && (
                            <div className="rounded-lg bg-duo-orange/10 p-3 text-xs text-duo-orange">
                              💡 {entry.funFact}
                            </div>
                          )}
                          <p className="text-xs text-duo-gray-300 dark:text-slate-400">
                            来源：{entry.marketName} · {entry.chapterTitle}
                          </p>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-duo-gray-300 dark:text-slate-400">
              没有找到相关术语
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </>
  );
}
