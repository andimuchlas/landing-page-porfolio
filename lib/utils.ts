export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

export const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

/** Map a section progress `p` into a local sub-range [from, to] of it. */
export const range01 = (p: number, from: number, to: number) =>
  clamp01((p - from) / (to - from));

/**
 * Split a continuous progress into `count` segments with eased transitions.
 * Returns the active index and a 0..1 blend factor toward the next one.
 */
export function segment(p: number, count: number) {
  const g = clamp01(p) * (count - 1);
  let idx = Math.floor(g);
  if (idx > count - 2 && count > 1) idx = count - 2;
  const raw = clamp01(g - idx);
  return { idx, frac: easeInOut(raw), raw };
}

/**
 * Continuous progress with plateaus: holds at each integer step for the
 * first half of every unit interval, transitions smoothly in the second.
 */
export function plateau(p: number, steps: number) {
  const g = clamp01(p) * (steps - 1);
  const base = Math.floor(g);
  const f = g - base;
  return base + (f <= 0.5 ? 0 : smoothstep(0, 1, (f - 0.5) / 0.5));
}

/* ---------- deterministic value noise (for terrain etc.) ---------- */

function hash2(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return s - Math.floor(s);
}

function valueNoise(x: number, y: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash2(xi, yi);
  const b = hash2(xi + 1, yi);
  const c = hash2(xi, yi + 1);
  const d = hash2(xi + 1, yi + 1);
  return lerp(lerp(a, b, u), lerp(c, d, u), v);
}

export function fbm(x: number, y: number, octaves = 4) {
  let amp = 0.5;
  let freq = 1;
  let sum = 0;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum += amp * valueNoise(x * freq, y * freq);
    norm += amp;
    amp *= 0.5;
    freq *= 2.07;
  }
  return sum / norm;
}

/* ---------- text → point cloud sampling ---------- */

/**
 * Renders `text` offscreen and samples up to `count` pixel positions,
 * returned as a Float32Array of xyz world coordinates centered on origin.
 */
export function sampleTextPoints(
  text: string,
  count: number,
  worldWidth = 11
): Float32Array {
  const W = 1400;
  const H = 360;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  const out = new Float32Array(count * 3);
  if (!ctx) return out;

  ctx.fillStyle = "#fff";
  // System stack on purpose: sampling must not depend on webfont readiness.
  ctx.font = "900 230px 'Arial Black', Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text.toUpperCase(), W / 2, H / 2 + 8);

  const data = ctx.getImageData(0, 0, W, H).data;

  const pts: number[] = [];
  for (let y = 0; y < H; y += 2) {
    for (let x = 0; x < W; x += 2) {
      if (data[(y * W + x) * 4 + 3] > 140) {
        pts.push(x, y);
      }
    }
  }

  if (pts.length === 0) return out;

  const total = pts.length / 2;
  const scale = worldWidth / W;
  for (let i = 0; i < count; i++) {
    const j = (Math.floor(hashRandom(i) * total) % total) * 2;
    out[i * 3] = (pts[j] - W / 2) * scale;
    out[i * 3 + 1] = -(pts[j + 1] - H / 2) * scale;
    out[i * 3 + 2] = (hashRandom(i * 7 + 1) - 0.5) * 0.6;
  }
  return out;
}

function hashRandom(i: number) {
  const s = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return s - Math.floor(s);
}
