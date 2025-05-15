import Button from "@/components/Utility/Button";
import { Rss } from "lucide-react";
import NewsPost from "@/components/Utility/NewsPost";

const demoNewsData = [
  {
    title: "New Research Paper Published",
    date: "2023-10-01",
  },
  {
    title: "Upcoming Workshop",
    date: "2023-11-15",
  },
  {
    title: "Conference Announcement",
    date: "2023-12-20",
  },
];

const News = () => {
  return (
    <div className=" bg-teal-200 relative w-full h-fit overflow-hidden px-12 py-12 flex flex-col items-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-bold">News</h1>
        <p className="text-lg">Stay tuned for updates!</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <NewsPost />
          <NewsPost />
          <NewsPost />
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
