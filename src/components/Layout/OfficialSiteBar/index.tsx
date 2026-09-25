'use client';

import { FloridaFlagIcon, UsFlagIcon } from '@/components/Utility/FlagIcon';
import { ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

// The hairline keeps Florida's white field from dissolving into the bar.
const FLAG_CLASS = 'shrink-0 rounded-[1px] ring-1 ring-ink-900/15';

export default function OfficialSiteBar() {
  const t = useTranslations('officialBar');

  return (
    <div className="border-b border-primary-100/70 bg-accent-50/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-1.5 text-[0.68rem] text-ink-700 md:px-6">
        <p className="flex min-w-0 items-center gap-2 font-medium">
          <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-primary-200/80 bg-surface/80 text-primary-600 dark:bg-accent-200/80">
            <ShieldCheck size={12} />
          </span>
          <span className="truncate sm:hidden">{t('shortLabel')}</span>
          <span className="hidden truncate sm:inline">{t('fullLabel')}</span>
        </p>
        <span className="flex shrink-0 items-center gap-2.5">
          <span className="flex items-center gap-1.5">
            <UsFlagIcon height={13} className={FLAG_CLASS} />
            <FloridaFlagIcon height={13} className={FLAG_CLASS} />
          </span>
          <span className="hidden text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-primary-500 sm:inline">
            {t('university')}
          </span>
        </span>
      </div>
    </div>
  );
}
