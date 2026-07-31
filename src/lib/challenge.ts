import type { Question } from "./types";
import { getMarkets, getLevelQuestions } from "./content";
import { loadProgress } from "./progress";

const CHALLENGE_KEY = "stocklingo_challenge_history";
const BEST_SCORE_KEY = "stocklingo_challenge_best";

export interface ChallengeRecord {
  score: number;
  correctCount: number;
  totalQuestions: number;
  maxCombo: number;
  timeUsedMs: number;
  date: string;
  isNewBest: boolean;
}

/**
 * Get random questions from completed levels for challenge mode.
 * Returns up to `count` questions, shuffled across markets/chapters.
 */
export function getChallengeQuestions(count = 20): Question[] {
  const progress = loadProgress();
  const completedKeys = Object.keys(progress.completedLevels);

  if (completedKeys.length === 0) return [];

  const allQuestions: Question[] = [];

  for (const key of completedKeys) {
    // key format: "market-chapter-level" e.g. "a-shares-4-3"
    const parts = key.split("-");
    // Handle market names with hyphens (e.g., "a-shares", "hk-us")
    let market: string;
    let chapter: number;
    let level: number;

    if (key.startsWith("a-shares-")) {
      market = "a-shares";
      chapter = parseInt(parts[2]);
      level = parseInt(parts[3]);
    } else if (key.startsWith("hk-us-")) {
      market = "hk-us";
      chapter = parseInt(parts[2]);
      level = parseInt(parts[3]);
    } else {
      continue;
    }

    if (isNaN(chapter) || isNaN(level)) continue;

    const questions = getLevelQuestions(market, chapter, level);
    allQuestions.push(...questions);
  }

  // Shuffle using Fisher-Yates
  const shuffled = [...allQuestions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count);
}

/**
 * Calculate score for a correct answer with combo multiplier.
 */
export function calculateScore(baseXp: number, combo: number): number {
  const multiplier = Math.min(1 + (combo - 1) * 0.5, 5); // cap at 5x
  return Math.round(baseXp * multiplier);
}

/**
 * Save a challenge record to localStorage.
 */
export function saveChallengeRecord(record: ChallengeRecord): void {
  const history = getChallengeHistory();
  history.unshift(record);
  // Keep last 50 records
  if (history.length > 50) history.length = 50;

  if (typeof window !== "undefined") {
    localStorage.setItem(CHALLENGE_KEY, JSON.stringify(history));

    // Update best score
    const currentBest = getBestScore();
    if (record.score > currentBest) {
      localStorage.setItem(BEST_SCORE_KEY, String(record.score));
    }
  }
}

/**
 * Get historical best score.
 */
export function getBestScore(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(BEST_SCORE_KEY) || "0", 10);
}

/**
 * Get challenge history records.
 */
export function getChallengeHistory(): ChallengeRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CHALLENGE_KEY) || "[]");
  } catch {
    return [];
  }
}

/**
 * Check if user has completed at least one level.
 */
export function hasCompletedLevels(): boolean {
  const progress = loadProgress();
  return Object.keys(progress.completedLevels).length > 0;
}
