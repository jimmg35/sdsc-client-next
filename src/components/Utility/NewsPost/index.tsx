import { NewsData } from "@/lib/news";
import Image from "next/image";
import Link from "next/link";

const NewsPost = ({ data }: { data: NewsData }) => {
  return (
    <div className="w-[370px] h-[475px] bg-white shadow-md rounded-md overflow-hidden flex flex-col">
      {/* 縮圖區塊 */}
      <div className="h-1/2 relative">
        <Image
          src={data.thumbnail}
          alt={data.title}
          layout="fill"
          objectFit="cover"
          className="w-full h-full"
        />
      </div>

      {/* 內容區塊 */}
      <div className="p-4 h-1/2 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-semibold mb-2">{data.title}</h1>
          <p className="text-gray-500 text-sm mb-1">
            {data.date.toDateString()}
          </p>
          <p className="text-gray-600 text-sm mb-2">By {data.author}</p>
          <p className="text-gray-700 text-sm">{data.description}</p>
        </div>
        <Link href={`/news/${data.slug}`} className="text-blue-600 text-sm">
          <button className="w-full cursor-pointer px-4 py-2 bg-teal-400 text-white rounded-md hover:bg-teal-500 transition">
            Read More
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NewsPost;
