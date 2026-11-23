/**
 * Builds a complete palette — every variable a block in src/app/theme.css
 * defines — from two seed colours and a neutral tint.
 *
 * Ramps are laid out in OKLCH, where equal steps in lightness look equal, so
 * a palette seeded from teal gets the same rhythm as one seeded from garnet.
 * Each seed replaces the ramp step nearest its own lightness, so the brand
 * colour itself appears in the ramp unaltered. Text steps are then nudged
 * until they clear WCAG AA (4.5:1) on both the surface and the page ground.
 *
 * Used by the dev theme panel to preview a palette live and to print the CSS
 * that pastes into theme.css. The built-in generated palettes there came out
 * of it too.
 */

export type PaletteSeed = {
  primary: string;
  accent: string;
  /** Hue of the neutral (ink) ramp, in degrees. */
  neutralHue: number;
  /** Chroma of the neutral ramp; 0 is pure grey, ~0.02 is noticeably warm/cool. */
  neutralChroma: number;
};

export type PaletteVars = Record<string, string>;

export type GeneratedPalette = { light: PaletteVars; dark: PaletteVars };

type Oklch = { l: number; c: number; h: number };

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
const INK_STEPS = [100, 200, 300, 500, 700, 900] as const;

// Lightness per step. Dark mode runs the other way: the codebase uses the low
// end of every ramp for grounds and the high end for text.
const L_PRIMARY = [0.975, 0.94, 0.88, 0.79, 0.64, 0.53, 0.45, 0.38, 0.31, 0.23];
const L_ACCENT = [0.985, 0.955, 0.91, 0.86, 0.79, 0.7, 0.6, 0.46, 0.35, 0.24];
const L_PRIMARY_DARK = [
  0.2, 0.24, 0.29, 0.35, 0.44, 0.56, 0.73, 0.82, 0.9, 0.96
];
const L_ACCENT_DARK = [
  0.18, 0.21, 0.25, 0.31, 0.4, 0.53, 0.66, 0.79, 0.87, 0.95
];
const L_INK = [0.975, 0.935, 0.86, 0.57, 0.44, 0.26];
const L_INK_DARK = [0.21, 0.25, 0.43, 0.7, 0.86, 0.965];

// Share of the seed's chroma each step keeps: near-white and near-black steps
// are desaturated so tints read as paper and shades as ink, not as neon.
const CHROMA_CURVE = [0.12, 0.25, 0.45, 0.7, 0.95, 1, 1, 0.9, 0.75, 0.55];
// Dark mode's low steps are grounds and panels, where the same saturation
// would read as a coloured wall rather than a tinted dark.
const CHROMA_CURVE_DARK = [
  0.08, 0.12, 0.18, 0.28, 0.45, 0.75, 0.9, 0.85, 0.7, 0.5
];

/* --- colour math -------------------------------------------------------- */

const toLinear = (v: number) =>
  v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
const fromLinear = (v: number) =>
  v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055;

const hexToRgb = (hex: string): [number, number, number] => {
  let h = hex.trim().replace('#', '');
  if (h.length === 3)
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  const n = parseInt(h.slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const rgbToHex = (rgb: [number, number, number]) =>
  '#' +
  rgb
    .map((v) =>
      Math.round(Math.min(255, Math.max(0, v)))
        .toString(16)
        .padStart(2, '0')
    )
    .join('');

const linearToOklab = ([r, g, b]: number[]) => {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  ];
};

const oklabToLinear = ([L, a, b]: number[]) => {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
  ];
};

const hexToOklch = (hex: string): Oklch => {
  const [L, a, b] = linearToOklab(hexToRgb(hex).map((v) => toLinear(v / 255)));
  return {
    l: L,
    c: Math.hypot(a, b),
    h: ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360
  };
};

const oklchToLinear = ({ l, c, h }: Oklch) => {
  const rad = (h * Math.PI) / 180;
  return oklabToLinear([l, c * Math.cos(rad), c * Math.sin(rad)]);
};

const inGamut = (rgb: number[]) =>
  rgb.every((v) => v >= -1e-4 && v <= 1 + 1e-4);

/** Converts to hex, pulling chroma in until the colour fits sRGB. */
const oklchToHex = (color: Oklch) => {
  let { c } = color;
  if (!inGamut(oklchToLinear(color))) {
    let lo = 0;
    let hi = c;
    for (let i = 0; i < 20; i++) {
      const mid = (lo + hi) / 2;
      if (inGamut(oklchToLinear({ ...color, c: mid }))) lo = mid;
      else hi = mid;
    }
    c = lo;
  }
  const rgb = oklchToLinear({ ...color, c }).map(
    (v) => fromLinear(Math.min(1, Math.max(0, v))) * 255
  );
  return rgbToHex(rgb as [number, number, number]);
};

