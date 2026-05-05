'use client';

// import NotificationBanner from '@/components/Layout/NotificationBanner';
import OfficialSiteBar from '@/components/Layout/OfficialSiteBar';
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
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type PrimaryNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const primaryNavItems: PrimaryNavItem[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Members', href: '/member', icon: UserRound },
  { label: 'Research', href: '/research', icon: Microscope },
  { label: 'MGWR', href: '/mgwr', icon: AppWindowMac },
  { label: 'Publications', href: '/publications', icon: ScrollText },
  { label: 'News', href: '/news', icon: Rss }
  // { label: 'Contact', href: '/contact', icon: PhoneCall }
];

type NavItem = PrimaryNavItem;

const Navbar = () => {
  const pathname = usePathname();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
    ? `mx-auto mt-3 w-[calc(100%_-_1rem)] max-w-5xl border border-white/80 bg-white/95 shadow-[0_18px_48px_-28px_rgba(31,22,18,0.38),0_3px_12px_-8px_rgba(31,22,18,0.24)] ring-1 ring-black/5 backdrop-blur-xl ${
        isOpen ? 'rounded-[2rem]' : 'rounded-full'
      }`
    : 'w-full border-b border-rose-100 bg-white shadow-[0_30px_80px_-60px_rgba(61,47,39,0.28)]';

  const navClass = hasScrolled
    ? 'relative mx-auto flex h-14 max-w-none items-center justify-between gap-4 px-3 text-rose-700 md:h-16 md:px-5'
    : 'relative mx-auto flex h-[3.75rem] max-w-6xl items-center justify-between gap-6 px-4 text-rose-700 md:h-[4.5rem] md:px-6';

  const renderLink = (item: NavItem, variant: 'desktop' | 'mobile') => {
    const Icon = item.icon;
    const isActive =
      pathname === item.href || pathname.startsWith(`${item.href}/`);

    if (variant === 'desktop') {
      return (
        <Link
          key={item.label}
          href={item.href}
          className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full font-semibold uppercase transition ${
            hasScrolled
              ? 'px-3 py-2 text-[0.68rem] tracking-[0.16em]'
              : 'px-4 py-2 text-xs tracking-[0.28em]'
          } ${
            isActive
              ? 'bg-rose-100/90 text-rose-700 shadow-[0_18px_44px_-28px_rgba(168,110,161,0.35)] border border-rose-200/70'
              : 'text-gray-600 hover:text-gray-700 hover:bg-rose-50'
          }`}
        >
          <Icon size={16} />
          {item.label}
        </Link>
      );
    }

    return (
      <Link
        key={item.label}
        href={item.href}
        className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition ${
          isActive
            ? 'border-rose-200 bg-rose-100/60 text-rose-700'
            : 'border-rose-200/70 bg-white/85 text-rose-600 hover:bg-rose-50'
        }`}
        onClick={() => setIsOpen(false)}
      >
        <span className="inline-flex items-center gap-2">
          <Icon size={18} />
          {item.label}
        </span>
        <span className="text-[0.65rem] uppercase tracking-[0.3em] text-rose-400">
          Explore
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
          <Image
            width={hasScrolled ? 118 : 145}
            height={hasScrolled ? 38 : 46}
            src="/img/sdsc-logo.png"
            alt="SDSC logo"
            className={`cursor-pointer rounded-md object-cover transition-all duration-300 ${
              hasScrolled ? 'max-w-[7.375rem]' : 'max-w-[9.0625rem]'
            }`}
            onClick={() => {
              window.location.href = '/';
            }}
          />

          <div className="hidden items-center gap-4 md:flex">
            <div
              className={`flex items-center ${
                hasScrolled ? 'gap-1.5' : 'gap-3'
              }`}
            >
              {primaryNavItems.map((item) => renderLink(item, 'desktop'))}
            </div>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-rose-200/70 bg-white text-rose-600 transition hover:text-rose-700 md:hidden"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>

        {/* <NotificationBanner /> */}

        {isOpen && (
          <div className="md:hidden">
            <div className={hasScrolled ? 'px-3 pb-4' : 'px-4 pb-6'}>
              <div className="space-y-4 rounded-3xl border border-rose-200/80 bg-white/95 p-6 shadow-[0_32px_64px_-42px_rgba(61,47,39,0.32)]">
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-rose-500">
                  Navigation
                </p>
                <div className="space-y-3">
                  {primaryNavItems.map((item) => renderLink(item, 'mobile'))}
                </div>
                <Link
                  href="/contact"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-silk-300 bg-silk-200/90 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-silk-800 transition hover:bg-silk-200"
                  onClick={() => setIsOpen(false)}
                >
                  Partner with SDSC
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
