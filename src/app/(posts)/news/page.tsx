import NewsCard from '@/components/Utility/NewsCard';
import { NewsData, getAllNews } from '@/lib/news';
import { ArrowUpRight, Rss } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const formatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

export default function News() {
  const articles: NewsData[] = getAllNews();
  const [featured, ...stories] = articles;

  return (
    <section className="page-shell">
      <div className="mx-auto max-w-6xl px-6 pb-28 pt-36 md:pt-40">
        <header className="text-center text-ink-900">
          <span className="chip-gold inline-flex items-center gap-2">
            <Rss size={18} className="text-garnet-600" />
            Newsroom
          </span>
          <h1 className="mt-6 text-4xl font-semibold text-garnet-800 text-glow md:text-5xl">
            Stories from the Spatial Data Science Center
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-sm text-ink-600 md:text-base">
            Explore breakthroughs, collaborations, and thought leadership from
            SDSC. Every article spotlights the people and projects reshaping
            spatial science.
          </p>
        </header>

        {featured ? (
          <article className="mt-16 grid gap-6 overflow-hidden rounded-[32px] border border-garnet-200/60 bg-white/80 shadow-[0_32px_60px_-40px_rgba(120,47,64,0.28)] md:grid-cols-[1.1fr_1fr]">
            <div className="relative h-64 w-full overflow-hidden md:h-auto">
              <Image
                src={featured.thumbnail}
                alt={featured.title}
                fill
                sizes="(max-width: 768px) 100vw, 540px"
                className="object-cover transition-transform duration-700 hover:scale-[1.08]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900/70 via-ink-900/20 to-transparent" />
              <span className="absolute bottom-4 left-4 rounded-full border border-white/60 bg-ink-900/50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-gold-100 backdrop-blur">
                Featured
              </span>
            </div>
            <div className="flex flex-col justify-between gap-6 px-6 py-8 text-ink-900 md:px-10">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-garnet-500">
                  {formatter.format(
                    featured.date instanceof Date
                      ? featured.date
                      : new Date(featured.date)
                  )}
                </p>
                <h2 className="text-3xl font-semibold text-garnet-800 text-glow">
                  {featured.title}
                </h2>
                <p className="text-sm leading-7 text-ink-600 md:text-base">
                  {featured.description}
                </p>
              </div>
              <Link
                href={`/news/${featured.slug}`}
                className="inline-flex items-center gap-2 self-start rounded-full border border-garnet-200/70 bg-gold-100/80 px-5 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-garnet-600 transition hover:border-garnet-300 hover:bg-gold-100 hover:text-garnet-700"
              >
                Read the story
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </article>
        ) : (
          <p className="mt-16 text-center text-sm text-ink-600">
            Stay tuned--stories from SDSC are on the way.
          </p>
        )}

        {stories.length > 0 && (
          <div className="mt-20 grid gap-6 md:grid-cols-3">
            {stories.map((item) => (
              <NewsCard key={item.slug} data={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
