import { palette } from "@/lib/mosaic";

// Square mosaic in the hero's style (blues, yellows, greens, white gaps), used as the favicon, Apple icon and social card mark.
const MARK = [
  "yyyyb.gg",
  "oonbb.gg",
  "nnnnbddg",
  "bbbnnndg",
  "bb.bnngg",
  "gg..bbn.",
  "ggdd.bbb",
  "gddd..bb",
];

export function MosaicMark({ size, radius }: { size: number; radius: number }) {
  const cell = size / MARK.length;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        background: "#fff",
      }}
    >
      {MARK.map((row, y) => (
        <div key={y} style={{ display: "flex", height: cell }}>
          {row.split("").map((c, x) => (
            <div key={x} style={{ width: cell, height: cell, background: palette[c] ?? "#fff" }} />
          ))}
        </div>
      ))}
    </div>
  );
}
