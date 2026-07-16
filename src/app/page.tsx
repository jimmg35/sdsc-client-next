'use client';

import { defaultLocale, locales } from '@/i18n/routing';
import { useEffect } from 'react';

const STORAGE_KEY = 'sdsc.locale';

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
    // Exact match (e.g. "zh-TW").
    const exact = (locales as readonly string[]).find(
      (locale) => locale.toLowerCase() === candidate.toLowerCase()
    );
    if (exact) return exact;
    // Base-language match (e.g. "es-MX" -> "es", "fr-CA" -> "fr").
    const base = candidate.split('-')[0].toLowerCase();
    const byBase = (locales as readonly string[]).find(
      (locale) => locale.split('-')[0].toLowerCase() === base
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
