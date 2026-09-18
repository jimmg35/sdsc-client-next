import {
  Building2,
  Bus,
  Earth,
  HeartPlus,
  ShieldAlert,
  SquaresExclude,
  Vote
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

const focusAreas: { key: string; icon: LucideIcon }[] = [
  { key: 'spatialAnalytics', icon: SquaresExclude },
  { key: 'healthWellbeing', icon: HeartPlus },
  { key: 'environment', icon: Earth },
  { key: 'voting', icon: Vote },
  { key: 'urban', icon: Building2 },
  { key: 'transportation', icon: Bus },
  { key: 'crime', icon: ShieldAlert }
];

const RULE = 'border-silk-600/25';

export default async function Research() {
  const t = await getTranslations('research');

  /* Spatial analytics is the methodological spine the other six sit on, so it
     keeps the lead position it had in the old bento grid. */
  const [lead, ...areas] = focusAreas;
  const LeadIcon = lead.icon;

  return (
    <section className="page-shell">
      <div className="mx-auto max-w-6xl px-6 pb-28 pt-36 md:pt-40">
        <header className="max-w-3xl">
          <p className="flex items-center gap-4 text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-silk-700 md:text-xs md:tracking-[0.42em]">
            <span
              aria-hidden
              className="h-px w-10 bg-gradient-to-r from-transparent to-silk-600/55"
            />
            {t('chip')}
          </p>
          <h1 className="mt-5 text-[2.1rem] font-semibold leading-[1.12] tracking-[-0.025em] text-ink-900 md:text-[3rem] md:leading-[1.06]">
            {t('title')}
          </h1>
          <p className="mt-6 text-base leading-8 text-ink-700 md:text-lg md:leading-9">
            {t('intro')}
          </p>
        </header>

        <section className="mt-20">
          <h2 className="flex items-center gap-4 text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-silk-700 md:tracking-[0.4em]">
            <span
              aria-hidden
              className="h-px w-10 bg-gradient-to-r from-transparent to-silk-600/55"
            />
            {t('areasEyebrow')}
          </h2>

          <article className={`mt-10 border-t ${RULE} pt-9`}>
            <LeadIcon
              aria-hidden
              size={26}
              strokeWidth={1.5}
              className="text-rose-600"
            />
            <h3 className="mt-5 text-2xl font-semibold tracking-[-0.02em] text-ink-900 md:text-[2rem] md:leading-[1.15]">
              {t(`areas.${lead.key}.title`)}
            </h3>
            <p className="mt-4 max-w-3xl text-base leading-8 text-ink-700 md:text-lg md:leading-9">
              {t(`areas.${lead.key}.description`)}
            </p>
          </article>

          {/* Ruled cells rather than cards: six peer areas read as one set. */}
          <div className="mt-14 grid gap-x-12 md:grid-cols-2 lg:grid-cols-3">
            {areas.map(({ key, icon: Icon }) => (
              <article key={key} className={`border-t ${RULE} pb-10 pt-8`}>
                <Icon
                  aria-hidden
                  size={22}
                  strokeWidth={1.5}
                  className="text-rose-600"
                />
                <h3 className="mt-4 text-lg font-medium leading-snug tracking-[-0.01em] text-ink-900">
                  {t(`areas.${key}.title`)}
                </h3>
                <p className="mt-3 text-sm leading-7 text-ink-700">
                  {t(`areas.${key}.description`)}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
