import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'zh-TW', 'zh-CN', 'es', 'fr'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const routing = defineRouting({
  locales,
  defaultLocale,
  // No middleware runs in a static export (`output: 'export'`), so every
  // locale must carry an explicit prefix (there is nothing to rewrite `/`).
  localePrefix: 'always'
});
