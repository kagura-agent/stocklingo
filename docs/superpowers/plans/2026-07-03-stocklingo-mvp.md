# StockLingo MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Duolingo-style gamified stock market education app (A-Shares MVP) with 102 quiz questions across 3 chapters, deployed as a static Next.js site.

**Architecture:** Next.js 14 App Router with static export. Content lives in JSON files loaded at build time. User progress (XP, streaks, completed levels) stored in localStorage. Mobile-first responsive design with Duolingo's signature green (#58CC02) theme.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, localStorage

---

## File Structure

```
stocklingo/
├── content/a-shares/
│   ├── metadata.json          (exists - market & chapter metadata)
│   ├── chapter-1.json         (create - 34 questions: 股票是什么)
│   ├── chapter-2.json         (create - 34 questions: 看懂行情)
│   └── chapter-3.json         (create - 34 questions: 牛熊往事)
├── src/
│   ├── app/
│   │   ├── globals.css        (create - Tailwind directives + custom styles)
│   │   ├── layout.tsx         (create - root layout with fonts, metadata)
│   │   ├── page.tsx           (create - home page, market selection)
│   │   ├── learn/
│   │   │   ├── page.tsx       (create - skill tree with chapters & levels)
│   │   │   └── [chapter]/
│   │   │       └── [level]/
│   │   │           └── page.tsx (create - quiz page with full quiz flow)
│   │   └── profile/
│   │       └── page.tsx       (create - XP, streak, completed levels)
│   ├── components/
│   │   ├── ProgressBar.tsx    (create - quiz progress indicator)
│   │   ├── QuestionCard.tsx   (create - story + question display)
│   │   ├── OptionButton.tsx   (create - Duolingo-style answer button)
│   │   ├── KnowledgeCard.tsx  (create - post-answer knowledge popup)
│   │   ├── XPAnimation.tsx    (create - XP earned animation)
│   │   ├── LevelSummary.tsx   (create - end-of-level score summary)
│   │   ├── ChapterCard.tsx    (create - chapter in skill tree)
│   │   └── BottomNav.tsx      (create - mobile bottom navigation)
│   └── lib/
│       ├── types.ts           (create - TypeScript interfaces)
│       ├── content.ts         (create - JSON data loading functions)
│       └── progress.ts        (create - localStorage progress/XP/streak)
├── public/
│   └── favicon.ico            (create - simple favicon)
├── package.json               (create - dependencies)
├── tailwind.config.ts         (create - custom theme)
├── tsconfig.json              (create - TypeScript config)
├── next.config.ts             (create - output: 'export')
└── .gitignore                 (create - Node ignores)
```

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tailwind.config.ts`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Create: `src/app/globals.css`
- Create: `src/app/layout.tsx`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "stocklingo",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.2.29",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/node": "^20.17.50",
    "@types/react": "^18.3.23",
    "@types/react-dom": "^18.3.7",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.4",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.8.3"
  }
}
```

- [ ] **Step 2: Create next.config.ts**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
};

export default nextConfig;
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Create tailwind.config.ts**

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        duo: {
          green: "#58CC02",
          "green-dark": "#4CAD00",
          "green-light": "#89E219",
          blue: "#1CB0F6",
          red: "#FF4B4B",
          orange: "#FF9600",
          purple: "#CE82FF",
          gray: {
            100: "#F7F7F7",
            200: "#E5E5E5",
            300: "#AFAFAF",
            400: "#777777",
            500: "#4B4B4B",
          },
        },
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 5: Create postcss.config.mjs**

```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
```

- [ ] **Step 6: Create .gitignore**

```
node_modules/
.next/
out/
*.tsbuildinfo
next-env.d.ts
```

- [ ] **Step 7: Create src/app/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-white text-duo-gray-500 antialiased;
  }
}

