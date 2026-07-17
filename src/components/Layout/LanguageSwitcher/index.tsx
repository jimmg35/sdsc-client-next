'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { type Locale } from '@/i18n/routing';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

const STORAGE_KEY = 'sdsc.locale';

type LanguageOption = {
  locale: Locale;
  autonym: string;
  code: string;
};

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { locale: 'en', autonym: 'English', code: 'EN' },
  { locale: 'zh-TW', autonym: '繁體中文', code: 'ZH-TW' },
  { locale: 'zh-CN', autonym: '简体中文', code: 'ZH-CN' },
  { locale: 'es', autonym: 'Español', code: 'ES' },
  { locale: 'fr', autonym: 'Français', code: 'FR' }
];

type LanguageSwitcherProps = {
  variant?: 'desktop' | 'mobile';
};

export default function LanguageSwitcher({
  variant = 'desktop'
}: LanguageSwitcherProps) {
  const t = useTranslations('languageSwitcher');
  const activeLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeOption =
    LANGUAGE_OPTIONS.find((option) => option.locale === activeLocale) ??
    LANGUAGE_OPTIONS[0];

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (nextLocale: Locale) => {
    setIsOpen(false);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, nextLocale);
    }

    if (nextLocale === activeLocale) {
      return;
    }

    // Switching locale is a soft navigation between two pre-rendered trees, so
    // the reader stays where they were: `scroll: false` suppresses the App
    // Router's scroll-to-top, and the current query string is carried over so
    // paginated views (e.g. /publications?page=3) do not reset underneath the
    // restored scroll offset. Read from window rather than useSearchParams,
    // which would force a Suspense boundary around the navbar on every page.
    const search = typeof window === 'undefined' ? '' : window.location.search;

    // `pathname` is locale-less; next-intl re-adds the target locale prefix.
    router.replace(`${pathname}${search}`, {
      locale: nextLocale,
      scroll: false
    });
  };

  const isMobile = variant === 'mobile';

  return (
    <div ref={containerRef} className={`relative ${isMobile ? 'w-full' : ''}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={t('aria')}
        className={`inline-flex shrink-0 cursor-pointer items-center rounded-full border font-semibold transition ${
          isMobile
            ? 'w-full justify-between gap-2 border-rose-200/70 bg-surface/85 px-4 py-3 text-sm text-rose-600 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 dark:bg-silk-200/85'
            : 'gap-1.5 border-rose-200/70 bg-surface/85 px-2.5 py-2 text-[0.68rem] uppercase tracking-[0.1em] text-rose-600 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 dark:bg-silk-200/85'
        }`}
      >
        <span className="inline-flex items-center gap-1.5">
          <Globe size={isMobile ? 18 : 14} />
          {/* Desktop shows the short code so the navbar width stays constant
              across locales; the full autonym only needs to fit the dropdown. */}
          <span>{isMobile ? activeOption.autonym : activeOption.code}</span>
        </span>
        <ChevronDown
          size={isMobile ? 18 : 13}
          className={`transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label={t('label')}
          className={`absolute z-50 overflow-hidden rounded-2xl border border-rose-200/70 bg-surface/95 p-1.5 dark:bg-silk-100/95 shadow-[0_28px_60px_-32px_rgba(61,47,39,0.5)] ring-1 ring-black/5 backdrop-blur-xl dark:ring-white/5 ${
            isMobile ? 'left-0 right-0 mt-2' : 'right-0 mt-2 min-w-[13rem]'
          }`}
        >
          {LANGUAGE_OPTIONS.map((option) => {
            const isActive = option.locale === activeLocale;
            return (
              <li key={option.locale} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  onClick={() => handleSelect(option.locale)}
                  className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                    isActive
                      ? 'bg-rose-100/90 text-rose-700'
                      : 'text-ink-700 hover:bg-rose-50 hover:text-rose-700'
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <span>{option.autonym}</span>
                    <span className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-rose-400">
                      {option.code}
                    </span>
                  </span>
                  {isActive && <Check size={15} className="text-rose-600" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
