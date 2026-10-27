"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

// Progressive blur pinned to the bottom of the viewport; fades out at the end of the page.
// Carries a "Scroll" hint until the visitor starts scrolling.
export default function ScrollBlur() {
  const [atEnd, setAtEnd] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => {
      const { scrollHeight } = document.documentElement;
      setAtEnd(window.innerHeight + window.scrollY >= scrollHeight - 48);
      setScrolled(window.scrollY > 60);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div aria-hidden className={`scroll-blur ${atEnd ? "is-hidden" : ""}`}>
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div className={`scroll-hint ${scrolled ? "is-gone" : ""}`}>
        <span className="flex items-center gap-1 rounded-full bg-white/80 px-3 py-1.5 text-[12px] font-medium text-muted shadow-[0_2px_10px_rgb(0_0_0/0.08)]">
          Scroll
          <ChevronDown className="size-3.5" strokeWidth={2.5} />
        </span>
      </div>
    </div>
  );
}
