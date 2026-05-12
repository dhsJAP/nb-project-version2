"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function Navbar() {
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`sticky top-0 z-50 bg-[#fdf8f5]/90 backdrop-blur-sm border-b border-rose-100 transition-transform duration-300 ${
        isHidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <span
          className="text-2xl text-rose-800 italic tracking-wide"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Trinh&apos;s Nails
        </span>

        <nav className="hidden md:flex items-center gap-8">
          {[
            { href: "/", label: "Home page" },
            { href: "#services", label: "Price list" },
            { href: "#staff", label: "Our staff" },
            { href: "#reviews", label: "Reviews" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-stone-500 hover:text-rose-600 transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        <Link
          href="/booking"
          className="bg-rose-700 hover:bg-rose-800 text-white text-sm px-5 py-2.5 rounded-full transition-colors font-medium"
        >
          Book now
        </Link>
      </div>
    </header>
  );
}
