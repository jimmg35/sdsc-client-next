import type { SVGProps } from 'react';

type FlagIconProps = Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> & {
  /** Rendered height in px; width follows the flag. Sharpest at 13 or 26. */
  height?: number;
};

/* Flags are artwork, not UI colour: they keep their official colours in every
   palette and theme, so these deliberately bypass theme.css. */
const OLD_GLORY_RED = '#b22234';
const OLD_GLORY_BLUE = '#3c3b6e';
const FLORIDA_RED = '#c8102e';
const SEAL_GOLD = '#d9a93a';
const SEAL_SKY = '#7fb3e0';
const SEAL_SUN = '#f2a900';
const SEAL_LAND = '#4f8a3c';

/* Both flags are drawn on the pixel grid they display at, 13px tall, so every
   edge lands on a whole pixel. Drawn to true proportions instead, the stars
   and stripes fall between pixels and blur into a pink smear at this size. */

/* 13 stripes of exactly one pixel each, under a 10x7 canton. Fifty stars
   cannot fit in 70 pixels, so the canton carries a staggered field of
   single-pixel stars, the way small flag icons have always drawn it. */
const US_STRIPES = Array.from(
  { length: 7 },
  (_, i) => `M0 ${i * 2}h25v1H0Z`
).join('');

const US_STARS = Array.from({ length: 5 }, (_, i) => {
  const row = i + 1;
  return Array.from(
    { length: 4 },
    (_, j) => `M${(row % 2 ? 1 : 2) + j * 2} ${row}h1v1h-1Z`
  ).join('');
}).join('');

export const UsFlagIcon = ({ height = 13, ...props }: FlagIconProps) => (
  <svg
    viewBox="0 0 25 13"
    width={(height * 25) / 13}
    height={height}
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <rect width="25" height="13" fill="#ffffff" />
    <path d={US_STRIPES} fill={OLD_GLORY_RED} />
    <rect width="10" height="7" fill={OLD_GLORY_BLUE} />
    <path d={US_STARS} fill="#ffffff" />
  </svg>
);

/* A red saltire on white with the state seal at the crossing, on a 20x13
   grid. The seal is reduced to what survives at icon size: a gold disc
   around the sun setting between sky and land, the horizon on a pixel row. */
export const FloridaFlagIcon = ({ height = 13, ...props }: FlagIconProps) => (
  <svg
    viewBox="0 0 20 13"
    width={(height * 20) / 13}
    height={height}
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    <rect width="20" height="13" fill="#ffffff" />
    <path
      d="M-2-1.3 22 14.3M22-1.3-2 14.3"
      stroke={FLORIDA_RED}
      strokeWidth="2"
    />
    <circle cx="10" cy="6.5" r="3.3" fill={SEAL_GOLD} />
    <path d="M7.86 7a2.2 2.2 0 1 1 4.28 0Z" fill={SEAL_SKY} />
    <circle cx="10" cy="7" r="1" fill={SEAL_SUN} />
    <path d="M7.86 7a2.2 2.2 0 0 0 4.28 0Z" fill={SEAL_LAND} />
  </svg>
);
