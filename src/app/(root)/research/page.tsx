import { PublicationData, getPublicationsByIds } from '@/lib/publications';
import {
  ArrowUpRight,
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
import Link from 'next/link';

type FocusArea = {
  key: string;
  icon: LucideIcon;
  /* Ids from src/contents/publications, in reading order. */
  publications: string[];
};

type ResolvedFocusArea = Omit<FocusArea, 'publications'> & {
  publications: PublicationData[];
};

const focusAreas: FocusArea[] = [
  {
    key: 'spatialAnalytics',
    icon: SquaresExclude,
    publications: [
      'multiscale-geographically-weighted-regression-theory-and-practice-2024',
      'uncovering-local-spatial-context-mgwbr-2026',
      'spatial-context-time-invariant-confounder-mgwr-2026',
      'geo-shapley'
    ]
  },
  {
    key: 'healthWellbeing',
    icon: HeartPlus,
    publications: [
      'mobility-ict-and-health',
      'rational-agent-access-model',
      'evaluating-small-area-differential-privacy-life-expectancy'
    ]
  },
  {
    key: 'environment',
    icon: Earth,
    publications: [
      'extreme-heat-adaptation-older-in-migrants',
      'new-mexico-wildfires-air-quality-health-2024',
      'voad-resource-exchange-patterns'
    ]
  },
  {
    key: 'voting',
    icon: Vote,
    publications: [
      'place-and-voting-behavior-prop-207',
      'twitter-psychological-traits-voter-realignment'
    ]
  },
  {
    key: 'urban',
    icon: Building2,
    publications: [
      'transit-investment-unbuilt-alignments-2026',
      'england-cities-building-footprints-2025',
      'single-family-home-spaciousness-covid-2025'
    ]
  },
  {
    key: 'transportation',
    icon: Bus,
    publications: [
      'bike-sharing-divvy-explainable-ml-2026',
      'mgtwr-ev-market-adoption-2026',
      'mode-choice-accessibility-model'
    ]
  },
  {
    key: 'crime',
    icon: ShieldAlert,
    publications: [
      'making-spatial-more-spatial-2025',
      'greenspace-social-disconnection-crime-2025',
      'geography-of-violence-brazil'
    ]
  }
];

const RULE = 'border-accent-600/25';

export default async function Research() {
  const t = await getTranslations('research');

  const areas: ResolvedFocusArea[] = focusAreas.map((area) => ({
    ...area,
    publications: getPublicationsByIds(area.publications)
  }));

  return (
    <section className="page-shell">
      <div className="mx-auto max-w-6xl px-6 pb-28 pt-36 md:pt-40">
        <header className="max-w-3xl">
          <p className="flex items-center gap-4 text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-accent-700 md:text-xs md:tracking-[0.42em]">
            <span
              aria-hidden
              className="h-px w-10 bg-gradient-to-r from-transparent to-accent-600/55"
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
          <h2 className="flex items-center gap-4 text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-accent-700 md:tracking-[0.4em]">
            <span
              aria-hidden
              className="h-px w-10 bg-gradient-to-r from-transparent to-accent-600/55"
            />
            {t('areasEyebrow')}
          </h2>

          {/* Each area now runs a full row with its papers, so the page is
              long enough to want a way straight to one. */}
          <nav
            aria-label={t('areasNav')}
            className={`mt-8 flex flex-wrap gap-x-7 gap-y-3 border-t ${RULE} py-5`}
          >
            {areas.map(({ key, icon: Icon }) => (
              <Link
                key={key}
                href={`#${toAnchor(key)}`}
                className="inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-ink-500 transition-colors hover:text-primary-600"
              >
                <Icon aria-hidden size={14} strokeWidth={1.75} />
                {t(`areas.${key}.title`)}
              </Link>
            ))}
          </nav>

          {/* Spatial analytics is the methodological spine the other six sit
              on, so it keeps the lead position and the larger type. */}
          {areas.map((area, index) => (
            <FocusAreaSection key={area.key} area={area} lead={index === 0} />
          ))}
        </section>
      </div>
    </section>
  );
}

async function FocusAreaSection({
  area,
  lead
}: {
  area: ResolvedFocusArea;
  lead: boolean;
}) {
  const t = await getTranslations('research');
  const { key, icon: Icon, publications } = area;

  return (
    <article
      id={toAnchor(key)}
      className={`scroll-mt-32 border-t ${RULE} py-12 md:grid md:scroll-mt-40 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-x-14 md:py-14 lg:gap-x-20`}
    >
      <div>
        <Icon
          aria-hidden
          size={lead ? 26 : 22}
          strokeWidth={1.5}
          className="text-primary-600"
        />
        <h3
          className={
            lead
              ? 'mt-5 text-2xl font-semibold tracking-[-0.02em] text-ink-900 md:text-[2rem] md:leading-[1.15]'
              : 'mt-4 text-xl font-semibold tracking-[-0.015em] text-ink-900 md:text-2xl'
          }
        >
          {t(`areas.${key}.title`)}
        </h3>
        <p
          className={
            lead
              ? 'mt-4 text-base leading-8 text-ink-700 md:text-lg md:leading-9'
              : 'mt-3 text-sm leading-7 text-ink-700 md:text-base md:leading-8'
          }
        >
          {t(`areas.${key}.description`)}
        </p>
      </div>

      {publications.length > 0 && (
        <div className="mt-10 md:mt-0">
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-accent-700">
            {t('publicationsEyebrow')}
          </p>
          <ol className="mt-4">
            {publications.map((publication) => (
              <li key={publication.id} className={`border-t ${RULE}`}>
                <PublicationEntry publication={publication} />
              </li>
            ))}
          </ol>
        </div>
      )}
    </article>
  );
}

function PublicationEntry({ publication }: { publication: PublicationData }) {
  const href = publication.doi?.trim();
  const layout = 'group flex items-start justify-between gap-6 py-5';

  const body = (
    <>
      <div className="min-w-0">
        {(publication.year || publication.journal) && (
          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[0.66rem] font-semibold uppercase tracking-[0.22em]">
            {publication.year && (
              <span className="tabular-nums text-primary-600">
                {publication.year}
              </span>
            )}
            {publication.journal && (
              <span className="font-medium tracking-[0.18em] text-ink-500">
                {publication.journal}
              </span>
            )}
          </p>
        )}
        <h4 className="mt-2.5 text-base font-medium leading-7 tracking-[-0.01em] text-ink-900 transition-colors duration-300 group-hover:text-primary-600">
          {publication.title.replace(/\.$/, '')}
        </h4>
        {publication.author && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-ink-700">
            {/* The year already leads the entry. */}
            {publication.author.replace(/\s*\(\d{4}\)\.?$/, '')}
          </p>
        )}
      </div>

      {href && (
        <ArrowUpRight
          aria-hidden
          size={16}
          className="mt-0.5 shrink-0 text-ink-500 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary-600"
        />
      )}
    </>
  );

  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`${layout} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300/70`}
    >
      {body}
    </a>
  ) : (
    <div className={layout}>{body}</div>
  );
}

/* `healthWellbeing` → `health-wellbeing`, for the in-page anchors. */
function toAnchor(key: string) {
  return key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}
