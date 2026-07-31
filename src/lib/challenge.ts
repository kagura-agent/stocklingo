"use client";

import type { Question } from "./types";
import { loadProgress } from "./progress";
import { getLevelQuestions, getMarkets } from "./content";

export interface ChallengeRecord {
  date: string;
  score: number;
  correct: number;
  total: number;
  maxCombo: number;
  durationSeconds: number;
}

const CHALLENGE_STORAGE_KEY = "stocklingo-challenge-history";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getChallengeQuestions(): Question[] {
  const progress = loadProgress();
  const completedKeys = Object.keys(progress.completedLevels);
  if (completedKeys.length === 0) return [];

  const allQuestions: Question[] = [];
  for (const key of completedKeys) {
    const parts = key.split("-");
    const market = parts.slice(0, -2).join("-");
    const chapter = Number(parts[parts.length - 2]);
    const level = Number(parts[parts.length - 1]);
    const questions = getLevelQuestions(market, chapter, level);
    allQuestions.push(...questions);
  }

  return shuffle(allQuestions).slice(0, 20);
}

export function hasCompletedLevels(): boolean {
  const progress = loadProgress();
  return Object.keys(progress.completedLevels).length > 0;
}

export function saveChallengeRecord(record: ChallengeRecord): void {
  if (typeof window === "undefined") return;
  const history = getChallengeHistory();
  history.unshift(record);
  if (history.length > 50) history.length = 50;
  localStorage.setItem(CHALLENGE_STORAGE_KEY, JSON.stringify(history));
}

export function getChallengeHistory(): ChallengeRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CHALLENGE_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function getBestScore(): number {
  const history = getChallengeHistory();
  if (history.length === 0) return 0;
  return Math.max(...history.map((r) => r.score));
}
