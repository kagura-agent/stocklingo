"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { UserProgress } from "./types";
import type { ActivityRecord } from "./activity";
import type { WrongAnswer } from "./wrong-answers";
import type { SRSCard } from "./srs";

export type DataType = "progress" | "activity" | "wrong_answers" | "srs";

export function isSupabaseEnabled(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export async function uploadAllData(
  supabase: SupabaseClient,
  userId: string
): Promise<void> {
  const progress = localStorage.getItem("stocklingo-progress");
  const activity = localStorage.getItem("stocklingo-activity");
  const wrongAnswers = localStorage.getItem("stocklingo_wrong_answers");
  const srs = localStorage.getItem("stocklingo_srs");

  const upserts: { data_type: DataType; data: unknown }[] = [
    { data_type: "progress", data: progress ? JSON.parse(progress) : {} },
    { data_type: "activity", data: activity ? JSON.parse(activity) : [] },
    { data_type: "wrong_answers", data: wrongAnswers ? JSON.parse(wrongAnswers) : [] },
    { data_type: "srs", data: srs ? JSON.parse(srs) : [] },
  ];

  for (const { data_type, data } of upserts) {
    await supabase.from("user_data").upsert(
      { user_id: userId, data_type, data, updated_at: new Date().toISOString() },
      { onConflict: "user_id,data_type" }
    );
  }
}

export async function downloadAndMerge(
  supabase: SupabaseClient,
  userId: string
): Promise<void> {
  const { data: rows } = await supabase
    .from("user_data")
    .select("data_type, data")
    .eq("user_id", userId);

  if (!rows || rows.length === 0) {
    await uploadAllData(supabase, userId);
    return;
  }

  const remote: Record<string, unknown> = {};
  for (const row of rows) {
    remote[row.data_type] = row.data;
  }

  mergeProgress(remote["progress"] as UserProgress | undefined);
  mergeActivity(remote["activity"] as ActivityRecord[] | undefined);
  mergeWrongAnswers(remote["wrong_answers"] as WrongAnswer[] | undefined);
  mergeSRS(remote["srs"] as SRSCard[] | undefined);

  await uploadAllData(supabase, userId);
}

function mergeProgress(remoteProgress: UserProgress | undefined): void {
  if (!remoteProgress) return;
  const raw = localStorage.getItem("stocklingo-progress");
  const local: UserProgress = raw
    ? JSON.parse(raw)
    : { completedLevels: {}, xp: 0, streak: { count: 0, lastDate: "" } };

  const merged: UserProgress = {
    completedLevels: { ...local.completedLevels },
    xp: Math.max(local.xp, remoteProgress.xp || 0),
    streak: local.streak,
  };

  if (remoteProgress.completedLevels) {
    for (const [key, val] of Object.entries(remoteProgress.completedLevels)) {
      const existing = merged.completedLevels[key];
      if (!existing || val.score > existing.score) {
        merged.completedLevels[key] = val;
      }
    }
  }

  if (remoteProgress.streak) {
    if (remoteProgress.streak.lastDate > (local.streak.lastDate || "")) {
      merged.streak = remoteProgress.streak;
    }
  }

  localStorage.setItem("stocklingo-progress", JSON.stringify(merged));
}

function mergeActivity(remoteActivity: ActivityRecord[] | undefined): void {
  if (!remoteActivity) return;
  const raw = localStorage.getItem("stocklingo-activity");
  const local: ActivityRecord[] = raw ? JSON.parse(raw) : [];

  const seen = new Set(local.map((a) => a.timestamp));
  const merged = [...local];
  for (const a of remoteActivity) {
    if (!seen.has(a.timestamp)) {
      merged.push(a);
      seen.add(a.timestamp);
    }
  }
  merged.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  localStorage.setItem("stocklingo-activity", JSON.stringify(merged));
}

function mergeWrongAnswers(remoteAnswers: WrongAnswer[] | undefined): void {
  if (!remoteAnswers) return;
  const raw = localStorage.getItem("stocklingo_wrong_answers");
  const local: WrongAnswer[] = raw ? JSON.parse(raw) : [];

  const map = new Map<string, WrongAnswer>();
  for (const a of local) map.set(a.id, a);
  for (const a of remoteAnswers) {
    const existing = map.get(a.id);
    if (!existing || a.timestamp > existing.timestamp) {
      map.set(a.id, a);
    }
  }
  localStorage.setItem("stocklingo_wrong_answers", JSON.stringify(Array.from(map.values())));
}

function mergeSRS(remoteCards: SRSCard[] | undefined): void {
  if (!remoteCards) return;
  const raw = localStorage.getItem("stocklingo_srs");
  const local: SRSCard[] = raw ? JSON.parse(raw) : [];

  const map = new Map<string, SRSCard>();
  for (const c of local) map.set(c.id, c);
  for (const c of remoteCards) {
    const existing = map.get(c.id);
    if (!existing || c.lastReview > existing.lastReview) {
      map.set(c.id, c);
    }
  }
  localStorage.setItem("stocklingo_srs", JSON.stringify(Array.from(map.values())));
}

export async function syncAfterWrite(
  supabase: SupabaseClient,
  userId: string,
  dataType: DataType,
  data: unknown
): Promise<void> {
  await supabase.from("user_data").upsert(
    { user_id: userId, data_type: dataType, data, updated_at: new Date().toISOString() },
    { onConflict: "user_id,data_type" }
  );
}
