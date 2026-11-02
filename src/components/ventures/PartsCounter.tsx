"use client";

import { useEffect, useState } from "react";

/** The illustrative board's "parts today" figure, ticking up while the visitor allows motion. */
export function PartsCounter({ start }: { start: number }) {
  const [parts, setParts] = useState(start);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setParts((value) => value + 1), 3200);
    return () => window.clearInterval(id);
  }, []);

  return <>{parts}</>;
}
