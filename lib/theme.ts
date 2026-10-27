// Colour themes for the site. Each sets the six palette variables Tailwind and the mosaics read.
export type Tones = { b: string; n: string; g: string; d: string; y: string; o: string };
export type Theme = { preset: string } | { custom: { b: string; g: string; y: string } };
export type Mode = "auto" | "light" | "dark";

export const PRESETS: { key: string; label: string; tones: Tones }[] = [
  { key: "classic", label: "Classic", tones: { b: "#0071E3", n: "#1C3AA9", g: "#34C759", d: "#1A7F37", y: "#FFD60A", o: "#F2B705" } },
  { key: "sunset", label: "Sunset", tones: { b: "#FF5E5B", n: "#B23A48", g: "#FF9F1C", d: "#D9480F", y: "#FFD166", o: "#F4A261" } },
  { key: "forest", label: "Forest", tones: { b: "#2D6A4F", n: "#1B4332", g: "#52B788", d: "#40916C", y: "#E9C46A", o: "#D4A373" } },
  { key: "grape", label: "Grape", tones: { b: "#7C3AED", n: "#4C1D95", g: "#EC4899", d: "#BE185D", y: "#FBBF24", o: "#F59E0B" } },
  { key: "mono", label: "Mono", tones: { b: "#3A3A3C", n: "#1C1C1E", g: "#8E8E93", d: "#636366", y: "#D1D1D6", o: "#AEAEB2" } },
];

// Okabe-Ito based tones: stay distinguishable for protanopia, deuteranopia and tritanopia.
export const COLOUR_BLIND_TONES: Tones = { b: "#0072B2", n: "#004B7A", g: "#E69F00", d: "#B35C00", y: "#F0E442", o: "#C9B800" };

const VARS: Record<keyof Tones, string> = {
  b: "--color-blue",
  n: "--color-blue-deep",
  g: "--color-green",
  d: "--color-green-deep",
  y: "--color-yellow",
  o: "--color-yellow-deep",
};

const darken = (c: string, amount: number) => `color-mix(in oklab, ${c} ${100 - amount}%, black)`;

export function tonesFor(theme: Theme): Tones {
  if ("custom" in theme) {
    const { b, g, y } = theme.custom;
    return { b, n: darken(b, 30), g, d: darken(g, 25), y, o: darken(y, 12) };
  }
  return (PRESETS.find((p) => p.key === theme.preset) ?? PRESETS[0]).tones;
}

export function applyTheme(theme: Theme, colourBlind = false) {
  const tones = colourBlind ? COLOUR_BLIND_TONES : tonesFor(theme);
  const root = document.documentElement.style;
  (Object.keys(VARS) as (keyof Tones)[]).forEach((k) => root.setProperty(VARS[k], tones[k]));
}

export function applyMode(mode: Mode) {
  if (mode === "auto") delete document.documentElement.dataset.mode;
  else document.documentElement.dataset.mode = mode;
}

// Accessibility switches live on <html> as data attributes the CSS reads.
export function applyFlag(name: "contrast" | "motion", value: string | null) {
  if (value === null) delete document.documentElement.dataset[name];
  else document.documentElement.dataset[name] = value;
}

export const motionReduced = () =>
  document.documentElement.dataset.motion === "reduce" ||
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
