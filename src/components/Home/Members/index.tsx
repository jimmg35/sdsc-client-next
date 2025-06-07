import { Users } from "lucide-react";
// import { getAllNews, NewsData } from "@/lib/news";
import Image from "next/image";
import Link from "next/link";
import Heading from "../Heading";

const Avatar = ({ src }: { src: string }) => {
  return (
    <Image
      width={160}
      height={160}
      className=" border-2 border-white rounded-full dark:border-gray-800"
      src={src}
      alt=""
    />
  );
};

const Members = () => {
  return (
    <div className=" bg-teal-100 relative w-full h-fit overflow-hidden px-12 py-12 flex flex-col items-center">
      <div className="flex flex-col items-center gap-4">
        <Heading
          title="People"
          subtitle="Meet our members!"
          icon={<Users size={32} className="inline-block mr-2" />}
        />

        <div className="flex -space-x-4 rtl:space-x-reverse">
          <Avatar src="/img/avatar-demo/profile-picture-0.jpg" />
          <Avatar src="/img/avatar-demo/profile-picture-1.jpg" />
          <Avatar src="/img/avatar-demo/profile-picture-2.jpg" />
          <Link
            className="flex items-center justify-center w-10 h-10 text-xs font-medium text-white bg-gray-700 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800"
            href="/member"
          >
            +99
          </Link>
        </div>
        {/* <div className="flex flex-wrap gap-4 justify-center">
          {news.map((post) => (
            <NewsPost key={post.slug} data={post} />
          ))}
        </div> */}
        {/* <Button
          href="/news"
          icon={<Rss size={24} className="ml-2" />}
          text="VIEW MORE"
        /> */}
      </div>
    </div>
  );
};

export default Members;
