"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { palette } from "@/lib/mosaic";

// Each tone flips to a neighbour from the same family when a wave passes through.
const ALT: Record<string, string> = { b: "g", n: "b", g: "y", d: "g", y: "b", o: "n" };

type Origin = "tl" | "tr" | "bc";
type Wave = { id: number; x: number; y: number; radius: number };

// Interactive pixel mosaic: builds in on load, ripples on tap, and pulses when a
// landing-page control marked `data-pulse` is hovered or pressed.
export default function Mosaic({
  map,
  origin = "tl",
  className,
}: {
  map: string[];
  origin?: Origin;
  className?: string;
}) {
  const width = Math.max(...map.map((row) => row.length));
  const height = map.length;
  const [loading, setLoading] = useState(true);
  const [wave, setWave] = useState<Wave | null>(null);
  const lastWave = useRef(0);
  const rippleRef = useRef<(x: number, y: number, radius: number) => void>(() => {});

  const start = useMemo(
    () => ({ tl: [0, 0], tr: [width, 0], bc: [width / 2, height] })[origin],
    [origin, width, height]
  );

  const cells = useMemo(
    () =>
      map.flatMap((row, y) =>
        row.split("").flatMap((c, x) =>
          palette[c]
            ? [{ x, y, c, d: Math.round(Math.hypot(x - start[0], y - start[1]) * 38) }]
            : []
        )
      ),
    [map, start]
  );

  useEffect(() => {
    // Reduced motion: CSS already disables the animations; skip timers and listeners.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const maxDelay = Math.max(...cells.map((c) => c.d));
    const done = setTimeout(() => setLoading(false), maxDelay + 700);

    const ripple = (x: number, y: number, radius: number) => {
      lastWave.current = Date.now();
      setWave({ id: Date.now() + Math.random(), x, y, radius });
    };

    // Pulse from the mosaic's origin when a marked landing control is touched.
    let lastPulse = 0;
    const onPulse = (e: Event) => {
      if (!(e.target as Element)?.closest?.("[data-pulse]") || Date.now() - lastPulse < 900) return;
      lastPulse = Date.now();
      ripple(start[0], start[1], Infinity);
    };
    document.addEventListener("pointerover", onPulse);
    document.addEventListener("pointerdown", onPulse);

    // Idle twinkle: one cell at a time, skipped right after a bigger wave.
    const twinkle = setInterval(() => {
      if (document.hidden || Date.now() - lastWave.current < 2000) return;
      const cell = cells[Math.floor(Math.random() * cells.length)];
      setWave({ id: Date.now(), x: cell.x, y: cell.y, radius: 0 });
    }, 2400 + Math.random() * 1200);

    rippleRef.current = ripple;
    return () => {
      clearTimeout(done);
      clearInterval(twinkle);
      document.removeEventListener("pointerover", onPulse);
      document.removeEventListener("pointerdown", onPulse);
    };
  }, [cells, start]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      shapeRendering="crispEdges"
      aria-hidden
      className={`mosaic ${loading ? "is-loading" : ""} ${className ?? ""}`}
      onPointerDown={(e) => {
        const i = (e.target as SVGElement).dataset?.i;
        if (i !== undefined) rippleRef.current(cells[+i].x, cells[+i].y, 4.5);
      }}
    >
      {cells.map((cell, i) => {
        const dist = wave ? Math.hypot(cell.x - wave.x, cell.y - wave.y) : Infinity;
        const inWave = wave !== null && dist <= wave.radius;
        return (
          <rect
            key={inWave ? `${i}-${wave.id}` : i}
            data-i={i}
            x={cell.x}
            y={cell.y}
            width={1.02}
            height={1.02}
            fill={palette[cell.c]}
            className={inWave ? "flip" : undefined}
            style={
              {
                "--d": `${cell.d}ms`,
                "--w": `${Math.round(dist * 45)}ms`,
                "--alt": palette[ALT[cell.c]],
              } as React.CSSProperties
            }
          />
        );
      })}
    </svg>
  );
}
