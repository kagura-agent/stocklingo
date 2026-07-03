"use client";

import { useEffect, useState } from "react";

export default function XPAnimation({ xp }: { xp: number }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div className="xp-float text-4xl font-black text-duo-green drop-shadow-lg">
        +{xp} XP
      </div>
    </div>
  );
}
