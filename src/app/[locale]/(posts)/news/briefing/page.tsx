import BriefingCoverage from '@/components/News/BriefingCoverage';
import { Link } from '@/i18n/navigation';
import {
  type BriefingSegment,
  getCurrentBriefing,
  parseBriefingSegments
} from '@/lib/briefing';
import { markdownToHTML } from '@/lib/md';
import { getRecentNewsWindow } from '@/lib/news';
import { ArrowLeft, Bot } from 'lucide-react';
import {
  getFormatter,
  getTranslations,
  setRequestLocale
} from 'next-intl/server';

const LONG_DATE = { year: 'numeric', month: 'long', day: 'numeric' } as const;
const SHORT_DATE = { year: 'numeric', month: 'short', day: 'numeric' } as const;

export default async function NewsBriefingPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations('briefing');
  const format = await getFormatter();

  const briefing = getCurrentBriefing(locale);
  const { months, windowStart, windowEnd, posts } = getRecentNewsWindow(3);
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
  const stories = posts
    .filter((story) => anchoredSlugs.has(story.slug))
    .map((story) => ({
      slug: story.slug,
      title: story.title,
      dateLabel: format.dateTime(story.date, SHORT_DATE)
    }));

  return (
    <section className="page-shell briefing-page-shell">
      <div className="mx-auto max-w-6xl px-6 pb-28 pt-36 md:pt-40">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 rounded-full border border-rose-200/80 bg-white/90 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-rose-600 shadow-[0_18px_42px_-30px_rgba(168,110,161,0.2)] transition hover:border-rose-300 hover:bg-white hover:text-rose-700"
          >
            <ArrowLeft size={16} />
            {t('back')}
          </Link>
        </div>

        <header className="mt-10 text-gold-100">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-gold-100/90 backdrop-blur">
              <Bot size={14} aria-hidden="true" />
              {t('aiBroadcaster')}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/80 bg-amber-100 px-4 py-2 text-[0.78rem] font-semibold text-amber-950 shadow-[0_18px_42px_-32px_rgba(217,119,6,0.55)]">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[0.78rem] font-black leading-none text-amber-950">
                !
              </span>
              {t('aiWarning')}
            </span>
          </div>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold text-gold-50 text-glow md:text-5xl">
            {briefing.title}
          </h1>
          <p className="mt-5 max-w-3xl text-sm text-gold-200/80 md:text-base">
            {briefing.description}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-rose-500">
            <span>
              {t('range', {
                start: format.dateTime(windowStart, LONG_DATE),
                end: format.dateTime(windowEnd, LONG_DATE)
              })}
            </span>
            <span className="h-1 w-1 rounded-full bg-rose-300" />
            <span>
              {t('updated', {
                date: format.dateTime(briefing.updatedAt, LONG_DATE)
              })}
            </span>
          </div>
        </header>

        <BriefingCoverage
          readTime={briefing.readTime}
          segments={renderedSegments}
          months={months}
          stories={stories}
        />
      </div>
    </section>
  );
}
