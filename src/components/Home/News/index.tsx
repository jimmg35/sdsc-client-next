import NewsCard from '@/components/Utility/NewsCard';
import { NewsData, getAllNews } from '@/lib/news';
import { Rss } from 'lucide-react';
import Link from 'next/link';
import Heading from '../Heading';

const News = () => {
  const news: NewsData[] = getAllNews().slice(0, 3);

  return (
    <section className="surface-fade relative overflow-hidden px-6 py-16 md:px-16 rounded-none">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_80%_-10%,_rgba(206,184,136,0.3),_transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_110%_at_20%_-20%,_rgba(233,187,204,0.35),_transparent_60%)]" />

      <div className="relative flex flex-col items-center gap-8 text-center text-ink-900">
        <span className="chip-gold inline-flex items-center gap-2">
          <Rss size={18} className="text-garnet-600" />
          Latest Dispatches
        </span>
        <Heading title="News & Updates" />
        <p className="max-w-2xl text-sm text-ink-600 md:text-base">
          Catch up on lab breakthroughs, spatial data events, and faculty
          spotlights curated each month from the SDSC community.
        </p>

        <div className="mt-4 grid gap-6 md:grid-cols-3">
          {news.map((post) => (
            <NewsCard key={post.slug} data={post} />
          ))}
        </div>

        <Link
          href="/news"
          className="inline-flex items-center gap-2 rounded-full border border-garnet-200/70 bg-white/80 px-6 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-garnet-600 transition hover:border-garnet-300 hover:bg-gold-100/80 hover:text-garnet-700"
        >
          View all stories
          <Rss size={18} />
        </Link>
      </div>
    </section>
  );
};

export default News;
