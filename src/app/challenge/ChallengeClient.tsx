"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import type { Question } from "@/lib/types";
import {
  getChallengeQuestions,
  hasCompletedLevels,
  saveChallengeRecord,
  getBestScore,
  type ChallengeRecord,
} from "@/lib/challenge";
import QuestionCard from "@/components/QuestionCard";
import OptionButton from "@/components/OptionButton";

type Phase = "ready" | "playing" | "finished";
type OptState = "default" | "selected" | "correct" | "wrong" | "missed";

export default function ChallengeClient() {
  const [phase, setPhase] = useState<Phase>("ready");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [totalTime, setTotalTime] = useState(0);
  const [record, setRecord] = useState<ChallengeRecord | null>(null);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [eligible, setEligible] = useState(true);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    setEligible(hasCompletedLevels());
  }, []);

  const endGame = useCallback(
    (finalCorrect: number, finalScore: number, finalMaxCombo: number) => {
      if (timerRef.current) clearInterval(timerRef.current);
      const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
      const best = getBestScore();
      const newRecord = finalScore > best;
      const rec: ChallengeRecord = {
        date: new Date().toISOString(),
        score: finalScore,
        correct: finalCorrect,
        total: questions.length,
        maxCombo: finalMaxCombo,
        durationSeconds: duration,
      };
      saveChallengeRecord(rec);
      setTotalTime(duration);
      setRecord(rec);
      setIsNewRecord(newRecord);
      setPhase("finished");
    },
    [questions.length]
  );

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    if (phase === "playing" && timeLeft === 0 && !answered) {
      handleTimeout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, phase, answered]);

  function handleStart() {
    const qs = getChallengeQuestions();
    if (qs.length === 0) return;
    setQuestions(qs);
    setCurrentIndex(0);
    setSelected(null);
    setAnswered(false);
    setLastCorrect(false);
    setLives(3);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setCorrect(0);
    setRecord(null);
    startTimeRef.current = Date.now();
    setPhase("playing");
    setTimeLeft(15);
    startTimer();
  }

  function handleTimeout() {
    setAnswered(true);
    const newLives = lives - 1;
    setLives(newLives);
    setCombo(0);
    if (newLives <= 0) {
      endGame(correct, score, maxCombo);
    }
  }

  function handleSelect(idx: number) {
    if (answered || phase !== "playing") return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSelected(idx);
    setAnswered(true);

    const q = questions[currentIndex];
    const isCorrect = idx === q.answer;

    if (isCorrect) {
      const newCombo = combo + 1;
      const multiplier = 1 + (newCombo - 1) * 0.5;
      const points = Math.round(10 * multiplier);
      const newScore = score + points;
      const newCorrect = correct + 1;
      const newMaxCombo = Math.max(maxCombo, newCombo);
      setCombo(newCombo);
      setMaxCombo(newMaxCombo);
      setScore(newScore);
      setCorrect(newCorrect);
      setLastCorrect(true);
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setCombo(0);
      setLastCorrect(false);
      if (newLives <= 0) {
        setTimeout(() => endGame(correct, score, maxCombo), 800);
        return;
      }
    }
  }

  function handleNext() {
    if (currentIndex + 1 >= questions.length) {
      endGame(correct, score, maxCombo);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setAnswered(false);
      const nextTime = lastCorrect ? 20 : 15;
      setTimeLeft(nextTime);
      startTimer();
    }
  }

  function getOptionState(idx: number): OptState {
    if (!answered) return "default";
    const q = questions[currentIndex];
    if (idx === q.answer) return "correct";
    if (idx === selected) return "wrong";
    return "default";
  }

  if (!eligible) {
    return (
      <div className="flex flex-col items-center gap-6 px-6 pt-20 pb-24 text-center">
        <div className="text-6xl">🔒</div>
        <h2 className="text-xl font-bold text-duo-gray-500 dark:text-slate-100">
          挑战模式未解锁
        </h2>
        <p className="text-duo-gray-400 dark:text-slate-400">
          先完成至少一个关卡再来挑战
        </p>
        <Link href="/learn" className="btn-primary mt-4 inline-block">
          去学习
        </Link>
      </div>
    );
  }

  if (phase === "ready") {
    return (
      <div className="flex flex-col items-center gap-6 px-6 pt-16 pb-24 text-center">
        <div className="text-6xl">⚡</div>
        <h1 className="text-2xl font-bold text-duo-gray-500 dark:text-slate-100">
          挑战模式
        </h1>
        <p className="text-duo-gray-400 dark:text-slate-400 max-w-xs">
          从已完成关卡中随机抽取 20 题，限时作答，连击加分！
        </p>
        <div className="flex gap-4 text-sm text-duo-gray-400 dark:text-slate-400">
          <span>❤️ 3 条命</span>
          <span>⏱️ 15s/题</span>
          <span>🔥 连击加分</span>
        </div>
        {getBestScore() > 0 && (
          <p className="text-sm text-duo-orange font-semibold">
            🏆 历史最高分: {getBestScore()}
          </p>
        )}
        <button onClick={handleStart} className="btn-primary mt-4">
          开始挑战
        </button>
      </div>
    );
  }

  if (phase === "finished" && record) {
    const accuracy = record.total > 0 ? Math.round((record.correct / record.total) * 100) : 0;
    return (
      <div className="flex flex-col items-center gap-5 px-6 pt-12 pb-24 text-center">
        {isNewRecord && (
          <div className="text-sm font-bold text-duo-orange animate-bounce">
            🎉 新纪录！
          </div>
        )}
        <div className="text-5xl">🏁</div>
        <h2 className="text-2xl font-bold text-duo-gray-500 dark:text-slate-100">
          挑战结束
        </h2>

        <div className="grid grid-cols-2 gap-4 w-full max-w-xs mt-2">
          <div className="rounded-2xl bg-green-50 dark:bg-green-900/20 p-4">
            <div className="text-2xl font-bold text-duo-green">{record.score}</div>
            <div className="text-xs text-duo-gray-400 dark:text-slate-400">总分</div>
          </div>
          <div className="rounded-2xl bg-blue-50 dark:bg-blue-900/20 p-4">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{accuracy}%</div>
            <div className="text-xs text-duo-gray-400 dark:text-slate-400">正确率</div>
          </div>
          <div className="rounded-2xl bg-orange-50 dark:bg-orange-900/20 p-4">
            <div className="text-2xl font-bold text-duo-orange">{record.maxCombo}x</div>
            <div className="text-xs text-duo-gray-400 dark:text-slate-400">最长连击</div>
          </div>
          <div className="rounded-2xl bg-purple-50 dark:bg-purple-900/20 p-4">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{record.durationSeconds}s</div>
            <div className="text-xs text-duo-gray-400 dark:text-slate-400">用时</div>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button onClick={handleStart} className="btn-primary">
            再来一局
          </button>
          <Link
            href="/"
            className="rounded-2xl border-2 border-duo-gray-200 dark:border-slate-600 px-6 py-3 font-bold text-duo-gray-400 dark:text-slate-300"
          >
            返回
          </Link>
        </div>
      </div>
    );
  }

  const q = questions[currentIndex];
  const timerColor =
    timeLeft <= 5 ? "text-duo-red" : timeLeft <= 10 ? "text-duo-orange" : "text-duo-green";
  const timerBarWidth = (timeLeft / (lastCorrect ? 20 : 15)) * 100;

  return (
    <div className="space-y-4 px-6 pt-4 pb-24">
      {/* Header: lives, timer, progress */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className={`text-lg ${i < lives ? "opacity-100" : "opacity-30"}`}>
              ❤️
            </span>
          ))}
        </div>
        <span className={`text-lg font-bold tabular-nums ${timerColor}`}>
          {timeLeft}s
        </span>
        <span className="text-sm text-duo-gray-400 dark:text-slate-400">
          {currentIndex + 1}/{questions.length}
        </span>
      </div>

      {/* Timer bar */}
      <div className="h-1.5 rounded-full bg-duo-gray-100 dark:bg-slate-700 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 linear ${
            timeLeft <= 5 ? "bg-duo-red" : timeLeft <= 10 ? "bg-duo-orange" : "bg-duo-green"
          }`}
          style={{ width: `${timerBarWidth}%` }}
        />
      </div>

      {/* Score + combo */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-bold text-duo-gray-500 dark:text-slate-200">
          得分: {score}
        </span>
        {combo >= 2 && (
          <span className="rounded-full bg-orange-100 dark:bg-orange-900/30 px-3 py-1 text-sm font-bold text-duo-orange">
            🔥x{combo}
          </span>
        )}
      </div>

      {/* Question */}
      <QuestionCard story={q.story} question={q.question} type={q.type} />

      {/* Options */}
      <div className="space-y-3 mt-4">
        {q.options.map((opt, idx) => (
          <OptionButton
            key={idx}
            label={opt}
            state={getOptionState(idx)}
            onClick={() => handleSelect(idx)}
            disabled={answered}
          />
        ))}
      </div>

      {/* Next button after answer */}
      {answered && lives > 0 && phase === "playing" && (
        <button onClick={handleNext} className="btn-primary mt-4 w-full">
          {currentIndex + 1 >= questions.length ? "查看结果" : "下一题"}
        </button>
      )}
    </div>
  );
}
