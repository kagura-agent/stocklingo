"use client";

import { useState } from "react";

export default function KnowledgeCard({
  title,
  content,
  funFact,
}: {
  title: string;
  content: string;
  funFact: string;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="card border-duo-blue bg-blue-50 space-y-2 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between text-left"
      >
        <h3 className="font-bold text-duo-blue flex items-center gap-2">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="shrink-0"
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17a1 1 0 001 1h6a1 1 0 001-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm2 14H10v-1h4v1zm.85-4.08l-.85.6V14h-4v-1.48l-.85-.6A4.997 4.997 0 017 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.08zM9 20h6a1 1 0 010 2H9a1 1 0 010-2z" />
          </svg>
          {title}
        </h3>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`text-duo-blue transition-transform duration-200 shrink-0 ${
            expanded ? "rotate-180" : ""
          }`}
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {expanded && (
        <div className="space-y-2 pt-1">
          <p className="text-sm text-duo-gray-500 leading-relaxed">{content}</p>
          {funFact && (
            <div className="flex gap-2 rounded-xl bg-white/60 p-3">
              <span className="shrink-0">💡</span>
              <p className="text-sm text-duo-orange font-medium">{funFact}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
