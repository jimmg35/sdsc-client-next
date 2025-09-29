'use client';

import {
  AppWindowMac,
  Info,
  Menu,
  Microscope,
  PhoneCall,
  Rss,
  ScrollText,
  UserRound,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'About', href: '/about', icon: Info },
  { label: 'Members', href: '/member', icon: UserRound },
  { label: 'Research', href: '/research', icon: Microscope },
  { label: 'MGWR', href: '/mgwr', icon: AppWindowMac },
  { label: 'Publications', href: '/publications', icon: ScrollText },
  { label: 'News', href: '/news', icon: Rss },
  { label: 'Contact', href: '/contact', icon: PhoneCall }
] as const;

type NavItem = (typeof navItems)[number];

const Navbar = () => {
  const pathname = usePathname();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
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

  const backgroundClass =
    hasScrolled || isOpen
      ? 'bg-white/92 border-b border-silk-200/80 shadow-[0_24px_70px_-48px_rgba(61,47,39,0.32)] backdrop-blur-xl'
      : 'bg-white/80 border-b border-transparent backdrop-blur-sm';

  const renderLink = (item: NavItem, variant: 'desktop' | 'mobile') => {
    const Icon = item.icon;
    const isActive =
      pathname === item.href || pathname.startsWith(`${item.href}/`);

    if (variant === 'desktop') {
      return (
        <Link
          key={item.label}
          href={item.href}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] transition ${
            isActive
              ? 'bg-rose-100/90 text-rose-700 shadow-[0_18px_44px_-28px_rgba(168,110,161,0.35)] border border-rose-200/70'
              : 'text-rose-600 hover:text-rose-700 hover:bg-rose-50'
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
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${backgroundClass}`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 text-rose-700 md:h-20 md:px-6 gap-6">
        <Image
          width={145}
          height={46}
          src="/img/sdsc-logo.png"
          alt="SDSC logo"
          className="rounded-full object-cover cursor-pointer"
          onClick={() => {
            window.location.href = '/';
          }}
        />

        <div className="hidden items-center gap-5 md:flex">
          <div className="flex items-center gap-3">
            {navItems.map((item) => renderLink(item, 'desktop'))}
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-silk-300 bg-silk-200/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-silk-800 transition hover:bg-silk-200"
          >
            Connect
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-rose-200/70 bg-white text-rose-600 transition hover:text-rose-700 md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-4 pb-6">
            <div className="space-y-4 rounded-3xl border border-rose-200/80 bg-white/95 p-6 shadow-[0_32px_64px_-42px_rgba(61,47,39,0.32)]">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-rose-500">
                Navigation
              </p>
              <div className="space-y-3">
                {navItems.map((item) => renderLink(item, 'mobile'))}
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
    </header>
  );
};

export default Navbar;
