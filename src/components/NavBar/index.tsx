"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Info,
  UserRound,
  Microscope,
  Scroll,
  CalendarDays,
  Rss,
  PhoneCall,
} from "lucide-react";

const NavDirection = [
  { name: "About", href: "/about", icon: <Info size={18} /> },
  { name: "Member", href: "/member", icon: <UserRound size={18} /> },
  { name: "Research", href: "/research", icon: <Microscope size={18} /> },
  { name: "Publications", href: "/publications", icon: <Scroll size={18} /> },
  { name: "Events", href: "/events", icon: <CalendarDays size={18} /> },
  { name: "News", href: "/news", icon: <Rss size={18} /> },
  { name: "Contact", href: "/contact", icon: <PhoneCall size={18} /> },
];

function Navbar() {
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

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 
        flex items-center
        ${
          isScrolled
            ? "bg-white text-black h-[80px]"
            : "bg-transparent text-white h-[110px]"
        }
      `}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <div className="text-3xl font-bold transition">SDSC</div>

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
            onClick={(prev) => {
              setIsOpen(!prev);
              console.log("wwww");
            }}
            className="p-2 rounded-md focus:outline-none hover:bg-gray-700"
            aria-label="Toggle Navigation"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div>asdasdsa</div>
          // <div>
          //   <ul className="flex flex-col gap-2 p-4 bg-gray-800">
          //     {NavDirection.map((item) => (
          //       <li key={item.name}>
          //         <Link
          //           href={item.href}
          //           className="block px-4 py-2 text-base transition hover:bg-gray-700"
          //           onClick={() => setIsOpen(false)}
          //         >
          //           {item.name}
          //         </Link>
          //       </li>
          //     ))}
          //   </ul>
          // </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
