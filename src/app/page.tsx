'use client';

import { defaultLocale, locales } from '@/i18n/routing';
import { useEffect } from 'react';

const STORAGE_KEY = 'sdsc.locale';

// Chinese cannot be matched on the base subtag alone: `zh-Hans` and `zh-TW`
// share it, so a base match would send every Chinese reader to whichever zh
// locale happens to come first in `locales`. The script is either explicit
// (zh-Hans / zh-Hant) or implied by the region.
const HANT_REGIONS = new Set(['tw', 'hk', 'mo']);
const HANS_REGIONS = new Set(['cn', 'sg', 'my']);

function resolveChinese(subtags: string[]): string | null {
  if (subtags[0] !== 'zh') return null;
  if (subtags.includes('hant')) return 'zh-TW';
  if (subtags.includes('hans')) return 'zh-CN';
  for (const subtag of subtags.slice(1)) {
    if (HANT_REGIONS.has(subtag)) return 'zh-TW';
    if (HANS_REGIONS.has(subtag)) return 'zh-CN';
  }
  // A bare `zh` is ambiguous; Simplified is the conventional reading.
  return 'zh-CN';
}

function resolvePreferredLocale(): string {
  if (typeof window === 'undefined') {
    return defaultLocale;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored && (locales as readonly string[]).includes(stored)) {
    return stored;
  }

  const candidates = window.navigator.languages?.length
    ? window.navigator.languages
    : [window.navigator.language];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const subtags = candidate.toLowerCase().split('-');

    const chinese = resolveChinese(subtags);
    if (chinese) return chinese;

    // Exact match (e.g. "fr").
    const exact = (locales as readonly string[]).find(
      (locale) => locale.toLowerCase() === candidate.toLowerCase()
    );
    if (exact) return exact;
    // Base-language match (e.g. "es-MX" -> "es", "fr-CA" -> "fr").
    const byBase = (locales as readonly string[]).find(
      (locale) => locale.split('-')[0].toLowerCase() === subtags[0]
    );
    if (byBase) return byBase;
  }

  return defaultLocale;
}

export default function RootRedirectPage() {
  useEffect(() => {
    const locale = resolvePreferredLocale();
    window.location.replace(`/${locale}/`);
  }, []);

  return (
    <main
      style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
        color: '#663d60'
      }}
    >
      <noscript>
        <a href={`/${defaultLocale}/`}>Enter the Spatial Data Science Center</a>
      </noscript>
    </main>
  );
}
