import { withBasePath } from '@/lib/base-path';
import { AnnouncementData } from '@/lib/announcements';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const formatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric'
});

const AnnouncementCard = ({ data }: { data: AnnouncementData }) => {
  const publishDate = formatter.format(
    data.date instanceof Date ? data.date : new Date(data.date)
  );

  return (
    <article className="group glass-card flex h-full w-full max-w-[24rem] flex-col overflow-hidden text-ink-900 transition duration-300 hover:-translate-y-2">
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={withBasePath(data.thumbnail)}
          alt={data.title}
          fill
          sizes="(max-width: 768px) 100vw, 384px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.08]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900/15 via-white/60 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-95" />
        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-rose-600">
          <span className="rounded-full border border-rose-200/60 bg-white/90 px-3 py-1 shadow-sm">
            {publishDate}
          </span>
          <span className="rounded-full border border-rose-200/60 bg-rose-50/90 px-3 py-1 text-rose-600">
            {data.author}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-6 px-6 py-6">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-rose-700 text-glow">
            {data.title}
          </h3>
          <p className="text-sm leading-6 text-ink-600">{data.description}</p>
        </div>
        <Link
          href={`/announcements/${data.slug}`}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-rose-600 transition hover:text-rose-700"
        >
          <span>View Update</span>
          <ArrowUpRight
            size={18}
            className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </Link>
      </div>
    </article>
  );
};

export default AnnouncementCard;
