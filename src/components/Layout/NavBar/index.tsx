'use client';

// import NotificationBanner from '@/components/Layout/NotificationBanner';
import LanguageSwitcher from '@/components/Layout/LanguageSwitcher';
import OfficialSiteBar from '@/components/Layout/OfficialSiteBar';
import ThemeToggle from '@/components/Layout/ThemeToggle';
import { Link, usePathname } from '@/i18n/navigation';
import easternEgg from '@/lib/easterneggs';
import {
  AppWindowMac,
  // PhoneCall,
  Home,
  // Info,
  // Megaphone,
  Menu,
  Microscope,
  Rss,
  ScrollText,
  UserRound,
  X
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

type PrimaryNavItem = {
  key: string;
  href: string;
  icon: LucideIcon;
};

const primaryNavItems: PrimaryNavItem[] = [
  { key: 'home', href: '/', icon: Home },
  { key: 'members', href: '/member', icon: UserRound },
  { key: 'research', href: '/research', icon: Microscope },
  { key: 'mgwr', href: '/mgwr', icon: AppWindowMac },
  { key: 'publications', href: '/publications', icon: ScrollText },
  { key: 'news', href: '/news', icon: Rss }
  // { key: 'contact', href: '/contact', icon: PhoneCall }
];

type NavItem = PrimaryNavItem;

// Roughly how much horizontal room the six nav labels need. CJK glyphs are
// about double the advance width of a Latin cap, so they count double. Locales
// past this budget (currently es/fr) get tighter tracking instead of
// overflowing the fixed-width shell.
const DENSE_LABEL_BUDGET = 44;

const measureLabelWeight = (labels: string[]) =>
  labels.reduce(
    (total, label) =>
      total +
      [...label].reduce(
        (width, char) => width + (/[㐀-鿿豈-﫿]/.test(char) ? 2 : 1),
        0
      ),
    0
  );

const Navbar = () => {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const isDense =
    measureLabelWeight(primaryNavItems.map((item) => t(item.key))) >
    DENSE_LABEL_BUDGET;

  useEffect(() => {
    console.log(easternEgg);
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const shellClass = hasScrolled
    ? `mx-auto mt-3 w-[calc(100%_-_1rem)] max-w-6xl border border-white/80 bg-surface/95 shadow-[0_18px_48px_-28px_rgba(31,22,18,0.38),0_3px_12px_-8px_rgba(31,22,18,0.24)] ring-1 ring-black/5 backdrop-blur-xl dark:border-white/10 dark:bg-silk-100/95 dark:ring-white/5 ${
        isOpen ? 'rounded-[2rem]' : 'rounded-full'
      }`
    : 'w-full border-b border-rose-100 bg-surface shadow-[0_30px_80px_-60px_rgba(61,47,39,0.28)] dark:bg-silk-50';

  const navClass = hasScrolled
    ? 'relative mx-auto flex h-14 max-w-none items-center justify-between gap-4 px-3 text-rose-700 md:h-16 md:px-5'
    : 'relative mx-auto flex h-[3.75rem] max-w-6xl items-center justify-between gap-6 px-4 text-rose-700 md:h-[4.5rem] md:px-6';

  const renderLink = (item: NavItem, variant: 'desktop' | 'mobile') => {
    const Icon = item.icon;
    const label = t(item.key);
    const isActive =
      pathname === item.href || pathname.startsWith(`${item.href}/`);

    if (variant === 'desktop') {
      return (
        <Link
          key={item.key}
          href={item.href}
          className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full font-semibold uppercase transition ${
            hasScrolled
              ? isDense
                ? 'px-2 py-2 text-[0.68rem] tracking-[0.04em] xl:px-2.5 xl:tracking-[0.08em]'
                : 'px-2.5 py-2 text-[0.68rem] tracking-[0.06em] xl:px-3 xl:tracking-[0.16em]'
              : isDense
                ? 'px-2.5 py-2 text-[0.68rem] tracking-[0.04em] xl:px-3 xl:text-[0.72rem] xl:tracking-[0.1em]'
                : 'px-3 py-2 text-[0.7rem] tracking-[0.08em] xl:px-4 xl:text-xs xl:tracking-[0.2em]'
          } ${
            isActive
              ? 'bg-rose-100/90 text-rose-700 shadow-[0_18px_44px_-28px_rgba(168,110,161,0.35)] border border-rose-200/70'
              : 'text-ink-700 hover:text-ink-900 hover:bg-rose-50'
          }`}
        >
          <Icon size={16} className="hidden xl:block" />
          {label}
        </Link>
      );
    }

    return (
      <Link
        key={item.key}
        href={item.href}
        className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition ${
          isActive
            ? 'border-rose-200 bg-rose-100/60 text-rose-700'
            : 'border-rose-200/70 bg-surface/85 text-rose-600 hover:bg-rose-50 dark:bg-silk-200/85'
        }`}
        onClick={() => setIsOpen(false)}
      >
        <span className="inline-flex items-center gap-2">
          <Icon size={18} />
          {label}
        </span>
        <span className="text-[0.65rem] uppercase tracking-[0.3em] text-rose-400">
          {t('explore')}
        </span>
      </Link>
    );
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          hasScrolled
            ? 'max-h-0 -translate-y-2 opacity-0'
            : 'max-h-10 translate-y-0 opacity-100'
        }`}
      >
        <OfficialSiteBar />
      </div>

      <div className={`transition-all duration-300 ease-out ${shellClass}`}>
        <nav className={navClass}>
          <Link href="/" aria-label={t('home')} className="shrink-0">
            <Image
              width={hasScrolled ? 118 : 145}
              height={hasScrolled ? 38 : 46}
              src="/img/sdsc-logo.png"
              alt="SDSC logo"
              className={`cursor-pointer rounded-md object-cover transition-all duration-300 ${
                hasScrolled ? 'max-w-[7.375rem]' : 'max-w-[9.0625rem]'
              }`}
            />
          </Link>

          <div className="hidden min-w-0 items-center gap-3 lg:flex">
            <div
              className={`flex min-w-0 items-center ${
                hasScrolled
                  ? 'gap-0.5 xl:gap-1.5'
                  : isDense
                    ? 'gap-0.5 xl:gap-1.5'
                    : 'gap-1 xl:gap-3'
              }`}
            >
              {primaryNavItems.map((item) => renderLink(item, 'desktop'))}
            </div>
            <ThemeToggle />
            <LanguageSwitcher />
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-rose-200/70 bg-surface text-rose-600 transition hover:text-rose-700 dark:bg-silk-200 lg:hidden"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>

        {/* <NotificationBanner /> */}

        {isOpen && (
          <div className="lg:hidden">
            <div className={hasScrolled ? 'px-3 pb-4' : 'px-4 pb-6'}>
              <div className="space-y-4 rounded-3xl border border-rose-200/80 bg-surface/95 p-6 shadow-[0_32px_64px_-42px_rgba(61,47,39,0.32)] dark:bg-silk-100/95">
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-rose-500">
                  {t('navigation')}
                </p>
                <div className="space-y-3">
                  {primaryNavItems.map((item) => renderLink(item, 'mobile'))}
                </div>
                <div className="flex items-center gap-3">
                  <ThemeToggle variant="mobile" />
                  <div className="min-w-0 flex-1">
                    <LanguageSwitcher variant="mobile" />
                  </div>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-silk-300 bg-silk-200/90 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-silk-800 transition hover:bg-silk-200"
                  onClick={() => setIsOpen(false)}
                >
                  {t('partnerCta')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
