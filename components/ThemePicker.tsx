"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Monitor, Moon, Sun, X } from "lucide-react";
import { PRESETS, applyFlag, applyMode, applyTheme, type Mode, type Theme } from "@/lib/theme";

const DEFAULT: Theme = { preset: "classic" };

// Floating bottom-right button: light/dark mode plus palette presets or custom picks.
// Choices last for the visit only; a refresh returns to Classic in light mode.
export default function ThemePicker() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(DEFAULT);
  const [mode, setMode] = useState<Mode>("light");
  const [colourBlind, setColourBlind] = useState(false);
  const [contrast, setContrast] = useState(false);
  const [motion, setMotion] = useState(false);
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
    applyTheme(next, colourBlind);
  };
  const toggleColourBlind = (on: boolean) => {
    setColourBlind(on);
    applyTheme(theme, on);
  };
  const toggleContrast = (on: boolean) => {
    setContrast(on);
    applyFlag("contrast", on ? "more" : null);
  };
  const toggleMotion = (on: boolean) => {
    setMotion(on);
    applyFlag("motion", on ? "reduce" : null);
  };
  const chooseMode = (next: Mode) => {
    setMode(next);
    applyMode(next);
  };

  const custom = "custom" in theme ? theme.custom : { b: "#0071E3", g: "#34C759", y: "#FFD60A" };
  const setCustom = (key: "b" | "g" | "y", value: string) => choose({ custom: { ...custom, [key]: value } });

  return (
    <div ref={panel} className="fixed bottom-[calc(14px+env(safe-area-inset-bottom))] right-3.5 z-[45] sm:bottom-[calc(16px+env(safe-area-inset-bottom))] sm:right-4">
      {open && (
        <div role="dialog" aria-label="Colours and display mode" className="absolute bottom-12 right-0 max-h-[calc(100svh-90px)] w-[284px] overflow-y-auto sm:bottom-14 origin-bottom-right animate-[pop_0.25s_var(--ease)] rounded-[22px] bg-paper/95 p-4 shadow-[0_12px_40px_-8px_rgb(0_0_0/0.25)] backdrop-blur-xl">
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
                aria-pressed={mode === key}
                className={`flex items-center justify-center gap-1.5 rounded-[9px] py-1.5 text-[12px] font-medium transition-colors ${
                  mode === key ? "bg-paper text-ink shadow-[0_1px_3px_rgb(0_0_0/0.12)]" : "text-muted"
                }`}
              >
                <Icon className="size-3.5" strokeWidth={2.25} />
                {label}
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-x-2 gap-y-3">
            {PRESETS.map((p) => {
              const active = "preset" in theme && theme.preset === p.key;
              return (
                <button key={p.key} onClick={() => choose({ preset: p.key })} className="flex flex-col items-center gap-1.5" aria-label={p.label === "CB safe" ? "Colour-blind safe" : p.label} aria-pressed={active}>
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
              {"custom" in theme && <Check className="size-4 text-ok" strokeWidth={2.5} />}
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

          <div className="mt-4 border-t border-line pt-3">
            <span className="text-[13px] font-medium">Accessibility</span>
            <div className="mt-1.5 divide-y divide-line">
              <Switch label="Colour-blind safe" hint="Okabe-Ito palette" on={colourBlind} onChange={toggleColourBlind} />
              <Switch label="High contrast" hint="Darker text and lines" on={contrast} onChange={toggleContrast} />
              <Switch label="Reduce motion" hint="Stop animations" on={motion} onChange={toggleMotion} />
            </div>
          </div>

          <button onClick={() => {
              toggleColourBlind(false);
              toggleContrast(false);
              toggleMotion(false);
              choose(DEFAULT);
              chooseMode("light");
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
        className="grid size-10 grid-cols-2 gap-[2.5px] rounded-full bg-paper p-[9px] sm:size-12 sm:gap-[3px] sm:p-[11px] shadow-[0_6px_24px_-6px_rgb(0_0_0/0.3)] ring-1 ring-ink/10 transition-transform active:scale-90"
      >
        <span className="rounded-[3px] bg-blue" />
        <span className="rounded-[3px] bg-green" />
        <span className="rounded-[3px] bg-yellow" />
        <span className="rounded-[3px] bg-blue-deep" />
      </button>
    </div>
  );
}

// iOS-style switch with a proper switch role for assistive tech.
function Switch({ label, hint, on, onChange }: { label: string; hint: string; on: boolean; onChange: (on: boolean) => void }) {
  return (
    <button role="switch" aria-checked={on} onClick={() => onChange(!on)} className="flex w-full items-center justify-between gap-3 py-2.5 text-left">
      <span>
        <span className="block text-[13px]">{label}</span>
        <span className="block text-[11px] text-muted">{hint}</span>
      </span>
      <span className={`relative h-[26px] w-[44px] shrink-0 rounded-full transition-colors ${on ? "bg-ok" : "bg-line"}`}>
        <span className={`absolute top-[3px] size-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-[21px]" : "translate-x-[3px]"}`} />
      </span>
    </button>
  );
}
