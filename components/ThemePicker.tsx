"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Monitor, Moon, Sun, X } from "lucide-react";
import { PRESETS, applyMode, applyTheme, type Mode, type Theme } from "@/lib/theme";

const DEFAULT: Theme = { preset: "classic" };

// Floating bottom-right button: light/dark mode plus palette presets or custom picks.
// Choices last for the visit only; a refresh returns to Classic and the system mode.
export default function ThemePicker() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(DEFAULT);
  const [mode, setMode] = useState<Mode>("auto");
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !panel.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  const choose = (next: Theme) => {
    setTheme(next);
    applyTheme(next);
  };
  const chooseMode = (next: Mode) => {
    setMode(next);
    applyMode(next);
  };

  const custom = "custom" in theme ? theme.custom : { b: "#0A84FF", g: "#34C759", y: "#FFD60A" };
  const setCustom = (key: "b" | "g" | "y", value: string) => choose({ custom: { ...custom, [key]: value } });

  return (
    <div ref={panel} className="fixed bottom-[calc(16px+env(safe-area-inset-bottom))] right-4 z-[45]">
      {open && (
        <div className="absolute bottom-14 right-0 w-[272px] origin-bottom-right animate-[pop_0.25s_var(--ease)] rounded-[22px] bg-paper/95 p-4 shadow-[0_12px_40px_-8px_rgb(0_0_0/0.25)] backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-semibold tracking-tight">Colours</span>
            <button onClick={() => setOpen(false)} aria-label="Close" className="grid size-7 place-items-center rounded-full bg-fill">
              <X className="size-3.5" strokeWidth={2.5} />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-1 rounded-[12px] bg-fill p-1">
            {(
              [
                ["auto", "Auto", Monitor],
                ["light", "Light", Sun],
                ["dark", "Dark", Moon],
              ] as const
            ).map(([key, label, Icon]) => (
              <button
                key={key}
                onClick={() => chooseMode(key)}
                className={`flex items-center justify-center gap-1.5 rounded-[9px] py-1.5 text-[12px] font-medium transition-colors ${
                  mode === key ? "bg-paper text-ink shadow-[0_1px_3px_rgb(0_0_0/0.12)]" : "text-muted"
                }`}
              >
                <Icon className="size-3.5" strokeWidth={2.25} />
                {label}
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-5 gap-2">
            {PRESETS.map((p) => {
              const active = "preset" in theme && theme.preset === p.key;
              return (
                <button key={p.key} onClick={() => choose({ preset: p.key })} className="flex flex-col items-center gap-1.5" aria-label={p.label}>
                  <span className={`grid size-11 grid-cols-2 overflow-hidden rounded-[12px] transition-transform active:scale-90 ${active ? "ring-2 ring-ink ring-offset-2 ring-offset-paper" : ""}`}>
                    {[p.tones.b, p.tones.g, p.tones.y, p.tones.n].map((c, i) => (
                      <span key={i} style={{ background: c }} />
                    ))}
                  </span>
                  <span className="text-[10px] font-medium text-muted">{p.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 border-t border-line pt-3">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium">Custom</span>
              {"custom" in theme && <Check className="size-4 text-green-deep" strokeWidth={2.5} />}
            </div>
            <div className="mt-2.5 grid grid-cols-3 gap-2">
              {(
                [
                  ["b", "Primary"],
                  ["g", "Secondary"],
                  ["y", "Accent"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="flex cursor-pointer flex-col items-center gap-1.5 rounded-[14px] bg-fill py-2.5">
                  <span className="relative size-8 overflow-hidden rounded-full ring-1 ring-black/10" style={{ background: custom[key] }}>
                    <input
                      type="color"
                      value={custom[key]}
                      onChange={(e) => setCustom(key, e.target.value)}
                      className="absolute inset-0 size-full cursor-pointer opacity-0"
                    />
                  </span>
                  <span className="text-[11px] text-muted">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <button onClick={() => {
              choose(DEFAULT);
              chooseMode("auto");
            }} className="mt-3 w-full rounded-full bg-fill py-2 text-[13px] font-medium transition-transform active:scale-[0.98]">
            Reset
          </button>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Change colours"
        aria-expanded={open}
        data-pulse
        className="grid size-12 grid-cols-2 gap-[3px] rounded-full bg-paper p-[11px] shadow-[0_6px_24px_-6px_rgb(0_0_0/0.3)] ring-1 ring-ink/10 transition-transform active:scale-90"
      >
        <span className="rounded-[3px] bg-blue" />
        <span className="rounded-[3px] bg-green" />
        <span className="rounded-[3px] bg-yellow" />
        <span className="rounded-[3px] bg-blue-deep" />
      </button>
    </div>
  );
}
