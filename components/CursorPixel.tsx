"use client";

import { useEffect, useRef } from "react";
import { palette } from "@/lib/mosaic";
import { motionReduced } from "@/lib/theme";

const tones = [palette.b, palette.g, palette.y, palette.n];

// A single pixel that trails the cursor on larger, mouse-driven screens.
export default function CursorPixel() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 640px)").matches) return;

    let x = -100, y = -100, tx = -100, ty = -100, frame = 0, tone = 0, overLink = false;

    const paint = () => {
      el.style.background = tones[tone];
      el.style.width = el.style.height = overLink ? "18px" : "10px";
    };
    const loop = () => {
      const k = motionReduced() ? 1 : 0.2;
      x += (tx - x) * k;
      y += (ty - y) * k;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      frame = requestAnimationFrame(loop);
    };
    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      el.style.opacity = "1";
      const link = !!(e.target as Element).closest?.("a, button, summary, [data-pulse], .mosaic, .board");
      if (link !== overLink) {
        overLink = link;
        if (link) tone = (tone + 1) % tones.length;
        paint();
      }
    };
    const onDown = () => (el.style.scale = "0.6");
    const onUp = () => (el.style.scale = "1");
    const onLeave = () => (el.style.opacity = "0");

    paint();
    frame = requestAnimationFrame(loop);
    const cycle = setInterval(() => {
      if (motionReduced()) return;
      tone = (tone + 1) % tones.length;
      paint();
    }, 1000);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      clearInterval(cycle);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60] rounded-[2px] opacity-0 shadow-[0_0_0_1.5px_var(--color-paper)] transition-[width,height,background-color,scale,opacity] duration-200"
    />
  );
}
