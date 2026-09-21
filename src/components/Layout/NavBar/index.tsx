'use client';

// import NotificationBanner from '@/components/Layout/NotificationBanner';
import OfficialSiteBar from '@/components/Layout/OfficialSiteBar';
import ThemeToggle from '@/components/Layout/ThemeToggle';
import easternEgg from '@/lib/easterneggs';
import {
  AppWindowMac,
  ArrowUpRight,
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
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

// Roughly how much horizontal room the six nav labels need. CJK glyphs are
// about double the advance width of a Latin cap, so they count double. Labels
// past this budget get tighter tracking instead of overflowing the fixed-width
// shell. Inert while the site is English-only, but kept for when the other
// locales (es/fr, which do exceed the budget) come back.
const DENSE_LABEL_BUDGET = 44;

const measureLabelWeight = (labels: string[]) =>
  labels.reduce(
    (total, label) =>
      total +
      [...label].reduce(
        (width, char) => width + (/[㐀-鿿豈-﫿]/.test(char) ? 2 : 1),
        0
      ),
    0
  );

// The bar docks into the floating shell past SCROLL_ENTER and only undocks
// again below SCROLL_EXIT. The gap between the two keeps a slow scroll or a
// trackpad's rubber-band settling near the threshold from toggling it back and
// forth every frame.
const SCROLL_ENTER = 32;
const SCROLL_EXIT = 8;

// Every scroll-driven transition shares one duration and curve so the shell,
// the bar's height, the logo and the official bar move as a single piece.
const MORPH =
  'duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none';

const isActivePath = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

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
  }, []);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setHasScrolled((prev) => (prev ? y > SCROLL_EXIT : y > SCROLL_ENTER));
    };

    // Coalesce to one read per frame; scroll can fire several times per frame.
    const handleScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    // The panel is lg:hidden, so widening past lg would leave the page
    // scroll-locked behind a menu nobody can see.
    const desktop = window.matchMedia('(min-width: 64rem)');
    const handleBreakpoint = () => {
      if (desktop.matches) setIsOpen(false);
    };

    window.addEventListener('keydown', handleKey);
    desktop.addEventListener('change', handleBreakpoint);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
      desktop.removeEventListener('change', handleBreakpoint);
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Only properties that interpolate are switched here: width and max-width
  // stay lengths/percentages in both states, and the radius is a real length
  // rather than `rounded-full`'s 9999px, which would sit at "fully round" for
  // almost the whole transition and then snap square at the last frame.
  const shellClass = `mx-auto border transition-[width,max-width,margin,border-radius,border-color,background-color,box-shadow] ${MORPH} ${
    hasScrolled
      ? 'mt-3 w-[calc(100%_-_1rem)] max-w-6xl rounded-[28px] border-silk-600/20 bg-surface/80 shadow-[0_14px_36px_-22px_rgba(44,36,32,0.4)] backdrop-blur-xl backdrop-saturate-150 md:rounded-[32px] dark:bg-silk-100/80 dark:shadow-[0_14px_36px_-22px_rgba(0,0,0,0.8)]'
      : 'mt-0 w-full max-w-full rounded-none border-transparent border-b-silk-600/20 bg-surface shadow-none dark:bg-silk-50'
  }`;

  const navClass = `relative mx-auto flex max-w-6xl items-center justify-between gap-4 text-rose-700 transition-[height,padding] ${MORPH} ${
    hasScrolled
      ? 'h-14 px-3 md:h-16 md:px-5'
      : 'h-[3.75rem] px-4 md:h-[4.5rem] md:px-6'
  }`;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Scrim behind the open mobile panel; tapping it closes the menu. */}
      <div
        aria-hidden
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 -z-10 bg-ink-900/25 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      {/* Collapsing a 1fr row to 0fr animates to the bar's real height, where
          a max-height guess would either clip it or spend part of the
          transition moving nothing. */}
      <div
        className={`grid transition-[grid-template-rows,opacity] ${MORPH} ${
          hasScrolled
            ? 'grid-rows-[0fr] opacity-0'
            : 'grid-rows-[1fr] opacity-100'
        }`}
        inert={hasScrolled}
      >
        <div className="min-h-0 overflow-hidden">
          <OfficialSiteBar />
        </div>
      </div>

      <div className={shellClass}>
        <nav className={navClass}>
          <Link
            href="/"
            aria-label={t('home')}
            className="shrink-0 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-400"
          >
            {/* Shrunk with a transform rather than new width/height props, so
                the image is never re-laid-out or re-requested mid-scroll. */}
            <Image
              width={145}
              height={46}
              src="/img/sdsc-logo.png"
              alt="SDSC logo"
              priority
              className={`w-[9.0625rem] origin-left rounded-md object-cover transition-transform dark:invert ${MORPH} ${
                hasScrolled ? 'scale-[0.82]' : 'scale-100'
              }`}
            />
          </Link>

          <div className="hidden min-w-0 items-center gap-3 lg:flex">
            <ul
              className={`flex min-w-0 items-center ${
                isDense ? 'gap-0.5 xl:gap-1' : 'gap-1 xl:gap-1.5'
              }`}
            >
              {primaryNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(pathname, item.href);

                return (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={`group relative inline-flex items-center gap-2 whitespace-nowrap rounded-md py-2 text-[0.7rem] font-semibold uppercase transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400 ${
                        isDense
                          ? 'px-2 tracking-[0.04em] xl:px-2.5 xl:tracking-[0.1em]'
                          : 'px-2.5 tracking-[0.08em] xl:px-3 xl:text-xs xl:tracking-[0.16em]'
                      } ${
                        isActive
                          ? 'text-rose-700'
                          : 'text-ink-700 hover:text-ink-900'
                      }`}
                    >
                      <Icon size={15} className="hidden xl:block" />
                      {t(item.key)}
                      <span
                        aria-hidden
                        className={`pointer-events-none absolute inset-x-2 bottom-0.5 h-px origin-center bg-current transition-transform duration-300 ease-out motion-reduce:transition-none ${
                          isActive
                            ? 'scale-x-100'
                            : 'scale-x-0 group-hover:scale-x-100'
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
            <span aria-hidden className="h-5 w-px bg-silk-600/25" />
            <ThemeToggle />
          </div>

          <button
            type="button"
            className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-silk-600/25 bg-surface/80 text-rose-600 transition hover:border-rose-300 hover:text-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400 dark:bg-silk-200/80 lg:hidden"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle navigation"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            <Menu
              size={18}
              className={`absolute transition duration-300 motion-reduce:transition-none ${
                isOpen ? 'rotate-90 scale-50 opacity-0' : 'opacity-100'
              }`}
            />
            <X
              size={18}
              className={`absolute transition duration-300 motion-reduce:transition-none ${
                isOpen ? 'opacity-100' : '-rotate-90 scale-50 opacity-0'
              }`}
            />
          </button>
        </nav>

        {/* <NotificationBanner /> */}

        <div
          id="mobile-navigation"
          className={`grid transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none lg:hidden ${
            isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
          inert={!isOpen}
        >
          <div className="min-h-0 overflow-hidden">
            <div
              className={`border-t border-silk-600/20 pt-5 ${
                hasScrolled ? 'mx-3 pb-4' : 'mx-4 pb-6'
              }`}
            >
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-rose-500">
                {t('navigation')}
              </p>

              <ul className="mt-2 divide-y divide-silk-600/15">
                {primaryNavItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = isActivePath(pathname, item.href);

                  return (
                    <li
                      key={item.key}
                      className={`transition duration-300 ease-out motion-reduce:transition-none ${
                        isOpen
                          ? 'translate-y-0 opacity-100'
                          : '-translate-y-1 opacity-0'
                      }`}
                      style={{
                        transitionDelay: isOpen ? `${60 + index * 35}ms` : '0ms'
                      }}
                    >
                      <Link
                        href={item.href}
                        aria-current={isActive ? 'page' : undefined}
                        onClick={() => setIsOpen(false)}
                        className={`group flex items-center justify-between py-3.5 text-[0.95rem] font-medium transition-colors ${
                          isActive
                            ? 'text-rose-700'
                            : 'text-ink-700 hover:text-ink-900'
                        }`}
                      >
                        <span className="inline-flex items-center gap-3">
                          <Icon
                            size={17}
                            className={
                              isActive ? 'text-rose-600' : 'text-ink-500'
                            }
                          />
                          {t(item.key)}
                        </span>
                        <ArrowUpRight
                          size={16}
                          className="text-ink-500 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-4 flex items-center gap-3 border-t border-silk-600/15 pt-4">
                <ThemeToggle variant="mobile" />
                <Link
                  href="/contact"
                  className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-silk-300 bg-silk-200/90 px-4 text-xs font-semibold uppercase tracking-[0.24em] text-silk-800 transition hover:bg-silk-200"
                  onClick={() => setIsOpen(false)}
                >
                  {t('partnerCta')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
