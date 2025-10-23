import AppCard from '@/components/Utility/AppCard';
import { withBasePath } from '@/lib/basePath';
import { ArrowUpRight, BookMarked, BookOpen, Database } from 'lucide-react';
import Link from 'next/link';

const downloadSources = [
  {
    title: 'MGWR GUI (Windows)',
    description:
      'Installer package with the latest stable build, examples, and documentation for Windows 10/11 environments.',
    imageUrl: '/img/software/mgwr.png',
    href: 'https://fsu-my.sharepoint.com/:u:/g/personal/zl23l_fsu_edu/ERbawWrrxUdAuqXxAcg_LcoBtZh-ENpHZAEKoCB8GZf7xg?download=1',
    meta: 'Windows | 64-bit'
  },
  {
    title: 'MGWR GUI (macOS)',
    description:
      'Universal binary for Apple Silicon and Intel Macs with notarized installer and starter projects.',
    imageUrl: '/img/software/mgwr.png',
    href: 'https://fsu-my.sharepoint.com/:u:/g/personal/zl23l_fsu_edu/EQ8R-YXyl9ZFtKASzfAtB2sBDWnICS4W2DHEaI0r2kfSFQ?download=1',
    meta: 'macOS | Universal'
  }
];

const downloads = downloadSources.map((item) => ({
  ...item,
  imageUrl: withBasePath(item.imageUrl)
}));

const documentationLinks = [
  {
    label: 'MGWR User Manual (PDF)',
    href: 'https://fsu-my.sharepoint.com/:b:/g/personal/zl23l_fsu_edu/ES4OcNxvDoNLqRClYPxLt7YB2mwKySD8QdloVuaH0WK0sw?download=1'
  },
  {
    label: 'MGWR Bibliography (PDF)',
    href: 'https://fsu-my.sharepoint.com/:b:/g/personal/zl23l_fsu_edu/ER0wFLcN4T1Ip5SP07DG4M8BFfH236Yp86KWU05K90aYRA?download=1'
  },
  {
    label: 'mgwr Python package on GitHub',
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
  return (
    <section className="page-shell">
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-32 text-gold-100 md:pt-40">
        <header className="text-center">
          <span className="chip-gold">MGWR Tools</span>
          <h1 className="mt-6 text-4xl font-semibold text-gold-50 text-glow md:text-5xl">
            Multiscale Geographically Weighted Regression (MGWR)
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-gold-200/75 md:text-base">
            MGWR provides a Windows and macOS interface for calibrating
            multiscale geographically weighted regression models so you can
            explore how multi-scale relationships vary across space.
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

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {downloads.map((item) => (
            <AppCard key={item.title} {...item} />
          ))}
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <section className="glass-card px-8 py-8 text-gold-100">
            <header className="panel-title text-gold-300">
              <BookMarked size={18} />
              Documentation
            </header>
            <ul className="mt-5 space-y-2 text-sm">
              {documentationLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-gold-300 underline-offset-4 hover:text-gold-50 hover:underline"
                  >
                    {item.label}
                    <ArrowUpRight size={14} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="glass-card px-8 py-8 text-gold-100">
            <header className="panel-title text-gold-300">
              <Database size={18} />
              Sample datasets
            </header>
            <ul className="mt-5 space-y-2 text-sm">
              {sampleDatasets.map((dataset) => (
                <li key={dataset.href}>
                  <Link
                    href={dataset.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-gold-300 underline-offset-4 hover:text-gold-50 hover:underline"
                  >
                    {dataset.name}
                    <ArrowUpRight size={14} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="mt-14 glass-card px-8 py-8 text-gold-100">
          <header className="panel-title text-gold-300">
            <BookOpen size={18} />
            Citation references
          </header>
          <ul className="mt-5 space-y-3 text-sm text-gold-200/85">
            {citations.map((item) => (
              <li key={item.href}>
                {item.text}{' '}
                <Link
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-gold-300 underline-offset-4 hover:text-gold-50 hover:underline"
                >
                  Access
                  <ArrowUpRight size={14} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}
