'use client';

import { ArrowUpRight, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Retiring the notice is taking it out of the navbar. A new one gets a new id,
// so a reader who closed this one still sees the next.
const NOTICE_ID = 'mgwr-3-0';
const NOTICE_HREF = '/mgwr';
const DISMISSED_KEY = `sdsc:notice-dismissed:${NOTICE_ID}`;

export default function NavNotice() {
  const t = useTranslations('navNotice');
  const pathname = usePathname();
  // Closed until mounted: a static page cannot know whether this reader has
  // dismissed it, and opening a beat late doubles as its entrance.
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      setIsOpen(window.localStorage.getItem(DISMISSED_KEY) !== '1');
    } catch {
      setIsOpen(true);
    }
  }, []);

  const dismiss = () => {
    setIsOpen(false);
    try {
      window.localStorage.setItem(DISMISSED_KEY, '1');
    } catch {
      // Storage blocked: it stays closed for this visit only.
    }
  };

  // Nothing to point at from the post it points to.
  if (!isOpen || pathname.startsWith(NOTICE_HREF)) {
    return null;
  }

  return (
    <div className="flex justify-center px-3">
      <div className="notice-glass pointer-events-auto mt-2 flex max-w-full items-center rounded-full border border-white/60 bg-surface/60 shadow-lift-sm backdrop-blur-xl backdrop-saturate-150 dark:border-white/10 dark:bg-accent-100/60">
        <Link
          href={NOTICE_HREF}
          className="group flex min-w-0 items-center gap-2.5 py-1.5 pl-3.5 pr-2 sm:gap-3"
        >
          <span aria-hidden className="notice-dot" />
          <span className="hidden text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-accent-700 sm:inline">
            {t('eyebrow')}
          </span>
          <span
            aria-hidden
            className="hidden h-3 w-px bg-accent-600/35 sm:block"
          />
          <span className="truncate text-[0.78rem] font-medium text-ink-900 transition-colors duration-300 group-hover:text-primary-600">
            {t('message')}
          </span>
          <ArrowUpRight
            size={14}
            aria-hidden
            className="shrink-0 text-primary-600 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </Link>

        <button
          type="button"
          onClick={dismiss}
          aria-label={t('dismiss')}
          className="mr-1.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-ink-500 transition hover:bg-ink-900/5 hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-400"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
}
