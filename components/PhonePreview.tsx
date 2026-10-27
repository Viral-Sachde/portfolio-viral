import type { Preview } from "@/lib/content";
import { palette } from "@/lib/mosaic";

// Phone-framed project preview with an illustrated screen per project.
export default function PhonePreview({ preview, title }: { preview: Preview; title: string }) {
  return (
    <div className="light-scope rounded-[2.2rem] bg-ink p-[6px] shadow-[0_12px_30px_-12px_rgb(0_0_0/0.35)]" role="img" aria-label={`${title} preview`}>
      <div className="relative aspect-[9/19] overflow-hidden rounded-[1.85rem] bg-white">
        <div className="absolute left-1/2 top-2 z-10 h-[16px] w-[32%] -translate-x-1/2 rounded-full bg-ink" />
        <Screen kind={preview.kind} />
      </div>
    </div>
  );
}

function Screen({ kind }: { kind: Preview["kind"] }) {
  if (kind === "flow") return <Flow />;
  if (kind === "cron") return <Cron />;
  if (kind === "meet") return <Meet />;
  if (kind === "bday") return <Bday />;
  if (kind === "extension") return <Extension />;
  if (kind === "brat") return <Brat />;
  return <Chat />;
}

function Meet() {
  const tiles = [palette.b, palette.g, palette.n, palette.y];
  return (
    <div className="flex h-full flex-col bg-[#111214] px-2.5 pt-9">
      <div className="flex items-center justify-between px-1 text-[10px] text-white/70">
        <span className="font-semibold text-white">Daily sync</span>
        <span className="flex items-center gap-1">
          <span className="size-1.5 animate-pulse rounded-full bg-[#FF453A]" />
          REC
        </span>
      </div>
      <div className="mt-2.5 grid flex-1 grid-cols-2 gap-1.5">
        {tiles.map((c, i) => (
          <div key={i} className="relative grid place-items-center rounded-xl" style={{ background: `color-mix(in srgb, ${c} 20%, transparent)` }}>
            <span className="size-8 rounded-full" style={{ background: c }} />
            <span className="absolute bottom-1.5 left-1.5 h-1 w-6 rounded-full bg-white/40" />
          </div>
        ))}
      </div>
      <div className="my-3 flex justify-center gap-2">
        {["bg-white/15", "bg-white/15", "bg-white/15", "bg-[#FF453A]"].map((c, i) => (
          <span key={i} className={`size-7 rounded-full ${c}`} />
        ))}
      </div>
    </div>
  );
}

function Node({ label, color, dark }: { label: string; color: string; dark?: boolean }) {
  return (
    <div
      className="truncate rounded-full px-1 py-1.5 text-center text-[10px] font-semibold"
      style={{ background: color, color: dark ? "#fff" : "#0A0A0A" }}
    >
      {label}
    </div>
  );
}

