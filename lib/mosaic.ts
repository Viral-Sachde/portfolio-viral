// Shared pixel palette and the hero's mosaic maps: each char is one cell, "." is empty.
export const palette: Record<string, string> = {
  b: "#0A84FF",
  n: "#1C3AA9",
  g: "#34C759",
  d: "#1A7F37",
  y: "#FFD60A",
  o: "#F2B705",
};

export const CORNER = [
  "yyyyyyyybbbbb",
  "oooooonbbbbbb",
  "oooooonbbbbbb",
  "nnnnnnnnnbbbb",
  "nnnnnnnnnbbbb",
  "bbbbbbnnnbbbb",
  "bbbbbbbnnnngg",
  "bbbbbbbbnnnng",
  "bbbbbbb.ddddd",
  "bbbbbbb..dddd",
];

export const EDGE = [
  "bbbb.nbb",
  "bbbbbnnb",
  "nbbbbnnn",
  "nbbbboyy",
  "nnbbboyy",
  "nnnbbyyy",
  "gnnbbyyy",
  "ggnnnyyy",
  "gggdddyy",
  "ggggddgg",
  "dggggddd",
  "ddggdddd",
  "gggggggd",
  ".gggggdd",
];

export const GROUND = [
  ".bbbb..n...........g",
  ".bbbbnnnggggbbbb..gg",
  ".bbbbbnngggggbbdddd.",
  "bbbbggoyygggbbbbdddg",
  "nbbbggoyygggggbbbggg",
];
