"use client";

import type { Question } from "./types";
import { addToSRS } from "./srs";

export interface WrongAnswer {
  id: string;
  market: string;
  chapter: number;
  level: number;
  question: Question;
  userAnswer: number;
  timestamp: number;
}

const STORAGE_KEY = "stocklingo_wrong_answers";

export function getWrongAnswers(): WrongAnswer[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveWrongAnswer(
  q: Question,
  market: string,
  chapter: number,
  level: number,
  userAnswer: number
): void {
  if (typeof window === "undefined") return;
  const answers = getWrongAnswers();
  const id = `${market}-${chapter}-${level}-${q.id}`;
  const existing = answers.findIndex((a) => a.id === id);
  const entry: WrongAnswer = {
    id,
    market,
    chapter,
    level,
    question: q,
    userAnswer,
    timestamp: Date.now(),
  };
  if (existing >= 0) {
    answers[existing] = entry;
  } else {
    answers.push(entry);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  addToSRS(entry);
  syncWrongAnswersIfLoggedIn(answers);
}

function syncWrongAnswersIfLoggedIn(answers: WrongAnswer[]): void {
  import("@/lib/supabase/client").then(({ createClient }) => {
    import("@/lib/sync").then(({ isSupabaseEnabled, syncAfterWrite }) => {
      if (!isSupabaseEnabled()) return;
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) syncAfterWrite(supabase, user.id, "wrong_answers", answers);
      });
    });
  });
}

export function removeWrongAnswer(id: string): void {
  if (typeof window === "undefined") return;
  const answers = getWrongAnswers().filter((a) => a.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
}

export function clearAllWrongAnswers(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
