import { mulberry32 } from "@/lib/random";
import { palette } from "./Mosaic";

const COLS = 16;
const ROWS = 9;
const tones = [palette.b, palette.n, palette.g, palette.d, palette.y, palette.o];

// Generative pixel cover: a rising skyline of blocks over a soft tint, unique per seed.
export default function Cover({ seed, className }: { seed: number; className?: string }) {
  const rand = mulberry32(seed);
  const base = Math.floor(rand() * tones.length);
  const rects: React.JSX.Element[] = [];
  let h = 5 + Math.floor(rand() * 2);

  for (let x = 0; x < COLS; x++) {
    h = Math.min(ROWS - 1, Math.max(3, h + Math.round(rand() * 2.4 - 1.2)));
    for (let y = ROWS - h; y < ROWS; y++) {
      const t = rand();
      const tone = t < 0.55 ? base : t < 0.8 ? (base + 1) % tones.length : (base + 4) % tones.length;
      rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={tones[tone]} />);
    }
  }

  return (
    <svg
      viewBox={`0 0 ${COLS} ${ROWS}`}
      preserveAspectRatio="xMidYMax slice"
      shapeRendering="crispEdges"
      aria-hidden
      className={className}
    >
      <rect width={COLS} height={ROWS} fill={tones[base]} opacity={0.12} />
      {rects}
    </svg>
  );
}
