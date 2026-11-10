"use client";

import { useEffect, useReducer, useRef, useSyncExternalStore } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ChevronsDown, RotateCw } from "lucide-react";
import { palette } from "@/lib/mosaic";

const W = 10;
const H = 18;

// Tetrominoes in the site palette.
const SHAPES: { m: number[][]; c: string }[] = [
  { m: [[1, 1, 1, 1]], c: "b" },
  { m: [[1, 1], [1, 1]], c: "y" },
  { m: [[0, 1, 0], [1, 1, 1]], c: "n" },
  { m: [[0, 1, 1], [1, 1, 0]], c: "g" },
  { m: [[1, 1, 0], [0, 1, 1]], c: "d" },
  { m: [[1, 0, 0], [1, 1, 1]], c: "o" },
  { m: [[0, 0, 1], [1, 1, 1]], c: "b" },
];

type Grid = (string | null)[][];
type Piece = { m: number[][]; c: string; x: number; y: number };
type Status = "idle" | "playing" | "paused" | "over";
type State = { grid: Grid; piece: Piece | null; next: number; bag: number[]; score: number; lines: number; status: Status };
type Action = "start" | "tick" | "left" | "right" | "rotate" | "soft" | "drop" | "pause";

const empty = (): Grid => Array.from({ length: H }, () => Array<string | null>(W).fill(null));
const shuffled = () => [0, 1, 2, 3, 4, 5, 6].sort(() => Math.random() - 0.5);
const rotate = (m: number[][]) => m[0].map((_, x) => m.map((row) => row[x]).reverse());

function fits(grid: Grid, m: number[][], x: number, y: number) {
  return m.every((row, dy) =>
    row.every((v, dx) => !v || (x + dx >= 0 && x + dx < W && y + dy < H && (y + dy < 0 || !grid[y + dy][x + dx])))
  );
}

// 7-bag randomiser: every piece once per round, so droughts can't happen.
function draw(state: State): Pick<State, "next" | "bag"> & { shape: number } {
  const bag = state.bag.length ? state.bag : shuffled();
  return { shape: state.next, next: bag[0], bag: bag.slice(1) };
}

function spawn(state: State): State {
  const { shape, next, bag } = draw(state);
  const { m, c } = SHAPES[shape];
  const piece = { m, c, x: Math.floor((W - m[0].length) / 2), y: -1 };
  if (!fits(state.grid, m, piece.x, piece.y)) return { ...state, piece: null, status: "over" };
  return { ...state, piece, next, bag };
}

function lock(state: State, bonus = 0): State {
  const { piece } = state;
  if (!piece) return state;
  const grid = state.grid.map((row) => [...row]);
  let overflow = false;
  piece.m.forEach((row, dy) =>
    row.forEach((v, dx) => {
      if (!v) return;
      if (piece.y + dy < 0) overflow = true;
      else grid[piece.y + dy][piece.x + dx] = piece.c;
    })
  );
  if (overflow) return { ...state, grid, piece: null, status: "over" };
  const kept = grid.filter((row) => row.some((c) => !c));
  const cleared = H - kept.length;
  const level = Math.floor(state.lines / 10);
  return spawn({
    ...state,
    grid: [...Array.from({ length: cleared }, () => Array<string | null>(W).fill(null)), ...kept],
    lines: state.lines + cleared,
    score: state.score + bonus + [0, 100, 300, 500, 800][cleared] * (level + 1),
  });
}

