import Avatar from '@/components/Utility/Avatar';
import { markdownToHTML, stripLeadingHeading } from '@/lib/md';
import { getMemberById } from '@/lib/members';
import { getAllNews, getNewsBySlug } from '@/lib/news';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { getFormatter, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Props = Promise<{
  slug: string;
}>;

export async function generateStaticParams() {
  const posts = getAllNews();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function PostPage(props: { params: Props }) {
  const { slug } = await props.params;
  const t = await getTranslations('news.detail');
  const format = await getFormatter();

  const post = getNewsBySlug(slug);

  if (!post) {
    notFound();
  }

  const publishedAt =
    post.date instanceof Date ? post.date : new Date(post.date);
  const mdHtmlContent = await markdownToHTML(stripLeadingHeading(post.content));

  /* The people behind the story are already in the frontmatter; the page has
     been dropping them. Unknown ids are skipped rather than left dangling. */
  const people = post.memberIds
    .map((memberId) => getMemberById(memberId))
    .filter((member): member is NonNullable<typeof member> => Boolean(member));

  return (
    <section className="page-shell">
      <div className="mx-auto max-w-3xl px-6 pb-28 pt-36 md:pt-40">
        <Link
          href="/news"
          className="group inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-rose-600 transition-colors hover:text-rose-700"
        >
          <ArrowLeft
            size={16}
            className="transition-transform duration-300 group-hover:-translate-x-0.5"
          />
          {t('back')}
        </Link>

        <article className="mt-12">
          <header>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-rose-600">
              <time
                dateTime={publishedAt.toISOString()}
                className="tabular-nums"
              >
                {format.dateTime(publishedAt, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              <span aria-hidden className="h-px w-8 bg-silk-600/45" />
              <span className="tracking-[0.18em] text-ink-500">
                {post.author}
              </span>
            </div>

            <h1 className="mt-6 text-[2rem] font-semibold leading-[1.15] tracking-[-0.025em] text-ink-900 md:text-[3rem] md:leading-[1.08]">
              {post.title}
            </h1>

            {/* Standfirst. Set larger than the body so the eye lands here
                first, and ruled off from it. */}
            <p className="mt-7 border-b border-silk-600/25 pb-9 text-lg leading-8 text-ink-700 md:text-xl md:leading-9">
              {post.description}
            </p>
          </header>

          {post.thumbnail && (
            <figure className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-silk-600/25 bg-silk-200">
              {/* Artwork ranges from wide photographs to transparent agency
                  logos, so an over-scaled blurred copy fills the frame and the
                  real image is contained on top of it — the same treatment the
                  home page index uses for its tiles. */}
              <Image
                src={post.thumbnail}
                alt=""
                aria-hidden
                fill
                sizes="(max-width: 768px) 100vw, 48rem"
                className="scale-125 object-cover opacity-70 blur-2xl saturate-150"
              />
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 48rem"
                className="object-contain object-center"
                priority
              />
            </figure>
          )}

          <div
            className="article-prose prose prose-base mt-10 max-w-none md:prose-lg"
            dangerouslySetInnerHTML={{ __html: mdHtmlContent }}
          />

          {post.sourceUrl && (
            <a
              href={post.sourceUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="group mt-12 flex items-center justify-between gap-6 border-y border-silk-600/25 py-6 text-[0.7rem] font-semibold uppercase tracking-[0.26em] text-rose-600 transition-colors hover:text-rose-700"
            >
              {t('viewSource')}
              <ArrowUpRight
                size={18}
                className="shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          )}
        </article>

        {people.length > 0 && (
          <section className="mt-16">
            <h2 className="flex items-center gap-4 text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-silk-700">
              <span
                aria-hidden
                className="h-px w-10 bg-gradient-to-r from-transparent to-silk-600/55"
              />
              {t('inThisStory')}
            </h2>

            <ul className="mt-7 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {people.map((member) => (
                <li key={member.id}>
                  <Link
                    href={`/member/${member.id}`}
                    className="group -mx-3 flex items-center gap-4 rounded-2xl px-3 py-3 transition-colors duration-300 hover:bg-rose-50/60"
                  >
                    <Avatar
                      src={member.thumbnail}
                      size={48}
                      alt={`${member.name} portrait`}
                      variant="soft"
                      className="shrink-0 group-hover:scale-[1.04]"
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-ink-900 transition-colors duration-300 group-hover:text-rose-600">
                        {member.name}
                      </span>
                      <span className="mt-0.5 block truncate text-xs leading-5 text-ink-500">
                        {member.title}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <Link
          href="/news"
          className="group mt-16 flex items-center gap-2 border-t border-silk-600/25 pt-7 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-rose-600 transition-colors hover:text-rose-700"
        >
          <ArrowLeft
            size={16}
            className="transition-transform duration-300 group-hover:-translate-x-0.5"
          />
          {t('back')}
        </Link>
      </div>
    </section>
  );
}