@layer components {
  .btn-option {
    @apply w-full rounded-2xl border-2 border-b-4 border-duo-gray-200 bg-white p-4 text-left text-lg font-medium transition-all active:border-b-2 active:mt-[2px];
  }
  .btn-option-selected {
    @apply border-duo-blue bg-blue-50 text-duo-blue;
  }
  .btn-option-correct {
    @apply border-duo-green bg-green-50 text-duo-green-dark;
  }
  .btn-option-wrong {
    @apply border-duo-red bg-red-50 text-duo-red;
  }
  .btn-primary {
    @apply w-full rounded-2xl border-b-4 border-[#4CAD00] bg-duo-green px-6 py-4 text-center text-lg font-bold text-white uppercase tracking-wide transition-all active:border-b-0 active:mt-1;
  }
  .card {
    @apply rounded-2xl border-2 border-duo-gray-200 bg-white p-5;
  }
}
```

- [ ] **Step 8: Create src/app/layout.tsx**

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StockLingo — 炒股版多邻国",
  description: "用游戏化方式学炒股",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-duo-gray-100">
        <main className="mx-auto max-w-lg pb-20">{children}</main>
      </body>
    </html>
  );
}
```

- [ ] **Step 9: Install dependencies and verify setup**

Run: `cd /home/kagura/repos/stocklingo && npm install`
Expected: Clean install, node_modules created

Run: `npx next build 2>&1 | tail -5`
Expected: May warn about missing pages but no crash

- [ ] **Step 10: Commit**

```bash
git add package.json next.config.ts tsconfig.json tailwind.config.ts postcss.config.mjs .gitignore src/app/globals.css src/app/layout.tsx
git commit -m "feat: scaffold Next.js 14 project with Tailwind"
```

---

## Task 2: TypeScript Types & Library Code

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/content.ts`
- Create: `src/lib/progress.ts`

- [ ] **Step 1: Create src/lib/types.ts**

```typescript
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
```

- [ ] **Step 2: Create src/lib/content.ts**

```typescript
import fs from "fs";
import path from "path";
import type { MarketMeta, Question } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content", "a-shares");

export function getMarketMeta(): MarketMeta {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, "metadata.json"), "utf-8");
  return JSON.parse(raw);
}

export function getChapterQuestions(chapter: number): Question[] {
  const raw = fs.readFileSync(
    path.join(CONTENT_DIR, `chapter-${chapter}.json`),
    "utf-8"
  );
  return JSON.parse(raw);
}

export function getLevelQuestions(chapter: number, level: number): Question[] {
  const questions = getChapterQuestions(chapter);
  return questions
    .filter((q) => q.level === level)
    .sort((a, b) => a.order - b.order);
}

export function getAllChapterLevelPairs(): { chapter: string; level: string }[] {
  const meta = getMarketMeta();
  const pairs: { chapter: string; level: string }[] = [];
  for (const ch of meta.chapters) {
    for (let l = 1; l <= ch.levels; l++) {
      pairs.push({ chapter: String(ch.id), level: String(l) });
    }
  }
  return pairs;
}
```

- [ ] **Step 3: Create src/lib/progress.ts**

```typescript
"use client";

import type { LevelProgress, UserProgress } from "./types";

const STORAGE_KEY = "stocklingo-progress";

function getDefaultProgress(): UserProgress {
  return {
    completedLevels: {},
    xp: 0,
    streak: { count: 0, lastDate: "" },
  };
}

export function loadProgress(): UserProgress {
  if (typeof window === "undefined") return getDefaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultProgress();
    return JSON.parse(raw);
  } catch {
    return getDefaultProgress();
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function levelKey(chapter: number, level: number): string {
  return `${chapter}-${level}`;
}

export function completeLevel(
  chapter: number,
  level: number,
  score: number,
  total: number,
  xpEarned: number
): UserProgress {
  const progress = loadProgress();
  const key = levelKey(chapter, level);

  const existing = progress.completedLevels[key];
  if (!existing || score > existing.score) {
    progress.completedLevels[key] = {
      score,
      total,
      xpEarned,
      completedAt: new Date().toISOString(),
    };
  }

  progress.xp += xpEarned;

  const today = new Date().toISOString().split("T")[0];
  if (progress.streak.lastDate === today) {
    // Already counted today
  } else {
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];
    if (progress.streak.lastDate === yesterday) {
      progress.streak.count += 1;
    } else {
      progress.streak.count = 1;
    }
    progress.streak.lastDate = today;
  }

  saveProgress(progress);
  return progress;
}

export function isLevelCompleted(chapter: number, level: number): boolean {
  const progress = loadProgress();
  return !!progress.completedLevels[levelKey(chapter, level)];
}

export function getChapterScore(chapter: number): number {
  const progress = loadProgress();
  let totalScore = 0;
  let totalQuestions = 0;
  for (const [key, lp] of Object.entries(progress.completedLevels)) {
    if (key.startsWith(`${chapter}-`)) {
      totalScore += lp.score;
      totalQuestions += lp.total;
    }
  }
  return totalQuestions === 0 ? 0 : totalScore / totalQuestions;
}