function reducer(state: State, action: Action): State {
  if (action === "start") return spawn({ grid: empty(), piece: null, next: Math.floor(Math.random() * 7), bag: shuffled(), score: 0, lines: 0, status: "playing" });
  if (action === "pause") return state.status === "playing" ? { ...state, status: "paused" } : state.status === "paused" ? { ...state, status: "playing" } : state;
  const { piece, grid } = state;
  if (state.status !== "playing" || !piece) return state;
  const at = (dx: number, dy: number, m = piece.m) => fits(grid, m, piece.x + dx, piece.y + dy);

  switch (action) {
    case "left":
      return at(-1, 0) ? { ...state, piece: { ...piece, x: piece.x - 1 } } : state;
    case "right":
      return at(1, 0) ? { ...state, piece: { ...piece, x: piece.x + 1 } } : state;
    case "rotate": {
      const m = rotate(piece.m);
      // Simple wall kicks: try nudging sideways before giving up.
      for (const kick of [0, -1, 1, -2, 2]) if (at(kick, 0, m)) return { ...state, piece: { ...piece, m, x: piece.x + kick } };
      return state;
    }
    case "tick":
    case "soft":
      if (at(0, 1)) return { ...state, piece: { ...piece, y: piece.y + 1 }, score: state.score + (action === "soft" ? 1 : 0) };
      return lock(state);
    case "drop": {
      let d = 0;
      while (at(0, d + 1)) d++;
      return lock({ ...state, piece: { ...piece, y: piece.y + d } }, d * 2);
    }
  }
  return state;
}

const KEYS: Record<string, Action> = {
  ArrowLeft: "left",
  a: "left",
  ArrowRight: "right",
  d: "right",
  ArrowUp: "rotate",
  w: "rotate",
  x: "rotate",
  ArrowDown: "soft",
  s: "soft",
  " ": "drop",
  p: "pause",
  Escape: "pause",
};

const BEST = "tetris-best";
const noop = () => () => {};
const readBest = () => {
  try {
    return Number(localStorage.getItem(BEST)) || 0;
  } catch {
    return 0;
  }
};
const initial: State = { grid: empty(), piece: null, next: 0, bag: [], score: 0, lines: 0, status: "idle" };

