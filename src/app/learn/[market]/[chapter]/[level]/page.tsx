import { getAllMarketChapterLevelPairs, getLevelQuestions } from "@/lib/content";
import QuizClient from "./QuizClient";

export function generateStaticParams() {
  return getAllMarketChapterLevelPairs();
}

export default function QuizPage({
  params,
}: {
  params: { market: string; chapter: string; level: string };
}) {
  const chapter = parseInt(params.chapter);
  const level = parseInt(params.level);
  const questions = getLevelQuestions(params.market, chapter, level);

  return <QuizClient questions={questions} market={params.market} chapter={chapter} level={level} />;
}
