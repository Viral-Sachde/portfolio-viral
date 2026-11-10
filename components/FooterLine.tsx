"use client";

import { useState } from "react";
import { CoffeeTip } from "@/components/Coffee";

const lines: React.ReactNode[] = [
  <>
    made in ahmedabad, powered by{" "}
    <CoffeeTip label="koffooo">
      <span className="text-ink underline decoration-muted decoration-dotted decoration-[1.5px] underline-offset-[3px]">koffooo</span>
    </CoffeeTip>{" "}
    and the occasional dabeli run to kutch
  </>,
  "garba season is the only cardio i never skip",
  "currently losing an argument with my gym playlist",
  "if you saw me at a tapri at 1am, no you didnt",
  "thepla is the best travel food ever made and im not taking questions",
  "walked 10k steps today, 9k of them were to the fridge",
];

// Rotating personal one-liners; tap for another.
export default function FooterLine() {
  const [i, setI] = useState(0);
  const next = () => setI((n) => (n + 1) % lines.length);
  return (
    <div className="relative mx-auto max-w-[34ch] text-balance text-[13px] leading-snug text-muted">
      <p onClick={next} className="cursor-pointer transition-colors hover:text-ink" aria-live="polite">
        {lines[i]}
      </p>
      <button type="button" onClick={next} className="mt-1 block w-full text-[11px] transition-colors hover:text-ink">
        tap for another
      </button>
    </div>
  );
}
