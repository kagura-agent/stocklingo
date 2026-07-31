"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Question } from "@/lib/types";
import {
  getChallengeQuestions,
  calculateScore,
  saveChallengeRecord,
  getBestScore,
  hasCompletedLevels,
  type ChallengeRecord,
} from "@/lib/challenge";
import BottomNav from "@/components/BottomNav";
import OptionButton from "@/components/OptionButton";

type GameState = "idle" | "playing" | "finished";

export default function ChallengeClient() {
  const [gameState, setGameState] = useState<GameState>("idle");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [record, setRecord] = useState<ChallengeRecord | null>(null);
  const [bestScore, setBestScore] = useState(0);
  const [canPlay, setCanPlay] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setCanPlay(hasCompletedLevels());
    setBestScore(getBestScore());
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startGame = useCallback(() => {
    const q = getChallengeQuestions(20);
    if (q.length === 0) return;
    setQuestions(q);
    setCurrentIdx(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setLives(3);
    setCorrectCount(0);
    setTimeLeft(15);
    setSelected(null);
    setShowResult(false);
    setRecord(null);
    setStartTime(Date.now());
    setGameState("playing");
  }, []);

  // Timer countdown
  useEffect(() => {
    if (gameState !== "playing" || showResult) return;

    clearTimer();
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up - treat as wrong
          clearTimer();
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, currentIdx, showResult]);

  const handleTimeout = () => {
    setShowResult(true);
    setCombo(0);
    setLives((prev) => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        setTimeout(() => endGame(), 1500);
      } else {
        setTimeout(() => advanceQuestion(), 1500);
      }
      return newLives;
    });
  };

  const endGame = useCallback(() => {
    clearTimer();
    const timeUsed = Date.now() - startTime;
    const currentBest = getBestScore();
    const isNewBest = score > currentBest;

    const newRecord: ChallengeRecord = {
      score,
      correctCount,
      totalQuestions: currentIdx + 1,
      maxCombo,
      timeUsedMs: timeUsed,
      date: new Date().toISOString(),
      isNewBest,
    };

    saveChallengeRecord(newRecord);
    setRecord(newRecord);
    setBestScore(Math.max(score, currentBest));
    setGameState("finished");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score, correctCount, currentIdx, maxCombo, startTime, clearTimer]);

  const advanceQuestion = () => {
    if (currentIdx + 1 >= questions.length) {
      endGame();
    } else {
      setCurrentIdx((prev) => prev + 1);
      setSelected(null);
      setShowResult(false);
      setTimeLeft(15);
    }
  };

  const handleAnswer = (optionIdx: number) => {
    if (showResult || selected !== null) return;

    clearTimer();
    setSelected(optionIdx);
    setShowResult(true);

    const question = questions[currentIdx];
    const isCorrect = optionIdx === question.answer;

    if (isCorrect) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo((prev) => Math.max(prev, newCombo));
      setCorrectCount((prev) => prev + 1);
      const earned = calculateScore(question.xp, newCombo);
      setScore((prev) => prev + earned);
      // Bonus time for correct answer
      setTimeLeft((prev) => prev + 5);
      setTimeout(() => advanceQuestion(), 1200);
    } else {
      setCombo(0);
      setLives((prev) => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          setTimeout(() => endGame(), 1500);
        } else {
          setTimeout(() => advanceQuestion(), 1500);
        }
        return newLives;
      });
    }
  };

  // Idle / Start screen
  if (gameState === "idle") {
    return (
      <>
        <div className="flex flex-col items-center gap-8 px-6 pt-16 pb-24">
          <div className="text-6xl">⚡</div>
          <h1 className="text-3xl font-black dark:text-slate-100">挑战模式</h1>
          <p className="text-center text-duo-gray-400 dark:text-slate-400 max-w-xs">
            限时答题，连击加分！<br />
            从已学内容随机出题，看看你能得多少分
          </p>

          <div className="w-full max-w-xs space-y-3">
            <div className="card flex items-center justify-between">
              <span className="text-duo-gray-400 dark:text-slate-400">🏆 最高分</span>
              <span className="font-bold text-duo-orange">{bestScore}</span>
            </div>
            <div className="card flex items-center justify-between">
              <span className="text-duo-gray-400 dark:text-slate-400">❤️ 生命值</span>
              <span className="font-bold">3 条</span>
            </div>
            <div className="card flex items-center justify-between">
              <span className="text-duo-gray-400 dark:text-slate-400">⏱️ 每题限时</span>
              <span className="font-bold">15 秒</span>
            </div>
          </div>

          {canPlay ? (
            <button
              onClick={startGame}
              className="w-full max-w-xs rounded-2xl bg-duo-green py-4 text-lg font-bold text-white shadow-lg transition-all hover:opacity-90 active:scale-95"
            >
              开始挑战
            </button>
          ) : (
            <div className="card border-duo-orange/50 bg-orange-50 dark:bg-orange-900/20 max-w-xs text-center">
              <p className="text-sm text-duo-gray-400 dark:text-slate-400">
                ⚠️ 先完成至少一个关卡再来挑战
              </p>
            </div>
          )}
        </div>
        <BottomNav />
      </>
    );
  }

  // Finished screen
  if (gameState === "finished" && record) {
    const accuracy = record.totalQuestions > 0
      ? Math.round((record.correctCount / record.totalQuestions) * 100)
      : 0;
    const timeUsedSec = Math.round(record.timeUsedMs / 1000);

    return (
      <>
        <div className="flex flex-col items-center gap-6 px-6 pt-12 pb-24">
          {record.isNewBest && (
            <div className="animate-bounce rounded-full bg-duo-orange px-4 py-1 text-sm font-bold text-white">
              🎉 新纪录！
            </div>
          )}

          <div className="text-5xl">
            {record.isNewBest ? "🏆" : score > 100 ? "⭐" : "💪"}
          </div>

          <h1 className="text-3xl font-black dark:text-slate-100">挑战结束</h1>

          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            <div className="card flex flex-col items-center gap-1 py-4">
              <span className="text-2xl font-black text-duo-green">{score}</span>
              <span className="text-xs text-duo-gray-300 dark:text-slate-400">总分</span>
            </div>
            <div className="card flex flex-col items-center gap-1 py-4">
              <span className="text-2xl font-black text-duo-blue">{accuracy}%</span>
              <span className="text-xs text-duo-gray-300 dark:text-slate-400">正确率</span>
            </div>
            <div className="card flex flex-col items-center gap-1 py-4">
              <span className="text-2xl font-black text-duo-orange">{record.maxCombo}x</span>
              <span className="text-xs text-duo-gray-300 dark:text-slate-400">最长连击</span>
            </div>
            <div className="card flex flex-col items-center gap-1 py-4">
              <span className="text-2xl font-black text-duo-purple">{timeUsedSec}s</span>
              <span className="text-xs text-duo-gray-300 dark:text-slate-400">用时</span>
            </div>
          </div>

          <div className="flex gap-3 w-full max-w-sm pt-4">
            <button
              onClick={startGame}
              className="flex-1 rounded-2xl bg-duo-green py-3 font-bold text-white transition-all hover:opacity-90 active:scale-95"
            >
              再来一次
            </button>
            <button
              onClick={() => setGameState("idle")}
              className="flex-1 rounded-2xl border-2 border-duo-green py-3 font-bold text-duo-green transition-colors hover:bg-duo-green hover:text-white"
            >
              返回
            </button>
          </div>
        </div>
        <BottomNav />
      </>
    );
  }

  // Playing screen
  const question = questions[currentIdx];
  if (!question) return null;

  const timerPercent = (timeLeft / 15) * 100;
  const timerColor = timeLeft <= 5
    ? "bg-duo-red"
    : timeLeft <= 10
    ? "bg-duo-orange"
    : "bg-duo-green";

  return (
    <>
      <div className="flex flex-col gap-4 px-6 pt-6 pb-24">
        {/* Top bar: lives, score, combo */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className={`text-xl ${i < lives ? "" : "opacity-30"}`}>
                ❤️
              </span>
            ))}
          </div>
          <div className="text-center">
            {combo > 1 && (
              <span className="text-xs font-bold text-duo-orange animate-pulse">
                {combo}x COMBO
              </span>
            )}
          </div>
          <div className="text-right">
            <span className="text-lg font-black text-duo-green">{score}</span>
          </div>
        </div>

        {/* Timer bar */}
        <div className="h-2 w-full rounded-full bg-duo-gray-200 dark:bg-slate-700 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-linear ${timerColor}`}
            style={{ width: `${timerPercent}%` }}
          />
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-between text-xs text-duo-gray-300 dark:text-slate-400">
          <span>第 {currentIdx + 1}/{questions.length} 题</span>
          <span>⏱️ {timeLeft}s</span>
        </div>

        {/* Question */}
        <div className="space-y-4 pt-2">
          {question.story && (
            <div className="card bg-green-50 dark:bg-green-900/20 border-duo-green/30">
              <p className="text-sm text-duo-gray-400 dark:text-slate-300 leading-relaxed">
                {question.story}
              </p>
            </div>
          )}
          <h2 className="text-lg font-bold leading-snug dark:text-slate-100">
            {question.question}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-3 pt-2">
          {question.options.map((option, idx) => {
            let state: "default" | "correct" | "wrong" = "default";
            if (showResult) {
              if (idx === question.answer) state = "correct";
              else if (idx === selected) state = "wrong";
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={showResult}
                className={`w-full rounded-xl border-2 px-4 py-3 text-left font-medium transition-all
                  ${state === "correct"
                    ? "border-duo-green bg-green-50 dark:bg-green-900/30 text-duo-green"
                    : state === "wrong"
                    ? "border-duo-red bg-red-50 dark:bg-red-900/30 text-duo-red"
                    : "border-duo-gray-200 dark:border-slate-600 hover:border-duo-green dark:text-slate-200"
                  }
                  ${showResult ? "cursor-default" : "active:scale-[0.98]"}
                `}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Feedback on answer */}
        {showResult && (
          <div className={`rounded-xl p-3 text-sm ${
            selected === question.answer
              ? "bg-green-50 dark:bg-green-900/20 text-duo-green"
              : "bg-red-50 dark:bg-red-900/20 text-duo-red"
          }`}>
            {selected === question.answer
              ? `✅ +${calculateScore(question.xp, combo)} 分！`
              : selected === null
              ? "⏰ 时间到！"
              : `❌ ${question.explanation}`
            }
          </div>
        )}
      </div>
      <BottomNav />
    </>
  );
}
