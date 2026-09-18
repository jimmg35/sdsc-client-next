import NewsIndexRow from '@/components/News/NewsIndexRow';
import { NewsData, getAllNews } from '@/lib/news';
import { ArrowUpRight, RadioTower } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

const News = async () => {
  const t = await getTranslations('home.news');
  const news: NewsData[] = getAllNews().slice(0, 3);

  return (
    <section className="surface-fade relative overflow-hidden rounded-none px-6 py-20 md:px-16 md:py-28">
      <div className="relative mx-auto w-full max-w-5xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="flex items-center gap-4 text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-silk-700 md:text-xs md:tracking-[0.42em]">
              <span
                aria-hidden
                className="h-px w-10 bg-gradient-to-r from-transparent to-silk-600/55"
              />
              {t('eyebrow')}
            </p>
            <h2 className="mt-5 text-3xl font-semibold tracking-[-0.02em] text-ink-900 md:text-[2.6rem] md:leading-[1.08]">
              {t('heading')}
            </h2>
            <p className="mt-5 text-sm leading-7 text-ink-700 md:text-base md:leading-8">
              {t('description')}
            </p>
          </div>

          <Link
            href="/news"
            className="group inline-flex shrink-0 items-center gap-2 self-start text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-rose-600 transition-colors hover:text-rose-700 md:self-end"
          >
            {t('viewAll')}
            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* An index rather than a card grid: hairline rules, no card chrome,
            and the thumbnail sits in its own column so the headline still
            leads the row. */}
        <ol className="mt-14 border-t border-silk-600/25">
          {news.map((post) => (
            <NewsIndexRow key={post.slug} data={post} />
          ))}
        </ol>

        {/* The briefing carries on the list's rhythm instead of adding a
            button cluster under it. */}
        <Link
          href="/news/briefing"
          className="group flex items-center justify-between gap-6 border-b border-silk-600/25 py-7"
        >
          <span className="flex items-center gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-rose-200/70 bg-rose-50/60 text-rose-600 transition duration-300 group-hover:border-rose-300 group-hover:bg-rose-100/70">
              <RadioTower size={18} />
            </span>
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-rose-600 transition-colors group-hover:text-rose-700">
              {t('readBriefing')}
            </span>
          </span>
          <ArrowUpRight
            size={18}
            className="shrink-0 text-ink-500 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-rose-600"
          />
        </Link>
      </div>
    </section>
  );
};

export default News;
