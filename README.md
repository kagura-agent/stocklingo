# StockLingo 📈🎮

**Learn stock trading like Duolingo — gamified, bite-sized, history-driven.**

> 又懒又想赚钱？每天5分钟，玩着学炒股。

## What is StockLingo?

StockLingo is a gamified stock market education app. Think Duolingo, but instead of learning languages, you learn how markets work — through real historical events, bite-sized quizzes, and addictive game mechanics.

## Core Concept

### Markets as Languages

Just like Duolingo organizes content by language, StockLingo organizes by market:

| Market | Analogy | Content Focus |
|--------|---------|---------------|
| 🇨🇳 A-Shares | Chinese | T+1, limit up/down, ST stocks, IPO lottery, northbound capital |
| 🇺🇸 US Stocks | English | T+0, options, earnings season, pre/after-market trading |
| 🇭🇰 HK Stocks | Cantonese | Connect mechanism, dual listing, stamp duty |
| 🪙 Crypto | Esperanto | 24/7, DeFi, halving cycles |

### Skill Tree + Historical Events

Each market has a skill tree where nodes are unlocked by completing levels. Every level is anchored to a **real historical event**:

```
A-Shares
├── Ch1: What is a Stock? (basics)
├── Ch2: How to Trade (mechanics)
├── Ch3: Bulls & Bubbles
│   ├── 3-1: The 2007 Supercycle (6124 → 1664)
│   ├── 3-2: 2015 Leverage Bull & Crash
│   └── 3-3: The Circuit Breaker Disaster (2016)
├── Ch4: Reading Financials
│   ├── 4-1: Moutai — The Compounder
│   └── 4-2: LeEco — The Implosion
├── Ch5: Policy-Driven Markets
│   ├── 5-1: Xiong'an New Area Announcement
│   └── 5-2: Carbon Neutrality Wave
└── ...

US Stocks
├── Ch1: US Market Basics
├── Ch2: The Dot-Com Bubble (2000)
├── Ch3: 2008 Financial Crisis
│   ├── 3-1: Lehman Brothers Falls
│   ├── 3-2: The Fed Steps In
│   └── 3-3: Recovery & Lessons
├── Ch4: The FAANG Era
├── Ch5: Meme Stocks & Retail Revolution
│   ├── 5-1: GameStop (GME) Saga
│   └── 5-2: AMC & the Diamond Hands
└── ...
```

### Level Design

Each level follows this structure:

1. **Story Intro** — "It's June 12, 2015. The Shanghai Index just hit 5,178..."
2. **Interactive Quiz** — 5-10 questions mixing:
   - Multiple choice (concepts)
   - True/False (myth busting)
   - "What would you do?" scenarios
   - Timeline ordering
3. **Knowledge Cards** — Unlocked after completion, like collectible flashcards
4. **Boss Challenge** — End-of-chapter comprehensive quiz

### Gamification

- 🔥 **Daily Streak** — Don't break the chain
- ⭐ **XP & Levels** — Earn points per correct answer
- 🏆 **Leaderboards** — Compete with friends
- 💎 **Gems** — In-app currency for hints, streak freezes
- 🎯 **Achievements** — "Survived the 2008 Crisis", "Warren Buffett Apprentice"
- ❤️ **Lives** — Get it wrong, lose a life (recharges over time)

## Example Question

> 📖 **Chapter 3, Level 2: The 2015 Leverage Bull**
>
> *"In June 2015, the Shanghai Composite crashed from 5,178 points. Within 3 weeks, it lost over 30% of its value."*
>
> **Q: What was the primary trigger for the crash?**
>
> A. US Federal Reserve rate hike  
> B. Cleanup of OTC margin financing (场外配资清理) ✅  
> C. Corporate earnings decline  
> D. Natural disaster  
>
> **💡 Explanation:** The bull run was largely fueled by leveraged margin trading through unregulated OTC platforms. When regulators moved to clean up these positions, forced liquidations cascaded through the market.

## Tech Stack (Planned)

- **Platform:** WeChat Mini Program (primary) + Web
- **Frontend:** React / Taro (cross-platform)
- **Backend:** Node.js / Python
- **Content:** AI-generated questions + human-curated historical narratives
- **Data:** Historical market data APIs

## MVP Scope

The minimum viable product:

1. **One market** (A-Shares) with **3 chapters** (10 levels each)
2. **Daily quiz** — 1 question/day push notification
3. **Basic progression** — XP, streak counter, level unlock
4. **Leaderboard** — simple global ranking
5. **Platform** — WeChat Mini Program

## Roadmap

- [ ] Product design document
- [ ] Content: A-Shares Chapter 1-3 question bank (100+ questions)
- [ ] UI/UX design (Duolingo-inspired)
- [ ] MVP development
- [ ] Beta testing
- [ ] US Stocks market expansion
- [ ] Social features (friends, challenges)

## Why This Works

1. **Real pain point** — People want to invest but find learning boring
2. **Proven model** — Duolingo proved gamified learning works at scale
3. **Infinite content** — Decades of market history = unlimited material
4. **AI-powered scaling** — Question generation can be automated
5. **Low compliance risk** — Education, not investment advice

## Origin

This project was born from a simple insight:

> "我有懒又想赚钱，懒得学习炒股知识，但是不学是不行的" — Luna, 2026-07-03

---

*StockLingo is an open-source project by [@kagura-agent](https://github.com/kagura-agent).*
