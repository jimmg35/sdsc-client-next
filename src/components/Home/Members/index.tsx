import { MemberData, getMemberById } from '@/lib/members';
import { Users } from 'lucide-react';
// import { getAllNews, NewsData } from "@/lib/news";
import Image from 'next/image';
import Link from 'next/link';
import Heading from '../Heading';

const Avatar = ({ src }: { src: string }) => {
  const size = 180;
  return (
    <Image
      width={size}
      height={size}
      className="border-2 border-teal-400 rounded-full object-cover"
      src={src}
      alt=""
    />
  );
};

const Members = () => {
  const stewart: MemberData | null = getMemberById('stewart-fotheringham');
  const ziqi: MemberData | null = getMemberById('ziqi-li');
  const mehak: MemberData | null = getMemberById('mehak-sachdeva');
  const mason: MemberData | null = getMemberById('mason-mathews');

  return (
    <div className=" bg-teal-100 relative w-full h-fit overflow-hidden px-12 py-12 flex flex-col items-center">
      <div className="flex flex-col items-center gap-4">
        <Heading
          title="People"
          subtitle="Meet our members!"
          icon={<Users size={32} className="inline-block mr-2" />}
          variant="secondary"
        />

        <div className="flex -space-x-4 rtl:space-x-reverse overflow-x-auto">
          {ziqi && <Avatar src={ziqi.thumbnail} />}
          {stewart && <Avatar src={stewart.thumbnail} />}
          {mason && <Avatar src={mason.thumbnail} />}
          {mehak && <Avatar src={mehak.thumbnail} />}
          {/* Add more avatars as needed */}
          <Link
            className="flex items-center justify-center w-10 h-10 text-xs font-medium text-white bg-gray-700 border-2 border-white rounded-full hover:bg-gray-600 dark:border-gray-800"
            href="/member"
          >
            +4
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Members;
