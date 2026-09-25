'use client';

import { setThemePreference } from '@/lib/theme';
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
    setThemePreference(
      document.documentElement.classList.contains('dark') ? 'light' : 'dark'
    );
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t('aria')}
      title={t('aria')}
      className={`inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border border-primary-200/70 bg-surface/85 text-primary-600 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 dark:bg-accent-200/85 ${
        isMobile ? 'h-11 w-11' : 'h-9 w-9'
      }`}
    >
      <Sun size={isMobile ? 18 : 16} className="dark:hidden" />
      <Moon size={isMobile ? 18 : 16} className="hidden dark:block" />
    </button>
  );
}
