'use client';

import {
  CircleX,
  Info,
  Menu,
  Microscope,
  PhoneCall,
  Rss,
  ScrollText,
  UserRound
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const NavDirection = [
  { name: 'About', href: '/about', icon: <Info size={18} /> },
  { name: 'Member', href: '/member', icon: <UserRound size={18} /> },
  { name: 'Research', href: '/research', icon: <Microscope size={18} /> },
  {
    name: 'Publications',
    href: '/publications',
    icon: <ScrollText size={18} />
  },
  // { name: 'Events', href: '/events', icon: <CalendarDays size={18} /> },
  { name: 'News', href: '/news', icon: <Rss size={18} /> },
  { name: 'Contact', href: '/contact', icon: <PhoneCall size={18} /> }
];

const scrolledStyle = 'bg-white text-black h-[80px] shadow-md';
// const notScrolledStyle = 'bg-transparent text-white h-[110px]';
const notScrolledStyle = 'bg-white text-black h-[80px]';

const Navbar = ({
  isForcedScrolled = false
}: {
  isForcedScrolled?: boolean;
}) => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 flex items-center
        ${
          isForcedScrolled
            ? scrolledStyle
            : isScrolled
              ? scrolledStyle
              : notScrolledStyle
        }
      `}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <Link href="/">
          <div className="text-teal-400 text-3xl font-bold transition">
            {/* SDSC */}
            <Image
              src={`/img/sdsc-logo.png`}
              width={145}
              height={46}
              alt="SDSC"
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-8">
          {NavDirection.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`hover:text-teal-400 hover:border-teal-400 flex items-center justify-center gap-1 text-base transition border-b-2 border-transparent `}
              >
                {item.icon}
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Burger Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => {
              setIsOpen((prev) => !prev);
            }}
            className="p-2 rounded-md focus:outline-none hover:bg-gray-700"
            aria-label="Toggle Navigation"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* <div className="container flex items-center justify-between px-4 py-2 bg-teal-400"></div> */}

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-0 left-0 w-screen h-screen bg-gray-800 text-white">
          <div className="pt-8 pr-8 pl-8 pb-4 flex justify-end">
            <button
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <CircleX size={28} />
            </button>
          </div>
          <ul className="flex flex-col gap-2 p-4 ">
            {NavDirection.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="flex items-center gap-1 px-4 py-2 text-base transition hover:bg-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
