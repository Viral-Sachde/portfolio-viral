"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { palette } from "@/lib/mosaic";

export const LINE = "te mara maate coffee kem mangai? ☕";

// The dialogue bubble. Shows on hover or focus, and toggles on tap for phones (closing itself
// after a few seconds). `align` keeps it on screen when the trigger sits near an edge.
export function CoffeeTip({
  children,
  label,
  align = "center",
  className = "",
}: {
  children: React.ReactNode;
  label: string;
  align?: "start" | "center" | "end";
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => setOpen(false), 3500);
    return () => clearTimeout(t);
  }, [open]);

  const place = align === "end" ? "right-0" : align === "start" ? "left-0" : "left-1/2 -translate-x-1/2";
  return (
    <span className={`group inline-block ${className}`}>
      <button
        type="button"
        aria-label={label}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="cursor-help"
      >
        {children}
      </button>
      <span
        role="tooltip"
        className={`pointer-events-none absolute bottom-full z-20 mb-2 whitespace-nowrap rounded-[10px] bg-ink px-3 py-2 text-[13px] font-medium italic text-paper shadow-[0_4px_16px_rgb(0_0_0/0.15)] transition-[opacity,translate] duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 ${place} ${
          open ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
        }`}
      >
        {LINE}
      </span>
    </span>
  );
}

// 9×9 pixel cup: s = steam, c = crema, t = cup body (tinted per cup), h = handle.
const CUP = [
  "..s..s...",
  ".s..s....",
  "..s..s...",
  ".........",
  "ccccccc..",
  "ttttttthh",
  "ttttttt.h",
  "ttttttthh",
  ".ttttt...",
];
const TINTS = ["b", "g", "n", "d"];

function Cup({ tint }: { tint: string }) {
  return (
    <svg viewBox="0 0 9 9" shapeRendering="crispEdges" className="coffee-cup block size-[30px]" aria-hidden>
      {CUP.flatMap((row, y) =>
        row.split("").map((ch, x) => {
          if (ch === ".") return null;
          const fill = ch === "s" ? "var(--color-muted)" : ch === "c" ? palette.o : palette[tint];
          return <rect key={`${x},${y}`} x={x} y={y} width={1.02} height={1.02} fill={fill} className={ch === "s" ? "steam" : undefined} />;
        })
      )}
    </svg>
  );
}

const SIZE = 30;
const GAP = 14;
// Anything a cup must not sit on top of.
const SOLID =
  "h1, h2, h3, p, li, a, button, input, textarea, select, summary, img, svg, video, canvas, dl, [class*='bg-'], [role='application']";

type Spot = { x: number; y: number; tint: string; align: "start" | "center" | "end" };

// Drops a few coffees at random empty spots anywhere on the page: a fresh layout every visit
// and on every width change. Each candidate is checked against the page's content so a cup
// never covers text, cards or controls. Few on purpose.
function scatter(main: HTMLElement, count: number): Spot[] {
  const origin = main.getBoundingClientRect();
  const blocked = Array.from(main.querySelectorAll<HTMLElement>(SOLID))
    .filter((el) => !el.closest(".coffee-spot, .scroll-blur") && el.offsetParent !== null)
    .map((el) => el.getBoundingClientRect())
    .filter((r) => r.width && r.height)
    .map((r) => ({ l: r.left - origin.left, t: r.top - origin.top, r: r.right - origin.left, b: r.bottom - origin.top }));
  const width = main.clientWidth;
  // Start below the hero; it already has the mosaics going on.
  const hero = main.querySelector("header");
  const top = hero ? hero.getBoundingClientRect().bottom - origin.top + GAP : 0;
  const height = main.scrollHeight - top;
  const spots: Spot[] = [];
  const hits = (x: number, y: number, list: { l: number; t: number; r: number; b: number }[]) =>
    list.some((b) => x - GAP < b.r && x + SIZE + GAP > b.l && y - GAP < b.b && y + SIZE + GAP > b.t);

  for (let tries = 0; tries < 400 && spots.length < count; tries++) {
    const x = 8 + Math.random() * (width - SIZE - 16);
    // Spread them down the page: each cup gets its own vertical band.
    const band = height / count;
    const y = top + band * spots.length + Math.random() * (band - SIZE);
    const taken = spots.map((s) => ({ l: s.x, t: s.y, r: s.x + SIZE, b: s.y + SIZE + 40 }));
    if (hits(x, y, blocked) || hits(x, y, taken)) continue;
    spots.push({ x, y, tint: TINTS[Math.floor(Math.random() * TINTS.length)], align: x < width / 3 ? "start" : x > (width * 2) / 3 ? "end" : "center" });
  }
  return spots;
}

export default function CoffeeCups({ count = 3 }: { count?: number }) {
  const [main, setMain] = useState<HTMLElement | null>(null);
  const [spots, setSpots] = useState<Spot[]>([]);

  useEffect(() => {
    const el = document.querySelector<HTMLElement>("main");
    if (!el) return;
    let timer = 0;
    let lastWidth = window.innerWidth;
    // Wait for fonts and images so the content is where it will stay.
    const place = () => {
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        setMain(el);
        setSpots(scatter(el, count));
      }, 400);
    };
    if (document.readyState === "complete") place();
    else window.addEventListener("load", place, { once: true });
    const onResize = () => {
      if (window.innerWidth === lastWidth) return; // phones fire resize when the toolbar hides
      lastWidth = window.innerWidth;
      place();
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", place);
      window.removeEventListener("resize", onResize);
    };
  }, [count]);

  if (!main) return null;
  return createPortal(
    spots.map(({ x, y, tint, align }, i) => (
      <span key={`${i}-${x}`} className="coffee-spot absolute z-10" style={{ left: x, top: y }}>
        <CoffeeTip label="A coffee someone left here" align={align} className="relative">
          <Cup tint={tint} />
        </CoffeeTip>
      </span>
    )),
    main
  );
}
