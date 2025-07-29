import Button from '@/components/Utility/Button';
import NewsPost from '@/components/Utility/NewsPost';
import { NewsData, getAllNews } from '@/lib/news';
import { Rss } from 'lucide-react';
import { Fade } from 'react-awesome-reveal';
import Heading from '../Heading';

const News = () => {
  const news: NewsData[] = getAllNews().slice(0, 3);

  return (
    <div className="bg-white relative w-full h-fit overflow-hidden px-12 py-12 flex flex-col items-center">
      <div className="flex flex-col items-center gap-4">
        <Fade direction="down" cascade triggerOnce>
          <Heading
            title="News"
            // subtitle="Stay tuned for updates!"
            // icon={<Rss size={32} className="inline-block mr-2" />}
            variant="secondary"
          />
        </Fade>
        <Fade direction="up" cascade triggerOnce>
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
        </Fade>
      </div>
    </div>
  );
};

export default News;
