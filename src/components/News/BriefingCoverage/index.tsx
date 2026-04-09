'use client';

import { RadioTower } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type BriefingRenderedSegment = {
  anchorSlug?: string;
  html: string;
};

type BriefingStory = {
  slug: string;
  title: string;
  dateLabel: string;
};

type Props = {
  readTime: string;
  segments: BriefingRenderedSegment[];
  months: number;
  stories: BriefingStory[];
};

const flareDurationMs = 2200;
const fontSizeOptions = {
  s: {
    label: 'S',
    proseClass: 'text-[0.98rem] prose-p:text-[0.98rem] prose-li:text-[0.98rem]'
  },
  m: {
    label: 'M',
    proseClass: 'text-[1.06rem] prose-p:text-[1.06rem] prose-li:text-[1.06rem]'
  },
  l: {
    label: 'L',
    proseClass: 'text-[1.16rem] prose-p:text-[1.16rem] prose-li:text-[1.16rem]'
  }
} as const;

type FontSizeOption = keyof typeof fontSizeOptions;

const BriefingCoverage = ({ readTime, segments, months, stories }: Props) => {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<FontSizeOption>('m');
  const clearHighlightTimeoutRef = useRef<number | null>(null);

  const focusStory = (slug: string) => {
    const targetId = `briefing-story-${slug}`;
    const targetElement = document.getElementById(targetId);

    if (!targetElement) {
      return;
    }

    if (clearHighlightTimeoutRef.current) {
      window.clearTimeout(clearHighlightTimeoutRef.current);
    }

    setActiveSlug(null);

    requestAnimationFrame(() => {
      setActiveSlug(slug);
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `#${targetId}`);

      clearHighlightTimeoutRef.current = window.setTimeout(() => {
        setActiveSlug((current) => (current === slug ? null : current));
      }, flareDurationMs);
    });
  };

  useEffect(() => {
    const hash = window.location.hash;

    if (!hash.startsWith('#briefing-story-')) {
      return;
    }

    const slug = hash.replace('#briefing-story-', '');

    if (!slug) {
      return;
    }

    const timer = window.setTimeout(() => {
      focusStory(slug);
    }, 120);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (clearHighlightTimeoutRef.current) {
        window.clearTimeout(clearHighlightTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="mt-12 grid gap-6 lg:items-start lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem]">
      <article className="surface-fade px-6 py-8 md:px-10">
        <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
          <div className="inline-flex rounded-full border border-rose-200/80 bg-white/90 p-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-rose-500 shadow-[0_16px_38px_-30px_rgba(168,110,161,0.22)]">
            {(Object.keys(fontSizeOptions) as FontSizeOption[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFontSize(option)}
                className={`rounded-full px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] transition ${
                  fontSize === option
                    ? 'bg-rose-50 text-rose-700 shadow-sm'
                    : 'text-rose-500 hover:text-rose-700'
                }`}
                aria-label={`Set briefing text size to ${fontSizeOptions[option].label}`}
                aria-pressed={fontSize === option}
              >
                {fontSizeOptions[option].label}
              </button>
            ))}
          </div>
          <div className="inline-flex items-center rounded-full border border-rose-200/80 bg-white/90 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-rose-500 shadow-[0_16px_38px_-30px_rgba(168,110,161,0.18)]">
            {readTime}
          </div>
        </div>

        <div
          className={`prose max-w-none text-justify text-ink-700 prose-headings:text-rose-700 prose-a:text-rose-600 prose-strong:text-ink-900 prose-p:text-justify prose-p:leading-8 prose-li:text-ink-700 ${fontSizeOptions[fontSize].proseClass}`}
        >
          {segments.map((segment, index) => {
            if (segment.anchorSlug) {
              return (
                <section
                  id={`briefing-story-${segment.anchorSlug}`}
                  key={`${segment.anchorSlug}-${index}`}
                  className={`briefing-story-card scroll-mt-36 rounded-[28px] px-4 py-2 transition duration-300 md:scroll-mt-44 ${
                    activeSlug === segment.anchorSlug
                      ? 'briefing-story-active'
                      : ''
                  }`}
                >
                  <div dangerouslySetInnerHTML={{ __html: segment.html }} />
                </section>
              );
            }

            return (
              <div
                key={`briefing-segment-${index}`}
                dangerouslySetInnerHTML={{ __html: segment.html }}
              />
            );
          })}
        </div>
      </article>

      <aside className="lg:sticky lg:top-28 lg:self-start xl:top-32">
        <section className="glass-card briefing-window-card px-6 py-6 text-ink-900 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
          <p className="panel-title">Briefing Window</p>
          <div className="mt-4 rounded-3xl border border-rose-100 bg-white/85 px-5 py-5">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-rose-500">
              Stories in scope
            </p>
            <div className="mt-4 flex items-end justify-between gap-4">
              <p className="text-4xl font-semibold text-rose-700">
                {stories.length}
              </p>
              <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-rose-500">
                Rolling {months} months
              </span>
            </div>
          </div>

          {stories.length > 0 ? (
            <div className="mt-5 space-y-3">
              {stories.map((story, index) => (
                <button
                  key={story.slug}
                  type="button"
                  onClick={() => focusStory(story.slug)}
                  className="group flex w-full cursor-pointer items-start gap-4 rounded-[24px] border border-rose-100 bg-white/88 px-4 py-4 text-left transition duration-300 hover:-translate-y-0.5 hover:border-rose-300 hover:shadow-[0_22px_48px_-32px_rgba(168,110,161,0.3)]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-xs font-semibold text-rose-600">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-rose-500">
                      {story.dateLabel}
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-ink-900 transition group-hover:text-rose-700">
                      {story.title}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-[24px] border border-dashed border-rose-200 bg-white/80 px-5 py-5 text-sm leading-7 text-ink-700">
              No stories are currently inside the rolling briefing window yet.
            </div>
          )}

          <div className="mt-5 rounded-[24px] border border-rose-100 bg-rose-50/70 px-5 py-4">
            <p className="inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-rose-500">
              <RadioTower size={14} />
              Ordered newest to oldest
            </p>
          </div>
        </section>
      </aside>
    </div>
  );
};

export default BriefingCoverage;
