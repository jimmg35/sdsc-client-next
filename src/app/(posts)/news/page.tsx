import Banner from "@/components/Utility/Banner";
import { getAllNews, NewsData } from "@/lib/news";
import NewsPost from "@/components/Utility/NewsPost";
import { Rss } from "lucide-react";

export default function News() {
  const news: NewsData[] = getAllNews();

  return (
    <section className="relative min-h-dvh">
      <Banner
        title="News"
        imageUrl="/img/banners/news-banner.jpg"
        icon={<Rss size={52} className="inline-block mr-2" />}
      />
      <div className="mx-auto max-w-7xl py-10 sm:px-6 flex flex-wrap items-center justify-center gap-8">
        {news.map((post) => (
          <NewsPost key={post.slug} data={post} />
        ))}
      </div>
    </section>
  );
}
