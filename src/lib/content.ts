import type { MarketMeta, Question } from "./types";

import chapter1Data from "../../content/a-shares/chapter-1.json";
import chapter2Data from "../../content/a-shares/chapter-2.json";
import chapter3Data from "../../content/a-shares/chapter-3.json";
import chapter4Data from "../../content/a-shares/chapter-4.json";
import chapter5Data from "../../content/a-shares/chapter-5.json";
import chapter6Data from "../../content/a-shares/chapter-6.json";
import metadataData from "../../content/a-shares/metadata.json";

const chapter1 = chapter1Data as Question[];
const chapter2 = chapter2Data as Question[];
const chapter3 = chapter3Data as Question[];
const chapter4 = chapter4Data as Question[];
const chapter5 = chapter5Data as Question[];
const chapter6 = chapter6Data as Question[];
const metadata = metadataData as MarketMeta;

const chapterMap: Record<number, Question[]> = {
  1: chapter1,
  2: chapter2,
  3: chapter3,
  4: chapter4,
  5: chapter5,
  6: chapter6,
};

export function getMetadata(): MarketMeta {
  return metadata;
}

export function getChapterQuestions(chapter: number): Question[] {
  return chapterMap[chapter] ?? [];
}

export function getLevelQuestions(
  chapter: number,
  level: number
): Question[] {
  const questions = getChapterQuestions(chapter);
  return questions
    .filter((q) => q.level === level)
    .sort((a, b) => a.order - b.order);
}

export function getAllChapterLevelPairs(): {
  chapter: string;
  level: string;
}[] {
  const pairs: { chapter: string; level: string }[] = [];
  for (const ch of metadata.chapters) {
    for (let l = 1; l <= ch.levels; l++) {
      pairs.push({ chapter: String(ch.id), level: String(l) });
    }
  }
  return pairs;
}
