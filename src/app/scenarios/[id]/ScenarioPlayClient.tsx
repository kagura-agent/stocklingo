"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import {
  getScenarioById,
  saveScenarioResult,
  calculateScore,
  type Scenario,
  type ScenarioNode,
  type ScenarioOption,
} from "@/lib/scenarios";

type Phase = "playing" | "outcome" | "summary";

export default function ScenarioPlayClient({ scenarioId }: { scenarioId: string }) {
  const router = useRouter();
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [currentNode, setCurrentNode] = useState<ScenarioNode | null>(null);
  const [phase, setPhase] = useState<Phase>("playing");
  const [selectedOption, setSelectedOption] = useState<ScenarioOption | null>(null);
  const [totalProfit, setTotalProfit] = useState(0);
  const [choices, setChoices] = useState<{ nodeId: string; optionIndex: number }[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const s = getScenarioById(scenarioId);
    if (!s) {
      router.push("/scenarios");
      return;
    }
    setScenario(s);
    setCurrentNode(s.nodes[0]);
  }, [scenarioId, router]);

  function handleChoice(option: ScenarioOption, index: number) {
    const newProfit = totalProfit + option.profit;
    setTotalProfit(newProfit);
    setSelectedOption(option);
    setChoices([...choices, { nodeId: currentNode!.id, optionIndex: index }]);
    setPhase("outcome");
  }

  function handleContinue() {
    if (!selectedOption || !scenario) return;

    if (selectedOption.next === null) {
      const finalScore = calculateScore(totalProfit, choices.length);
      setScore(finalScore);
      saveScenarioResult({
        scenarioId: scenario.id,
        totalProfit,
        choices,
        completedAt: new Date().toISOString(),
        score: finalScore,
      });
      setPhase("summary");
      return;
    }

    const nextNode = scenario.nodes.find((n) => n.id === selectedOption.next);
    if (nextNode) {
      setCurrentNode(nextNode);
      setSelectedOption(null);
      setPhase("playing");
    }
  }

  function handleRestart() {
    if (!scenario) return;
    setCurrentNode(scenario.nodes[0]);
    setPhase("playing");
    setSelectedOption(null);
    setTotalProfit(0);
    setChoices([]);
    setScore(0);
  }

  if (!scenario || !currentNode) return null;

  const profitColor =
    totalProfit > 0
      ? "text-green-600 dark:text-green-400"
      : totalProfit < 0
        ? "text-red-600 dark:text-red-400"
        : "text-duo-gray-300 dark:text-slate-400";

  return (
    <main className="min-h-screen bg-duo-bg dark:bg-slate-950 pb-24 pt-6 px-4">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.push("/scenarios")}
            className="text-duo-gray-300 dark:text-slate-400 hover:text-duo-gray-400"
          >
            ← 返回
          </button>
          <div className={`text-sm font-bold ${profitColor}`}>
            {totalProfit > 0 ? "+" : ""}
            {totalProfit.toFixed(1)}%
          </div>
        </div>

        <h1 className="text-lg font-bold text-duo-gray-400 dark:text-white mb-1">
          {scenario.title}
        </h1>

        {/* Progress */}
        <div className="flex items-center gap-1 mb-6">
          {choices.map((_, i) => (
            <div key={i} className="h-1.5 flex-1 rounded-full bg-duo-green" />
          ))}
          <div className="h-1.5 flex-1 rounded-full bg-duo-green/30 dark:bg-slate-700" />
        </div>

        {phase === "playing" && (
          <div className="animate-fade-in">
            <div className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-duo-gray-200 dark:border-slate-700 p-5 mb-6">
              <p className="text-duo-gray-400 dark:text-slate-200 leading-relaxed">
                {currentNode.context}
              </p>
            </div>

            <div className="space-y-3">
              {currentNode.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleChoice(option, i)}
                  className="w-full text-left rounded-xl border-2 border-duo-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 transition-all hover:border-duo-green hover:shadow-sm active:scale-[0.98]"
                >
                  <span className="text-duo-gray-400 dark:text-slate-200">
                    {option.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === "outcome" && selectedOption && (
          <div className="animate-fade-in">
            <div className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-duo-gray-200 dark:border-slate-700 p-5 mb-4">
              <p className="text-duo-gray-400 dark:text-slate-200 leading-relaxed mb-3">
                {selectedOption.outcome}
              </p>
              {selectedOption.profit !== 0 && (
                <div
                  className={`text-sm font-bold ${
                    selectedOption.profit > 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  本步盈亏: {selectedOption.profit > 0 ? "+" : ""}
                  {selectedOption.profit}%
                </div>
              )}
            </div>
            <button
              onClick={handleContinue}
              className="w-full rounded-xl bg-duo-green py-3 font-bold text-white transition-all hover:bg-green-600 active:scale-[0.98]"
            >
              {selectedOption.next === null ? "查看总结" : "继续"}
            </button>
          </div>
        )}

        {phase === "summary" && (
          <div className="animate-fade-in">
            <div className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-duo-gray-200 dark:border-slate-700 p-6 text-center mb-6">
              <div className="text-5xl mb-4">
                {score >= 80 ? "🏆" : score >= 50 ? "📈" : "📉"}
              </div>
              <h2 className="text-xl font-bold text-duo-gray-400 dark:text-white mb-2">
                模拟结束
              </h2>

              <div className="grid grid-cols-2 gap-4 my-6">
                <div className="rounded-xl bg-duo-bg dark:bg-slate-800 p-3">
                  <div className={`text-2xl font-bold ${profitColor}`}>
                    {totalProfit > 0 ? "+" : ""}
                    {totalProfit.toFixed(1)}%
                  </div>
                  <div className="text-xs text-duo-gray-300 dark:text-slate-400 mt-1">
                    总盈亏
                  </div>
                </div>
                <div className="rounded-xl bg-duo-bg dark:bg-slate-800 p-3">
                  <div className="text-2xl font-bold text-duo-green">{score}</div>
                  <div className="text-xs text-duo-gray-300 dark:text-slate-400 mt-1">
                    评分
                  </div>
                </div>
              </div>

              <div className="text-left rounded-xl bg-duo-bg dark:bg-slate-800 p-4">
                <h3 className="font-bold text-duo-gray-400 dark:text-white text-sm mb-2">
                  关键教训
                </h3>
                <p className="text-sm text-duo-gray-300 dark:text-slate-400 leading-relaxed">
                  {selectedOption?.outcome}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleRestart}
                className="w-full rounded-xl bg-duo-green py-3 font-bold text-white transition-all hover:bg-green-600 active:scale-[0.98]"
              >
                重新体验
              </button>
              <button
                onClick={() => router.push("/scenarios")}
                className="w-full rounded-xl border-2 border-duo-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-3 font-bold text-duo-gray-400 dark:text-white transition-all hover:border-duo-green active:scale-[0.98]"
              >
                返回列表
              </button>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
