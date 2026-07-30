"use client";

import type { UserProgress } from "./types";

const STORAGE_KEY = "stocklingo-progress";

function getDefaultProgress(): UserProgress {
  return {
    completedLevels: {},
    xp: 0,
    streak: { count: 0, lastDate: "" },
  };
}

export function loadProgress(): UserProgress {
  if (typeof window === "undefined") return getDefaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultProgress();
    return JSON.parse(raw);
  } catch {
    return getDefaultProgress();
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function levelKey(market: string, chapter: number, level: number): string {
  return `${market}-${chapter}-${level}`;
}

export function completeLevel(
  market: string,
  chapter: number,
  level: number,
  score: number,
  total: number,
  xpEarned: number
): UserProgress {
  const progress = loadProgress();
  const key = levelKey(market, chapter, level);

  const existing = progress.completedLevels[key];
  if (!existing || score > existing.score) {
    progress.completedLevels[key] = {
      score,
      total,
      xpEarned,
      completedAt: new Date().toISOString(),
    };
  }

  progress.xp += xpEarned;

  const today = new Date().toISOString().split("T")[0];
  if (progress.streak.lastDate === today) {
    // Already counted today
  } else {
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];
    if (progress.streak.lastDate === yesterday) {
      progress.streak.count += 1;
    } else {
      progress.streak.count = 1;
    }
    progress.streak.lastDate = today;
  }

  saveProgress(progress);
  return progress;
}

export function isLevelCompleted(market: string, chapter: number, level: number): boolean {
  const progress = loadProgress();
  return !!progress.completedLevels[levelKey(market, chapter, level)];
}

export function getChapterScore(market: string, chapter: number): number {
  const progress = loadProgress();
  const prefix = `${market}-${chapter}-`;
  let totalScore = 0;
  let totalQuestions = 0;
  for (const [key, lp] of Object.entries(progress.completedLevels)) {
    if (key.startsWith(prefix)) {
      totalScore += lp.score;
      totalQuestions += lp.total;
    }
  }
  return totalQuestions === 0 ? 0 : totalScore / totalQuestions;
}

export function isChapterUnlocked(
  market: string,
  chapterId: number,
  unlockCondition: { chapter: number; minScore: number } | null
): boolean {
  if (!unlockCondition) return true;
  return getChapterScore(market, unlockCondition.chapter) >= unlockCondition.minScore;
}
