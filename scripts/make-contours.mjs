// Generates public/img/contours/hero-contours.svg, the topographic contour
// lines over the home hero and behind picture-less stories.
// d3-contour is not a project dependency; run it with:
//   npm i --no-save d3-contour@4.0.2
//   node scripts/make-contours.mjs public/img/contours/hero-contours.svg 7
// The second argument is the noise seed; change it for a different terrain.
import { contours } from 'd3-contour';
import { writeFileSync } from 'node:fs';

const out = process.argv[2];
let seed = Number(process.argv[3] ?? 7);

// Visible frame 1600x900, sampled every 10px; the grid runs 3 cells past every
// edge so d3-contour's boundary-closing segments fall outside the viewBox.
const VIEW_W = 1600, VIEW_H = 900, CELL = 10, PAD = 3;
const GW = VIEW_W / CELL + PAD * 2 + 1;
const GH = VIEW_H / CELL + PAD * 2 + 1;

const rand = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

// Value noise on a lattice, smoothly interpolated, summed over octaves.
const LATTICE = 64;
const lattice = Array.from({ length: LATTICE * LATTICE }, rand);
const at = (i, j) => lattice[((j % LATTICE + LATTICE) % LATTICE) * LATTICE + ((i % LATTICE + LATTICE) % LATTICE)];
const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
const noise = (x, y) => {
  const i = Math.floor(x), j = Math.floor(y);
  const u = fade(x - i), v = fade(y - j);
  const a = at(i, j), b = at(i + 1, j), c = at(i, j + 1), d = at(i + 1, j + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
};
const fbm = (x, y) => {
  let sum = 0, amp = 1, freq = 1, norm = 0;
  for (let o = 0; o < 5; o++) {
    sum += amp * noise(x * freq, y * freq);
    norm += amp; amp *= 0.5; freq *= 2.03;
  }
  return sum / norm;
};

// Landforms in visible-frame fractions: the main summit sits where the old
// rings were centred (68% 50%), over the heatmap in the artwork.
const hills = [
  { x: 0.68, y: 0.5, r: 0.26, h: 1.0 },
  { x: 0.9, y: 0.16, r: 0.14, h: 0.45 },
  { x: 0.42, y: 0.82, r: 0.18, h: 0.5 },
  { x: 0.16, y: 0.3, r: 0.2, h: -0.35 }
];

const values = new Float64Array(GW * GH);
for (let j = 0; j < GH; j++) {
  for (let i = 0; i < GW; i++) {
    const fx = ((i - PAD) * CELL) / VIEW_W;
    const fy = ((j - PAD) * CELL) / VIEW_H;
    let z = 0;
    for (const h of hills) {
      const dx = fx - h.x, dy = (fy - h.y) * (VIEW_H / VIEW_W);
      z += h.h * Math.exp(-(dx * dx + dy * dy) / (2 * h.r * h.r * 0.36));
    }
    z += 0.55 * (fbm(fx * 3.2, fy * 1.8) - 0.5);
    values[j * GW + i] = z;
  }
}

let min = Infinity, max = -Infinity;
for (const v of values) { if (v < min) min = v; if (v > max) max = v; }
const LEVELS = 24;
const step = (max - min) / (LEVELS + 1);
const thresholds = Array.from({ length: LEVELS }, (_, k) => min + step * (k + 1));

// Chaikin corner cutting, closed ring.
const smooth = (ring, passes = 2) => {
  let pts = ring.slice(0, -1);
  for (let p = 0; p < passes; p++) {
    const next = [];
    for (let k = 0; k < pts.length; k++) {
      const [x0, y0] = pts[k], [x1, y1] = pts[(k + 1) % pts.length];
      next.push([0.75 * x0 + 0.25 * x1, 0.75 * y0 + 0.25 * y1]);
      next.push([0.25 * x0 + 0.75 * x1, 0.25 * y0 + 0.75 * y1]);
    }
    pts = next;
  }
  return pts;
};

// Integer coordinates, consecutive duplicates and near-collinear points dropped.
const toPath = (ring) => {
  const raw = smooth(ring, 1).map(([x, y]) => [
    Math.round((x - PAD) * CELL),
    Math.round((y - PAD) * CELL)
  ]);
  const pts = [];
  for (const p of raw) {
    const q = pts[pts.length - 1];
    if (q && Math.abs(q[0] - p[0]) + Math.abs(q[1] - p[1]) < 4) continue;
    if (pts.length >= 2) {
      const o = pts[pts.length - 2];
      const cross = (q[0] - o[0]) * (p[1] - o[1]) - (q[1] - o[1]) * (p[0] - o[0]);
      if (Math.abs(cross) < 6) pts.pop();
    }
    pts.push(p);
  }
  if (pts.length < 4) return '';
  // Relative moves after the first point keep the numbers short.
  let d = `M${pts[0][0]} ${pts[0][1]}l`;
  for (let k = 1; k < pts.length; k++) {
    const dx = pts[k][0] - pts[k - 1][0], dy = pts[k][1] - pts[k - 1][1];
    d += `${dx}${dy < 0 ? '' : ' '}${dy}`.replace(/^(\d)/, k > 1 ? ' $1' : '$1');
  }
  return d + 'z';
};

const generator = contours().size([GW, GH]).thresholds(thresholds);
const minor = [], index = [];
generator(values).forEach((geometry, k) => {
  const d = geometry.coordinates
    .flat()
    .filter((ring) => ring.length > 8)
    .map(toPath)
    .join('');
  if (!d) return;
  ((k + 1) % 5 === 0 ? index : minor).push(d);
});

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEW_W} ${VIEW_H}" preserveAspectRatio="xMidYMid slice" fill="none" stroke="#fff" stroke-linejoin="round"><path stroke-opacity=".12" stroke-width="1" vector-effect="non-scaling-stroke" d="${minor.join('')}"/><path stroke-opacity=".24" stroke-width="1.5" vector-effect="non-scaling-stroke" d="${index.join('')}"/></svg>\n`;
writeFileSync(out, svg);
console.log(`${out}: ${(svg.length / 1024).toFixed(1)} KB, ${minor.length} minor + ${index.length} index levels`);
