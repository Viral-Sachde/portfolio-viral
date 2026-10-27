"use client";

import { useState } from "react";

const lines = [
  "made in ahmedabad, powered by cutting chai and the occasional dabeli run to kutch",
  "garba season is the only cardio i never skip",
  "currently losing an argument with my gym playlist",
  "if you saw me at a tapri at 1am, no you didnt",
  "thepla is the best travel food ever made and im not taking questions",
  "walked 10k steps today, 9k of them were to the fridge",
];

// Rotating personal one-liners; tap for another.
export default function FooterLine() {
  const [i, setI] = useState(0);
  return (
    <button
      onClick={() => setI((n) => (n + 1) % lines.length)}
      className="mx-auto block max-w-[34ch] text-balance text-[13px] leading-snug text-muted transition-colors hover:text-ink"
      aria-live="polite"
    >
      {lines[i]}
      <span className="mt-1 block text-[11px]">tap for another</span>
    </button>
  );
}
