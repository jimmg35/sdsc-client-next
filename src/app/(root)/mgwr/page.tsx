'use client';

import CitationCard from '@/components/MGWR/CitationCard';
import DownloadCard from '@/components/Utility/DownloadCard';
import { AppleIcon, WindowsIcon } from '@/components/Utility/PlatformIcon';
import { bibliographyVersions, currentBibliography } from '@/lib/bibliography';
import { trackMGWRDownload } from '@/lib/ga';
import {
  ArrowDownToLine,
  ArrowUpRight,
  BookMarked,
  BookOpen,
  Database,
  Download,
  FileText,
  Github,
  History,
  Library,
  MapPin
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

const DOWNLOAD_VERSION = '2.2.1';

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

const documentationLinks = [
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
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-32 text-gold-100 md:pt-40">
        <header className="text-center">
          <span className="chip-gold">{t('chip')}</span>
          <h1 className="mt-6 text-4xl font-semibold text-gold-50 text-glow md:text-5xl">
            {t('title')}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-gold-200/75 md:text-base">
            {t('intro')}
          </p>
        </header>

        {/*<section className="mt-12 glass-card px-8 py-8 text-gold-100 md:px-10">
          <p className="text-sm text-gold-200/85">
            MGWR extends the original geographically weighted regression
            framework by allowing each explanatory variable to vary at its own
            spatial scale. The software is open source and free to use; please
            cite the references below in published work that relies on MGWR.
          </p>
        </section>*/}

        <section className="mt-14">
          <header className="panel-title text-rose-500">
            <Download size={18} />
            {t('downloads.heading')}
          </header>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-4">
            <div className="halo">
              <Image
                src="/img/software/mgwr.png"
                alt={t('downloads.productName')}
                width={64}
                height={64}
                className="rounded-xl"
              />
            </div>
            <div className="min-w-0">
              <h2 className="text-2xl font-semibold text-ink-900 text-glow">
                {t('downloads.productName')}
              </h2>
              <p className="mt-1 text-sm text-ink-700">
                {t('downloads.tagline')}
              </p>
            </div>
            <span className="chip-gold ml-auto">
              {tCommon('version', { version: DOWNLOAD_VERSION })}
            </span>
          </div>

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

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <section className="glass-card flex h-full flex-col px-7 py-8 text-ink-900">
            <header className="panel-title text-rose-500">
              <BookMarked size={18} />
              {t('documentation')}
            </header>
            <p className="mt-4 text-sm text-ink-700">
              {t('documentationHint')}
            </p>
            <ul className="mt-5 space-y-2.5">
              {documentationLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-2xl border border-silk-300/55 bg-surface/45 px-4 py-3 transition duration-300 hover:border-rose-200/70 hover:bg-rose-50/50 calcite-focus"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-silk-300/60 bg-silk-100/80 text-ink-900 transition duration-300 group-hover:border-rose-300/70 group-hover:text-rose-600">
                      <item.Icon size={16} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-ink-900">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-ink-500">
                        {item.kind}
                      </span>
                    </span>
                    <ArrowUpRight
                      size={16}
                      className="shrink-0 text-rose-600 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="glass-card flex h-full flex-col px-7 py-8 text-ink-900">
            <header className="panel-title text-rose-500">
              <Database size={18} />
              {t('sampleDatasets')}
            </header>
            <p className="mt-4 text-sm text-ink-700">
              {t('sampleDatasetsHint')}
            </p>
            <ul className="mt-5 grid flex-1 auto-rows-fr gap-2.5 sm:grid-cols-2">
              {sampleDatasets.map((dataset) => (
                <li key={dataset.href}>
                  <Link
                    href={dataset.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full items-center gap-3 rounded-2xl border border-silk-300/55 bg-surface/45 px-4 py-3 transition duration-300 hover:border-rose-200/70 hover:bg-rose-50/50 calcite-focus"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-silk-300/60 bg-silk-100/80 text-ink-900 transition duration-300 group-hover:border-rose-300/70 group-hover:text-rose-600">
                      <MapPin size={16} />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink-900">
                      {dataset.name}
                    </span>
                    <ArrowDownToLine
                      size={16}
                      className="shrink-0 text-rose-600 transition-transform duration-300 group-hover:translate-y-0.5"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="mt-14 glass-card px-7 py-8 text-ink-900 md:px-9">
          <header className="panel-title text-rose-500">
            <History size={18} />
            {t('bibliographyHistory.title')}
          </header>
          <p className="mt-4 max-w-2xl text-sm text-ink-700">
            {t('bibliographyHistory.description')}
          </p>
          <ul className="mt-6 space-y-2.5">
            {bibliographyVersions.map((edition, index) => (
              <li key={edition.version}>
                <Link
                  href={encodeURI(edition.href)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border border-silk-300/55 bg-surface/45 px-4 py-3.5 transition duration-300 hover:border-rose-200/70 hover:bg-rose-50/50 calcite-focus"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-silk-300/60 bg-silk-100/80 text-ink-900 transition duration-300 group-hover:border-rose-300/70 group-hover:text-rose-600">
                    <FileText size={16} />
                  </span>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-ink-900">
                        {edition.releasedAt}
                      </span>
                      {index === 0 ? (
                        <span className="rounded-full border border-rose-200/70 bg-rose-50/70 px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-rose-600">
                          {t('bibliographyHistory.current')}
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-0.5 block text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-ink-500">
                      PDF &middot; {edition.size}
                    </span>
                  </span>
                  <span className="ml-auto inline-flex items-center gap-2 rounded-full border border-rose-200/60 bg-rose-50/70 px-3.5 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-rose-600 transition duration-300 group-hover:border-rose-300/80 group-hover:bg-rose-100/70">
                    <Download
                      size={14}
                      className="transition-transform duration-300 group-hover:translate-y-0.5"
                    />
                    {t('bibliographyHistory.download')}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14 glass-card px-7 py-8 text-ink-900 md:px-9">
          <header className="panel-title text-rose-500">
            <BookOpen size={18} />
            {t('citationReferences')}
          </header>
          <ul className="mt-6 space-y-3">
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
