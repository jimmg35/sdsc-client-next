import NewsIndexRow from '@/components/News/NewsIndexRow';
import { NewsData, getAllNews } from '@/lib/news';
import { ArrowUpRight, RadioTower } from 'lucide-react';
import { getFormatter, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';

const RULE = 'border-accent-600/25';

export default async function News() {
  const t = await getTranslations('news');
  const format = await getFormatter();

  const articles: NewsData[] = getAllNews();
  const [featured, ...stories] = articles;
  const featuredDate = featured
    ? featured.date instanceof Date
      ? featured.date
      : new Date(featured.date)
    : null;

  return (
    <section className="page-shell">
      <div className="mx-auto max-w-6xl px-6 pb-28 pt-36 md:pt-40">
        <header className="max-w-3xl">
          <p className="flex items-center gap-4 text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-accent-700 md:text-xs md:tracking-[0.42em]">
            <span
              aria-hidden
              className="h-px w-10 bg-gradient-to-r from-transparent to-accent-600/55"
            />
            {t('page.chip')}
          </p>
          <h1 className="mt-5 text-[2.1rem] font-semibold leading-[1.12] tracking-[-0.025em] text-ink-900 md:text-[3rem] md:leading-[1.06]">
            {t('page.title')}
          </h1>
          <p className="mt-6 text-base leading-8 text-ink-700 md:text-lg md:leading-9">
            {t('page.intro')}
          </p>
        </header>

        {/* The briefing sits as a ruled band rather than a panel, the same
            shape it takes at the foot of the home page list. */}
        <Link
          href="/news/briefing"
          className={`group mt-16 flex flex-col gap-5 border-y ${RULE} py-7 md:flex-row md:items-center md:justify-between md:gap-10`}
        >
          <span className="flex items-start gap-5">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary-200/70 bg-primary-50/60 text-primary-600 transition duration-300 group-hover:border-primary-300 group-hover:bg-primary-100/70">
              <RadioTower size={18} />
            </span>
            <span className="min-w-0">
              <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-accent-700">
                {t('briefingCallout.eyebrow')}
              </span>
              <span className="mt-2 block text-lg font-medium leading-snug tracking-[-0.01em] text-ink-900 transition-colors duration-300 group-hover:text-primary-600 md:text-xl">
                {t('briefingCallout.title')}
              </span>
              <span className="mt-2 block max-w-2xl text-sm leading-7 text-ink-700">
                {t('briefingCallout.description')}
              </span>
            </span>
          </span>

          <span className="inline-flex shrink-0 items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-primary-600 transition-colors group-hover:text-primary-700">
            {t('briefingCallout.cta')}
            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </span>
        </Link>

        {featured && featuredDate ? (
          <article className="mt-20">
            <p className="flex items-center gap-4 text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-accent-700 md:tracking-[0.4em]">
              <span
                aria-hidden
                className="h-px w-10 bg-gradient-to-r from-transparent to-accent-600/55"
              />
              {t('featured')}
            </p>

            <Link
              href={`/news/${featured.slug}`}
              className="group mt-8 grid gap-x-14 gap-y-8 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:items-center"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-primary-600">
                  <time dateTime={featuredDate.toISOString()}>
                    {format.dateTime(featuredDate, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                  <span className="tracking-[0.18em] text-ink-500">
                    {featured.author}
                  </span>
                </div>

                <h2 className="mt-5 text-[1.8rem] font-semibold leading-[1.16] tracking-[-0.02em] text-ink-900 transition-colors duration-300 group-hover:text-primary-600 md:text-[2.4rem] md:leading-[1.1]">
                  {featured.title}
                </h2>
                <p className="mt-5 text-base leading-8 text-ink-700">
                  {featured.description}
                </p>
                <span className="mt-7 inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-primary-600">
                  {t('readStory')}
                  <ArrowUpRight
                    size={16}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </span>
              </div>

              {featured.thumbnail && (
                <figure
                  className={`relative order-first aspect-[16/10] w-full overflow-hidden rounded-2xl border ${RULE} bg-accent-200 md:order-last`}
                >
                  <Image
                    src={featured.thumbnail}
                    alt=""
                    aria-hidden
                    fill
                    sizes="(max-width: 768px) 100vw, 28rem"
                    className="scale-125 object-cover opacity-70 blur-2xl saturate-150"
                  />
                  <Image
                    src={featured.thumbnail}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 28rem"
                    className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    priority
                  />
                </figure>
              )}
            </Link>
          </article>
        ) : (
          <p className="mt-20 text-sm text-ink-700">{t('empty')}</p>
        )}

        {stories.length > 0 && (
          <section className="mt-24">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="flex items-center gap-4 text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-accent-700 md:tracking-[0.4em]">
                <span
                  aria-hidden
                  className="h-px w-10 bg-gradient-to-r from-transparent to-accent-600/55"
                />
                {t('allStories')}
              </h2>
              <span className="text-[0.7rem] font-semibold tabular-nums text-ink-500">
                {stories.length}
              </span>
            </div>

            <ol className={`mt-8 border-t ${RULE}`}>
              {stories.map((item) => (
                <NewsIndexRow key={item.slug} data={item} />
              ))}
            </ol>
          </section>
        )}
      </div>
    </section>
  );
}
