"use client";

const STORAGE_KEY = "stocklingo-srs-reviews";

export function getSRSReviewCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    return parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
  } catch {
    return 0;
  }
}

export function incrementSRSReviewCount(): void {
  if (typeof window === "undefined") return;
  const count = getSRSReviewCount() + 1;
  localStorage.setItem(STORAGE_KEY, String(count));
}