export function isChapterUnlocked(
  chapterId: number,
  unlockCondition: { chapter: number; minScore: number } | null
): boolean {
  if (!unlockCondition) return true;
  return getChapterScore(unlockCondition.chapter) >= unlockCondition.minScore;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/types.ts src/lib/content.ts src/lib/progress.ts
git commit -m "feat: add types, content loader, and progress manager"
```

---

## Task 3: Content — Chapter 1 (股票是什么, 34 questions)

**Files:**
- Create: `content/a-shares/chapter-1.json`

- [ ] **Step 1: Write chapter-1.json**

Create all 34 questions for Chapter 1:
- Level 1-1: 股票本质 (6 questions, mix of multiple_choice/true_false)
- Level 1-2: A股市场 (6 questions)
- Level 1-3: 交易规则 (6 questions)
- Level 1-4: 开户买卖 (6 questions)
- Level 1-5: Boss Challenge (10 questions, mix of all types including scenario, higher difficulty)

Requirements:
- IDs follow pattern: `a-shares-{chapter}-{level}-{order:02d}` (e.g., `a-shares-1-1-01`)
- Chinese language, vivid 2-3 sentence stories
- Plausible distractors
- true_false options: `["正确", "错误"]`
- XP: easy=10, medium=15, hard=20
- Boss questions: mostly medium/hard

- [ ] **Step 2: Validate JSON**

Run: `cd /home/kagura/repos/stocklingo && node -e "const d=require('./content/a-shares/chapter-1.json'); console.log('Questions:', d.length, 'Levels:', [...new Set(d.map(q=>q.level))])"`
Expected: `Questions: 34 Levels: [1, 2, 3, 4, 5]`

- [ ] **Step 3: Commit**

```bash
git add content/a-shares/chapter-1.json
git commit -m "content: add chapter 1 — 股票是什么 (34 questions)"
```

---

## Task 4: Content — Chapter 2 (看懂行情, 34 questions)

**Files:**
- Create: `content/a-shares/chapter-2.json`

- [ ] **Step 1: Write chapter-2.json**

Same structure as Chapter 1 but for market reading topics:
- Level 2-1: K线图入门 (6 questions)
- Level 2-2: 成交量换手率 (6 questions)
- Level 2-3: PE/PB/市值 (6 questions)
- Level 2-4: 大盘指数 (6 questions)
- Level 2-5: Boss Challenge (10 questions)

- [ ] **Step 2: Validate JSON**

Run: `cd /home/kagura/repos/stocklingo && node -e "const d=require('./content/a-shares/chapter-2.json'); console.log('Questions:', d.length, 'Levels:', [...new Set(d.map(q=>q.level))])"`
Expected: `Questions: 34 Levels: [1, 2, 3, 4, 5]`

- [ ] **Step 3: Commit**

```bash
git add content/a-shares/chapter-2.json
git commit -m "content: add chapter 2 — 看懂行情 (34 questions)"
```

---

## Task 5: Content — Chapter 3 (牛熊往事, 34 questions)

**Files:**
- Create: `content/a-shares/chapter-3.json`

- [ ] **Step 1: Write chapter-3.json**

Historical events chapter — accuracy is critical:
- Level 3-1: 2007超级牛市 — 998→6124→1664 (6 questions)
- Level 3-2: 2015杠杆牛 — 5178→千股跌停 (6 questions)
- Level 3-3: 2016熔断 — 4天4次熔断 (6 questions)
- Level 3-4: 2020疫情冲击 (6 questions)
- Level 3-5: Boss Challenge (10 questions)

Key historical facts to get right:
- 2005.6.6 上证最低998点 → 2007.10.16 最高6124点 → 2008.10.28 最低1664点
- 2015.6.12 上证5178点 → 千股跌停 → 2015.8.26 最低2850点
- 2016.1.4 熔断机制首日触发, 1.4和1.7两天四次熔断, 1.8暂停熔断机制, 仅实施4天
- 2020.2.3 春节后开盘上证跌7.72%, 后快速反弹

- [ ] **Step 2: Validate JSON**

Run: `cd /home/kagura/repos/stocklingo && node -e "const d=require('./content/a-shares/chapter-3.json'); console.log('Questions:', d.length, 'Levels:', [...new Set(d.map(q=>q.level))])"`
Expected: `Questions: 34 Levels: [1, 2, 3, 4, 5]`

- [ ] **Step 3: Commit**

```bash
git add content/a-shares/chapter-3.json
git commit -m "content: add chapter 3 — 牛熊往事 (34 questions)"
```

---

## Task 6: UI Components

**Files:**
- Create: `src/components/ProgressBar.tsx`
- Create: `src/components/OptionButton.tsx`
- Create: `src/components/QuestionCard.tsx`
- Create: `src/components/KnowledgeCard.tsx`
- Create: `src/components/XPAnimation.tsx`
- Create: `src/components/LevelSummary.tsx`
- Create: `src/components/ChapterCard.tsx`
- Create: `src/components/BottomNav.tsx`

- [ ] **Step 1: Create ProgressBar.tsx**

```tsx
"use client";

export default function ProgressBar({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="h-4 w-full rounded-full bg-duo-gray-200">
      <div
        className="h-4 rounded-full bg-duo-green transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Create OptionButton.tsx**

```tsx
"use client";

type OptionState = "default" | "selected" | "correct" | "wrong" | "missed";

export default function OptionButton({
  label,
  state,
  onClick,
  disabled,
}: {
  label: string;
  state: OptionState;
  onClick: () => void;
  disabled: boolean;
}) {
  const stateClass: Record<OptionState, string> = {
    default: "btn-option",
    selected: "btn-option btn-option-selected",
    correct: "btn-option btn-option-correct",
    wrong: "btn-option btn-option-wrong",
    missed: "btn-option btn-option-correct opacity-60",
  };

  return (
    <button
      className={stateClass[state]}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
```

- [ ] **Step 3: Create QuestionCard.tsx**

```tsx
"use client";

export default function QuestionCard({
  story,
  question,
}: {
  story: string;
  question: string;
}) {
  return (
    <div className="space-y-4">
      <div className="card bg-green-50 border-duo-green/30">
        <p className="text-sm text-duo-gray-400 leading-relaxed">{story}</p>
      </div>
      <h2 className="text-xl font-bold leading-snug">{question}</h2>
    </div>
  );
}
```

- [ ] **Step 4: Create KnowledgeCard.tsx**

```tsx
"use client";

export default function KnowledgeCard({
  title,
  content,
  funFact,
}: {
  title: string;
  content: string;
  funFact: string;
}) {
  return (
    <div className="card border-duo-blue bg-blue-50 space-y-2">
      <h3 className="font-bold text-duo-blue">{title}</h3>
      <p className="text-sm text-duo-gray-500 leading-relaxed">{content}</p>
      {funFact && (
        <p className="text-sm text-duo-orange font-medium">
          {"💡 "}{funFact}
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Create XPAnimation.tsx**

```tsx
"use client";

import { useEffect, useState } from "react";

export default function XPAnimation({ xp }: { xp: number }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div className="animate-bounce text-4xl font-black text-duo-green drop-shadow-lg">
        +{xp} XP
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Create LevelSummary.tsx**

```tsx
"use client";

import Link from "next/link";

export default function LevelSummary({
  score,
  total,
  xpEarned,
  chapter,
}: {
  score: number;
  total: number;
  xpEarned: number;
  chapter: number;
}) {
  const pct = Math.round((score / total) * 100);
  const passed = pct >= 60;

  return (
    <div className="flex flex-col items-center gap-6 py-10">
      <div
        className={`text-6xl font-black ${passed ? "text-duo-green" : "text-duo-red"}`}
      >
        {pct}%
      </div>
      <p className="text-lg text-duo-gray-400">
        {score}/{total} 题正确
      </p>
      <div className="text-2xl font-bold text-duo-orange">+{xpEarned} XP</div>
      <p className="text-duo-gray-300">
        {passed ? "太棒了！继续前进！" : "再接再厉，重新挑战！"}
      </p>
      <Link href="/learn" className="btn-primary mt-4 inline-block">
        返回学习
      </Link>
    </div>
  );
}
```

- [ ] **Step 7: Create ChapterCard.tsx**

```tsx
"use client";

import Link from "next/link";

export default function ChapterCard({
  id,
  title,
  titleEn,
  description,
  levels,
  locked,
  completedLevels,
}: {
  id: number;
  title: string;
  titleEn: string;
  description: string;
  levels: number;
  locked: boolean;
  completedLevels: number;
}) {
  return (
    <div
      className={`card ${locked ? "opacity-50" : ""} space-y-4`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="text-sm text-duo-gray-300">{titleEn}</p>
        </div>
        {locked && <span className="text-2xl">🔒</span>}
        {!locked && completedLevels === levels && (
          <span className="text-2xl">⭐</span>
        )}
      </div>
      <p className="text-sm text-duo-gray-400">{description}</p>
      {!locked && (
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: levels }, (_, i) => i + 1).map((level) => {
            const done = level <= completedLevels;
            const isBoss = level === levels;
            return (
              <Link
                key={level}
                href={`/learn/${id}/${level}`}
                className={`flex h-12 w-12 items-center justify-center rounded-full border-2 border-b-4 font-bold transition-all ${
                  done
                    ? "border-duo-green bg-duo-green text-white"
                    : isBoss
                      ? "border-duo-orange bg-orange-50 text-duo-orange"
                      : "border-duo-gray-200 bg-white text-duo-gray-400 hover:border-duo-green hover:text-duo-green"
                }`}
              >
                {isBoss ? "👑" : level}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 8: Create BottomNav.tsx**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "首页", icon: "🏠" },
  { href: "/learn", label: "学习", icon: "📚" },
  { href: "/profile", label: "我的", icon: "👤" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-duo-gray-200 bg-white">
      <div className="mx-auto flex max-w-lg">
        {tabs.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium ${
                active ? "text-duo-green" : "text-duo-gray-300"
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

- [ ] **Step 9: Commit**

```bash
git add src/components/
git commit -m "feat: add all UI components (Duolingo-style)"
```

---

## Task 7: Pages — Home & Profile

**Files:**
- Create: `src/app/page.tsx`
- Create: `src/app/profile/page.tsx`

- [ ] **Step 1: Create home page (src/app/page.tsx)**

```tsx
import Link from "next/link";
import BottomNav from "@/components/BottomNav";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center gap-8 px-6 pt-16">
        <h1 className="text-4xl font-black text-duo-green">StockLingo</h1>
        <p className="text-center text-duo-gray-400">
          用游戏化方式学炒股
          <br />
          像学语言一样学投资
        </p>

        <div className="w-full space-y-4 pt-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-duo-gray-300">
            选择市场
          </h2>
          <Link
            href="/learn"
            className="card flex items-center gap-4 border-duo-green hover:bg-green-50 transition-colors"
          >
            <span className="text-4xl">🇨🇳</span>
            <div>
              <h3 className="text-lg font-bold">A股市场</h3>
              <p className="text-sm text-duo-gray-300">
                从零开始学A股，3章 · 15关
              </p>
            </div>
          </Link>

          <div className="card flex items-center gap-4 opacity-40">
            <span className="text-4xl">🇺🇸</span>
            <div>
              <h3 className="text-lg font-bold">美股市场</h3>
              <p className="text-sm text-duo-gray-300">即将推出</p>
            </div>
          </div>

          <div className="card flex items-center gap-4 opacity-40">
            <span className="text-4xl">🇭🇰</span>
            <div>
              <h3 className="text-lg font-bold">港股市场</h3>
              <p className="text-sm text-duo-gray-300">即将推出</p>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
```

- [ ] **Step 2: Create profile page (src/app/profile/page.tsx)**

```tsx
"use client";

import { useEffect, useState } from "react";
import { loadProgress } from "@/lib/progress";
import type { UserProgress } from "@/lib/types";
import BottomNav from "@/components/BottomNav";

export default function ProfilePage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  if (!progress) {
    return (
      <div className="flex items-center justify-center pt-20">
        <div className="text-duo-gray-300">加载中...</div>
      </div>
    );
  }

  const completedCount = Object.keys(progress.completedLevels).length;

  return (
    <>
      <div className="space-y-6 px-6 pt-10">
        <h1 className="text-2xl font-black">我的</h1>

        <div className="grid grid-cols-2 gap-4">
          <div className="card flex flex-col items-center gap-2 py-6">
            <span className="text-3xl font-black text-duo-orange">
              {progress.xp}
            </span>
            <span className="text-sm text-duo-gray-300">总经验值</span>
          </div>
          <div className="card flex flex-col items-center gap-2 py-6">
            <span className="text-3xl font-black text-duo-red">
              {progress.streak.count}
            </span>
            <span className="text-sm text-duo-gray-300">连续打卡</span>
          </div>
        </div>

        <div className="card space-y-3">
          <h2 className="font-bold">学习进度</h2>
          <div className="flex items-center justify-between text-sm">
            <span className="text-duo-gray-400">已完成关卡</span>
            <span className="font-bold">{completedCount} / 15</span>
          </div>
          <div className="h-3 w-full rounded-full bg-duo-gray-200">
            <div
              className="h-3 rounded-full bg-duo-green transition-all"
              style={{ width: `${(completedCount / 15) * 100}%` }}
            />
          </div>
        </div>

        <div className="card space-y-3">
          <h2 className="font-bold">成就</h2>
          <div className="flex gap-4 text-center">
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl">{completedCount > 0 ? "🌟" : "🔒"}</span>
              <span className="text-xs text-duo-gray-300">初学者</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl">{completedCount >= 5 ? "📈" : "🔒"}</span>
              <span className="text-xs text-duo-gray-300">行情通</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl">{completedCount >= 10 ? "🏆" : "🔒"}</span>
              <span className="text-xs text-duo-gray-300">老股民</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl">{completedCount >= 15 ? "👑" : "🔒"}</span>
              <span className="text-xs text-duo-gray-300">股神</span>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx src/app/profile/page.tsx
git commit -m "feat: add home and profile pages"
```

---

## Task 8: Pages — Skill Tree (Learn)

**Files:**
- Create: `src/app/learn/page.tsx`

- [ ] **Step 1: Create skill tree page**

```tsx
"use client";

import { useEffect, useState } from "react";
import ChapterCard from "@/components/ChapterCard";
import BottomNav from "@/components/BottomNav";
import { loadProgress, isLevelCompleted, isChapterUnlocked } from "@/lib/progress";
import type { ChapterMeta, UserProgress } from "@/lib/types";

const chapters: ChapterMeta[] = [
  {
    id: 1,
    title: "股票是什么",
    titleEn: "What is a Stock",
    description: "从零开始，搞懂股票的本质和A股的基本规则",
    levels: 5,
    unlockCondition: null,
  },
  {
    id: 2,
    title: "看懂行情",
    titleEn: "Reading the Market",
    description: "K线、成交量、估值指标——看懂市场在说什么",
    levels: 5,
    unlockCondition: { chapter: 1, minScore: 0.6 },
  },
  {
    id: 3,
    title: "牛熊往事",
    titleEn: "Bulls & Bubbles",
    description: "穿越A股20年，在历史事件中学会生存",
    levels: 5,
    unlockCondition: { chapter: 2, minScore: 0.6 },
  },
];

export default function LearnPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  function getCompletedLevels(chapterId: number, totalLevels: number): number {
    let count = 0;
    for (let l = 1; l <= totalLevels; l++) {
      if (isLevelCompleted(chapterId, l)) count++;
    }
    return count;
  }

  return (
    <>
      <div className="space-y-6 px-6 pt-10">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🇨🇳</span>
          <div>
            <h1 className="text-2xl font-black">A股市场</h1>
            <p className="text-sm text-duo-gray-300">
              {progress ? `${progress.xp} XP` : "加载中..."}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {chapters.map((ch) => (
            <ChapterCard
              key={ch.id}
              id={ch.id}
              title={ch.title}
              titleEn={ch.titleEn}
              description={ch.description}
              levels={ch.levels}
              locked={!isChapterUnlocked(ch.id, ch.unlockCondition)}
              completedLevels={getCompletedLevels(ch.id, ch.levels)}
            />
          ))}
        </div>
      </div>
      <BottomNav />
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/learn/page.tsx
git commit -m "feat: add skill tree page"
```

---

## Task 9: Pages — Quiz Page

**Files:**
- Create: `src/app/learn/[chapter]/[level]/page.tsx`

- [ ] **Step 1: Create quiz page**

This is the most complex page. It needs:
- `generateStaticParams` to pre-generate all chapter/level combinations
- Build-time data loading via `getLevelQuestions`
- Client-side quiz state management
- Answer checking with visual feedback
- Knowledge card display after correct answers
- XP animation
- Level summary at the end

```tsx
import { getAllChapterLevelPairs, getLevelQuestions } from "@/lib/content";
import type { Question } from "@/lib/types";
import QuizClient from "./QuizClient";

export function generateStaticParams() {
  return getAllChapterLevelPairs();
}

export default function QuizPage({
  params,
}: {
  params: { chapter: string; level: string };
}) {
  const chapter = parseInt(params.chapter);
  const level = parseInt(params.level);
  const questions = getLevelQuestions(chapter, level);

  return <QuizClient questions={questions} chapter={chapter} level={level} />;
}
```

- [ ] **Step 2: Create QuizClient component**

Create `src/app/learn/[chapter]/[level]/QuizClient.tsx`:

```tsx
"use client";

import { useState } from "react";
import type { Question } from "@/lib/types";
import { completeLevel } from "@/lib/progress";
import ProgressBar from "@/components/ProgressBar";
import QuestionCard from "@/components/QuestionCard";
import OptionButton from "@/components/OptionButton";
import KnowledgeCard from "@/components/KnowledgeCard";
import XPAnimation from "@/components/XPAnimation";
import LevelSummary from "@/components/LevelSummary";

type AnswerState = "unanswered" | "correct" | "wrong";

export default function QuizClient({
  questions,
  chapter,
  level,
}: {
  questions: Question[];
  chapter: number;
  level: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("unanswered");
  const [score, setScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [showXP, setShowXP] = useState(false);
  const [finished, setFinished] = useState(false);

  const q = questions[currentIndex];

  function handleSelect(idx: number) {
    if (answerState !== "unanswered") return;
    setSelected(idx);
    const isCorrect = idx === q.answer;
    setAnswerState(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      setScore((s) => s + 1);
      setXpEarned((x) => x + q.xp);
      setShowXP(true);
      setTimeout(() => setShowXP(false), 1500);
    }
  }

  function handleNext() {
    if (currentIndex + 1 >= questions.length) {
      const finalScore = score;
      const finalXP = xpEarned;
      completeLevel(chapter, level, finalScore, questions.length, finalXP);
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setAnswerState("unanswered");
    }
  }

  if (finished) {
    return (
      <div className="px-6">
        <LevelSummary
          score={score}
          total={questions.length}
          xpEarned={xpEarned}
          chapter={chapter}
        />
      </div>
    );
  }

  function getOptionState(idx: number) {
    if (answerState === "unanswered") {
      return selected === idx ? "selected" : "default";
    }
    if (idx === q.answer) return "correct";
    if (idx === selected) return "wrong";
    return "default";
  }

  return (
    <div className="space-y-6 px-6 pt-6">
      {showXP && <XPAnimation xp={q.xp} />}

      <ProgressBar current={currentIndex + 1} total={questions.length} />

      <QuestionCard story={q.story} question={q.question} />

      <div className="space-y-3">
        {q.options.map((opt, idx) => (
          <OptionButton
            key={idx}
            label={opt}
            state={getOptionState(idx) as "default" | "selected" | "correct" | "wrong" | "missed"}
            onClick={() => handleSelect(idx)}
            disabled={answerState !== "unanswered"}
          />
        ))}
      </div>

      {answerState !== "unanswered" && (
        <div className="space-y-4">
          <div
            className={`rounded-2xl p-4 ${
              answerState === "correct"
                ? "bg-green-50 text-duo-green-dark"
                : "bg-red-50 text-duo-red"
            }`}
          >
            <p className="font-bold">
              {answerState === "correct" ? "✓ 正确！" : "✗ 错误"}
            </p>
            <p className="mt-1 text-sm">{q.explanation}</p>
          </div>

          {answerState === "correct" && (
            <KnowledgeCard
              title={q.knowledgeCard.title}
              content={q.knowledgeCard.content}
              funFact={q.knowledgeCard.funFact}
            />
          )}

          <button onClick={handleNext} className="btn-primary">
            {currentIndex + 1 >= questions.length ? "查看结果" : "继续"}
          </button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/learn/\[chapter\]/\[level\]/
git commit -m "feat: add quiz page with full answer flow"
```

---

## Task 10: Build & Verify

- [ ] **Step 1: Run build**

Run: `cd /home/kagura/repos/stocklingo && npm run build 2>&1`
Expected: Successful static export to `out/` directory

- [ ] **Step 2: Fix any build errors**

If build fails, read error output and fix. Common issues:
- Missing imports
- Type mismatches
- Static export incompatibilities (no server-only APIs in client components)

- [ ] **Step 3: Verify output**

Run: `ls out/ && echo "---" && ls out/learn/`
Expected: HTML files for all pages including all chapter/level combinations

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: StockLingo MVP — complete with 102 questions and Duolingo-style UI"
```