// Tile Tetris in the site's pixel style. Keys only count while the board has focus, so arrow
// keys keep scrolling the page everywhere else. It pauses itself when scrolled away or hidden.
export default function Tetris() {
  const [state, dispatch] = useReducer(reducer, initial);
  const stored = useSyncExternalStore(noop, readBest, () => 0);
  const best = Math.max(stored, state.score);
  const box = useRef<HTMLDivElement>(null);
  const level = Math.floor(state.lines / 10);

  useEffect(() => {
    if (state.score <= stored) return;
    try {
      localStorage.setItem(BEST, String(state.score));
    } catch {}
  }, [state.score, stored]);

  useEffect(() => {
    if (state.status !== "playing") return;
    const id = setInterval(() => dispatch("tick"), Math.max(90, 650 - level * 55));
    return () => clearInterval(id);
  }, [state.status, level]);

  // Pause when the board leaves the screen or the tab is hidden.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const pause = () => state.status === "playing" && dispatch("pause");
    const io = new IntersectionObserver(([e]) => !e.isIntersecting && pause(), { threshold: 0.1 });
    io.observe(el);
    const onHide = () => document.hidden && pause();
    document.addEventListener("visibilitychange", onHide);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [state.status]);

  const start = () => {
    dispatch("start");
    box.current?.focus({ preventScroll: true });
  };
  const onKey = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === " ") && state.status !== "playing" && state.status !== "paused") {
      e.preventDefault();
      return start();
    }
    const action = KEYS[e.key];
    if (!action || state.status === "idle" || state.status === "over") return;
    e.preventDefault();
    dispatch(action);
  };

  // Where the piece would land, drawn as an outline.
  let ghost = 0;
  if (state.piece) while (fits(state.grid, state.piece.m, state.piece.x, state.piece.y + ghost + 1)) ghost++;

  const cells: { x: number; y: number; c: string; kind: "set" | "live" | "ghost" }[] = [];
  state.grid.forEach((row, y) => row.forEach((c, x) => c && cells.push({ x, y, c, kind: "set" })));
  if (state.piece) {
    const p = state.piece;
    p.m.forEach((row, dy) =>
      row.forEach((v, dx) => {
        if (!v) return;
        if (ghost > 0 && p.y + dy + ghost >= 0) cells.push({ x: p.x + dx, y: p.y + dy + ghost, c: p.c, kind: "ghost" });
        if (p.y + dy >= 0) cells.push({ x: p.x + dx, y: p.y + dy, c: p.c, kind: "live" });
      })
    );
  }
  const next = SHAPES[state.next];

  const overlay =
    state.status === "idle" ? "Start" : state.status === "paused" ? "Resume" : state.status === "over" ? "Play again" : null;

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-10">
      <div
        ref={box}
        tabIndex={0}
        onKeyDown={onKey}
        role="application"
        aria-label="Tile Tetris. Arrow keys move and rotate, space drops, P pauses."
        className="relative mx-auto w-full max-w-[200px] shrink-0 sm:max-w-[260px] rounded-[18px] bg-fill p-2.5 outline-none focus-visible:shadow-[0_0_0_2.5px_var(--color-blue)] sm:mx-0"
      >
        <svg viewBox={`0 0 ${W} ${H}`} shapeRendering="crispEdges" className="block w-full select-none">
          {cells.map(({ x, y, c, kind }, i) =>
            kind === "ghost" ? (
              <rect key={`g${i}`} x={x + 0.12} y={y + 0.12} width={0.76} height={0.76} fill="none" stroke={palette[c]} strokeWidth={0.12} opacity={0.6} />
            ) : (
              <rect key={`${kind}${i}`} x={x + 0.04} y={y + 0.04} width={0.92} height={0.92} rx={0.08} fill={palette[c]} />
            )
          )}
        </svg>
        {overlay && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-[18px] bg-paper/70 backdrop-blur-[2px]">
            {state.status === "over" && <p className="text-[15px] font-semibold tracking-tight">Stacked out. {state.score} pts</p>}
            <button
              type="button"
              onClick={state.status === "paused" ? () => dispatch("pause") : start}
              className="rounded-full bg-ink px-4 py-2.5 text-[14px] font-medium text-paper transition-transform active:scale-95"
            >
              {overlay}
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-5">
        <dl className="grid grid-cols-3 gap-2 text-center sm:grid-cols-1 sm:text-left">
          {[
            ["Score", state.score],
            ["Lines", state.lines],
            ["Best", best],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[14px] bg-fill px-3 py-2.5">
              <dt className="text-[12px] text-muted">{label}</dt>
              <dd className="text-[20px] font-semibold tabular-nums tracking-tight">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="hidden items-center gap-3 sm:flex">
          <span className="text-[12px] text-muted">Next</span>
          <svg viewBox={`0 0 4 2`} className="h-6 w-12" shapeRendering="crispEdges">
            {next.m.flatMap((row, y) =>
              row.map((v, x) => (v ? <rect key={`${x}${y}`} x={x + 0.05} y={y + 0.05} width={0.9} height={0.9} fill={palette[next.c]} /> : null))
            )}
          </svg>
        </div>
        <p className="hidden text-[13px] leading-relaxed text-muted sm:block">
          ← → move · ↑ rotate · ↓ soft drop
          <br />
          space hard drop · P pause
        </p>
        {/* Touch controls */}
        <div className="grid grid-cols-5 gap-2 sm:hidden">
          {(
            [
              ["left", ArrowLeft, "Move left"],
              ["rotate", RotateCw, "Rotate"],
              ["right", ArrowRight, "Move right"],
              ["soft", ArrowDown, "Soft drop"],
              ["drop", ChevronsDown, "Hard drop"],
            ] as const
          ).map(([action, Icon, label]) => (
            <button
              key={action}
              type="button"
              aria-label={label}
              onClick={() => dispatch(action)}
              className="flex h-12 touch-manipulation items-center justify-center rounded-[14px] bg-fill transition-transform active:scale-90"
            >
              <Icon className="size-5" strokeWidth={2.25} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
