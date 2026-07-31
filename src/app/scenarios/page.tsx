"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import {
  getAllScenarios,
  getCompletedScenarioIds,
  type Scenario,
} from "@/lib/scenarios";

export default function ScenariosPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    setScenarios(getAllScenarios());
    setCompleted(getCompletedScenarioIds());
  }, []);

  const difficultyLabel: Record<string, { text: string; color: string }> = {
    easy: { text: "入门", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    medium: { text: "进阶", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
    hard: { text: "困难", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  };

  return (
    <main className="min-h-screen bg-duo-bg dark:bg-slate-950 pb-24 pt-6 px-4">
      <div className="mx-auto max-w-lg">
        <h1 className="text-2xl font-bold text-duo-gray-400 dark:text-white mb-2">
          情景模拟
        </h1>
        <p className="text-duo-gray-300 dark:text-slate-400 mb-6">
          身临其境体验真实交易决策，从错误中学习而不损失真金白银
        </p>

        <div className="space-y-4">
          {scenarios.map((scenario) => {
            const isCompleted = completed.includes(scenario.id);
            const diff = difficultyLabel[scenario.difficulty];
            return (
              <Link
                key={scenario.id}
                href={`/scenarios/${scenario.id}`}
                className="block rounded-2xl border-2 border-duo-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 transition-all hover:border-duo-green hover:shadow-md active:scale-[0.98]"
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{scenario.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-bold text-duo-gray-400 dark:text-white">
                        {scenario.title}
                      </h2>
                      {isCompleted && (
                        <span className="text-duo-green text-sm">✓</span>
                      )}
                    </div>
                    <p className="text-sm text-duo-gray-300 dark:text-slate-400 line-clamp-2">
                      {scenario.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${diff.color}`}>
                        {diff.text}
                      </span>
                      {scenario.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-duo-gray-300 dark:text-slate-500"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
