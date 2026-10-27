"use client";

import { useEffect, useState } from "react";

// Progressive blur pinned to the bottom of the viewport; fades out at the end of the page.
export default function ScrollBlur() {
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const update = () => {
      const { scrollHeight } = document.documentElement;
      setAtEnd(window.innerHeight + window.scrollY >= scrollHeight - 48);
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
    </div>
  );
}
