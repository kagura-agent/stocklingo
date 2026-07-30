"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Question } from "@/lib/types";
import {
  getDailyQuestion,
  isDailyCompleted,
  completeDailyQuiz,
  getDailyState,
} from "@/lib/daily";
import QuestionCard from "@/components/QuestionCard";
import OptionButton from "@/components/OptionButton";
import KnowledgeCard from "@/components/KnowledgeCard";
import XPAnimation from "@/components/XPAnimation";

type AnswerState = "unanswered" | "correct" | "wrong";
type OptState = "default" | "selected" | "correct" | "wrong" | "missed";

export default function DailyPage() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [streak, setStreak] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("unanswered");
  const [showXP, setShowXP] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const done = isDailyCompleted();
    const state = getDailyState();
    setStreak(state.streak);
    setAlreadyDone(done);
    if (!done) {
      setQuestion(getDailyQuestion());
    }
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-duo-green border-t-transparent" />
      </div>
    );
  }

  if (alreadyDone) {
    const state = getDailyState();
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="text-6xl">✅</div>
          <h1 className="text-2xl font-bold text-white">今日已完成</h1>
          {state.streak > 0 && (
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/20 px-4 py-2 text-orange-300">
              <span className="text-lg">🔥</span>
              <span className="font-bold">连续 {state.streak} 天</span>
            </div>
          )}
          <p className="text-slate-400">明天再来挑战新题目吧！</p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-2xl bg-duo-green px-8 py-3 font-bold text-white shadow-lg"
          >
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  if (!question) return null;

  const xpBonus = streak >= 3 ? 2 : streak >= 1 ? 1 : 0;
  const totalXP = question.xp + xpBonus;

  function handleSelect(idx: number) {
    if (answerState !== "unanswered" || !question) return;
    setSelected(idx);
    const isCorrect = idx === question.answer;
    setAnswerState(isCorrect ? "correct" : "wrong");
    const earned = isCorrect ? totalXP : 0;
    completeDailyQuiz(isCorrect, earned);
    if (isCorrect) {
      setShowXP(true);
      setTimeout(() => setShowXP(false), 1800);
    }
    setAlreadyDone(true);
  }

  function getOptionState(idx: number): OptState {
    if (!question) return "default";
    if (answerState === "unanswered") {
      return selected === idx ? "selected" : "default";
    }
    if (idx === question.answer) return "correct";
    if (idx === selected) return "wrong";
    return "default";
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pb-24">
      {showXP && <XPAnimation xp={totalXP} streak={streak + 1} />}

      <div className="mx-auto max-w-md space-y-6 px-6 pt-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">📅 每日一题</h1>
          {streak > 0 && (
            <span className="rounded-full bg-orange-500/20 px-3 py-1 text-sm font-bold text-orange-300">
              🔥 {streak} 天
            </span>
          )}
        </div>

        {xpBonus > 0 && answerState === "unanswered" && (
          <div className="rounded-xl bg-indigo-500/20 px-4 py-2 text-center text-sm text-indigo-300">
            连续签到加成 +{xpBonus} XP
          </div>
        )}

        <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
          <QuestionCard
            story={question.story}
            question={question.question}
            type={question.type}
          />
        </div>

        <div className="space-y-3">
          {question.options.map((opt, idx) => (
            <OptionButton
              key={idx}
              label={opt}
              state={getOptionState(idx)}
              onClick={() => handleSelect(idx)}
              disabled={answerState !== "unanswered"}
            />
          ))}
        </div>

        {answerState !== "unanswered" && (
          <div className="space-y-4 animate-slide-up-fade">
            <div
              className={`rounded-2xl p-4 ${
                answerState === "correct"
                  ? "bg-green-500/20 text-green-300"
                  : "bg-red-500/20 text-red-300"
              }`}
            >
              <p className="text-lg font-bold">
                {answerState === "correct" ? "正确!" : "错误"}
              </p>
              <p className="mt-1 text-sm leading-relaxed opacity-90">
                {question.explanation}
              </p>
            </div>

            <KnowledgeCard
              title={question.knowledgeCard.title}
              content={question.knowledgeCard.content}
              funFact={question.knowledgeCard.funFact}
            />

            <Link
              href="/"
              className="block w-full rounded-2xl bg-duo-green py-3 text-center font-bold text-white shadow-lg"
            >
              完成
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
