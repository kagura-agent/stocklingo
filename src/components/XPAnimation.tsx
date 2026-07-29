"use client";

import { useEffect, useState } from "react";

export default function XPAnimation({
  xp,
  streak = 0,
}: {
  xp: number;
  streak?: number;
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const enhanced = streak >= 5;

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div
        className={`xp-float font-black drop-shadow-lg ${
          enhanced
            ? "text-5xl text-duo-orange"
            : "text-4xl text-duo-green"
        }`}
      >
        +{xp} XP
        {enhanced && <span className="ml-2">🔥</span>}
      </div>
    </div>
  );
}
