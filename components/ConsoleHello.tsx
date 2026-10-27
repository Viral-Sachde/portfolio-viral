"use client";

import { useEffect } from "react";

// A note for visitors curious enough to open devtools.
export default function ConsoleHello() {
  useEffect(() => {
    console.log(
      "%cOh, you're curious too.%c\nThe source lives at github.com/Viral-Sachde. Say hi: vsachde74@gmail.com",
      "font: 600 16px system-ui; color: #0A84FF",
      "font: 13px system-ui; color: #6E6E73"
    );
  }, []);
  return null;
}
