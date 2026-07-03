# StockLingo MVP Design Spec

## Overview

StockLingo is a Duolingo-style gamified app that teaches stock market literacy through bite-sized lessons, interactive quizzes, and real historical scenarios. MVP scope: A-Shares market only.

## Content Structure

### Quiz Format
Each question is a JSON object with: id, chapter, level, order, type (multiple_choice | true_false | scenario), difficulty, story (2-3 sentence scene-setter), question, options, answer (0-indexed), explanation, knowledgeCard ({title, content, funFact}), xp, tags.

### Chapters & Levels
3 chapters, each with 4 regular levels (6 questions) + 1 boss level (10 questions) = 34 questions per chapter, 102 total.

**Chapter 1 — 股票是什么 (What is a Stock)**
- 1-1: 股票本质 (ownership, shares, listing)
- 1-2: A股市场 (SSE, SZSE, ChiNext, STAR)
- 1-3: 交易规则 (T+1, price limits 10%/20%, trading hours)
- 1-4: 开户买卖 (account opening, buy/sell process)
- 1-5: Boss Challenge

**Chapter 2 — 看懂行情 (Reading the Market)**
- 2-1: K线图入门 (candlestick basics)
- 2-2: 成交量换手率 (volume & turnover)
- 2-3: PE/PB/市值 (valuation metrics)
- 2-4: 大盘指数 (market indices)
- 2-5: Boss Challenge

**Chapter 3 — 牛熊往事 (Bulls & Bubbles)**
- 3-1: 2007超级牛市 (998→6124→1664)
- 3-2: 2015杠杆牛 (5178→千股跌停)
- 3-3: 2016熔断 (4天4次熔断)
- 3-4: 2020疫情冲击
- 3-5: Boss Challenge

### Content Requirements
- Chinese language primary
- Vivid, relatable stories for each question
- Plausible distractors in options
- Historically accurate data for Chapter 3
- true_false questions use fixed options: ["正确", "错误"]

## Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Build**: Static export (`output: 'export'` in next.config.ts)
- **State**: localStorage for progress, XP, streaks
- **Data**: JSON files in `content/` directory, loaded at build time

### Project Structure
```
stocklingo/
├── content/a-shares/
│   ├── metadata.json
│   ├── chapter-1.json
│   ├── chapter-2.json
│   └── chapter-3.json
├── src/
│   ├── app/
│   │   ├── layout.tsx          (root layout, fonts, metadata)
│   │   ├── page.tsx            (home — market selection)
│   │   ├── learn/
│   │   │   ├── page.tsx        (skill tree)
│   │   │   └── [chapter]/
│   │   │       └── [level]/
│   │   │           └── page.tsx (quiz page)
│   │   └── profile/
│   │       └── page.tsx        (user profile)
│   ├── components/
│   │   ├── ProgressBar.tsx
│   │   ├── QuestionCard.tsx
│   │   ├── OptionButton.tsx
│   │   ├── KnowledgeCard.tsx
│   │   ├── XPAnimation.tsx
│   │   ├── LevelSummary.tsx
│   │   ├── ChapterCard.tsx
│   │   └── BottomNav.tsx
│   └── lib/
│       ├── content.ts          (load JSON data)
│       ├── progress.ts         (localStorage progress/XP/streak)
│       └── types.ts            (TypeScript interfaces)
├── public/
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.ts
```

### Pages

**1. Home `/`**
- Market selection grid (only A-Shares active for MVP)
- Duolingo green theme (#58CC02)
- Mobile-first responsive design

**2. Skill Tree `/learn`**
- Chapter list with progress indicators
- Lock/unlock based on prior chapter completion (60% score)
- Level buttons within each chapter showing completion state

**3. Quiz `/learn/[chapter]/[level]`**
- Top: progress bar (current question / total)
- Story card with scene-setting text
- Question text + option buttons (Duolingo rounded style)
- Correct: green flash + explanation + knowledge card + XP animation
- Incorrect: red flash + correct answer + explanation
- End: score summary with XP earned

**4. Profile `/profile`**
- Total XP display
- Streak (consecutive days)
- Completed chapters/levels overview

### Data Flow
1. JSON files in `content/` are imported at build time via `fs.readFileSync` in `generateStaticParams` and page-level data loading
2. Quiz progress tracked in localStorage: `{ completedLevels: {}, xp: number, streak: { count, lastDate } }`
3. Chapter unlock logic checks localStorage for prior chapter's completion percentage

### Design Language
- Primary: Duolingo green #58CC02
- Success: green tones
- Error: red tones
- Large rounded buttons for options
- Card-based layouts
- Playful but clean typography
- Mobile-first, works on desktop

## Constraints
- Static export only — no server-side runtime
- All data baked in at build time
- No authentication, no backend
- localStorage only (no cross-device sync)
