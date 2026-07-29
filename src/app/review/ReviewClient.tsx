"use client";

import { useState, useEffect } from "react";
import {
  getWrongAnswers,
  removeWrongAnswer,
  clearAllWrongAnswers,
  type WrongAnswer,
} from "@/lib/wrong-answers";
import OptionButton from "@/components/OptionButton";

type OptState = "default" | "selected" | "correct" | "wrong" | "missed";

export default function ReviewClient() {
  const [answers, setAnswers] = useState<WrongAnswer[]>([]);
  const [practiceId, setPracticeId] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    setAnswers(getWrongAnswers());
  }, []);

  function handleClear() {
    if (!confirm("确定要清空所有错题吗？")) return;
    clearAllWrongAnswers();
    setAnswers([]);
  }

  function handlePractice(id: string) {
    setPracticeId(id);
    setSelected(null);
    setAnswered(false);
  }

  function handleSelect(idx: number, item: WrongAnswer) {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === item.question.answer) {
      removeWrongAnswer(item.id);
      setTimeout(() => {
        setAnswers((prev) => prev.filter((a) => a.id !== item.id));
        setPracticeId(null);
      }, 1200);
    }
  }

  function getOptionState(idx: number, item: WrongAnswer): OptState {
    if (!answered) return "default";
    if (idx === item.question.answer) return "correct";
    if (idx === selected) return "wrong";
    return "default";
  }

  if (answers.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 px-6 pt-20 pb-24">
        <div className="text-6xl">🎉</div>
        <h2 className="text-xl font-bold text-duo-gray-500">没有错题！继续保持</h2>
      </div>
    );
  }

  return (
    <div className="px-6 pt-6 pb-24 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-duo-gray-500">
          错题本（{answers.length}）
        </h1>
        <button
          onClick={handleClear}
          className="text-sm text-duo-red font-medium"
        >
          清空
        </button>
      </div>

      <div className="space-y-4">
        {answers.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-duo-gray-200 bg-white p-4 space-y-3"
          >
            <div className="flex items-center gap-2 text-xs text-duo-gray-300">
              <span>第{item.chapter}章</span>
              <span>·</span>
              <span>第{item.level}关</span>
            </div>
            <p className="text-sm font-medium text-duo-gray-500">
              {item.question.question}
            </p>
            <div className="text-xs text-duo-gray-300 space-y-1">
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
                    state={getOptionState(idx, item)}
                    onClick={() => handleSelect(idx, item)}
                    disabled={answered}
                  />
                ))}
                {answered && selected !== item.question.answer && (
                  <p className="text-xs text-duo-gray-300 pt-1">
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
    </div>
  );
}
