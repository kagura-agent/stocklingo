"use client";

const typeBadge: Record<string, { label: string; color: string }> = {
  multiple_choice: { label: "选择题", color: "bg-duo-blue text-white" },
  true_false: { label: "判断题", color: "bg-duo-purple text-white" },
  scenario: { label: "情景题", color: "bg-duo-orange text-white" },
};

export default function QuestionCard({
  story,
  question,
  type,
}: {
  story: string;
  question: string;
  type: "multiple_choice" | "true_false" | "scenario";
}) {
  const badge = typeBadge[type];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span
          className={`inline-block rounded-full px-3 py-0.5 text-xs font-bold ${badge.color}`}
        >
          {badge.label}
        </span>
      </div>
      <div className="card bg-green-50 dark:bg-green-900/20 border-duo-green/30">
        <p className="text-sm text-duo-gray-400 dark:text-slate-300 leading-relaxed">{story}</p>
      </div>
      <h2 className="text-xl font-bold leading-snug dark:text-slate-100">{question}</h2>
    </div>
  );
}
