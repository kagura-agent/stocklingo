import type { MarketMeta, Question } from "./types";

import aSharesChapter1 from "../../content/a-shares/chapter-1.json";
import aSharesChapter2 from "../../content/a-shares/chapter-2.json";
import aSharesChapter3 from "../../content/a-shares/chapter-3.json";
import aSharesChapter4 from "../../content/a-shares/chapter-4.json";
import aSharesChapter5 from "../../content/a-shares/chapter-5.json";
import aSharesChapter6 from "../../content/a-shares/chapter-6.json";
import aSharesMetadata from "../../content/a-shares/metadata.json";

import hkUsChapter1 from "../../content/hk-us/chapter-1.json";
import hkUsChapter2 from "../../content/hk-us/chapter-2.json";
import hkUsChapter3 from "../../content/hk-us/chapter-3.json";
import hkUsChapter4 from "../../content/hk-us/chapter-4.json";
import hkUsChapter5 from "../../content/hk-us/chapter-5.json";
import hkUsChapter6 from "../../content/hk-us/chapter-6.json";
import hkUsMetadata from "../../content/hk-us/metadata.json";

import derivativesChapter1 from "../../content/derivatives/chapter-1.json";
import derivativesChapter2 from "../../content/derivatives/chapter-2.json";
import derivativesChapter3 from "../../content/derivatives/chapter-3.json";
import derivativesChapter4 from "../../content/derivatives/chapter-4.json";
import derivativesMetadata from "../../content/derivatives/metadata.json";

type MarketId = "a-shares" | "hk-us" | "derivatives";

const markets: Record<MarketId, { metadata: MarketMeta; chapters: Record<number, Question[]> }> = {
  "a-shares": {
    metadata: aSharesMetadata as MarketMeta,
    chapters: {
      1: aSharesChapter1 as Question[],
      2: aSharesChapter2 as Question[],
      3: aSharesChapter3 as Question[],
      4: aSharesChapter4 as Question[],
      5: aSharesChapter5 as Question[],
      6: aSharesChapter6 as Question[],
    },
  },
  "hk-us": {
    metadata: hkUsMetadata as MarketMeta,
    chapters: {
      1: hkUsChapter1 as Question[],
      2: hkUsChapter2 as Question[],
      3: hkUsChapter3 as Question[],
      4: hkUsChapter4 as Question[],
      5: hkUsChapter5 as Question[],
      6: hkUsChapter6 as Question[],
    },
  },
  "derivatives": {
    metadata: derivativesMetadata as MarketMeta,
    chapters: {
      1: derivativesChapter1 as Question[],
      2: derivativesChapter2 as Question[],
      3: derivativesChapter3 as Question[],
      4: derivativesChapter4 as Question[],
    },
  },
};

export function getMarkets(): MarketMeta[] {
  return Object.values(markets).map((m) => m.metadata);
}

export function getMarketMetadata(market: string): MarketMeta {
  return markets[market as MarketId]?.metadata ?? markets["a-shares"].metadata;
}

export function getMetadata(): MarketMeta {
  return getMarketMetadata("a-shares");
}

export function getChapterQuestions(market: string, chapter: number): Question[] {
  return markets[market as MarketId]?.chapters[chapter] ?? [];
}

export function getLevelQuestions(
  market: string,
  chapter: number,
  level: number
): Question[] {
  const questions = getChapterQuestions(market, chapter);
  return questions
    .filter((q) => q.level === level)
    .sort((a, b) => a.order - b.order);
}

export function getAllMarketChapterLevelPairs(): {
  market: string;
  chapter: string;
  level: string;
}[] {
  const pairs: { market: string; chapter: string; level: string }[] = [];
  for (const [marketId, data] of Object.entries(markets)) {
    for (const ch of data.metadata.chapters) {
      for (let l = 1; l <= ch.levels; l++) {
        pairs.push({ market: marketId, chapter: String(ch.id), level: String(l) });
      }
    }
  }
  return pairs;
}

export function getAllChapterLevelPairs(): {
  chapter: string;
  level: string;
}[] {
  const meta = getMetadata();
  const pairs: { chapter: string; level: string }[] = [];
  for (const ch of meta.chapters) {
    for (let l = 1; l <= ch.levels; l++) {
      pairs.push({ chapter: String(ch.id), level: String(l) });
    }
  }
  return pairs;
}

export function getAllQuestionsFromAllMarkets(): Question[] {
  const all: Question[] = [];
  for (const data of Object.values(markets)) {
    for (const questions of Object.values(data.chapters)) {
      all.push(...questions);
    }
  }
  return all;
}
