"use client";

import { useEffect } from "react";

const EMAIL = "vsachde74@gmail.com";
const BLUE = "#0A84FF";
const MUTED = "#6E6E73";
const title = `font: 600 16px system-ui; color: ${BLUE}`;
const body = `font: 13px system-ui; color: ${MUTED}`;
const item = "font: 600 13px system-ui; color: #1A7F37";

type Key = "koffooo" | "whoami" | "projects";
const NAMES: Record<Key, string> = { koffooo: "☕ koffooo bean", whoami: "🧩 puzzle piece", projects: "🔧 wrench" };

// A tiny text adventure for visitors curious enough to open devtools. Collect three items with
// whoami(), projects() and koffooo(), then hire() unlocks the email and a "you found it" badge.
export default function ConsoleHello() {
  useEffect(() => {
    const found = new Set<Key>();
    const w = window as unknown as Record<string, unknown>;

    const say = (text: string, style = body) => console.log(`%c${text}`, style);
    const get = (key: Key) => {
      if (found.has(key)) return say(`You already have the ${NAMES[key]}.`);
      found.add(key);
      console.log(`%c+ ${NAMES[key]}  %c(${found.size}/3)`, item, body);
      if (found.size === 3) say("Your bag feels full. Maybe try hire()…", `${body}; font-style: italic`);
    };

    const commands: Record<string, () => void> = {
      help() {
        say("Console quest", title);
        say(
          [
            "Find three items, then knock on the door.",
            "",
            "  whoami()    who is this guy",
            "  projects()  what he's shipped",
            "  koffooo()   refuel",
            "  bag()       what you're carrying",
            "  hire()      knock on the door",
          ].join("\n")
        );
      },
      whoami() {
        say("Viral Sachde. Forward Deployed / Solutions Engineer, Full Stack + AI, Ahmedabad.");
        say("Reads the source before trusting anything. Ships to prod, logs and all.");
        get("whoami");
      },
      projects() {
        say("Scroll up to Projects for the real list. Short version: products, end to end, used by real people.");
        get("projects");
      },
      koffooo() {
        if (found.has("koffooo")) {
          say("te mara maate coffee kem mangai? ☕", `font: italic 600 14px system-ui; color: ${BLUE}`);
          return;
        }
        say("    ( (\n     ) )\n  ........\n  |      |]\n  \\      /\n   `----'", `font: 12px ui-monospace, monospace; color: ${MUTED}`);
        say("Brewed. Strong, no sugar, slightly too hot. Exactly how code reviews should be.");
        get("koffooo");
      },
      bag() {
        if (!found.size) return say("Empty. Try help().");
        say([...found].map((k) => NAMES[k]).join("   "), item);
      },
      hire() {
        const missing = (Object.keys(NAMES) as Key[]).filter((k) => !found.has(k));
        if (missing.length) {
          say(`The door is locked. You're still missing ${missing.length === 1 ? "one thing" : `${missing.length} things`}. Try help().`);
          return;
        }
        console.log(
          "%c ★ YOU FOUND IT ★ ",
          "font: 700 14px system-ui; color: #000; background: #FFD60A; padding: 6px 10px; border-radius: 6px"
        );
        say("The door creaks open. Behind it, an inbox:", body);
        say(EMAIL, `font: 600 15px system-ui; color: ${BLUE}`);
        say("Say you came from the console. I'll know you're one of us.", body);
      },
    };
    commands.koffee = commands.coffee = commands.koffooo;

    for (const [name, fn] of Object.entries(commands)) w[name] = fn;

    say("Oh, you're curious too.", title);
    say("There's a tiny quest hidden in here. Type help() to start.");

    return () => {
      for (const name of Object.keys(commands)) delete w[name];
    };
  }, []);
  return null;
}
