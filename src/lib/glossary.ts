import { getMarkets, getChapterQuestions } from "./content";
import type { MarketMeta } from "./types";

export interface GlossaryEntry {
  title: string;
  content: string;
  funFact: string;
  market: string;
  marketName: string;
  chapterTitle: string;
}

export function getGlossaryEntries(): GlossaryEntry[] {
  const seen = new Set<string>();
  const entries: GlossaryEntry[] = [];
  const markets = getMarkets();

  for (const meta of markets) {
    for (const chapter of meta.chapters) {
      const questions = getChapterQuestions(meta.market, chapter.id);
      for (const q of questions) {
        const { title, content, funFact } = q.knowledgeCard;
        if (seen.has(title)) continue;
        seen.add(title);
        entries.push({
          title,
          content,
          funFact,
          market: meta.market,
          marketName: meta.name,
          chapterTitle: chapter.title,
        });
      }
    }
  }

  return entries;
}

export function searchGlossary(entries: GlossaryEntry[], query: string): GlossaryEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return entries;
  return entries.filter(
    (e) => e.title.toLowerCase().includes(q) || e.content.toLowerCase().includes(q)
  );
}

export function groupByChapter(entries: GlossaryEntry[]): Record<string, GlossaryEntry[]> {
  const groups: Record<string, GlossaryEntry[]> = {};
  for (const entry of entries) {
    const key = `${entry.marketName} · ${entry.chapterTitle}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(entry);
  }
  return groups;
}
