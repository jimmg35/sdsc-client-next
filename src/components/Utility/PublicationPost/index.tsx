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
    <div className="custom-li">
      <span>{author}</span>
      <span>{title}</span>
      <span>{journal}</span>
      <span>{catalog}</span>
      <span>{doi}</span>
    </div>
  );
};

export default PublicationPost;
