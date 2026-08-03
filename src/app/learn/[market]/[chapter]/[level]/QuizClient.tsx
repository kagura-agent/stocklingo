"use client";

import { useState } from "react";
import Link from "next/link";
import type { Question } from "@/lib/types";
import { completeLevel, loadProgress } from "@/lib/progress";
import { saveWrongAnswer, removeWrongAnswer } from "@/lib/wrong-answers";
import { getMarkets } from "@/lib/content";
import { getActivities } from "@/lib/activity";
import { getSRSReviewCount } from "@/lib/srs-tracker";
import { getDailyState } from "@/lib/daily";
import { getCompletedScenarioIds } from "@/lib/scenarios";
import { useAchievementCheck, type AchievementContext } from "@/hooks/useAchievementCheck";
import ProgressBar from "@/components/ProgressBar";
import QuestionCard from "@/components/QuestionCard";
import OptionButton from "@/components/OptionButton";
import KnowledgeCard from "@/components/KnowledgeCard";
import XPAnimation from "@/components/XPAnimation";
import LevelSummary from "@/components/LevelSummary";
import AchievementToast from "@/components/AchievementToast";

type AnswerState = "unanswered" | "correct" | "wrong";
type OptState = "default" | "selected" | "correct" | "wrong" | "missed";

export default function QuizClient({
  questions,
  market,
  chapter,
  level,
}: {
  questions: Question[];
  market: string;
  chapter: number;
  level: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("unanswered");
  const [score, setScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [showXP, setShowXP] = useState(false);
  const [finished, setFinished] = useState(false);
  const [streak, setStreak] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [achievementCtx, setAchievementCtx] = useState<AchievementContext | null>(null);

  const newAchievements = useAchievementCheck(achievementCtx);

  if (questions.length === 0 && !finished) {
    return (
      <div className="flex flex-col items-center gap-6 px-6 pt-20">
        <div className="text-6xl">🚧</div>
        <h2 className="text-xl font-bold text-duo-gray-500 dark:text-slate-100">
          内容开发中
        </h2>
        <p className="text-center text-duo-gray-400 dark:text-slate-400">
          第 {chapter} 章 第 {level} 关的内容正在制作中，敬请期待！
        </p>
        <Link href={`/learn/${market}`} className="btn-primary mt-4 inline-block">
          返回学习
        </Link>
      </div>
    );
  }

  const q = questions[currentIndex];

  function handleSelect(idx: number) {
    if (answerState !== "unanswered") return;
    setSelected(idx);
    const isCorrect = idx === q.answer;
    setAnswerState(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      setScore((s) => s + 1);
      setXpEarned((x) => x + q.xp);
      setShowXP(true);
      setStreak((s) => s + 1);
      setTimeout(() => setShowXP(false), 1800);
      removeWrongAnswer(`${market}-${chapter}-${level}-${q.id}`);
    } else {
      setStreak(0);
      saveWrongAnswer(q, market, chapter, level, idx);
    }
  }

  function handleNext() {
    if (currentIndex + 1 >= questions.length) {
      const finalScore = score;
      const finalXP = xpEarned;
      completeLevel(market, chapter, level, finalScore, questions.length, finalXP);
      const progress = loadProgress();
      const completedCount = Object.keys(progress.completedLevels).length;
      const totalLevels = getMarkets().reduce((s, m) => s + m.chapters.reduce((s2, ch) => s2 + ch.levels, 0), 0);
      setAchievementCtx({
        completedCount,
        totalLevels,
        streak: progress.streak.count,
        dailyStreak: getDailyState().streak,
        scenarioCount: getCompletedScenarioIds().length,
        progress,
        activities: getActivities(),
        srsReviewCount: getSRSReviewCount(),
      });
      setFinished(true);
    } else {
      setTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((i) => i + 1);
        setSelected(null);
        setAnswerState("unanswered");
        setTransitioning(false);
      }, 200);
    }
  }

  if (finished) {
    return (
      <div className="px-6">
        <LevelSummary
          score={score}
          total={questions.length}
          xpEarned={xpEarned}
          market={market}
          chapter={chapter}
        />
        <AchievementToast achievements={newAchievements} />
      </div>
    );
  }

  function getOptionState(idx: number): OptState {
    if (answerState === "unanswered") {
      return selected === idx ? "selected" : "default";
    }
    if (idx === q.answer) return "correct";
    if (idx === selected) return "wrong";
    return "default";
  }

  return (
    <div className="space-y-6 px-6 pt-6 pb-8">
      {showXP && <XPAnimation xp={q.xp} streak={streak} />}

      <ProgressBar
        current={currentIndex + 1}
        total={questions.length}
        onClose={`/learn/${market}`}
      />

      {streak >= 2 && answerState === "unanswered" && (
        <div className="flex justify-center animate-streak-pop">
          <span className="rounded-full bg-orange-100 dark:bg-orange-900/30 px-3 py-1 text-sm font-bold text-duo-orange">
            🔥x{streak}
          </span>
        </div>
      )}

      <div
        className={`transition-all duration-200 ${
          transitioning ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"
        }`}
      >
        <QuestionCard story={q.story} question={q.question} type={q.type} />

        <div className="space-y-3 mt-6">
          {q.options.map((opt, idx) => (
            <OptionButton
              key={idx}
              label={opt}
              state={getOptionState(idx)}
              onClick={() => handleSelect(idx)}
              disabled={answerState !== "unanswered"}
            />
          ))}
        </div>
      </div>

      {answerState !== "unanswered" && (
        <div className="space-y-4 animate-slide-up-fade">
          <div
            className={`rounded-2xl p-4 ${
              answerState === "correct"
                ? "bg-green-50 dark:bg-green-900/30 text-duo-green-dark dark:text-green-300"
                : "bg-red-50 dark:bg-red-900/30 text-duo-red dark:text-red-300"
            }`}
          >
            <p className="font-bold text-lg">
              {answerState === "correct" ? "正确!" : "错误"}
            </p>
            <p className="mt-1 text-sm leading-relaxed">{q.explanation}</p>
          </div>

          <KnowledgeCard
            title={q.knowledgeCard.title}
            content={q.knowledgeCard.content}
            funFact={q.knowledgeCard.funFact}
          />

          <button onClick={handleNext} className="btn-primary">
            {currentIndex + 1 >= questions.length ? "查看结果" : "继续"}
          </button>
        </div>
      )}
    </div>
  );
}
