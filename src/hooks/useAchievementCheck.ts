"use client";

import { useMemo } from "react";
import { achievements, type AchievementContext, type Achievement } from "@/lib/achievements";

export type { AchievementContext } from "@/lib/achievements";

const STORAGE_KEY = "stocklingo_notified_achievements";

function getNotifiedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveNotifiedIds(ids: string[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function useAchievementCheck(ctx: AchievementContext | null): Achievement[] {
  return useMemo(() => {
    if (!ctx) return [];
    const notified = getNotifiedIds();
    const newlyUnlocked: Achievement[] = [];

    for (const a of achievements) {
      if (a.check(ctx) && !notified.includes(a.id)) {
        newlyUnlocked.push(a);
      }
    }

    if (newlyUnlocked.length > 0) {
      saveNotifiedIds([...notified, ...newlyUnlocked.map((a) => a.id)]);
    }

    return newlyUnlocked;
  }, [ctx]);
}
