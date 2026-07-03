"use client";

import { useState } from "react";
import Link from "next/link";
import type { Question } from "@/lib/types";
import { completeLevel } from "@/lib/progress";
import ProgressBar from "@/components/ProgressBar";
import QuestionCard from "@/components/QuestionCard";
import OptionButton from "@/components/OptionButton";
import KnowledgeCard from "@/components/KnowledgeCard";
import XPAnimation from "@/components/XPAnimation";
import LevelSummary from "@/components/LevelSummary";

type AnswerState = "unanswered" | "correct" | "wrong";
type OptState = "default" | "selected" | "correct" | "wrong" | "missed";

export default function QuizClient({
  questions,
  chapter,
  level,
}: {
  questions: Question[];
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

  // Handle case where there are no questions for this level
  if (questions.length === 0 && !finished) {
    return (
      <div className="flex flex-col items-center gap-6 px-6 pt-20">
        <div className="text-6xl">🚧</div>
        <h2 className="text-xl font-bold text-duo-gray-500">
          内容开发中
        </h2>
        <p className="text-center text-duo-gray-400">
          第 {chapter} 章 第 {level} 关的内容正在制作中，敬请期待！
        </p>
        <Link href="/learn" className="btn-primary mt-4 inline-block">
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
      setTimeout(() => setShowXP(false), 1800);
    }
  }

  function handleNext() {
    if (currentIndex + 1 >= questions.length) {
      const finalScore = score;
      const finalXP = xpEarned;
      completeLevel(chapter, level, finalScore, questions.length, finalXP);
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setAnswerState("unanswered");
    }
  }

  if (finished) {
    return (
      <div className="px-6">
        <LevelSummary
          score={score}
          total={questions.length}
          xpEarned={xpEarned}
          chapter={chapter}
        />
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
      {showXP && <XPAnimation xp={q.xp} />}

      <ProgressBar
        current={currentIndex + 1}
        total={questions.length}
        onClose="/learn"
      />

      <QuestionCard story={q.story} question={q.question} type={q.type} />

      <div className="space-y-3">
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

      {answerState !== "unanswered" && (
        <div className="space-y-4">
          <div
            className={`rounded-2xl p-4 ${
              answerState === "correct"
                ? "bg-green-50 text-duo-green-dark"
                : "bg-red-50 text-duo-red"
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
