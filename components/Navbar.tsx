"use client";

import  Link  from "next/link";

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 bg-[#fdf8f5]/90 backdrop-blur-sm border-b border-rose-100">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <span
            className="text-2xl text-rose-800 italic tracking-wide"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Trinh&apos;s Nails
          </span>

          <nav className="hidden md:flex items-center gap-8">
            {[
              { href: '/',          label: 'Home page' },
              { href: '#services',  label: 'Price list'  },
              { href: '#reviews',   label: 'Reviews'  },
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
            className="bg-rose-500 hover:bg-rose-600 text-white text-sm px-5 py-2.5 rounded-full transition-colors font-medium"
          >
            Book now
          </Link>
        </div>
      </header>
    );
}