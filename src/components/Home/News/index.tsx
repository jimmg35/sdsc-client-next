import NewsCard from '@/components/Utility/NewsCard';
import { NewsData, getAllNews } from '@/lib/news';
import { Rss } from 'lucide-react';
import Link from 'next/link';
import Heading from '../Heading';

const News = () => {
  const news: NewsData[] = getAllNews().slice(0, 3);

  return (
    <section className="surface-fade relative overflow-hidden rounded-none px-6 py-16 md:px-16">
      {/* <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_80%_-10%,_rgba(124,74,158,0.32),_transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_110%_at_20%_-20%,_rgba(189,156,99,0.32),_transparent_60%)]" /> */}

      <div className="relative flex flex-col items-center gap-8 text-center text-gold-100">
        <span className="chip-gold inline-flex items-center gap-2">
          <Rss size={18} className="text-gold-200" />
          Latest Dispatches
        </span>
        <Heading title="News & Events" />
        <p className="max-w-2xl text-sm text-gold-200/75 md:text-base">
          Catch up on the latest research, projects, awards, 
          events, and stories from the SDSC community.
        </p>

        <div className="mt-4 grid gap-6 md:grid-cols-3">
          {news.map((post) => (
            <NewsCard key={post.slug} data={post} />
          ))}
        </div>

        <Link
          href="/news"
          className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-[#130722]/20 px-6 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-gold-300 transition hover:border-gold-400 hover:text-gold-50"
        >
          View all stories
          <Rss size={18} />
        </Link>
      </div>
    </section>
  );
};

export default News;
