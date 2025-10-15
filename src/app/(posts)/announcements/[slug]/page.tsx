import { getAnnouncementBySlug } from '@/lib/announcements';
import { markdownToHTML } from '@/lib/md';
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

export default async function AnnouncementPage(props: { params: Props }) {
  const { slug } = await props.params;

  let announcement;

  try {
    announcement = getAnnouncementBySlug(slug);
  } catch (error) {
    console.log(error);
    notFound();
  }

  if (!announcement) {
    notFound();
  }

  const publishedAt =
    announcement.date instanceof Date
      ? announcement.date
      : new Date(announcement.date);
  const mdHtmlContent = await markdownToHTML(announcement.content);

  return (
    <section className="page-shell">
      <div className="mx-auto max-w-5xl px-6 pb-28 pt-36 text-gold-100 md:pt-40">
        <Link
          href="/announcements"
          className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-[#160b29]/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-200 transition hover:border-gold-400 hover:text-gold-50"
        >
          <ArrowLeft size={16} />
          Back to Updates
        </Link>

        <article className="surface-fade relative mt-10 overflow-hidden rounded-[32px] px-6 pb-10 pt-8 md:px-12">
          <div className="relative mx-auto flex max-w-3xl flex-col gap-6 text-gold-100">
            <header className="text-center">
              <span className="chip-gold inline-flex items-center justify-center">
                Official SDSC Update
              </span>
              <h1 className="mt-4 text-4xl font-semibold text-gold-50 text-glow md:text-5xl">
                {announcement.title}
              </h1>
              <div className="mt-4 flex items-center justify-center gap-4 text-xs font-semibold uppercase tracking-[0.28em] text-gold-300/75">
                <span className="inline-flex items-center gap-2">
                  <User size={16} /> {announcement.author}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Calendar size={16} /> {formatter.format(publishedAt)}
                </span>
              </div>
            </header>

            {announcement.thumbnail && (
              <div className="relative h-64 w-full overflow-hidden rounded-[24px] border border-garnet-500/30">
                <Image
                  src={announcement.thumbnail}
                  alt={announcement.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 720px"
                  className="object-cover"
                />
              </div>
            )}

            <div className="px-6 py-8 text-gold-100">
              <article
                className="prose max-w-none text-gold-200/80 prose-headings:text-gold-50 prose-a:text-gold-300 prose-strong:text-gold-50 prose-blockquote:border-gold-400/30 prose-blockquote:text-gold-50"
                dangerouslySetInnerHTML={{ __html: mdHtmlContent }}
              />
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
