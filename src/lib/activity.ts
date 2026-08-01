"use client";

export interface ActivityRecord {
  timestamp: string;
  market: string;
  chapter: number;
  level: number;
  score: number;
  total: number;
  durationSeconds: number;
}

const STORAGE_KEY = "stocklingo-activity";

export function getActivities(): ActivityRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveActivities(activities: ActivityRecord[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
}

export function recordActivity(record: ActivityRecord): void {
  const activities = getActivities();
  activities.push(record);
  saveActivities(activities);
  syncActivityIfLoggedIn(activities);
}

function syncActivityIfLoggedIn(activities: ActivityRecord[]): void {
  import("@/lib/supabase/client").then(({ createClient }) => {
    import("@/lib/sync").then(({ isSupabaseEnabled, syncAfterWrite }) => {
      if (!isSupabaseEnabled()) return;
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) syncAfterWrite(supabase, user.id, "activity", activities);
      });
    });
  });
}

export function getActivityByDate(date: string): ActivityRecord[] {
  return getActivities().filter(
    (a) => a.timestamp.split("T")[0] === date
  );
}
