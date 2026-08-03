"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadProgress, isLevelCompleted, isChapterUnlocked, getChapterScore } from "@/lib/progress";
import { getMarketMetadata } from "@/lib/content";
import type { ChapterMeta } from "@/lib/types";

type NodeStatus = "completed" | "in-progress" | "unlocked" | "locked";

interface ChapterNode {
  chapter: ChapterMeta;
  status: NodeStatus;
  completedLevels: number;
  totalLevels: number;
}

function getChapterNodes(market: string): ChapterNode[] {
  const meta = getMarketMetadata(market);
  let firstUnstarted = false;

  return meta.chapters.map((chapter) => {
    const unlocked = isChapterUnlocked(market, chapter.id, chapter.unlockCondition);
    let completed = 0;
    for (let l = 1; l <= chapter.levels; l++) {
      if (isLevelCompleted(market, chapter.id, l)) completed++;
    }

    let status: NodeStatus;
    if (!unlocked) {
      status = "locked";
    } else if (completed === chapter.levels) {
      status = "completed";
    } else if (completed > 0) {
      status = "in-progress";
    } else {
      status = "unlocked";
    }

    return { chapter, status, completedLevels: completed, totalLevels: chapter.levels };
  });
}

function findActiveIndex(nodes: ChapterNode[]): number {
  const inProgress = nodes.findIndex((n) => n.status === "in-progress");
  if (inProgress !== -1) return inProgress;
  const firstUnlocked = nodes.findIndex((n) => n.status === "unlocked");
  return firstUnlocked;
}

export default function LearningPathMap({ market }: { market: string }) {
  const [nodes, setNodes] = useState<ChapterNode[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setNodes(getChapterNodes(market));
    setMounted(true);
  }, [market]);

  if (!mounted) return null;

  const activeIdx = findActiveIndex(nodes);
  const nodeSpacing = 140;
  const svgHeight = (nodes.length - 1) * nodeSpacing + 80;
  const svgWidth = 320;
  const centerX = svgWidth / 2;
  const offsetX = 80;

  function nodeX(i: number): number {
    return i % 2 === 0 ? centerX - offsetX : centerX + offsetX;
  }
  function nodeY(i: number): number {
    return 40 + i * nodeSpacing;
  }

  return (
    <div className="relative w-full overflow-x-hidden" style={{ minHeight: svgHeight + 40 }}>
      <svg
        className="absolute inset-0 w-full"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="xMidYMin meet"
        style={{ height: svgHeight }}
      >
        <defs>
          <linearGradient id="grad-completed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#58CC02" />
            <stop offset="100%" stopColor="#58CC02" />
          </linearGradient>
          <linearGradient id="grad-pending" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E5E5E5" />
            <stop offset="100%" stopColor="#E5E5E5" />
          </linearGradient>
        </defs>
        {nodes.map((node, i) => {
          if (i === 0) return null;
          const x1 = nodeX(i - 1);
          const y1 = nodeY(i - 1);
          const x2 = nodeX(i);
          const y2 = nodeY(i);
          const midY = (y1 + y2) / 2;
          const prevDone = nodes[i - 1].status === "completed";
          return (
            <path
              key={`line-${i}`}
              d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`}
              fill="none"
              stroke={prevDone ? "#58CC02" : "#E5E5E5"}
              strokeWidth="4"
              strokeLinecap="round"
              className="dark:opacity-80"
            />
          );
        })}
      </svg>

      <div className="relative" style={{ height: svgHeight }}>
        {nodes.map((node, i) => {
          const x = nodeX(i);
          const y = nodeY(i);
          const isLeft = i % 2 === 0;
          const isActive = i === activeIdx;

          return (
            <div
              key={node.chapter.id}
              className="absolute"
              style={{
                left: `calc(${(x / svgWidth) * 100}% - 24px)`,
                top: y - 24,
                animationDelay: `${i * 100}ms`,
              }}
            >
              <PathNode
                node={node}
                market={market}
                isActive={isActive}
                isLeft={isLeft}
                index={i}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PathNode({
  node,
  market,
  isActive,
  isLeft,
  index,
}: {
  node: ChapterNode;
  market: string;
  isActive: boolean;
  isLeft: boolean;
  index: number;
}) {
  const { chapter, status, completedLevels, totalLevels } = node;

  const circleBase = "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-2 border-b-4 transition-all";
  const statusStyles: Record<NodeStatus, string> = {
    completed: "bg-duo-green border-duo-green-dark text-white",
    "in-progress": "bg-duo-blue border-blue-600 text-white",
    unlocked: "bg-white dark:bg-slate-800 border-dashed border-duo-gray-200 dark:border-slate-600 text-duo-gray-400 dark:text-slate-400",
    locked: "bg-duo-gray-100 dark:bg-slate-700 border-duo-gray-200 dark:border-slate-600 text-duo-gray-300 dark:text-slate-500",
  };

  const circle = (
    <div
      className={`${circleBase} ${statusStyles[status]} ${isActive ? "animate-pulse" : ""}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {status === "completed" && "✓"}
      {status === "in-progress" && `${completedLevels}/${totalLevels}`}
      {status === "unlocked" && chapter.id}
      {status === "locked" && "🔒"}
    </div>
  );

  const label = (
    <div
      className={`absolute top-1/2 -translate-y-1/2 w-32 ${
        isLeft ? "left-14" : "right-14"
      }`}
      style={isLeft ? { textAlign: "left" } : { textAlign: "right" }}
    >
      <div className={`text-sm font-bold ${status === "locked" ? "text-duo-gray-300 dark:text-slate-500" : "text-duo-gray-500 dark:text-slate-100"}`}>
        {chapter.title}
      </div>
      <div className="text-xs text-duo-gray-300 dark:text-slate-400 line-clamp-2">
        {chapter.description}
      </div>
    </div>
  );

  const content = (
    <div
      className={`relative opacity-0 animate-[fade-in_0.4s_ease-out_forwards]`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {circle}
      {label}
    </div>
  );

  if (status === "locked") {
    return content;
  }

  return (
    <Link href={`/learn/${market}/${chapter.id}`}>
      {content}
    </Link>
  );
}
