"use client";

import { useState } from "react";
import LearningPathMap from "@/components/LearningPathMap";
import BottomNav from "@/components/BottomNav";
import { getMarkets } from "@/lib/content";

const markets = getMarkets();

export default function LearningPathPage() {
  const [activeMarket, setActiveMarket] = useState(markets[0].market);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 pb-24">
      <div className="mx-auto max-w-lg px-5 pt-10">
        <h1 className="text-3xl font-black text-duo-green mb-6">学习路径</h1>

        <div className="flex gap-2 mb-8">
          {markets.map((m) => (
            <button
              key={m.market}
              onClick={() => setActiveMarket(m.market)}
              className={`flex-1 rounded-2xl border-2 border-b-4 px-4 py-3 text-center font-bold transition-all active:border-b-2 active:mt-[2px] ${
                activeMarket === m.market
                  ? "border-duo-green bg-green-50 dark:bg-green-900/20 text-duo-green"
                  : "border-duo-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-duo-gray-400 dark:text-slate-400"
              }`}
            >
              <span className="mr-1">{m.icon}</span>
              {m.name}
            </button>
          ))}
        </div>

        <LearningPathMap market={activeMarket} />
      </div>
      <BottomNav />
    </div>
  );
}
