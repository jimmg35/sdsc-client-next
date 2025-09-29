import { markdownToHTML } from '@/lib/md';
import { getNewsBySlug } from '@/lib/news';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const formatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

type Props = Promise<{
  slug: string;
}>;

export default async function PostPage(props: { params: Props }) {
  const { slug } = await props.params;
  const post = getNewsBySlug(slug);

  if (!post) {
    notFound();
  }

  const publishedAt =
    post.date instanceof Date ? post.date : new Date(post.date);
  const mdHtmlContent = await markdownToHTML(post.content);

  return (
    <section className="page-shell">
      <div className="mx-auto max-w-5xl px-6 pb-28 pt-36 md:pt-40">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 rounded-full border border-garnet-200/70 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-garnet-600 transition hover:border-garnet-300 hover:bg-gold-100/80 hover:text-garnet-700"
        >
          <ArrowLeft size={16} />
          Back to Newsroom
        </Link>

        <article className="surface-fade relative mt-10 overflow-hidden rounded-[32px] px-6 pb-10 pt-8 md:px-12">
          <div className="relative mx-auto flex max-w-3xl flex-col gap-6 text-ink-900">
            <header className="text-center">
              <span className="chip-gold inline-flex items-center justify-center">
                SDSC Insight
              </span>
              <h1 className="mt-4 text-4xl font-semibold text-garnet-800 text-glow md:text-5xl">
                {post.title}
              </h1>
              <div className="mt-4 flex items-center justify-center gap-4 text-xs font-semibold uppercase tracking-[0.24em] text-ink-500">
                <span className="inline-flex items-center gap-2">
                  <User size={16} /> {post.author}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Calendar size={16} /> {formatter.format(publishedAt)}
                </span>
              </div>
            </header>

            {post.thumbnail && (
              <div className="relative h-64 w-full overflow-hidden rounded-[24px]">
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 720px"
                  className="object-cover"
                />
              </div>
            )}

            <div className="glass-card px-6 py-8 text-ink-900">
              <article
                className="prose max-w-none text-ink-700 prose-headings:text-garnet-700 prose-a:text-garnet-600 prose-strong:text-ink-900 prose-blockquote:border-garnet-200 prose-blockquote:text-garnet-700"
                dangerouslySetInnerHTML={{ __html: mdHtmlContent }}
              />
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
