import { getAllChapterLevelPairs, getLevelQuestions } from "@/lib/content";
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
