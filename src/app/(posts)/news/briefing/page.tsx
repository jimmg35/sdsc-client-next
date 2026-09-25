import BriefingCoverage from '@/components/News/BriefingCoverage';
import {
  type BriefingSegment,
  getCurrentBriefing,
  parseBriefingSegments
} from '@/lib/briefing';
import { markdownToHTML } from '@/lib/md';
import { getRecentNewsWindow } from '@/lib/news';
import { ArrowLeft, Bot } from 'lucide-react';
import { getFormatter, getTranslations } from 'next-intl/server';
import Link from 'next/link';

const LONG_DATE = { year: 'numeric', month: 'long', day: 'numeric' } as const;
const SHORT_DATE = { year: 'numeric', month: 'short', day: 'numeric' } as const;

export default async function NewsBriefingPage() {
  const t = await getTranslations('briefing');
  const format = await getFormatter();

  const briefing = getCurrentBriefing();

  /* The window is the one the briefing was written for, not one rolling off
     the build date. The site is a static export, so every rebuild used to
     move the window on while the text stayed put: the header announced one
     range, the narrative covered another, and the story list came up empty.
     Ending on the day the briefing was updated keeps all three in step. */
  const updatedAt = briefing.updatedAt;
  const { months, windowStart, windowEnd, posts } = getRecentNewsWindow(
    3,
    new Date(
      updatedAt.getFullYear(),
      updatedAt.getMonth(),
      updatedAt.getDate(),
      23,
      59,
      59
    )
  );

  const briefingSegments = parseBriefingSegments(briefing.content);
  const renderedSegments = await Promise.all(
    briefingSegments.map(async (segment: BriefingSegment) => ({
      anchorSlug: segment.anchorSlug,
      html: await markdownToHTML(segment.markdown)
    }))
  );
  const anchoredSlugs = new Set(
    renderedSegments
      .map((segment) => segment.anchorSlug)
      .filter((slug): slug is string => Boolean(slug))
  );

  /* Every story in the window is listed, not only the ones the narrative
     discusses; those jump to their passage, the rest open the story. */
  const stories = posts.map((story) => ({
    slug: story.slug,
    title: story.title,
    dateLabel: format.dateTime(story.date, SHORT_DATE),
    anchored: anchoredSlugs.has(story.slug)
  }));

  return (
    <section className="page-shell briefing-page-shell">
      <div className="mx-auto max-w-6xl px-6 pb-28 pt-36 md:pt-40">
        <Link
          href="/news"
          className="group inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-primary-600 transition-colors hover:text-primary-700"
        >
          <ArrowLeft
            size={16}
            className="transition-transform duration-300 group-hover:-translate-x-0.5"
          />
          {t('back')}
        </Link>

        <header className="mt-12 max-w-3xl">
          <p className="flex items-center gap-4 text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-accent-700 md:text-xs md:tracking-[0.42em]">
            <span
              aria-hidden
              className="h-px w-10 bg-gradient-to-r from-transparent to-accent-600/55"
            />
            {briefing.eyebrow}
          </p>
          <h1 className="mt-5 text-[2.1rem] font-semibold leading-[1.12] tracking-[-0.025em] text-ink-900 md:text-[3rem] md:leading-[1.06]">
            {briefing.title}
          </h1>
          <p className="mt-6 text-base leading-8 text-ink-700 md:text-lg md:leading-9">
            {briefing.description}
          </p>

          <p className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-primary-600">
            <span className="tabular-nums">
              {t('range', {
                start: format.dateTime(windowStart, LONG_DATE),
                end: format.dateTime(windowEnd, LONG_DATE)
              })}
            </span>
            <span aria-hidden className="h-px w-6 bg-accent-600/45" />
            <span className="tracking-[0.18em] text-ink-500">
              {t('updated', {
                date: format.dateTime(updatedAt, LONG_DATE)
              })}
            </span>
            <span aria-hidden className="h-px w-6 bg-accent-600/45" />
            <span className="tracking-[0.18em] text-ink-500">
              {briefing.readTime}
            </span>
          </p>
        </header>

        {/* Said once, plainly, where it will be read before the narrative —
            not as a warning badge competing with the headline. */}
        <p className="mt-10 flex items-start gap-4 border-y border-accent-600/25 py-5 text-sm leading-6 text-ink-700">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary-200/70 bg-primary-50/60 text-primary-600">
            <Bot size={15} aria-hidden />
          </span>
          <span>
            <span className="block text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-accent-700">
              {t('aiBroadcaster')}
            </span>
            <span className="mt-1 block">{t('aiWarning')}</span>
          </span>
        </p>

        <BriefingCoverage
          segments={renderedSegments}
          months={months}
          stories={stories}
        />
      </div>
    </section>
  );
}
