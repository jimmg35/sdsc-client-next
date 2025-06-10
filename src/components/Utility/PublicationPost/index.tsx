import { PublicationData } from '@/lib/publications';
import { BookMarked } from 'lucide-react';
import Link from 'next/link';

const PublicationPost = ({
  author,
  title,
  journal,
  catalog,
  doi
}: PublicationData) => {
  return (
    <div className="flex items-center h-fit mb-4 md:w-[800px] bg-teal-100 hover:ring-4 hover:ring-teal-400/10 px-8 py-4 rounded-md border border-[#F4F4F5] hover:border-teal-400">
      <div>
        <BookMarked size={48} className="mr-4 text-teal-400" />
      </div>
      <div>
        <Link
          href={doi}
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal-600 hover:underline text-sm"
        >
          <h3 className="text-lg font-semibold">{title}</h3>
        </Link>
        <p className="text-sm text-gray-600">{author}</p>
        <p className="text-sm text-gray-600 italic">{journal}</p>
        <p className="text-sm text-gray-600">{catalog}</p>
      </div>
    </div>
  );
};

export default PublicationPost;
