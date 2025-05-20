import Button from "@/components/Utility/Button";
import { Rss } from "lucide-react";
import NewsPost from "@/components/Utility/NewsPost";
import { getAllNews, NewsData } from "@/lib/news";

const News = () => {
  const news: NewsData[] = getAllNews().slice(0, 3);

  return (
    <div className=" bg-teal-200 relative w-full h-fit overflow-hidden px-12 py-12 flex flex-col items-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold">
          <Rss size={32} className="inline-block mr-2" />
          News
        </h1>
        <p className="text-lg">Stay tuned for updates!</p>
        <div className="flex flex-wrap gap-4 justify-center">
          {news.map((post) => (
            <NewsPost key={post.slug} data={post} />
          ))}
        </div>
        <Button
          href="/news"
          icon={<Rss size={24} className="ml-2" />}
          text="VIEW MORE"
        />
      </div>
    </div>
  );
};

export default News;
