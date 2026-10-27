"use client";

import { useState } from "react";
import { stackGroups } from "@/lib/content";

const tabs = [{ key: "all", label: "All" }, ...stackGroups];

// iOS-style segmented control that lights up one slice of the stack at a time.
export default function StackPicker() {
  const [active, setActive] = useState("all");
  const index = tabs.findIndex((t) => t.key === active);

  return (
    <div>
      <div className="relative flex rounded-[10px] bg-fill p-[3px]" role="group" aria-label="Filter stack">
        <span
          className="absolute inset-y-[3px] left-[3px] rounded-[8px] bg-paper shadow-[0_1px_3px_rgb(0_0_0/0.12)] transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
          style={{ width: `calc((100% - 6px) / ${tabs.length})`, transform: `translateX(${index * 100}%)` }}
        />
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            aria-pressed={active === t.key}
            className={`relative z-10 flex-1 py-1.5 text-[13px] font-medium transition-colors ${
              active === t.key ? "text-ink" : "text-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ul className="mt-5 flex flex-wrap gap-2">
        {stackGroups.flatMap((g) =>
          g.items.map((item) => {
            const on = active === "all" || active === g.key;
            return (
              <li
                key={item}
                className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-[14px] transition-all duration-300"
                style={{
                  borderColor: on && active !== "all" ? g.color : "var(--color-line)",
                  background: on && active !== "all" ? `color-mix(in srgb, ${g.color} 12%, var(--color-paper))` : "var(--color-paper)",
                  opacity: on ? 1 : 0.28,
                  transform: on && active !== "all" ? "scale(1.04)" : "none",
                }}
              >
                <span className="size-2 rounded-[2px]" style={{ background: g.color }} />
                {item}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
