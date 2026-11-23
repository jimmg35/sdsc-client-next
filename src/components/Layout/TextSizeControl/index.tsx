'use client';

import {
  TEXT_SIZE_OPTIONS,
  type TextSize,
  readTextSize,
  setTextSizePreference
} from '@/lib/textSize';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

// Each button's "A" is drawn at the size it picks, so the choice reads at a
// glance without needing the label.
const GLYPH_CLASS: Record<TextSize, string> = {
  small: 'text-[0.75rem]',
  medium: 'text-[0.9rem]',
  large: 'text-[1.05rem]'
};

export default function TextSizeControl() {
  const t = useTranslations('textSize');
  // Unknown until mount: the pick lives on <html>, set by the head script.
  const [size, setSize] = useState<TextSize | null>(null);

  useEffect(() => {
    setSize(readTextSize());
  }, []);

  const choose = (next: TextSize) => {
    setTextSizePreference(next);
    setSize(next);
  };

  return (
    <div
      role="group"
      aria-label={t('label')}
      className="flex shrink-0 items-center gap-0.5"
    >
      <span className="mr-1 hidden font-medium text-ink-700 md:inline">
        {t('label')}
      </span>
      {TEXT_SIZE_OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => choose(option)}
          aria-pressed={size === option}
          aria-label={t('aria', { size: t(option) })}
          title={t(option)}
          className={`inline-flex h-6 min-w-6 cursor-pointer items-center justify-center rounded-full px-1 font-semibold leading-none transition-colors ${
            GLYPH_CLASS[option]
          } ${
            size === option
              ? 'bg-primary-50 text-primary-700 ring-1 ring-primary-300'
              : 'text-ink-700 hover:text-primary-600'
          }`}
        >
          A
        </button>
      ))}
    </div>
  );
}
