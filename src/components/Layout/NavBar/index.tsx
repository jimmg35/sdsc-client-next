'use client';

import {
  AppWindowMac,
  ArrowUpRight,
  ChevronDown,
  Info,
  Megaphone,
  Menu,
  Microscope,
  PhoneCall,
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
  hasMega?: boolean;
};

type ResourceLink = {
  label: string;
  href: string;
  description: string;
  icon: LucideIcon;
};

const primaryNavItems: PrimaryNavItem[] = [
  { label: 'About', href: '/about', icon: Info },
  { label: 'Members', href: '/member', icon: UserRound },
  { label: 'Research', href: '/research', icon: Microscope },
  { label: 'MGWR', href: '/mgwr', icon: AppWindowMac },
  {
    label: 'Resources',
    href: '/publications',
    icon: ScrollText,
    hasMega: true
  },
  { label: 'Contact', href: '/contact', icon: PhoneCall }
];

const resourceLinks: ResourceLink[] = [
  {
    label: 'Publications',
    href: '/publications',
    description: 'Peer-reviewed insights and research outputs from the SDSC.',
    icon: ScrollText
  },
  {
    label: 'Updates',
    href: '/announcements',
    description: 'Official communications, initiatives, and leadership notes.',
    icon: Megaphone
  },
  {
    label: 'News',
    href: '/news',
    description: 'Stories highlighting people, partnerships, and milestones.',
    icon: Rss
  }
];

type NavItem = PrimaryNavItem;

const Navbar = () => {
  const pathname = usePathname();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);

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

  useEffect(() => {
    setIsMegaOpen(false);
    setIsResourcesOpen(false);
    setIsOpen(false);
  }, [pathname]);

  const backgroundClass =
    hasScrolled || isOpen
      ? 'bg-white/92 border-b border-silk-200/80 shadow-[0_24px_70px_-48px_rgba(61,47,39,0.32)] backdrop-blur-xl'
      : 'bg-white/80 border-b border-transparent backdrop-blur-sm';

  const openMega = () => setIsMegaOpen(true);
  const closeMega = () => setIsMegaOpen(false);

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
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${backgroundClass}`}
    >
      <nav
        className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 text-rose-700 md:h-20 md:px-6"
        onMouseLeave={closeMega}
      >
        <Image
          width={145}
          height={46}
          src="/img/sdsc-logo.png"
          alt="SDSC logo"
          className="cursor-pointer rounded-md object-cover"
          onClick={() => {
            window.location.href = '/';
          }}
        />

        <div className="hidden items-center gap-5 md:flex">
          <div className="flex items-center gap-3">
            {primaryNavItems.map((item) => {
              if (item.hasMega) {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={openMega}
                  >
                    <button
                      type="button"
                      className={`inline-flex items-center gap-2 rounded-full border border-transparent px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] transition ${
                        isMegaOpen || isActive
                          ? 'bg-rose-100/90 text-rose-700 shadow-[0_18px_44px_-28px_rgba(168,110,161,0.35)] border border-rose-200/70'
                          : 'text-gray-600 hover:text-gray-700 hover:bg-rose-50'
                      }`}
                      onClick={() => setIsMegaOpen((prev) => !prev)}
                      aria-expanded={isMegaOpen}
                      aria-haspopup="true"
                    >
                      <Icon size={16} />
                      {item.label}
                      <ChevronDown
                        size={14}
                        className={`transition-transform ${isMegaOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                  </div>
                );
              }

              return renderLink(item, 'desktop');
            })}
          </div>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-rose-200/70 bg-white text-rose-600 transition hover:text-rose-700 md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {isMegaOpen && (
          <div
            className="absolute left-0 right-0 top-full hidden pt-4 md:block"
            onMouseEnter={openMega}
            onMouseLeave={closeMega}
          >
            <div className="mx-auto max-w-5xl rounded-3xl border border-rose-200/70 bg-white/95 p-8 shadow-[0_40px_80px_-48px_rgba(61,47,39,0.45)] backdrop-blur">
              <div className="grid gap-6 md:grid-cols-3">
                {resourceLinks.map((link) => {
                  const LinkIcon = link.icon;
                  const isActive =
                    pathname === link.href ||
                    pathname.startsWith(`${link.href}/`);
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={`group flex h-full flex-col gap-3 rounded-2xl border border-transparent px-5 py-4 transition hover:border-rose-200/70 hover:bg-rose-50/60 ${
                        isActive ? 'border-rose-300 bg-rose-50/80' : ''
                      }`}
                    >
                      <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-rose-600">
                        <LinkIcon size={18} />
                        {link.label}
                      </span>
                      <p className="text-sm text-rose-900/70">
                        {link.description}
                      </p>
                      <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-rose-400 transition group-hover:text-rose-600">
                        Explore
                        <ArrowUpRight size={14} />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </nav>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-4 pb-6">
            <div className="space-y-4 rounded-3xl border border-rose-200/80 bg-white/95 p-6 shadow-[0_32px_64px_-42px_rgba(61,47,39,0.32)]">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-rose-500">
                Navigation
              </p>
              <div className="space-y-3">
                {primaryNavItems.map((item) => {
                  if (item.hasMega) {
                    const Icon = item.icon;
                    const isActive =
                      pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);

                    return (
                      <div key={item.label} className="space-y-2">
                        <button
                          type="button"
                          className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                            isActive || isResourcesOpen
                              ? 'border-rose-200 bg-rose-100/60 text-rose-700'
                              : 'border-rose-200/70 bg-white/85 text-rose-600 hover:bg-rose-50'
                          }`}
                          onClick={() => setIsResourcesOpen((prev) => !prev)}
                          aria-expanded={isResourcesOpen}
                          aria-haspopup="true"
                        >
                          <span className="inline-flex items-center gap-2">
                            <Icon size={18} />
                            {item.label}
                          </span>
                          <ChevronDown
                            size={16}
                            className={`transition-transform ${
                              isResourcesOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {isResourcesOpen && (
                          <div className="space-y-2 rounded-2xl border border-rose-100 bg-rose-50/70 px-4 py-3">
                            {resourceLinks.map((link) => {
                              const LinkIcon = link.icon;
                              return (
                                <Link
                                  key={link.label}
                                  href={link.href}
                                  className="flex items-center justify-between rounded-xl px-2 py-2 text-sm text-rose-600 transition hover:bg-white"
                                  onClick={() => {
                                    setIsOpen(false);
                                    setIsResourcesOpen(false);
                                  }}
                                >
                                  <span className="inline-flex items-center gap-2">
                                    <LinkIcon size={16} />
                                    {link.label}
                                  </span>
                                  <span className="text-[0.65rem] uppercase tracking-[0.3em] text-rose-400">
                                    Go
                                  </span>
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return renderLink(item, 'mobile');
                })}
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
