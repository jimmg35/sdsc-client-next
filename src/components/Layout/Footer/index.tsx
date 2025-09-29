import {
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  MapPin,
  PhoneCall,
  Twitter
} from 'lucide-react';
import Link from 'next/link';

const quickLinks = [
  { label: 'About', href: '/about' },
  { label: 'Members', href: '/member' },
  { label: 'Research', href: '/research' },
  { label: 'MGWR', href: '/mgwr' },
  { label: 'Publications', href: '/publications' },
  { label: 'News', href: '/news' },
  { label: 'Contact', href: '/contact' }
];

const socialLinks = [
  { label: 'Twitter', href: '#', icon: Twitter },
  { label: 'LinkedIn', href: '#', icon: Linkedin },
  { label: 'GitHub', href: '#', icon: Github }
];

const Footer = () => {
  return (
    <footer className="relative mt-24 border-t border-garnet-100/60 bg-white/85 text-ink-700">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_15%_-10%,_rgba(206,184,136,0.28),_transparent_55%),_radial-gradient(110%_110%_at_85%_-20%,_rgba(120,47,64,0.18),_transparent_60%)]" />

      <div className="relative mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-garnet-200/60 bg-gold-100/70">
                <span className="h-6 w-6 rounded-full bg-garnet-600/80" />
              </span>
              <div className="text-left">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-garnet-600">
                  SDSC
                </p>
                <p className="text-[0.65rem] uppercase tracking-[0.34em] text-ink-500">
                  Spatial Data Science Center
                </p>
              </div>
            </div>
            <p className="max-w-xs text-sm leading-6 text-ink-600">
              SDSC pairs spatial analytics, design, and community partnerships
              to translate geospatial intelligence into impact across Florida
              State University and beyond.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-garnet-200/70 bg-gold-100/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-garnet-600 transition hover:border-garnet-300 hover:bg-gold-100 hover:text-garnet-700"
            >
              Partner with us
              <ArrowUpRight size={16} />
            </Link>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.32em] text-garnet-500">
              Navigate
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 text-ink-600 transition hover:text-garnet-700"
                  >
                    <span className="h-px w-6 bg-garnet-200/70" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 text-sm">
            <h3 className="text-xs font-semibold uppercase tracking-[0.32em] text-garnet-500">
              Visit
            </h3>
            <p className="flex items-start gap-3 text-ink-600">
              <MapPin size={18} className="text-garnet-600" />
              <span>
                Department of Geography Florida State University Tallahassee, FL
                32306
              </span>
            </p>
            <p className="flex items-center gap-3 text-ink-600">
              <PhoneCall size={18} className="text-garnet-600" />
              <span>+1 (850) 123-4567</span>
            </p>
            <p className="flex items-center gap-3 text-ink-600">
              <Mail size={18} className="text-garnet-600" />
              <span>contact@sdsc.fsu.edu</span>
            </p>
          </div>

          <div className="space-y-5">
            <h3 className="text-xs font-semibold uppercase tracking-[0.32em] text-garnet-500">
              Stay connected
            </h3>
            <p className="text-sm text-ink-600">
              Join our newsletter for research updates, event invites, and MGWR
              release notes.
            </p>
            <form className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                name="email"
                aria-label="Email"
                placeholder="Email address"
                className="flex-1 rounded-full border border-garnet-200/70 bg-white/80 px-4 py-2 text-sm text-ink-700 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-garnet-300"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full border border-garnet-300/70 bg-garnet-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-garnet-500"
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
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-garnet-200/70 bg-white/80 text-garnet-600 transition hover:bg-gold-100/80 hover:text-garnet-700"
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

      <div className="relative border-t border-garnet-100/60 bg-white/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-4 text-[0.7rem] uppercase tracking-[0.28em] text-ink-500 md:flex-row">
          <span>SDSC �V Florida State University</span>
          <span>
            c {new Date().getFullYear()} Spatial Data Science Center. All rights
            reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
