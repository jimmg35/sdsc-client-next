import Banner from '@/components/Utility/Banner';
import NewsPost from '@/components/Utility/NewsPost';
import Search from '@/components/Utility/Search';
import { NewsData, getAllNews } from '@/lib/news';
import { Rss } from 'lucide-react';

export default function News() {
  const news: NewsData[] = getAllNews();

  return (
    <section className="relative min-h-dvh">
      <Banner
        title="News"
        imageUrl="/img/banners/news-banner.jpg"
        icon={<Rss size={52} className="inline-block mr-2" />}
      />
      <div className="mx-auto max-w-7xl pt-10 px-6">
        <Search placeholder="Search for articles!" />
      </div>
      <div className="mx-auto max-w-7xl py-10 px-6 flex flex-wrap items-center justify-center gap-8">
        {/* <Search /> */}
        {news.map((post) => (
          <NewsPost key={post.slug} data={post} />
        ))}
      </div>
    </section>
  );
}
