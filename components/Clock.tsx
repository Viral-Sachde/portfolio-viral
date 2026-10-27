"use client";

import { useEffect, useState } from "react";

const format = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
});

// Live Ahmedabad time; renders a placeholder until mounted to avoid hydration mismatch.
export default function Clock() {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setNow(format.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const [h, m] = (now ?? "--:--").split(":");
  return (
    <span className="tabular-nums">
      {h}
      <span className="animate-pulse">:</span>
      {m}
    </span>
  );
}