function Flow() {
  const line = <div className="mx-auto h-4 w-px bg-ink/25" />;
  return (
    <div className="flex h-full flex-col bg-fill px-4 pt-10">
      <div className="text-[10px] font-medium text-muted">Workflow</div>
      <div className="text-[15px] font-semibold tracking-tight">Approval flow</div>
      <div className="mt-5 flex flex-col">
        <Node label="Draft" color="#fff" />
        {line}
        <Node label="Review" color={palette.n} dark />
        {line}
        <div className="grid grid-cols-2 gap-1.5">
          <Node label="Approve" color={palette.g} />
          <Node label="Edit" color={palette.y} />
        </div>
        {line}
        <Node label="Published" color={palette.d} dark />
      </div>
      <div className="mt-auto mb-5 space-y-1.5">
        {[78, 64, 70].map((w, i) => (
          <div key={i} className="flex items-center gap-2 rounded-xl bg-white p-2">
            <span className="size-2 rounded-full" style={{ background: [palette.g, palette.b, palette.y][i] }} />
            <span className="h-1.5 rounded-full bg-line" style={{ width: `${w}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Cron() {
  const steps = [
    { t: "09:30", label: "Draft 5 posts", by: "Claude", c: palette.b },
    { t: "09:31", label: "Pick the best", by: "Dedupe last 30", c: palette.n },
    { t: "11:00", label: "Make the image", by: "DALL·E 3", c: palette.y },
    { t: "11:00", label: "Publish", by: "LinkedIn + X", c: palette.g },
  ];
  return (
    <div className="flex h-full flex-col bg-white px-4 pt-10">
      <div className="text-[10px] font-medium text-muted">Every day</div>
      <div className="text-[15px] font-semibold tracking-tight">Autopilot</div>
      <ol className="mt-5">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-2.5">
            <div className="flex flex-col items-center">
              <span className="mt-0.5 size-2.5 rounded-[3px]" style={{ background: s.c }} />
              {i < steps.length - 1 && <span className="w-px flex-1 bg-line" />}
            </div>
            <div className="pb-2.5">
              <div className="text-[10px] font-medium tabular-nums text-muted">{s.t}</div>
              <div className="text-[12px] font-semibold leading-tight">{s.label}</div>
              <div className="text-[10px] text-muted">{s.by}</div>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-auto mb-5 rounded-xl bg-green/15 p-2.5 text-center text-[11px] font-semibold text-ok">
        ✓ Posted, no hands
      </div>
    </div>
  );
}

function Chat() {
  const bubble = "max-w-[82%] rounded-[12px] px-2.5 py-1.5 text-[10.5px] leading-snug shadow-[0_1px_0_rgb(0_0_0/0.06)]";
  return (
    <div className="flex h-full flex-col bg-[#EFEAE2]">
      <div className="flex items-center gap-2 px-3 pb-2 pt-9 text-white" style={{ background: palette.d }}>
        <span className="grid size-6 place-items-center rounded-full bg-white/20 text-[10px] font-bold">A</span>
        <div className="leading-tight">
          <div className="text-[11px] font-semibold">Acme Sales</div>
          <div className="text-[9px]">online</div>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 overflow-hidden px-2.5 pt-2.5">
        <div className={`${bubble} self-start bg-white`}>Hi! Pricing for 50 seats?</div>
        <div className={`${bubble} self-end bg-[#D9FDD3]`}>
          <div className="mb-0.5 text-[8.5px] font-semibold text-ok">✨ AI draft</div>
          Quote sent. Demo at 11 tomorrow?
        </div>
        <div className={`${bubble} self-start bg-white`}>Works 👍</div>
        <div className="mt-1 self-center rounded-full bg-white/80 px-2.5 py-1 text-[9px] font-semibold" style={{ color: palette.n }}>
          🔥 Lead qualified → Sales agent
        </div>
      </div>
      <div className="mx-2.5 mb-4 flex items-center justify-between rounded-full bg-white px-3 py-1.5 text-[10px] text-muted">Message<span style={{ color: palette.d }}>✨</span></div>
    </div>
  );
}

function Bday() {
  return (
    <div className="relative flex h-full flex-col items-center bg-[#1E4D2B] px-3 pt-12 text-white">
      <div className="text-[10px] font-medium">Thursday</div>
      <div className="text-[44px] font-semibold leading-none tracking-[-0.04em]">12:00</div>
      <div className="mt-6 w-full rounded-[14px] bg-white/90 p-2.5 text-ink shadow-lg backdrop-blur">
        <div className="flex items-center gap-1.5 text-[9px] font-semibold text-ink/80">
          <span className="grid size-3.5 place-items-center rounded-[4px] bg-[#E3F988] text-[8px]">🎉</span>
          BLOOP · now
        </div>
        <div className="mt-1 text-[11px] font-semibold leading-tight">It&apos;s Aman&apos;s birthday!</div>
        <div className="text-[10px] leading-snug text-ink/70">Be the first to wish. Tap for a hype one.</div>
      </div>
      <div className="mt-2 w-full rounded-[14px] bg-white/25 p-2.5">
        <div className="text-[9px] font-semibold">11:55 PM · heads-up</div>
        <div className="mt-0.5 h-1.5 w-3/4 rounded-full bg-white/40" />
      </div>
      <div className="mt-auto mb-5 flex gap-1.5">
        {["Sweet", "Funny", "Hype"].map((t, i) => (
          <span key={t} className={`rounded-full px-2 py-1 text-[9px] font-semibold ${i === 2 ? "bg-[#E3F988] text-[#1E4D2B]" : "bg-white/15"}`}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function Extension() {
  const tiles = [palette.b, palette.y, palette.g, palette.n, palette.o, palette.d, palette.b, palette.g, palette.y];
  return (
    <div className="flex h-full flex-col bg-fill px-2.5 pt-9">
      <div className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1.5 text-[9px] text-muted">
        <span className="size-2 rounded-full bg-green" />
        any-website.com
      </div>
      <div className="mt-2.5 rounded-[14px] bg-white p-2.5 shadow-[0_6px_20px_rgb(0_0_0/0.08)]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-tight">Images</span>
          <span className="rounded-full bg-blue px-1.5 py-0.5 text-[9px] font-semibold text-white">42</span>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-1">
          {tiles.map((c, i) => (
            <span key={i} className="relative aspect-square rounded-md" style={{ background: c }}>
              {i % 4 !== 3 && <span className="absolute right-0.5 top-0.5 size-2 rounded-full border border-white bg-white/90" />}
            </span>
          ))}
        </div>
        <div className="mt-2.5 flex gap-1">
          {["JPG", "PNG", "WebP"].map((f, i) => (
            <span key={f} className={`flex-1 rounded-full py-1 text-center text-[9px] font-semibold ${i === 2 ? "bg-ink text-white" : "bg-fill"}`}>
              {f}
            </span>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[9px] text-muted">
          Quality
          <span className="relative h-1 flex-1 rounded-full bg-line">
            <span className="absolute inset-y-0 left-0 w-4/5 rounded-full bg-blue" />
          </span>
          80%
        </div>
        <div className="mt-2.5 rounded-full bg-blue py-1.5 text-center text-[10px] font-semibold text-white">Download all</div>
      </div>
    </div>
  );
}

function Brat() {
  return (
    <div className="flex h-full flex-col bg-paper px-3 pt-10">
      <div className="text-[10px] font-medium text-muted">Generator</div>
      <div className="grid aspect-square w-full place-items-center bg-[#8ACE00]">
        <span className="font-[Arial_Narrow,Arial,sans-serif] text-[34px] lowercase tracking-[-0.06em] text-black [filter:blur(0.7px)] [transform:scaleX(0.9)]">
          brat
        </span>
      </div>
      <div className="mt-2.5 rounded-full bg-fill px-3 py-1.5 text-[10px] text-muted">type a lyric…</div>
      <div className="mt-2 flex gap-1">
        {[
          ["Brat", "#8ACE00", "text-black"],
          ["Cyber", "#00E5FF", "text-black"],
          ["Sunset", "#FF7A59", "text-black"],
        ].map(([t, c, fg], i) => (
          <span key={t} className={`flex-1 rounded-full py-1 text-center text-[9px] font-semibold ${fg} ${i === 0 ? "ring-2 ring-ink/80" : ""}`} style={{ background: c }}>
            {t}
          </span>
        ))}
      </div>
      <div className="mt-auto mb-5 rounded-full bg-ink py-1.5 text-center text-[10px] font-semibold text-paper">Download PNG</div>
    </div>
  );
}
