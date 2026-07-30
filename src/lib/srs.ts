"use client";

import type { Question } from "./types";
import type { WrongAnswer } from "./wrong-answers";

export interface SRSCard {
  id: string;
  market: string;
  chapter: number;
  level: number;
  question: Question;
  userAnswer: number;
  easiness: number;
  interval: number;
  repetitions: number;
  nextReview: string;
  lastReview: string;
}

const STORAGE_KEY = "stocklingo_srs";

function getCards(): SRSCard[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveCards(cards: SRSCard[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

export function gradeCard(card: SRSCard, quality: number): SRSCard {
  const q = Math.max(0, Math.min(5, quality));
  const newEasiness = Math.max(
    1.3,
    card.easiness + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)
  );

  let newInterval: number;
  let newRepetitions: number;

  if (q >= 3) {
    newInterval = Math.round(card.interval * newEasiness);
    newRepetitions = card.repetitions + 1;
  } else {
    newInterval = 1;
    newRepetitions = 0;
  }

  const now = new Date();
  const next = new Date(now);
  next.setDate(next.getDate() + newInterval);

  return {
    ...card,
    easiness: newEasiness,
    interval: newInterval,
    repetitions: newRepetitions,
    nextReview: next.toISOString(),
    lastReview: now.toISOString(),
  };
}

export function getDueCards(): SRSCard[] {
  const now = new Date().toISOString();
  return getCards().filter((card) => card.nextReview <= now);
}

export function getDueCount(): number {
  return getDueCards().length;
}

export function addToSRS(wrongAnswer: WrongAnswer): void {
  const cards = getCards();
  const existing = cards.findIndex((c) => c.id === wrongAnswer.id);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const card: SRSCard = {
    id: wrongAnswer.id,
    market: wrongAnswer.market ?? "a-shares",
    chapter: wrongAnswer.chapter,
    level: wrongAnswer.level,
    question: wrongAnswer.question,
    userAnswer: wrongAnswer.userAnswer,
    easiness: 2.5,
    interval: 1,
    repetitions: 0,
    nextReview: tomorrow.toISOString(),
    lastReview: new Date().toISOString(),
  };

  if (existing >= 0) {
    cards[existing] = card;
  } else {
    cards.push(card);
  }
  saveCards(cards);
}

export function updateSRSCard(card: SRSCard): void {
  const cards = getCards();
  const idx = cards.findIndex((c) => c.id === card.id);
  if (idx >= 0) {
    cards[idx] = card;
  } else {
    cards.push(card);
  }
  saveCards(cards);
}
