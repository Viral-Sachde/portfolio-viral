"use client";

import { useLayoutEffect, useRef, useState } from "react";

// Screen width the mockups are drawn at (the 220px desktop phone minus its bezel).
const BASE = 208;

// Lays the screen out at its desktop size and scales it to whatever width the frame gets,
// so small phones show the same picture instead of clipping its bottom half.
export default function ScreenFit({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / BASE));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0">
      <div
        className="screen-fit absolute left-0 top-0 aspect-[9/19] origin-top-left"
        style={{ width: BASE, transform: scale ? `scale(${scale})` : undefined, visibility: scale ? undefined : "hidden" }}
      >
        {children}
      </div>
    </div>
  );
}
