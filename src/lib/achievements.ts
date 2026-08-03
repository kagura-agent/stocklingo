import { getMarkets } from "./content";
import type { UserProgress } from "./types";

export type AchievementTier = "bronze" | "silver" | "gold";

export interface Achievement {
  id: string;
  emoji: string;
  lockedEmoji: string;
  label: string;
  description: string;
  tier: AchievementTier;
  category: string;
  check: (ctx: AchievementContext) => boolean;
}

export interface AchievementContext {
  completedCount: number;
  totalLevels: number;
  streak: number;
  dailyStreak: number;
  scenarioCount: number;
  progress: UserProgress;
  activities: { score: number; total: number }[];
  srsReviewCount: number;
}

export const ACHIEVEMENT_CATEGORIES = [
  { key: "progress", label: "📈 进度类" },
  { key: "streak", label: "🔥 连续类" },
  { key: "accuracy", label: "💯 精准类" },
  { key: "explore", label: "🌏 探索类" },
  { key: "review", label: "🧠 复习类" },
  { key: "daily", label: "📅 每日类" },
];

export const achievements: Achievement[] = [
  // 进度类
  { id: "progress-1", emoji: "🌟", lockedEmoji: "🔒", label: "初学者", description: "完成第 1 个关卡", tier: "bronze", category: "progress", check: (c) => c.completedCount >= 1 },
  { id: "progress-5", emoji: "📈", lockedEmoji: "🔒", label: "行情通", description: "完成 5 个关卡", tier: "bronze", category: "progress", check: (c) => c.completedCount >= 5 },
  { id: "progress-10", emoji: "🏆", lockedEmoji: "🔒", label: "老股民", description: "完成 10 个关卡", tier: "silver", category: "progress", check: (c) => c.completedCount >= 10 },
  { id: "progress-15", emoji: "👑", lockedEmoji: "🔒", label: "股神", description: "完成 15 个关卡", tier: "silver", category: "progress", check: (c) => c.completedCount >= 15 },
  { id: "progress-20", emoji: "💫", lockedEmoji: "🔒", label: "传奇", description: "完成 20 个关卡", tier: "gold", category: "progress", check: (c) => c.completedCount >= 20 },
  { id: "progress-all", emoji: "🎓", lockedEmoji: "🔒", label: "毕业了", description: "完成全部关卡", tier: "gold", category: "progress", check: (c) => c.completedCount >= c.totalLevels && c.totalLevels > 0 },

  // 连续类
  { id: "streak-3", emoji: "🔥", lockedEmoji: "🔒", label: "三天打鱼", description: "连续打卡 3 天", tier: "bronze", category: "streak", check: (c) => c.streak >= 3 },
  { id: "streak-7", emoji: "⚡", lockedEmoji: "🔒", label: "周周不断", description: "连续打卡 7 天", tier: "bronze", category: "streak", check: (c) => c.streak >= 7 },
  { id: "streak-14", emoji: "🌊", lockedEmoji: "🔒", label: "半月不辍", description: "连续打卡 14 天", tier: "silver", category: "streak", check: (c) => c.streak >= 14 },
  { id: "streak-30", emoji: "💎", lockedEmoji: "🔒", label: "月度坚持", description: "连续打卡 30 天", tier: "silver", category: "streak", check: (c) => c.streak >= 30 },
  { id: "streak-60", emoji: "🏅", lockedEmoji: "🔒", label: "钢铁意志", description: "连续打卡 60 天", tier: "gold", category: "streak", check: (c) => c.streak >= 60 },

  // 精准类
  { id: "accuracy-perfect", emoji: "💯", lockedEmoji: "🔒", label: "满分选手", description: "满分通关任意关卡", tier: "silver", category: "accuracy", check: (c) => Object.values(c.progress.completedLevels).some((l) => l.score === l.total && l.total > 0) },
  { id: "accuracy-5streak", emoji: "🎯", lockedEmoji: "🔒", label: "精准射手", description: "连续 5 次正确率 80%+", tier: "gold", category: "accuracy", check: (c) => {
    const acts = c.activities;
    if (acts.length < 5) return false;
    for (let i = acts.length - 5; i < acts.length; i++) {
      if (acts[i].total === 0 || acts[i].score / acts[i].total < 0.8) return false;
    }
    return true;
  }},

  // 探索类
  { id: "explore-two-markets", emoji: "🌏", lockedEmoji: "🔒", label: "全球视野", description: "在两个市场各完成至少一个关卡", tier: "silver", category: "explore", check: (c) => {
    const keys = Object.keys(c.progress.completedLevels);
    const markets = new Set(keys.map((k) => k.split("-").slice(0, -2).join("-")));
    return markets.size >= 2;
  }},
  { id: "explore-master", emoji: "📚", lockedEmoji: "🔒", label: "学霸", description: "完成某市场的全部关卡", tier: "gold", category: "explore", check: (c) => {
    const markets = getMarkets();
    return markets.some((m) => {
      const totalLevels = m.chapters.reduce((s, ch) => s + ch.levels, 0);
      const completedInMarket = Object.keys(c.progress.completedLevels).filter(
        (k) => k.startsWith(`${m.market}-`)
      ).length;
      return completedInMarket >= totalLevels && totalLevels > 0;
    });
  }},
  { id: "explore-scenario-3", emoji: "🎭", lockedEmoji: "🔒", label: "剧本杀", description: "完成 3 个情景模拟", tier: "bronze", category: "explore", check: (c) => c.scenarioCount >= 3 },
  { id: "explore-scenario-all", emoji: "🎬", lockedEmoji: "🔒", label: "全场景通关", description: "完成全部 6 个情景模拟", tier: "gold", category: "explore", check: (c) => c.scenarioCount >= 6 },

  // 复习类
  { id: "review-10", emoji: "🧠", lockedEmoji: "🔒", label: "温故知新", description: "复习 10 题", tier: "bronze", category: "review", check: (c) => c.srsReviewCount >= 10 },
  { id: "review-30", emoji: "📖", lockedEmoji: "🔒", label: "勤学苦练", description: "复习 30 题", tier: "bronze", category: "review", check: (c) => c.srsReviewCount >= 30 },
  { id: "review-50", emoji: "🔬", lockedEmoji: "🔒", label: "求知若渴", description: "复习 50 题", tier: "silver", category: "review", check: (c) => c.srsReviewCount >= 50 },
  { id: "review-100", emoji: "🏛️", lockedEmoji: "🔒", label: "学术泰斗", description: "复习 100 题", tier: "gold", category: "review", check: (c) => c.srsReviewCount >= 100 },

  // 每日类
  { id: "daily-3", emoji: "📅", lockedEmoji: "🔒", label: "每日三连", description: "每日一题连续 3 天", tier: "bronze", category: "daily", check: (c) => c.dailyStreak >= 3 },
  { id: "daily-7", emoji: "🗓️", lockedEmoji: "🔒", label: "周周打卡", description: "每日一题连续 7 天", tier: "silver", category: "daily", check: (c) => c.dailyStreak >= 7 },
  { id: "daily-14", emoji: "📆", lockedEmoji: "🔒", label: "半月达人", description: "每日一题连续 14 天", tier: "gold", category: "daily", check: (c) => c.dailyStreak >= 14 },
];

export function getUnlockedAchievements(ctx: AchievementContext): Achievement[] {
  return achievements.filter((a) => a.check(ctx));
}
