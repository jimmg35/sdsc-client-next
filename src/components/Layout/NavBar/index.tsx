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
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const backgroundClass = isOpen
    ? 'bg-white shadow-[0_18px_48px_-28px_rgba(120,47,64,0.45)] backdrop-blur-xl border-b border-garnet-100/60'
    : hasScrolled
      ? 'bg-white/85 shadow-[0_18px_48px_-28px_rgba(120,47,64,0.45)] backdrop-blur-xl border-b border-garnet-100/60'
      : 'bg-white border-b border-transparent';

  const renderLink = (item: NavItem, variant: 'desktop' | 'mobile') => {
    const Icon = item.icon;
    const isActive =
      pathname === item.href || pathname.startsWith(`${item.href}/`);

    if (variant === 'desktop') {
      return (
        <Link
          key={item.label}
          href={item.href}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] transition ${
            isActive
              ? 'bg-gold-100/90 text-garnet-700 shadow-[0_14px_30px_-22px_rgba(120,47,64,0.65)] border border-garnet-200/70'
              : 'text-garnet-600 hover:text-garnet-700 hover:bg-gold-100/60'
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
        className={`flex items-center justify-between rounded-xl border border-garnet-200/60 px-4 py-3 text-sm font-medium text-garnet-700 transition ${
          isActive ? 'bg-gold-100/90' : 'bg-white/85 hover:bg-gold-100/70'
        }`}
        onClick={() => setIsOpen(false)}
      >
        <span className="inline-flex items-center gap-2">
          <Icon size={18} />
          {item.label}
        </span>
        <span className="text-[0.65rem] uppercase tracking-[0.3em] text-garnet-500">
          Explore
        </span>
      </Link>
    );
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${backgroundClass}`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-20 md:px-6">
        <div className="hidden items-center gap-4 md:flex">
          <div className="flex items-center gap-3">
            <Link href="/" className="">
              <Image
                src="/img/sdsc-logo.png"
                alt="SDSC logo"
                width={145.8}
                height={46.3}
                priority
                className="h-8 w-auto md:h-10"
              />
            </Link>
            {navItems.map((item) => renderLink(item, 'desktop'))}
          </div>
          {/* <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-garnet-300/70 bg-garnet-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-garnet-500"
          >
            Connect
          </Link> */}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-garnet-200/70 bg-white/80 text-garnet-600 transition hover:bg-gold-100/80 md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-4 pb-6">
            <div className="space-y-3 rounded-3xl border border-garnet-200/60 bg-white/90 p-5 shadow-[0_28px_60px_-32px_rgba(120,47,64,0.45)]">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-garnet-500">
                Navigation
              </p>
              <div className="space-y-3">
                {navItems.map((item) => renderLink(item, 'mobile'))}
              </div>
              <Link
                href="/contact"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-garnet-300/70 bg-garnet-600 px-4 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-garnet-500"
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
