export interface Question {
  id: string;
  chapter: number;
  level: number;
  order: number;
  type: "multiple_choice" | "true_false" | "scenario";
  difficulty: "easy" | "medium" | "hard";
  story: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  knowledgeCard: {
    title: string;
    content: string;
    funFact: string;
  };
  xp: number;
  tags: string[];
}

export interface ChapterMeta {
  id: number;
  title: string;
  titleEn: string;
  description: string;
  levels: number;
  unlockCondition: { chapter: number; minScore: number } | null;
}

export interface MarketMeta {
  market: string;
  name: string;
  icon: string;
  chapters: ChapterMeta[];
}

export interface LevelProgress {
  score: number;
  total: number;
  xpEarned: number;
  completedAt: string;
}

export interface UserProgress {
  completedLevels: Record<string, LevelProgress>;
  xp: number;
  streak: {
    count: number;
    lastDate: string;
  };
}
