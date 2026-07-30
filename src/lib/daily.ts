"use client";

import type { Question } from "./types";
import { getMarkets, getChapterQuestions } from "./content";
import { loadProgress, saveProgress } from "./progress";

const STORAGE_KEY = "stocklingo-daily";

export interface DailyState {
  date: string;
  completed: boolean;
  correct: boolean | null;
  xpEarned: number;
  streak: number;
}

function getDefaultState(): DailyState {
  return {
    date: "",
    completed: false,
    correct: null,
    xpEarned: 0,
    streak: 0,
  };
}

function loadDailyState(): DailyState {
  if (typeof window === "undefined") return getDefaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    return JSON.parse(raw);
  } catch {
    return getDefaultState();
  }
}

function saveDailyState(state: DailyState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function getCompletedChapterIds(): { market: string; chapterId: number }[] {
  const progress = loadProgress();
  const allMarkets = getMarkets();
  const completed: { market: string; chapterId: number }[] = [];

  for (const meta of allMarkets) {
    for (const ch of meta.chapters) {
      let allDone = true;
      for (let l = 1; l <= ch.levels; l++) {
        if (!progress.completedLevels[`${meta.market}-${ch.id}-${l}`]) {
          allDone = false;
          break;
        }
      }
      if (allDone) completed.push({ market: meta.market, chapterId: ch.id });
    }
  }
  return completed;
}

export function getDailyQuestion(): Question {
  const completedChapters = getCompletedChapterIds();
  const sources = completedChapters.length > 0
    ? completedChapters
    : [{ market: "a-shares", chapterId: 1 }];

  const allQuestions: Question[] = [];
  for (const { market, chapterId } of sources) {
    allQuestions.push(...getChapterQuestions(market, chapterId));
  }

  const today = getToday();
  const index = simpleHash(today) % allQuestions.length;
  return allQuestions[index];
}

export function isDailyCompleted(): boolean {
  const state = loadDailyState();
  return state.date === getToday() && state.completed;
}

export function completeDailyQuiz(correct: boolean, xpEarned: number): void {
  const state = loadDailyState();
  const today = getToday();

  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  let newStreak: number;
  if (state.date === yesterday) {
    newStreak = state.streak + 1;
  } else if (state.date === today) {
    newStreak = state.streak;
  } else {
    newStreak = 1;
  }

  saveDailyState({
    date: today,
    completed: true,
    correct,
    xpEarned,
    streak: newStreak,
  });

  if (correct && xpEarned > 0) {
    const progress = loadProgress();
    progress.xp += xpEarned;
    saveProgress(progress);
  }
}

export function getDailyState(): DailyState {
  const state = loadDailyState();
  const today = getToday();
  if (state.date !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    return {
      ...getDefaultState(),
      streak: state.date === yesterday ? state.streak : 0,
    };
  }
  return state;
}
