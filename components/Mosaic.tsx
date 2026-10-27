"use client";

import { memo, useEffect, useMemo, useRef } from "react";
import { palette } from "@/lib/mosaic";
import { motionReduced } from "@/lib/theme";

// Each tone flips to a neighbour from the same family when a wave passes through.
const ALT: Record<string, string> = { b: "g", n: "b", g: "y", d: "g", y: "b", o: "n" };

type Origin = "tl" | "tr" | "bc";

// Interactive pixel mosaic: a stepped wipe reveals it on load (one cheap animation for the
// whole SVG), taps ripple outward, and controls marked `data-pulse` send a wave through it.
// Waves touch the DOM directly so a ripple never re-renders hundreds of rects through React.
function Mosaic({ map, origin = "tl", className }: { map: string[]; origin?: Origin; className?: string }) {
  const svg = useRef<SVGSVGElement>(null);
  const width = Math.max(...map.map((row) => row.length));
  const height = map.length;
  const start = useMemo(() => ({ tl: [0, 0], tr: [width, 0], bc: [width / 2, height] })[origin], [origin, width, height]);
  const cells = useMemo(
    () => map.flatMap((row, y) => row.split("").flatMap((c, x) => (palette[c] ? [{ x, y, c }] : []))),
    [map]
  );

  useEffect(() => {
    const el = svg.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rects = Array.from(el.querySelectorAll("rect"));
    let clear = 0;
    let lastWave = 0;
    let visible = true;

    const ripple = (x: number, y: number, radius: number) => {
      if (motionReduced()) return;
      lastWave = Date.now();
      const hits: SVGRectElement[] = [];
      let longest = 0;
      rects.forEach((r, i) => {
        const dist = Math.hypot(cells[i].x - x, cells[i].y - y);
        if (dist > radius) return;
        const delay = Math.round(dist * 45);
        longest = Math.max(longest, delay);
        r.style.setProperty("--w", `${delay}ms`);
        r.classList.remove("flip");
        hits.push(r);
      });
      void el.getBoundingClientRect(); // restart the animation on rects already flipping
      hits.forEach((r) => r.classList.add("flip"));
      clearTimeout(clear);
      clear = window.setTimeout(() => hits.forEach((r) => r.classList.remove("flip")), longest + 900);
    };

    const onTap = (e: PointerEvent) => {
      const i = (e.target as SVGElement).dataset?.i;
      if (i !== undefined) ripple(cells[+i].x, cells[+i].y, 4.5);
    };

    let lastPulse = 0;
    const onPulse = (e: Event) => {
      if (!(e.target as Element)?.closest?.("[data-pulse]") || Date.now() - lastPulse < 900) return;
      lastPulse = Date.now();
      ripple(start[0], start[1], Infinity);
    };

    // Idle twinkle, only while the mosaic is on screen.
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(el);
    const twinkle = setInterval(() => {
      if (!visible || document.hidden || Date.now() - lastWave < 2000) return;
      const cell = cells[Math.floor(Math.random() * cells.length)];
      ripple(cell.x, cell.y, 0);
    }, 2400 + Math.random() * 1200);

    el.addEventListener("pointerdown", onTap);
    document.addEventListener("pointerover", onPulse);
    document.addEventListener("pointerdown", onPulse);
    return () => {
      clearTimeout(clear);
      clearInterval(twinkle);
      io.disconnect();
      el.removeEventListener("pointerdown", onTap);
      document.removeEventListener("pointerover", onPulse);
      document.removeEventListener("pointerdown", onPulse);
    };
  }, [cells, start]);

  return (
    <svg
      ref={svg}
      viewBox={`0 0 ${width} ${height}`}
      shapeRendering="crispEdges"
      aria-hidden
      className={`mosaic reveal-${origin} ${className ?? ""}`}
    >
      {cells.map((cell, i) => (
        <rect
          key={i}
          data-i={i}
          x={cell.x}
          y={cell.y}
          width={1.02}
          height={1.02}
          fill={palette[cell.c]}
          style={{ "--alt": palette[ALT[cell.c]] } as React.CSSProperties}
        />
      ))}
    </svg>
  );
}

export default memo(Mosaic);
