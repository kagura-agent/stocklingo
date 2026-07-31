import chaseHighData from "../../content/scenarios/chase-high.json";
import stopLossData from "../../content/scenarios/stop-loss.json";
import bullBearData from "../../content/scenarios/bull-bear.json";

export interface ScenarioOption {
  text: string;
  outcome: string;
  next: string | null;
  profit: number;
}

export interface ScenarioNode {
  id: string;
  context: string;
  options: ScenarioOption[];
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  nodes: ScenarioNode[];
}

export interface ScenarioResult {
  scenarioId: string;
  totalProfit: number;
  choices: { nodeId: string; optionIndex: number }[];
  completedAt: string;
  score: number;
}

const STORAGE_KEY = "stocklingo-scenarios";

const scenarios: Scenario[] = [
  chaseHighData as Scenario,
  stopLossData as Scenario,
  bullBearData as Scenario,
];

export function getAllScenarios(): Scenario[] {
  return scenarios;
}

export function getScenarioById(id: string): Scenario | undefined {
  return scenarios.find((s) => s.id === id);
}

export function getScenarioResults(): ScenarioResult[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveScenarioResult(result: ScenarioResult): void {
  const results = getScenarioResults();
  results.push(result);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
}

export function calculateScore(totalProfit: number, steps: number): number {
  const profitScore = Math.max(0, Math.min(60, (totalProfit + 30) * 2));
  const efficiencyScore = Math.max(0, 40 - (steps - 1) * 5);
  return Math.round(Math.min(100, profitScore + efficiencyScore));
}

export function getCompletedScenarioIds(): string[] {
  const results = getScenarioResults();
  return Array.from(new Set(results.map((r) => r.scenarioId)));
}
