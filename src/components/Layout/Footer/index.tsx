import {
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Twitter
} from 'lucide-react';
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

const socialLinks = [
  { label: 'Twitter', href: '#', icon: Twitter },
  { label: 'LinkedIn', href: '#', icon: Linkedin },
  { label: 'GitHub', href: '#', icon: Github }
];

const Footer = async () => {
  const t = await getTranslations('footer');
  const tNav = await getTranslations('nav');

  return (
    <footer className="relative border-t border-silk-200/80 bg-surface/90 text-ink-700 dark:bg-silk-50/90">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_15%_-10%,_rgba(198,164,215,0.28),_transparent_55%),_radial-gradient(105%_105%_at_80%_-15%,_rgba(194,156,106,0.24),_transparent_60%)]" />

      <div className="relative mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-5">
            <Image
              width={145}
              height={46}
              src="/img/sdsc-logo.png"
              alt="SDSC logo"
              className="rounded-full object-cover dark:invert"
            />
            <p className="max-w-xs text-sm leading-6 text-ink-700/80">
              {t('tagline')}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-silk-300 bg-silk-200/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-silk-800 transition hover:bg-silk-200"
            >
              {t('partnerWithUs')}
              <ArrowUpRight size={16} />
            </Link>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.34em] text-rose-500/80">
              {t('navigate')}
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {quickLinks.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 text-ink-700/80 transition hover:text-rose-600"
                  >
                    <span className="h-px w-6 bg-rose-200/70" />
                    {tNav(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 text-sm">
            <h3 className="text-xs font-semibold uppercase tracking-[0.34em] text-rose-500/80">
              {t('visit')}
            </h3>
            <p className="flex items-start gap-3 text-ink-700/80">
              <MapPin size={18} className="text-rose-500" />
              <span>
                Spatial Data Science Center
                <br />
                Florida State University
                <br />
                Tallahassee, FL 32306
              </span>
            </p>
            <p className="flex items-center gap-3 text-ink-700/80">
              <Mail size={18} className="text-rose-500" />
              <span>admin@sdsc.edu</span>
            </p>
          </div>

          <div className="space-y-5" hidden>
            <h3 className="text-xs font-semibold uppercase tracking-[0.34em] text-rose-500/80">
              Stay connected
            </h3>
            <p className="text-sm text-ink-700/80">
              Join our newsletter for research updates, event invites, and MGWR
              release notes.
            </p>
            <form className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                name="email"
                aria-label="Email"
                placeholder="Email address"
                className="flex-1 rounded-full border border-rose-200/80 bg-surface px-4 py-2 text-sm text-ink-700 placeholder:text-ink-500/70 focus:outline-none focus:ring-2 focus:ring-rose-200"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full border border-silk-300 bg-silk-200/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-silk-800 transition hover:bg-silk-200"
              >
                Join
              </button>
            </form>
            <div className="flex gap-3">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-rose-200/60 bg-surface text-rose-600 transition hover:bg-rose-50 hover:text-rose-700"
                    aria-label={item.label}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-silk-200/80 bg-surface/80 dark:bg-silk-100/80">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-4 text-[0.7rem] uppercase tracking-[0.3em] text-ink-500 md:flex-row">
          <span>SDSC - Florida State University</span>
          <span>{t('copyright', { year: new Date().getFullYear() })}</span>
          <span>Version b0.20260119.283</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
