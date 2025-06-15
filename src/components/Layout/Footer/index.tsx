import {
  CalendarDays,
  Info,
  Microscope,
  PhoneCall,
  Rss,
  ScrollText,
  UserRound
} from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Logo and About */}
        <div>
          <h2 className="text-white text-xl font-semibold mb-4">SDSC</h2>
          <p className="text-sm leading-relaxed">
            The Spatial Data Science Center (SDSC) at Florida State University
            pioneers research in spatial analysis, AI, and geographic modeling.
          </p>
        </div>

        {/* Quick Links - using NavDirection */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li key="About">
              <Link
                href="/about"
                className="flex items-center gap-2 hover:underline"
              >
                <Info size={18} />
                About
              </Link>
            </li>

            <li key="Member">
              <Link
                href="/member"
                className="flex items-center gap-2 hover:underline"
              >
                <UserRound size={18} />
                Member
              </Link>
            </li>

            <li key="Research">
              <Link
                href="/research"
                className="flex items-center gap-2 hover:underline"
              >
                <Microscope size={18} />
                Research
              </Link>
            </li>

            <li key="Publications">
              <Link
                href="/publications"
                className="flex items-center gap-2 hover:underline"
              >
                <ScrollText size={18} />
                Publications
              </Link>
            </li>

            <li key="Events">
              <Link
                href="/events"
                className="flex items-center gap-2 hover:underline"
              >
                <CalendarDays size={18} />
                Events
              </Link>
            </li>

            <li key="News">
              <Link
                href="/news"
                className="flex items-center gap-2 hover:underline"
              >
                <Rss size={18} />
                News
              </Link>
            </li>

            <li key="Contact">
              <Link
                href="/contact"
                className="flex items-center gap-2 hover:underline"
              >
                <PhoneCall size={18} />
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact</h3>
          <ul className="text-sm space-y-2">
            <li>Email: sdsc@fsu.edu</li>
            <li>Phone: +1 (888) 888-8888</li>
            <li>FSU Geography Dept, Tallahassee, FL</li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-white font-semibold mb-4">Follow Us</h3>
          <div className="flex space-x-4 text-xl">
            <a href="#" className="hover:text-white" aria-label="Twitter">
              Twitter
            </a>
            <a href="#" className="hover:text-white" aria-label="LinkedIn">
              LinkedIn
            </a>
            <a href="#" className="hover:text-white" aria-label="GitHub">
              GitHub
            </a>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 text-center text-sm text-gray-400 py-4">
        © {new Date().getFullYear()} SDSC. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
