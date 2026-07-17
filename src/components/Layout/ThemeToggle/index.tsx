'use client';

import { THEME_STORAGE_KEY } from '@/lib/theme';
import { Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';

type ThemeToggleProps = {
  variant?: 'desktop' | 'mobile';
};

export default function ThemeToggle({ variant = 'desktop' }: ThemeToggleProps) {
  const t = useTranslations('themeToggle');
  const isMobile = variant === 'mobile';

  // Which icon shows is decided by CSS off the `dark` class, not React state.
  // The class is already set by the blocking script in <head>, so the correct
  // icon paints immediately and there is nothing for hydration to mismatch on.
  const toggle = () => {
    const root = document.documentElement;
    const next = root.classList.contains('dark') ? 'light' : 'dark';

    root.classList.toggle('dark', next === 'dark');

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Private mode / storage disabled: the toggle still works for this page.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t('aria')}
      title={t('aria')}
      className={`inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border border-rose-200/70 bg-surface/85 text-rose-600 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 dark:bg-silk-200/85 ${
        isMobile ? 'h-11 w-11' : 'h-9 w-9'
      }`}
    >
      <Sun size={isMobile ? 18 : 16} className="dark:hidden" />
      <Moon size={isMobile ? 18 : 16} className="hidden dark:block" />
    </button>
  );
}