export const relativeLuminance = (hex: string) => {
  const [r, g, b] = hexToRgb(hex).map((v) => toLinear(v / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const contrastRatio = (a: string, b: string) => {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort(
    (x, y) => y - x
  );
  return (hi + 0.05) / (lo + 0.05);
};

const rgba = (hex: string, alpha: number) => {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/* --- ramps -------------------------------------------------------------- */

const buildRamp = (seed: string, lightness: number[], dark: boolean) => {
  const base = hexToOklch(seed);
  const curve = dark ? CHROMA_CURVE_DARK : CHROMA_CURVE;
  const ramp = lightness.map((l, i) =>
    oklchToHex({ l, c: base.c * curve[i], h: base.h })
  );
  if (!dark) {
    // The brand colour itself replaces whichever step it is closest to.
    let nearest = 0;
    lightness.forEach((l, i) => {
      if (Math.abs(l - base.l) < Math.abs(lightness[nearest] - base.l))
        nearest = i;
    });
    ramp[nearest] = seed.toLowerCase();
  }
  return ramp;
};

/**
 * Moves one colour's lightness, darker on a light background or lighter on a
 * dark one, until it reaches `target` contrast against every background.
 */
const ensureContrast = (
  hex: string,
  backgrounds: string[],
  target: number,
  towardDark: boolean
) => {
  const passes = (h: string) =>
    backgrounds.every((bg) => contrastRatio(h, bg) >= target);
  if (passes(hex)) return hex;
  const color = hexToOklch(hex);
  for (let i = 1; i <= 60; i++) {
    const l = color.l + (towardDark ? -0.01 : 0.01) * i;
    if (l <= 0 || l >= 1) break;
    const next = oklchToHex({ ...color, l });
    if (passes(next)) return next;
  }
  return hex;
};

const assignRamp = (vars: PaletteVars, name: string, ramp: string[]) => {
  STEPS.forEach((step, i) => {
    vars[`--color-${name}-${step}`] = ramp[i];
  });
};

const modeVars = (seed: PaletteSeed, dark: boolean): PaletteVars => {
  const vars: PaletteVars = {};
  const p = hexToOklch(seed.primary);
  const a = hexToOklch(seed.accent);
  const n = { h: seed.neutralHue, c: seed.neutralChroma };

  const primary = buildRamp(
    seed.primary,
    dark ? L_PRIMARY_DARK : L_PRIMARY,
    dark
  );
  const accent = buildRamp(seed.accent, dark ? L_ACCENT_DARK : L_ACCENT, dark);
  const ink = (dark ? L_INK_DARK : L_INK).map((l, i) =>
    oklchToHex({ l, c: n.c * (i === 0 || i === 5 ? 0.6 : 1), h: n.h })
  );

  const surface = dark
    ? oklchToHex({ l: 0.245, c: n.c * 0.8, h: n.h })
    : '#ffffff';
  const groundFrom = dark
    ? oklchToHex({ l: 0.185, c: a.c * 0.08, h: a.h })
    : oklchToHex({ l: 0.992, c: a.c * 0.08, h: a.h });
  const groundVia = dark
    ? oklchToHex({ l: 0.2, c: a.c * 0.1, h: a.h })
    : oklchToHex({ l: 0.965, c: a.c * 0.2, h: a.h });
  const groundTo = dark
    ? oklchToHex({ l: 0.215, c: a.c * 0.12, h: a.h })
    : oklchToHex({ l: 0.935, c: a.c * 0.3, h: a.h });
  // accent-50 is the body colour under the gradient; keep it on the ground.
  accent[0] = groundFrom;

  const grounds = [surface, groundFrom];
  const text = (hex: string) => ensureContrast(hex, grounds, 4.5, !dark);
  primary[6] = text(primary[6]);
  primary[7] = text(primary[7]);
  accent[7] = text(accent[7]);
  ink[3] = text(ink[3]);
  ink[4] = text(ink[4]);
  ink[5] = text(ink[5]);

  assignRamp(vars, 'primary', primary);
  assignRamp(vars, 'accent', accent);
  INK_STEPS.forEach((step, i) => {
    vars[`--color-ink-${step}`] = ink[i];
  });

  vars['--color-surface'] = surface;
  vars['--color-shade'] = dark ? '#000000' : ink[5];

  if (!dark) {
    vars['--color-night'] = oklchToHex({
      l: 0.2,
      c: Math.min(p.c, 0.1) * 0.35,
      h: p.h
    });
    vars['--color-night-ink'] = oklchToHex({ l: 0.95, c: a.c * 0.25, h: a.h });
    vars['--color-brand-primary'] = seed.primary.toLowerCase();
    vars['--color-brand-accent'] = seed.accent.toLowerCase();
    vars['--color-scrim'] = vars['--color-night'];
  }

  // A seed that is already light (a pastel primary) needs a stronger wash to
  // register; a deep one would turn the ground muddy at the same strength.
  const primaryWashAlpha = dark
    ? 0.34
    : +(0.1 + 0.3 * Math.max(0, p.l - 0.35)).toFixed(2);
  vars['--wash-accent'] = rgba(
    dark ? accent[6] : seed.accent,
    dark ? 0.12 : 0.32
  );
  vars['--wash-primary'] = rgba(seed.primary, primaryWashAlpha);
  vars['--ground-from'] = groundFrom;
  vars['--ground-via'] = groundVia;
  vars['--ground-to'] = groundTo;

  return vars;
};

export const generatePalette = (seed: PaletteSeed): GeneratedPalette => ({
  light: modeVars(seed, false),
  dark: modeVars(seed, true)
});

/** Pastes into theme.css as-is: a light block and its `.dark` pair. */
export const paletteToCss = (
  name: string,
  palette: GeneratedPalette,
  comment?: string
) => {
  const body = (vars: PaletteVars) =>
    Object.entries(vars)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join('\n');
  const head = comment ? `/* ${comment} */\n` : '';
  return `${head}[data-palette='${name}'] {\n${body(palette.light)}\n}\n\n[data-palette='${name}'].dark {\n${body(palette.dark)}\n}\n`;
};
