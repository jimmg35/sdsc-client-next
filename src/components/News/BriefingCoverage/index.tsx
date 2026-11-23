'use client';

import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

type BriefingRenderedSegment = {
  anchorSlug?: string;
  html: string;
};

type BriefingStory = {
  slug: string;
  title: string;
  dateLabel: string;
  /* Whether the narrative has a passage on this story to jump to. */
  anchored: boolean;
};

type Props = {
  segments: BriefingRenderedSegment[];
  months: number;
  stories: BriefingStory[];
};

const RULE = 'border-accent-600/25';

/* How long a passage stays lit after the list jumps to it. */
const HIGHLIGHT_MS = 2200;

/* The typography plugin's own size steps, so line height and paragraph
   spacing scale with the text instead of only the glyphs growing. */
const TEXT_SIZES = [
  { id: 's', label: 'S', className: 'prose-base' },
  { id: 'm', label: 'M', className: 'prose-lg' },
  { id: 'l', label: 'L', className: 'prose-xl' }
] as const;

type TextSize = (typeof TEXT_SIZES)[number]['id'];

const passageId = (slug: string) => `briefing-story-${slug}`;

const BriefingCoverage = ({ segments, months, stories }: Props) => {
  const t = useTranslations('briefing');
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [textSize, setTextSize] = useState<TextSize>('m');
  const clearHighlightRef = useRef<number | null>(null);

  const focusStory = useCallback((slug: string) => {
    const target = document.getElementById(passageId(slug));

    if (!target) {
      return;
    }

    if (clearHighlightRef.current) {
      window.clearTimeout(clearHighlightRef.current);
    }

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    setActiveSlug(slug);
    target.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start'
    });
    window.history.replaceState(null, '', `#${passageId(slug)}`);

    clearHighlightRef.current = window.setTimeout(() => {
      setActiveSlug((current) => (current === slug ? null : current));
    }, HIGHLIGHT_MS);
  }, []);

  // A shared link to a passage lands on it, lit, rather than at the top.
  useEffect(() => {
    const prefix = `#${passageId('')}`;
    const hash = window.location.hash;

    if (!hash.startsWith(prefix) || hash.length === prefix.length) {
      return;
    }

    const timer = window.setTimeout(
      () => focusStory(hash.slice(prefix.length)),
      120
    );

    return () => window.clearTimeout(timer);
  }, [focusStory]);

  useEffect(
    () => () => {
      if (clearHighlightRef.current) {
        window.clearTimeout(clearHighlightRef.current);
      }
    },
    []
  );

  const sizeClass =
    TEXT_SIZES.find((size) => size.id === textSize)?.className ?? '';

  return (
    <div className="mt-14 grid gap-x-16 gap-y-16 lg:grid-cols-[minmax(0,1fr)_19rem] xl:grid-cols-[minmax(0,1fr)_21rem]">
      <article className="min-w-0 max-w-3xl">
        <div className="mb-8 flex items-center justify-end gap-3">
          <span
            id="briefing-text-size"
            className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-ink-500"
          >
            {t('textSize')}
          </span>
          <div
            role="group"
            aria-labelledby="briefing-text-size"
            className="flex items-center gap-1"
          >
            {TEXT_SIZES.map((size) => (
              <button
                key={size.id}
                type="button"
                onClick={() => setTextSize(size.id)}
                aria-pressed={textSize === size.id}
                aria-label={t('textSizeAria', { size: size.label })}
                className={`h-7 w-7 cursor-pointer rounded-full text-[0.7rem] font-semibold transition-colors ${
                  textSize === size.id
                    ? 'bg-primary-50 text-primary-700 ring-1 ring-primary-200'
                    : 'text-ink-500 hover:text-primary-600'
                }`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>

        <div className={`article-prose prose max-w-none ${sizeClass}`}>
          {segments.map((segment, index) => {
            const slug = segment.anchorSlug;

            if (!slug) {
              return (
                <div
                  key={`segment-${index}`}
                  dangerouslySetInnerHTML={{ __html: segment.html }}
                />
              );
            }

            /* A passage tied to a story hangs off a hairline in the margin,
               which lights up when the list jumps to it. Its own margins are
               zeroed inside so the tint sits evenly around the text and the
               gaps between passages match the gaps between paragraphs. */
            return (
              <section
                key={`${slug}-${index}`}
                id={passageId(slug)}
                className={`-ml-4 my-[1.4em] scroll-mt-36 rounded-r-xl border-l-2 py-1 pl-4 pr-3 transition-colors duration-700 md:-ml-6 md:scroll-mt-44 md:pl-6 [&>div>:first-child]:mt-0 [&>div>:last-child]:mb-0 ${
                  activeSlug === slug
                    ? 'border-primary-500 bg-primary-50/70'
                    : `${RULE} bg-transparent`
                }`}
              >
                <div dangerouslySetInnerHTML={{ __html: segment.html }} />
                <Link
                  href={`/news/${slug}`}
                  className="not-prose group mt-4 inline-flex items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-primary-600 no-underline transition-colors hover:text-primary-700"
                >
                  {t('readStory')}
                  <ArrowUpRight
                    size={14}
                    aria-hidden
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </section>
            );
          })}
        </div>
      </article>

      <aside className="lg:sticky lg:top-32 lg:self-start">
        <p className="flex items-center gap-4 text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-accent-700">
          <span
            aria-hidden
            className="h-px w-10 bg-gradient-to-r from-transparent to-accent-600/55"
          />
          {t('window.title')}
        </p>

        <div
          className={`mt-6 flex items-end justify-between gap-4 border-y ${RULE} py-5`}
        >
          <p className="flex flex-col">
            <span className="text-[2.4rem] font-semibold leading-none tracking-[-0.03em] text-ink-900 tabular-nums">
              {stories.length}
            </span>
            <span className="mt-2 text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-ink-500">
              {t('window.storiesInScope', { count: stories.length })}
            </span>
          </p>
          <span className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-primary-600">
            {t('window.rolling', { months })}
          </span>
        </div>

        {stories.length > 0 ? (
          <ol>
            {stories.map((story) => {
              const active = activeSlug === story.slug;
              const Icon = story.anchored ? ArrowDownRight : ArrowUpRight;
              const body = (
                <>
                  <span className="min-w-0">
                    <span className="block text-[0.66rem] font-semibold uppercase tabular-nums tracking-[0.22em] text-primary-600">
                      {story.dateLabel}
                    </span>
                    <span
                      className={`mt-2 block text-sm font-medium leading-6 transition-colors duration-300 group-hover:text-primary-600 ${
                        active ? 'text-primary-600' : 'text-ink-900'
                      }`}
                    >
                      {story.title}
                    </span>
                  </span>
                  <Icon
                    size={15}
                    aria-hidden
                    className="mt-0.5 shrink-0 text-ink-500 transition duration-300 group-hover:text-primary-600"
                  />
                </>
              );
              const rowClass =
                'group flex w-full cursor-pointer items-start justify-between gap-4 py-5 text-left';

              return (
                <li key={story.slug} className={`border-b ${RULE}`}>
                  {story.anchored ? (
                    <button
                      type="button"
                      onClick={() => focusStory(story.slug)}
                      aria-label={t('window.jump', { title: story.title })}
                      className={rowClass}
                    >
                      {body}
                    </button>
                  ) : (
                    <Link href={`/news/${story.slug}`} className={rowClass}>
                      {body}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        ) : (
          <p className={`border-b ${RULE} py-5 text-sm leading-7 text-ink-700`}>
            {t('window.empty')}
          </p>
        )}

        <p className="mt-4 text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-ink-500">
          {t('window.ordered')}
        </p>
      </aside>
    </div>
  );
};

export default BriefingCoverage;
