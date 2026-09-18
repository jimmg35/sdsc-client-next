import { NewsData } from '@/lib/news';
import { ArrowUpRight } from 'lucide-react';
import { getFormatter } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';

/* Same string for both layers of the tile so they resolve to one optimized
   URL, and the blurred copy costs no extra request. */
const THUMBNAIL_SIZES = '(max-width: 768px) 100vw, 11rem';

/* One row of the news index, shared by the home page section and the
   newsroom archive so both read as the same list. */
const NewsIndexRow = async ({ data }: { data: NewsData }) => {
  const format = await getFormatter();
  const publishedAt =
    data.date instanceof Date ? data.date : new Date(data.date);

  return (
    <li className="border-b border-silk-600/25">
      <Link
        href={`/news/${data.slug}`}
        className="group relative grid gap-x-10 gap-y-5 py-8 md:grid-cols-[9.5rem_1fr_11rem] md:items-start md:py-9"
      >
        {/* Echoes the rule beside the director's pull quote. */}
        <span
          aria-hidden
          className="pointer-events-none absolute -left-4 top-0 hidden h-full w-px origin-top scale-y-0 bg-gradient-to-b from-silk-600 via-rose-500/70 to-transparent transition-transform duration-500 ease-out group-hover:scale-y-100 md:-left-8 md:block"
        />

        <div className="flex items-baseline gap-3 md:flex-col md:gap-2">
          <time
            dateTime={publishedAt.toISOString()}
            className="text-[0.7rem] font-semibold uppercase tabular-nums tracking-[0.22em] text-rose-600"
          >
            {format.dateTime(publishedAt, {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </time>
          <span className="text-[0.7rem] uppercase tracking-[0.18em] text-ink-500">
            {data.author}
          </span>
        </div>

        <div>
          <h3 className="text-lg font-medium leading-snug tracking-[-0.01em] text-ink-900 transition-colors duration-300 group-hover:text-rose-600 md:text-2xl md:leading-[1.3]">
            {data.title}
          </h3>
          <p className="mt-3 line-clamp-2 text-sm leading-7 text-ink-700">
            {data.description}
          </p>
        </div>

        {/* Thumbnails run from wide photos to transparent agency logos, so
            cropping to fill is not safe. An over-scaled blurred copy fills
            the tile with the image's own colour and the real image is
            contained on top of it — the same trick the hero uses.

            A post without artwork leaves the column empty rather than
            borrowing a placeholder, so the headlines stay on one measure
            down the list either way. */}
        {data.thumbnail && (
          <figure className="relative order-first aspect-[16/9] w-full overflow-hidden rounded-xl border border-silk-600/25 bg-silk-200 md:order-last md:mt-1 md:aspect-[16/10]">
            <Image
              src={data.thumbnail}
              alt=""
              aria-hidden
              fill
              sizes={THUMBNAIL_SIZES}
              className="scale-125 object-cover opacity-70 blur-xl saturate-150"
            />
            {/* The headline names the story, so the tile is decorative. */}
            <Image
              src={data.thumbnail}
              alt=""
              fill
              sizes={THUMBNAIL_SIZES}
              className="object-contain transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
            <span
              aria-hidden
              className="absolute inset-0 flex items-center justify-center bg-[#160f12]/55 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            >
              <ArrowUpRight size={22} />
            </span>
          </figure>
        )}
      </Link>
    </li>
  );
};

export default NewsIndexRow;
