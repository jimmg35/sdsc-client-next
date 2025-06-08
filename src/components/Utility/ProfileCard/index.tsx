import { MemberData } from '@/lib/members';
import Link from 'next/link';
import Avatar from '../Avatar';

const ProfileCard = ({ thumbnail, name, title }: MemberData) => {
  return (
    // <div className="w-64 h-96 flex flex-col items-center bg-gray-800 rounded-lg shadow-lg p-6">
    //   <div className="w-30 h-30">
    //     <Avatar src={thumbnail} size={180} />
    //   </div>
    //   <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
    //     {name}
    //   </h3>
    //   <p className="text-gray-600 dark:text-gray-400 mb-4">{title}</p>
    //   <a
    //     className="text-blue-600 dark:text-blue-400 hover:underline"
    //     target="_blank"
    //     rel="noopener noreferrer"
    //   >
    //     View Profile
    //   </a>
    // </div>
    <div className="shadow-xl">
      <div className="w-64 h-108 bg-gray-800 rounded-t-lg">
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
          href="#"
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
