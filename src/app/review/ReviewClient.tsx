"use client";

import { useState, useEffect } from "react";
import {
  getWrongAnswers,
  removeWrongAnswer,
  clearAllWrongAnswers,
  type WrongAnswer,
} from "@/lib/wrong-answers";
import { getDueCards, gradeCard, updateSRSCard, type SRSCard } from "@/lib/srs";
import { incrementSRSReviewCount } from "@/lib/srs-tracker";
import OptionButton from "@/components/OptionButton";

type OptState = "default" | "selected" | "correct" | "wrong" | "missed";
type Tab = "review" | "wrong";

export default function ReviewClient() {
  const [tab, setTab] = useState<Tab>("review");
  const [answers, setAnswers] = useState<WrongAnswer[]>([]);
  const [dueCards, setDueCards] = useState<SRSCard[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [lastInterval, setLastInterval] = useState<number | null>(null);
  const [practiceId, setPracticeId] = useState<string | null>(null);
  const [wrongSelected, setWrongSelected] = useState<number | null>(null);
  const [wrongAnswered, setWrongAnswered] = useState(false);

  useEffect(() => {
    setAnswers(getWrongAnswers());
    setDueCards(getDueCards());
  }, []);

  const currentCard = dueCards[currentIdx];

  function handleReviewSelect(idx: number) {
    if (answered || !currentCard) return;
    setSelected(idx);
    setAnswered(true);
    const quality = idx === currentCard.question.answer ? 4 : 1;
    const updated = gradeCard(currentCard, quality);
    updateSRSCard(updated);
    incrementSRSReviewCount();
    if (quality >= 3) {
      setLastInterval(updated.interval);
    }
  }

  function handleNext() {
    setSelected(null);
    setAnswered(false);
    setLastInterval(null);
    setCurrentIdx((i) => i + 1);
  }

  function getReviewOptionState(idx: number): OptState {
    if (!answered || !currentCard) return "default";
    if (idx === currentCard.question.answer) return "correct";
    if (idx === selected) return "wrong";
    return "default";
  }

  function handleClear() {
    if (!confirm("确定要清空所有错题吗？")) return;
    clearAllWrongAnswers();
    setAnswers([]);
  }

  function handlePractice(id: string) {
    setPracticeId(id);
    setWrongSelected(null);
    setWrongAnswered(false);
  }

  function handleWrongSelect(idx: number, item: WrongAnswer) {
    if (wrongAnswered) return;
    setWrongSelected(idx);
    setWrongAnswered(true);
    if (idx === item.question.answer) {
      removeWrongAnswer(item.id);
      setTimeout(() => {
        setAnswers((prev) => prev.filter((a) => a.id !== item.id));
        setPracticeId(null);
      }, 1200);
    }
  }

  function getWrongOptionState(idx: number, item: WrongAnswer): OptState {
    if (!wrongAnswered) return "default";
    if (idx === item.question.answer) return "correct";
    if (idx === wrongSelected) return "wrong";
    return "default";
  }

  function formatSource(item: { market?: string; chapter: number; level: number }) {
    const marketLabel = item.market === "hk-us" ? "港美股" : "A股";
    return `${marketLabel} · 第${item.chapter}章 · 第${item.level}关`;
  }

  return (
    <div className="px-6 pt-6 pb-24">
      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab("review")}
          className={`flex-1 py-2 rounded-xl text-sm font-bold ${
            tab === "review"
              ? "bg-duo-green text-white"
              : "bg-duo-gray-100 dark:bg-slate-800 text-duo-gray-300 dark:text-slate-400"
          }`}
        >
          待复习{dueCards.length > 0 && `（${dueCards.length}）`}
        </button>
        <button
          onClick={() => setTab("wrong")}
          className={`flex-1 py-2 rounded-xl text-sm font-bold ${
            tab === "wrong"
              ? "bg-duo-green text-white"
              : "bg-duo-gray-100 text-duo-gray-300"
          }`}
        >
          错题本{answers.length > 0 && `（${answers.length}）`}
        </button>
      </div>

      {/* Review Tab */}
      {tab === "review" && (
        <>
          {dueCards.length === 0 ? (
            <div className="flex flex-col items-center gap-4 pt-16">
              <div className="text-6xl">✅</div>
              <h2 className="text-xl font-bold text-duo-gray-500 dark:text-slate-100">
                没有待复习的内容
              </h2>
              <p className="text-sm text-duo-gray-300 dark:text-slate-400">明天再来看看吧！</p>
            </div>
          ) : currentIdx >= dueCards.length ? (
            <div className="flex flex-col items-center gap-4 pt-16">
              <div className="text-6xl">🎉</div>
              <h2 className="text-xl font-bold text-duo-gray-500 dark:text-slate-100">
                今日复习完成！
              </h2>
              <p className="text-sm text-duo-gray-300 dark:text-slate-400">
                你已完成 {dueCards.length} 道复习题
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-duo-gray-300 dark:text-slate-400">
                  {formatSource(currentCard)}
                </span>
                <span className="text-xs text-duo-gray-300 dark:text-slate-400">
                  {currentIdx + 1}/{dueCards.length}
                </span>
              </div>

              <p className="text-lg font-bold text-duo-gray-500 dark:text-slate-100">
                {currentCard.question.question}
              </p>

              <div className="space-y-2">
                {currentCard.question.options.map((opt, idx) => (
                  <OptionButton
                    key={idx}
                    label={opt}
                    state={getReviewOptionState(idx)}
                    onClick={() => handleReviewSelect(idx)}
                    disabled={answered}
                  />
                ))}
              </div>

              {answered && (
                <div className="space-y-3 pt-2">
                  {selected !== currentCard.question.answer && (
                    <p className="text-xs text-duo-gray-300 dark:text-slate-400">
                      {currentCard.question.explanation}
                    </p>
                  )}
                  {lastInterval !== null && (
                    <p className="text-sm text-duo-green font-medium">
                      下次复习：{lastInterval}天后
                    </p>
                  )}
                  <button
                    onClick={handleNext}
                    className="w-full py-3 rounded-xl bg-duo-green text-white font-bold text-sm"
                  >
                    下一题
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Wrong Answers Tab */}
      {tab === "wrong" && (
        <>
          {answers.length === 0 ? (
            <div className="flex flex-col items-center gap-4 pt-16">
              <div className="text-6xl">🎉</div>
              <h2 className="text-xl font-bold text-duo-gray-500 dark:text-slate-100">
                没有错题！继续保持
              </h2>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-end">
                <button
                  onClick={handleClear}
                  className="text-sm text-duo-red font-medium"
                >
                  清空
                </button>
              </div>

              {answers.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-duo-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 space-y-3"
                >
                  <div className="flex items-center gap-2 text-xs text-duo-gray-300 dark:text-slate-400">
                    <span>{formatSource(item)}</span>
                  </div>
                  <p className="text-sm font-medium text-duo-gray-500 dark:text-slate-100">
                    {item.question.question}
                  </p>
                  <div className="text-xs text-duo-gray-300 dark:text-slate-400 space-y-1">
                    <p>
                      你的答案：
                      <span className="text-duo-red">
                        {item.question.options[item.userAnswer]}
                      </span>
                    </p>
                    <p>
                      正确答案：
                      <span className="text-duo-green">
                        {item.question.options[item.question.answer]}
                      </span>
                    </p>
                  </div>

                  {practiceId === item.id ? (
                    <div className="space-y-2 pt-2">
                      {item.question.options.map((opt, idx) => (
                        <OptionButton
                          key={idx}
                          label={opt}
                          state={getWrongOptionState(idx, item)}
                          onClick={() => handleWrongSelect(idx, item)}
                          disabled={wrongAnswered}
                        />
                      ))}
                      {wrongAnswered &&
                        wrongSelected !== item.question.answer && (
                          <p className="text-xs text-duo-gray-300 dark:text-slate-400 pt-1">
                            {item.question.explanation}
                          </p>
                        )}
                    </div>
                  ) : (
                    <button
                      onClick={() => handlePractice(item.id)}
                      className="text-sm font-medium text-duo-blue"
                    >
                      重新练习
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
