import { MemberData } from '@/lib/members';
import Link from 'next/link';
import Avatar from '../Avatar';

const ProfileCard = ({ id, thumbnail, name, title }: MemberData) => {
  return (
    <div className="shadow-xl">
      <div className="w-64 h-96 bg-gray-800 rounded-t-lg">
        <div className="flex flex-col items-center justify-around p-10 gap-4">
          <Avatar src={thumbnail} size={180} />
          <div>
            <p className="text-base font-medium text-white">{name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          </div>
        </div>
      </div>
      <div className="flex">
        <Link
          href={`/member/${id}`}
          className="w-full h-10 flex items-center justify-center text-white bg-gray-700 rounded-bl-lg"
        >
          Profile
        </Link>
        <Link
          href="#"
          className="w-full h-10 flex items-center justify-center text-black bg-teal-400 rounded-br-lg"
        >
          C.V.
        </Link>
      </div>
    </div>
  );
};

export default ProfileCard;
