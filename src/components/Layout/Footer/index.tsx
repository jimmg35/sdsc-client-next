import { CONTACT_ADDRESS_LINES, CONTACT_EMAIL } from '@/lib/contact';
import { ArrowUpRight, Mail, MapPin } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';

const quickLinks = [
  { key: 'home', href: '/' },
  { key: 'members', href: '/member' },
  { key: 'research', href: '/research' },
  { key: 'mgwr', href: '/mgwr' },
  { key: 'publications', href: '/publications' },
  { key: 'news', href: '/news' }
];

/** Build marker shown in the footer bar, bumped with each release. */
const BUILD_VERSION = 'b0.20260119.283';

const RULE = 'border-silk-600/25';

const Footer = async () => {
  const t = await getTranslations('footer');
  const tNav = await getTranslations('nav');

  return (
    <footer
      className={`relative border-t ${RULE} bg-surface/90 text-ink-700 dark:bg-silk-50/90`}
    >
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14">
          <div>
            <Image
              width={145}
              height={46}
              src="/img/sdsc-logo.png"
              alt="SDSC logo"
              /* Matches the navbar: a wordmark, so it keeps a small radius
                 rather than the pill that was clipping its ends. */
              className="rounded-md object-cover dark:invert"
            />
            <p className="mt-6 max-w-sm text-sm leading-7 text-ink-700">
              {t('tagline')}
            </p>
            <Link
              href="/contact"
              className="group mt-7 inline-flex items-center gap-2 rounded-full border border-rose-200/70 bg-surface/85 px-5 py-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-rose-600 transition hover:border-rose-300 hover:text-rose-700"
            >
              {t('partnerWithUs')}
              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <nav aria-label={t('navigate')}>
            <FooterHeading>{t('navigate')}</FooterHeading>
            <ul className="mt-6 space-y-3.5">
              {quickLinks.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="text-sm text-ink-700 transition-colors duration-300 hover:text-rose-600"
                  >
                    {tNav(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <FooterHeading>{t('visit')}</FooterHeading>
            <address className="mt-6 space-y-5 text-sm not-italic leading-7 text-ink-700">
              <p className="flex items-start gap-3">
                <MapPin
                  size={17}
                  aria-hidden
                  className="mt-1 shrink-0 text-rose-600"
                />
                <span>
                  {CONTACT_ADDRESS_LINES.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </p>
              <p className="flex items-center gap-3">
                <Mail
                  size={17}
                  aria-hidden
                  className="shrink-0 text-rose-600"
                />
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="transition-colors duration-300 hover:text-rose-600"
                >
                  {CONTACT_EMAIL}
                </a>
              </p>
            </address>
          </div>
        </div>
      </div>

      <div className={`border-t ${RULE}`}>
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-5 text-[0.68rem] uppercase tracking-[0.26em] text-ink-500 md:flex-row">
          <span>{t('copyright', { year: new Date().getFullYear() })}</span>
          <span className="tabular-nums">{BUILD_VERSION}</span>
        </div>
      </div>
    </footer>
  );
};

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-silk-700">
      {children}
    </h3>
  );
}

export default Footer;
