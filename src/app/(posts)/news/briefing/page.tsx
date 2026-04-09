import BriefingCoverage from '@/components/News/BriefingCoverage';
import {
  getCurrentBriefing,
  parseBriefingSegments,
  type BriefingSegment
} from '@/lib/briefing';
import { markdownToHTML } from '@/lib/md';
import { getRecentNewsWindow } from '@/lib/news';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const longFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

const shortFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric'
});

export default async function NewsBriefingPage() {
  const briefing = getCurrentBriefing();
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
      dateLabel: shortFormatter.format(story.date)
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
            Back to Newsroom
          </Link>
        </div>

        <header className="mt-10 text-gold-100">
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold text-gold-50 text-glow md:text-5xl">
            {briefing.title}
          </h1>
          <p className="mt-5 max-w-3xl text-sm text-gold-200/80 md:text-base">
            {briefing.description}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-rose-500">
            <span>{longFormatter.format(windowStart)} to {longFormatter.format(windowEnd)}</span>
            <span className="h-1 w-1 rounded-full bg-rose-300" />
            <span>Updated {longFormatter.format(briefing.updatedAt)}</span>
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
