"use client";
import React, { useState, useEffect } from "react";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

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
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-gray-800 h-[80px]" : "bg-transparent h-[110px]"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        <div className="text-white text-xl font-bold">Logo</div>
        <ul className="flex space-x-4">
          <li>
            <a href="#" className="text-white hover:text-gray-400">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="text-white hover:text-gray-400">
              About
            </a>
          </li>
          <li>
            <a href="#" className="text-white hover:text-gray-400">
              Services
            </a>
          </li>
          <li>
            <a href="#" className="text-white hover:text-gray-400">
              Contact
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
