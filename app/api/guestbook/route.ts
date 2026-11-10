// Pixel guestbook: each visitor leaves one 5×5 drawing in the site palette. Stored in Upstash
// Redis over REST when the Vercel Upstash integration is connected (KV_REST_API_* or
// UPSTASH_REDIS_REST_*). Without it the route says `shared: false` and the page keeps the
// visitor's own mark in their browser. Drawings are 25 palette letters, so nothing else gets in.
const URL_ = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
const KEY = "guestbook:v1";
// Unique visitors to the homepage, as a HyperLogLog: a tiny fixed size however many people come.
const VISITORS = "guestbook:v1:visitors";
const SHOWN = 300;
const PER_MINUTE = 10;
const PIXELS = /^[bngdyo.]{25}$/;

export type Mark = { id: string; p: string; t: number };

async function redis(commands: (string | number)[][]): Promise<unknown[]> {
  const res = await fetch(`${URL_}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(commands),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`redis ${res.status}`);
  return ((await res.json()) as { result?: unknown }[]).map((r) => r.result);
}

// HGETALL returns [id, json, id, json, …]. Newest first; ids are hashed so they never leave the server.
function toMarks(hash: unknown): Mark[] {
  const marks: Mark[] = [];
  if (!Array.isArray(hash)) return marks;
  for (let i = 0; i < hash.length; i += 2) {
    try {
      const { p, t } = JSON.parse(String(hash[i + 1]));
      if (PIXELS.test(p)) marks.push({ id: String(hash[i]), p, t: Number(t) || 0 });
    } catch {}
  }
  return marks.sort((a, b) => b.t - a.t).slice(0, SHOWN);
}

async function hashId(id: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`guestbook:${id}`));
  return Array.from(new Uint8Array(bytes).slice(0, 8), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function GET(request: Request) {
  if (!URL_ || !TOKEN) return Response.json({ shared: false });
  const v = new URL(request.url).searchParams.get("v");
  const count: (string | number)[][] = [["PFCOUNT", VISITORS]];
  if (v && /^[a-z0-9-]{8,64}$/.test(v)) count.unshift(["PFADD", VISITORS, await hashId(v)]);
  try {
    const replies = await redis([["HGETALL", KEY], ["HLEN", KEY], ...count]);
    const [hash, total] = replies;
    return Response.json({ shared: true, marks: toMarks(hash), total: Number(total) || 0, visitors: Number(replies.at(-1)) || 0 });
  } catch {
    return Response.json({ shared: false }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (!URL_ || !TOKEN) return Response.json({ shared: false });
  let body: { id?: unknown; p?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad json" }, { status: 400 });
  }
  const { id, p } = body;
  if (typeof id !== "string" || !/^[a-z0-9-]{8,64}$/.test(id) || typeof p !== "string" || !PIXELS.test(p) || !/[^.]/.test(p)) {
    return Response.json({ error: "bad mark" }, { status: 400 });
  }
  const ip = (request.headers.get("x-forwarded-for") ?? "anon").split(",")[0].trim();
  const bucket = `guestbook:v1:rl:${ip}:${Math.floor(Date.now() / 60000)}`;
  try {
    const [count] = await redis([["INCR", bucket], ["EXPIRE", bucket, 90]]);
    if (Number(count) > PER_MINUTE) return Response.json({ error: "slow down" }, { status: 429 });
    const key = await hashId(id);
    const [, hash, total] = await redis([
      ["HSET", KEY, key, JSON.stringify({ p, t: Date.now() })],
      ["HGETALL", KEY],
      ["HLEN", KEY],
    ]);
    return Response.json({ shared: true, marks: toMarks(hash), total: Number(total) || 0, you: key });
  } catch {
    return Response.json({ error: "store unavailable" }, { status: 503 });
  }
}
