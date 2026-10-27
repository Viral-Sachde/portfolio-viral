// Pixel mosaics drawn from character maps: each char is one cell, "." is empty.
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

export default function Mosaic({
  map,
  className,
}: {
  map: string[];
  className?: string;
}) {
  const width = Math.max(...map.map((row) => row.length));
  const rects: React.JSX.Element[] = [];

  // Merge horizontal runs of the same color so scaled edges stay seamless.
  map.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x];
      let end = x + 1;
      while (row[end] === c) end++;
      if (palette[c]) {
        rects.push(
          <rect key={`${x}-${y}`} x={x} y={y} width={end - x} height={1.02} fill={palette[c]} />
        );
      }
      x = end;
    }
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${map.length}`}
      shapeRendering="crispEdges"
      aria-hidden
      className={className}
    >
      {rects}
    </svg>
  );
}
