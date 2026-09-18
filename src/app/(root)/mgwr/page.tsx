'use client';

import CitationCard from '@/components/MGWR/CitationCard';
import DownloadCard from '@/components/Utility/DownloadCard';
import { AppleIcon, WindowsIcon } from '@/components/Utility/PlatformIcon';
import { bibliographyVersions, currentBibliography } from '@/lib/bibliography';
import { trackMGWRDownload } from '@/lib/ga';
import {
  ArrowDownToLine,
  ArrowUpRight,
  BookOpen,
  Github,
  Library
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

const DOWNLOAD_VERSION = '2.2.1';

const RULE = 'border-silk-600/25';

const downloads = [
  {
    key: 'windows',
    Icon: WindowsIcon,
    href: 'https://fsu-my.sharepoint.com/:u:/g/personal/zl23l_fsu_edu/ERbawWrrxUdAuqXxAcg_LcoBtZh-ENpHZAEKoCB8GZf7xg?download=1',
    platform: 'windows'
  },
  {
    key: 'macos',
    Icon: AppleIcon,
    href: 'https://fsu-my.sharepoint.com/:u:/g/personal/zl23l_fsu_edu/EQ8R-YXyl9ZFtKASzfAtB2sBDWnICS4W2DHEaI0r2kfSFQ?download=1',
    platform: 'macos'
  }
] as const;

const documentationLinks: {
  label: string;
  kind: string;
  Icon: LucideIcon;
  href: string;
}[] = [
  {
    label: 'MGWR User Manual',
    kind: 'PDF',
    Icon: BookOpen,
    href: 'https://fsu-my.sharepoint.com/:b:/g/personal/zl23l_fsu_edu/ES4OcNxvDoNLqRClYPxLt7YB2mwKySD8QdloVuaH0WK0sw?download=1'
  },
  {
    label: 'MGWR Bibliography',
    kind: `PDF · ${currentBibliography.size}`,
    Icon: Library,
    href: currentBibliography.href
  },
  {
    label: 'mgwr Python package',
    kind: 'GitHub',
    Icon: Github,
    href: 'https://github.com/pysal/mgwr'
  }
];

const citations = [
  {
    text: 'Fotheringham, A. S., Oshan, T. M., & Li, Z. (2023). Multiscale geographically weighted regression: Theory and practice. CRC Press.',
    href: 'https://www.routledge.com/Multiscale-Geographically-Weighted-Regression-Theory-and-Practice/Fotheringham-Oshan-Li/p/book/9781032564227?srsltid=AfmBOop073-LTOaP9k-wBUDEYyPMuVCkyCf4cGSM7BXQMD0NiUVx7vBZ'
  },
  {
    text: 'Fotheringham, A. S., Yang, W., & Kang, W. (2017). Multiscale geographically weighted regression (MGWR). Annals of the American Association of Geographers, 107(6), 1247-1265.',
    href: 'https://www.tandfonline.com/doi/full/10.1080/24694452.2017.1352480'
  },
  {
    text: 'Oshan, T. M., Li, Z., Kang, W., Wolf, L. J., & Fotheringham, A. S. (2019). mgwr: A Python implementation of multiscale geographically weighted regression for investigating process spatial heterogeneity and scale. ISPRS International Journal of Geo-Information, 8(6), 269.',
    href: 'https://www.mdpi.com/2220-9964/8/6/269/pdf'
  }
];

const sampleDatasets = [
  {
    name: 'Tokyo',
    href: 'https://fsu-my.sharepoint.com/:u:/g/personal/zl23l_fsu_edu/Ec4vkFYLt49BhqD8b35hKIgB5EZb4XB-dhWJEmZx5lzx5w?download=1'
  },
  {
    name: 'Georgia',
    href: 'https://fsu-my.sharepoint.com/:u:/g/personal/zl23l_fsu_edu/EbusGxq5ReBMosunfqcJWB0Bhnv4Nfi-_ZI1QFR_3tohNQ?download=1'
  },
  {
    name: 'Clearwater',
    href: 'https://fsu-my.sharepoint.com/:u:/g/personal/zl23l_fsu_edu/EccA3iN0fMFFuvA_NlNCCcABmWy3z-GB96S_8ghiPKG4hg?download=1'
  },
  {
    name: 'Airbnb',
    href: 'https://fsu-my.sharepoint.com/:u:/g/personal/zl23l_fsu_edu/ESX01Cqw87hNkRvZNbXDTFcBTGVxeorKk3DX27yU7JKmMw?download=1'
  }
];

export default function MGWR() {
  const t = useTranslations('mgwr');
  const tCommon = useTranslations('common');

  return (
    <section className="page-shell">
      <div className="mx-auto max-w-6xl px-6 pb-28 pt-36 md:pt-40">
        <header className="max-w-3xl">
          <Eyebrow>{t('chip')}</Eyebrow>
          <h1 className="mt-5 text-[2.1rem] font-semibold leading-[1.12] tracking-[-0.025em] text-ink-900 md:text-[3rem] md:leading-[1.06]">
            {t('title')}
          </h1>
          <p className="mt-6 text-base leading-8 text-ink-700 md:text-lg md:leading-9">
            {t('intro')}
          </p>
        </header>

        {/* The release itself: mark, name, and the version being served. */}
        <div
          className={`mt-16 flex flex-wrap items-center gap-x-6 gap-y-5 border-y ${RULE} py-7`}
        >
          <Image
            src="/img/software/mgwr.png"
            alt={t('downloads.productName')}
            width={56}
            height={56}
            className={`shrink-0 rounded-2xl border ${RULE}`}
          />
          <div className="min-w-0">
            <h2 className="text-xl font-semibold tracking-[-0.01em] text-ink-900 md:text-2xl">
              {t('downloads.productName')}
            </h2>
            <p className="mt-1.5 text-sm leading-6 text-ink-700">
              {t('downloads.tagline')}
            </p>
          </div>
          <span className="ml-auto shrink-0 text-[0.68rem] font-semibold uppercase tabular-nums tracking-[0.24em] text-rose-600">
            {tCommon('version', { version: DOWNLOAD_VERSION })}
          </span>
        </div>

        <section className="mt-14">
          <Eyebrow>{t('downloads.heading')}</Eyebrow>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {downloads.map((item) => (
              <DownloadCard
                key={item.key}
                icon={<item.Icon size={26} />}
                title={t(`downloads.${item.key}.title`)}
                meta={t(`downloads.${item.key}.meta`)}
                description={t(`downloads.${item.key}.description`)}
                href={item.href}
                cta={tCommon('download')}
                onClick={() =>
                  trackMGWRDownload(item.platform, item.href, DOWNLOAD_VERSION)
                }
              />
            ))}
          </div>
        </section>

        <div className="mt-20 grid gap-16 md:grid-cols-2 md:gap-14">
          <section>
            <Eyebrow>{t('documentation')}</Eyebrow>
            <p className="mt-4 text-sm leading-7 text-ink-700">
              {t('documentationHint')}
            </p>
            <ul className="mt-7">
              {documentationLinks.map((item) => (
                <li key={item.label} className={`border-t ${RULE}`}>
                  <ResourceRow href={item.href}>
                    <item.Icon
                      size={17}
                      aria-hidden
                      className="mt-0.5 shrink-0 text-ink-500 transition-colors duration-300 group-hover:text-rose-600"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-ink-900 transition-colors duration-300 group-hover:text-rose-600">
                        {item.label}
                      </span>
                      <span className="mt-1 block text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-ink-500">
                        {item.kind}
                      </span>
                    </span>
                    <ArrowUpRight
                      size={16}
                      aria-hidden
                      className="mt-0.5 shrink-0 text-ink-500 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-rose-600"
                    />
                  </ResourceRow>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <Eyebrow>{t('sampleDatasets')}</Eyebrow>
            <p className="mt-4 text-sm leading-7 text-ink-700">
              {t('sampleDatasetsHint')}
            </p>
            <ul className="mt-7 grid gap-x-10 sm:grid-cols-2">
              {sampleDatasets.map((dataset) => (
                <li key={dataset.href} className={`border-t ${RULE}`}>
                  <ResourceRow href={dataset.href}>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink-900 transition-colors duration-300 group-hover:text-rose-600">
                      {dataset.name}
                    </span>
                    <ArrowDownToLine
                      size={16}
                      aria-hidden
                      className="shrink-0 text-ink-500 transition duration-300 group-hover:translate-y-0.5 group-hover:text-rose-600"
                    />
                  </ResourceRow>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="mt-20">
          <Eyebrow>{t('bibliographyHistory.title')}</Eyebrow>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-700">
            {t('bibliographyHistory.description')}
          </p>
          <ul className="mt-8">
            {bibliographyVersions.map((edition, index) => (
              <li key={edition.version} className={`border-t ${RULE}`}>
                <ResourceRow href={encodeURI(edition.href)}>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-sm font-medium text-ink-900 transition-colors duration-300 group-hover:text-rose-600">
                        {edition.releasedAt}
                      </span>
                      {index === 0 && (
                        <span className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-rose-600">
                          {t('bibliographyHistory.current')}
                        </span>
                      )}
                    </span>
                    <span className="mt-1 block text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-ink-500">
                      PDF &middot; {edition.size}
                    </span>
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-ink-500 transition-colors duration-300 group-hover:text-rose-600">
                    {t('bibliographyHistory.download')}
                    <ArrowDownToLine
                      size={15}
                      aria-hidden
                      className="transition-transform duration-300 group-hover:translate-y-0.5"
                    />
                  </span>
                </ResourceRow>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-20">
          <Eyebrow>{t('citationReferences')}</Eyebrow>
          <ul className="mt-8">
            {citations.map((item, index) => (
              <CitationCard
                key={item.href}
                index={index + 1}
                text={item.text}
                href={item.href}
                accessLabel={t('access')}
                copyLabel={t('citationCopy')}
                copiedLabel={t('citationCopied')}
              />
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <h2 className="flex items-center gap-4 text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-silk-700 md:tracking-[0.4em]">
      <span
        aria-hidden
        className="h-px w-10 bg-gradient-to-r from-transparent to-silk-600/55"
      />
      {children}
    </h2>
  );
}

/* Every resource on the page — manual, dataset, bibliography edition — is the
   same ruled row that tints on hover, so the three lists read alike. */
function ResourceRow({
  href,
  children
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group calcite-focus -mx-3 flex items-start gap-4 rounded-2xl px-3 py-4 transition-colors duration-300 hover:bg-rose-50/50"
    >
      {children}
    </Link>
  );
}
