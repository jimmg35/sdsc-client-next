import {
  getAllAnnouncements,
  getAnnouncementBySlug
} from '@/lib/announcements';
import { markdownToHTML } from '@/lib/md';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { getFormatter, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Props = Promise<{
  slug: string;
}>;

export async function generateStaticParams() {
  const announcements = getAllAnnouncements();
  return announcements.map((announcement) => ({
    slug: announcement.slug
  }));
}

export default async function AnnouncementPage(props: { params: Props }) {
  const { slug } = await props.params;
  const t = await getTranslations('announcements.detail');
  const format = await getFormatter();

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
      <div className="mx-auto max-w-5xl px-6 pb-28 pt-36 text-ink-900 md:pt-40">
        <Link
          href="/announcements"
          className="inline-flex items-center gap-2 rounded-full border border-primary-200/80 bg-surface/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary-600 shadow-glow-sm transition hover:border-primary-300 hover:bg-surface hover:text-primary-700"
        >
          <ArrowLeft size={16} />
          {t('back')}
        </Link>

        <article className="surface-fade relative mt-10 overflow-hidden rounded-[32px] px-6 pb-10 pt-8 md:px-12">
          <div className="relative mx-auto flex max-w-3xl flex-col gap-6 text-ink-900">
            <header className="text-center">
              <span className="chip-accent inline-flex items-center justify-center">
                {t('chip')}
              </span>
              <h1 className="mt-4 text-4xl font-semibold text-ink-900 text-glow md:text-5xl">
                {announcement.title}
              </h1>
              <div className="mt-4 flex items-center justify-center gap-4 text-xs font-semibold uppercase tracking-[0.28em] text-accent-700">
                <span className="inline-flex items-center gap-2">
                  <User size={16} /> {announcement.author}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Calendar size={16} />{' '}
                  {format.dateTime(publishedAt, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </header>

            {announcement.thumbnail && (
              <div className="relative h-64 w-full overflow-hidden rounded-[24px] border border-accent-600/25">
                <Image
                  src={announcement.thumbnail}
                  alt={announcement.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 720px"
                  className="object-cover"
                />
              </div>
            )}

            <div className="px-6 py-8 text-ink-900">
              <article
                className="article-prose prose max-w-none"
                dangerouslySetInnerHTML={{ __html: mdHtmlContent }}
              />
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
