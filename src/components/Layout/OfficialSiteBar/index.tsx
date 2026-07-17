'use client';

import { ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function OfficialSiteBar() {
  const t = useTranslations('officialBar');

  return (
    <div className="border-b border-rose-100/70 bg-silk-50/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-1.5 text-[0.68rem] text-ink-700 md:px-6">
        <p className="flex min-w-0 items-center gap-2 font-medium">
          <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-rose-200/80 bg-surface/80 text-rose-600 dark:bg-silk-200/80">
            <ShieldCheck size={12} />
          </span>
          <span className="truncate sm:hidden">{t('shortLabel')}</span>
          <span className="hidden truncate sm:inline">{t('fullLabel')}</span>
        </p>
        <span className="hidden text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-rose-500 sm:inline">
          {t('university')}
        </span>
      </div>
    </div>
  );
}
