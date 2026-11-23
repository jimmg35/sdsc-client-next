import AnnouncementCard from '@/components/Utility/AnnouncementCard';
import { AnnouncementData, getAllAnnouncements } from '@/lib/announcements';
import { ArrowUpRight } from 'lucide-react';
import { getFormatter, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';

export default async function Announcements() {
  const t = await getTranslations('announcements');
  const format = await getFormatter();

  const announcements: AnnouncementData[] = getAllAnnouncements();
  const [featured, ...others] = announcements;

  return (
    <section className="page-shell">
      <div className="mx-auto max-w-6xl px-6 pb-28 pt-36 text-ink-900 md:pt-40">
        <header className="text-center">
          <span className="chip-accent">{t('page.chip')}</span>
          <h1 className="mt-6 text-4xl font-semibold text-ink-900 text-glow md:text-5xl">
            {t('page.title')}
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-sm text-ink-700 md:text-base">
            {t('page.intro')}
          </p>
        </header>

        {featured ? (
          <article
            className={`mt-16 grid gap-6 overflow-hidden rounded-[32px] border border-accent-600/25 bg-surface shadow-soft ${
              featured.thumbnail ? 'md:grid-cols-[1.1fr_1fr]' : ''
            }`}
          >
            {featured.thumbnail && (
              <div className="relative h-64 w-full overflow-hidden md:h-auto">
                <Image
                  src={featured.thumbnail}
                  alt={featured.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 540px"
                  className="object-cover transition-transform duration-700 hover:scale-[1.08]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/85 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 rounded-full border border-brand-accent/40 bg-night/85 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-night-ink backdrop-blur">
                  {t('featured')}
                </span>
              </div>
            )}
            <div className="flex flex-col justify-between gap-6 px-6 py-8 text-ink-900 md:px-10">
              <div className="space-y-4">
                {!featured.thumbnail && (
                  <span className="inline-flex rounded-full border border-primary-200/70 bg-primary-50/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-primary-600">
                    {t('featured')}
                  </span>
                )}
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent-700">
                  {format.dateTime(
                    featured.date instanceof Date
                      ? featured.date
                      : new Date(featured.date),
                    { year: 'numeric', month: 'long', day: 'numeric' }
                  )}
                </p>
                <h2 className="text-3xl font-semibold text-ink-900 text-glow">
                  {featured.title}
                </h2>
                <p className="text-sm leading-7 text-ink-700 md:text-base">
                  {featured.description}
                </p>
              </div>
              <Link
                href={`/announcements/${featured.slug}`}
                className="inline-flex items-center gap-2 self-start rounded-full border border-brand-primary bg-brand-primary px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:brightness-110"
              >
                {t('readUpdate')}
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </article>
        ) : (
          <p className="mt-16 text-center text-sm text-ink-700">{t('empty')}</p>
        )}

        {others.length > 0 && (
          <div className="mt-20 grid gap-6 md:grid-cols-3">
            {others.map((item) => (
              <AnnouncementCard key={item.slug} data={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
