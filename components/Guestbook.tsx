"use client";

import { useEffect, useState } from "react";
import { Eraser } from "lucide-react";
import { palette } from "@/lib/mosaic";

const N = 5;
const TONES = ["b", "n", "g", "d", "y", "o"] as const;
const NAMES: Record<string, string> = { b: "Blue", n: "Deep blue", g: "Green", d: "Deep green", y: "Yellow", o: "Amber" };
const BLANK = ".".repeat(N * N);

type Mark = { id: string; p: string; t: number };
type Saved = { p: string; t: number; key?: string };

function store<T>(key: string, value?: T): T | null {
  try {
    if (value !== undefined) localStorage.setItem(key, JSON.stringify(value));
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function visitorId() {
  try {
    let id = localStorage.getItem("guestbook-id");
    if (!id) localStorage.setItem("guestbook-id", (id = crypto.randomUUID()));
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

function Stamp({ p, className, label }: { p: string; className?: string; label?: string }) {
  return (
    <svg viewBox={`0 0 ${N} ${N}`} shapeRendering="crispEdges" role={label ? "img" : undefined} aria-label={label} aria-hidden={!label} className={className}>
      {p.split("").map((c, i) =>
        c === "." ? null : <rect key={i} x={i % N} y={Math.floor(i / N)} width={1.02} height={1.02} fill={palette[c]} />
      )}
    </svg>
  );
}

// Visitors draw a 5×5 pixel self-portrait and stamp it on the wall. One mark per visitor;
// stamping again replaces it. Shared through /api/guestbook once a store is connected.
export default function Guestbook() {
  const [pixels, setPixels] = useState(BLANK);
  const [tone, setTone] = useState<string>("b");
  const [marks, setMarks] = useState<Mark[]>([]);
  const [total, setTotal] = useState(0);
  const [visitors, setVisitors] = useState(0);
  const [shared, setShared] = useState(false);
  const [you, setYou] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    const mine = store<Saved>("guestbook-mark");
    fetch(`/api/guestbook?v=${visitorId()}`)
      .then((r) => r.json())
      .catch(() => ({ shared: false }))
      .then((s: { shared: boolean; marks?: Mark[]; total?: number; visitors?: number }) => {
        if (mine) {
          setPixels(mine.p);
          setYou(mine.key ?? "local");
        }
        if (s.shared) {
          setShared(true);
          setMarks(s.marks ?? []);
          setTotal(s.total ?? 0);
          setVisitors(s.visitors ?? 0);
        } else if (mine) {
          setMarks([{ id: "local", p: mine.p, t: mine.t }]);
          setTotal(1);
        }
      });
  }, []);

  const paint = (i: number) =>
    setPixels((p) => {
      const c = tone === "." || p[i] === tone ? "." : tone;
      return p.slice(0, i) + c + p.slice(i + 1);
    });

  const stamp = async () => {
    if (pixels === BLANK || busy) return;
    const t = Date.now();
    if (!shared) {
      store<Saved>("guestbook-mark", { p: pixels, t, key: "local" });
      setMarks([{ id: "local", p: pixels, t }]);
      setTotal(1);
      setYou("local");
      setNote("Stamped.");
      return;
    }
    setBusy(true);
    try {
      const r = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: visitorId(), p: pixels }),
      });
      const s = await r.json();
      if (!r.ok) throw new Error(s.error);
      store<Saved>("guestbook-mark", { p: pixels, t, key: s.you });
      setMarks(s.marks);
      setTotal(s.total);
      setYou(s.you);
      setNote("Stamped. You're on the wall.");
    } catch (e) {
      setNote(e instanceof Error && e.message === "slow down" ? "Easy, give it a minute." : "Couldn't reach the wall. Try again?");
    } finally {
      setBusy(false);
    }
  };

  const empty = pixels === BLANK;

  return (
    <div className="flex flex-col gap-8 sm:flex-row sm:gap-10">
      <div className="shrink-0">
        <div className="grid w-[200px] grid-cols-5 gap-1 rounded-[18px] bg-fill p-2.5" role="group" aria-label="Drawing pad, 5 by 5">
          {pixels.split("").map((c, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Pixel ${(i % N) + 1}, ${Math.floor(i / N) + 1}: ${c === "." ? "empty" : NAMES[c]}`}
              onClick={() => paint(i)}
              className="aspect-square touch-manipulation rounded-[5px] bg-paper transition-transform active:scale-90"
              style={c === "." ? undefined : { background: palette[c] }}
            />
          ))}
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          {TONES.map((t) => (
            <button
              key={t}
              type="button"
              aria-label={NAMES[t]}
              aria-pressed={tone === t}
              onClick={() => setTone(t)}
              className="size-6 rounded-[6px] transition-transform aria-pressed:scale-110 aria-pressed:shadow-[0_0_0_2px_var(--color-paper),0_0_0_3.5px_var(--color-ink)]"
              style={{ background: palette[t] }}
            />
          ))}
          <button
            type="button"
            aria-label="Eraser"
            aria-pressed={tone === "."}
            onClick={() => setTone(".")}
            className="flex size-6 items-center justify-center rounded-[6px] bg-fill text-muted transition-transform aria-pressed:scale-110 aria-pressed:text-ink aria-pressed:shadow-[0_0_0_2px_var(--color-paper),0_0_0_3.5px_var(--color-ink)]"
          >
            <Eraser className="size-3.5" strokeWidth={2.25} />
          </button>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={stamp}
            disabled={empty || busy}
            className="rounded-full bg-ink px-4 py-2.5 text-[14px] font-medium text-paper transition-[transform,opacity] active:scale-95 disabled:opacity-40"
          >
            {you ? "Update my mark" : "Stamp it"}
          </button>
          {!empty && (
            <button type="button" onClick={() => setPixels(BLANK)} className="text-[13px] text-muted hover:text-ink">
              Clear
            </button>
          )}
        </div>
        <p aria-live="polite" className="mt-2 h-5 text-[13px] text-muted">
          {note}
        </p>
      </div>

      <div className="min-w-0 flex-1">
        {visitors > 0 && (
          <p className="mb-4">
            <span className="block text-[32px] font-semibold leading-none tabular-nums tracking-[-0.04em]">
              {visitors.toLocaleString("en-IN")}
            </span>
            <span className="text-[13px] text-muted">{visitors === 1 ? "visitor" : "visitors"} so far</span>
          </p>
        )}
        <p className="mb-3 text-[13px] text-muted">
          {total ? `${total} ${total === 1 ? "mark" : "marks"} on the wall` : "The wall is empty. Be the first."}
        </p>
        <ul className="flex flex-wrap gap-2">
          {marks.map((m) => (
            <li key={m.id} className={`rounded-[10px] bg-fill p-1.5 ${m.id === you ? "shadow-[0_0_0_2px_var(--color-blue)]" : ""}`}>
              <Stamp p={m.p} className="block size-9" label={m.id === you ? "Your mark" : "A visitor's mark"} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
