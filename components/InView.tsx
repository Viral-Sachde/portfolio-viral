"use client";

import { useEffect, useRef, useState } from "react";

// Adds `in` to the class list the first time the element scrolls into view.
export default function InView({
  as: Tag = "div",
  className = "",
  children,
}: {
  as?: "div" | "section";
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`${className} ${seen ? "in" : ""}`}>
      {children}
    </Tag>
  );
}
