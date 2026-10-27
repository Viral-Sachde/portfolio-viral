"use client";

import { useState } from "react";
import { mulberry32 } from "@/lib/random";
import InView from "./InView";
import { palette } from "@/lib/mosaic";

const COLS = 24;
const ROWS = 16;
const S = 10;
const PAINT = [palette.b, palette.g, palette.y, palette.n, palette.d];

type Glyph = "square" | "ring" | "x";
type Cell = { x: number; y: number; glyph: Glyph; color: string };

function buildCells(): Cell[] {
  const rand = mulberry32(2026);
  const cells: Cell[] = [];
  let top = 6;

  for (let x = 0; x < COLS; x++) {
    top = Math.min(9, Math.max(1, top + Math.round(rand() * 4 - 2.2)));
    for (let y = 0; y < ROWS; y++) {
      const stray = y < top && y >= top - 2 && rand() < 0.22;
      if (y < top && !stray) continue;

      const zone = Math.sin(x * 0.4) + Math.cos(y * 0.5) + (y / ROWS) * 2.2 + rand() * 0.7;
      const r = rand();
      let glyph: Glyph;
      let color: string;

      if (stray) {
        glyph = r < 0.6 ? "x" : "square";
        color = r < 0.3 ? palette.n : palette.o;
      } else if (zone < 1.3) {
        glyph = r < 0.15 ? "x" : "square";
        color = r < 0.7 ? palette.y : palette.o;
      } else if (zone < 2.3) {
        glyph = r < 0.55 ? "ring" : r < 0.8 ? "square" : "x";
        color = r > 0.88 ? palette.n : palette.b;
      } else {
        glyph = r < 0.55 ? "ring" : r < 0.8 ? "square" : "x";
        color = r > 0.88 ? palette.d : palette.g;
      }

      cells.push({ x, y, glyph, color });
    }
  }
  return cells;
}

const cells = buildCells();

// Tap any square to cycle it through the palette.
export default function Board() {
  const [paint, setPaint] = useState<Record<number, number>>({});
  const painted = Object.keys(paint).length;

  const tap = (i: number) => setPaint((p) => ({ ...p, [i]: ((p[i] ?? -1) + 1) % PAINT.length }));

  return (
    <InView className="board">
      <svg
        viewBox={`0 0 ${COLS * S} ${ROWS * S}`}
        role="img"
        aria-label="Decorative pixel board you can tap to recolour"
        className="block w-full touch-manipulation select-none"
      >
        {cells.map((cell, i) => {
          const x = cell.x * S;
          const y = cell.y * S;
          const fill = paint[i] !== undefined ? PAINT[paint[i]] : cell.color;
          const glyph = paint[i] !== undefined ? "square" : cell.glyph;

          return (
            <g
              key={i}
              className="cursor-pointer"
              onClick={() => tap(i)}
            >
              <rect x={x} y={y} width={S} height={S} fill="transparent" />
              {glyph === "x" ? (
                <path d={`M${x + 2.5} ${y + 2.5}l5 5m0-5l-5 5`} stroke={fill} strokeWidth={1.5} />
              ) : (
                <rect x={x + 1} y={y + 1} width={8} height={8} rx={0.8} fill={fill} />
              )}
              {glyph === "ring" && (
                <>
                  <circle cx={x + 5} cy={y + 5} r={2.4} fill="none" stroke="#fff" strokeWidth={0.9} />
                  <circle cx={x + 5} cy={y + 5} r={0.8} fill="#fff" />
                </>
              )}
            </g>
          );
        })}
      </svg>
      <div className="mt-4 flex h-8 items-center justify-between text-[13px] text-muted">
        <span>{painted ? `${painted} painted` : "Tap a square. Make a mess."}</span>
        {painted > 0 && (
          <button
            onClick={() => setPaint({})}
            className="rounded-full bg-fill px-3 py-1.5 font-medium text-ink transition-transform active:scale-95"
          >
            Reset
          </button>
        )}
      </div>
    </InView>
  );
}
