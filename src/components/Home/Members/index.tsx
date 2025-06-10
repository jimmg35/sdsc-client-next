import Avatar from '@/components/Utility/Avatar';
import { MemberData, getMemberById } from '@/lib/members';
import { Users } from 'lucide-react';
import Link from 'next/link';
import Heading from '../Heading';

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
          {ziqi && <Avatar src={ziqi.thumbnail} size={180} />}
          {stewart && <Avatar src={stewart.thumbnail} size={180} />}
          {mason && <Avatar src={mason.thumbnail} size={180} />}
          {mehak && <Avatar src={mehak.thumbnail} size={180} />}
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
