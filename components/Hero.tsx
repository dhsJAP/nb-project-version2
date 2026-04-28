"use client";

import Link from "next/link";
import Image from "next/image";


export function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center">
        <div
          className="absolute inset-0 opacity-50"
        >
          <Image src="/images/hero-nail2.jpg" 
          alt="Hero" 
          fill 
          className="object-cover"
          preload={true}
          sizes="100vw" />
        </div>
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-rose-100 to-pink-50 blur-3xl opacity-60" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-gradient-to-tr from-amber-50 to-rose-50 blur-3xl opacity-50" />

        <div className="relative z-10 max-w-6xl mx-auto px-5 grid md:grid-cols-2 gap-12 items-center py-24">
          
          <div>
            <p className="text-xs tracking-[4px] text-rose-400 uppercase mb-5">
              Premium Nail Studio
            </p>
            <h1
              className="text-5xl md:text-6xl leading-[1.1] text-stone-800 mb-6"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
            >
              The standard
              <br />
              of{' '}
              <em className="text-rose-600 not-italic">Nail</em>
              <br />
              Excellence.
            </h1>
            <p className="mt-6 text-lg text-stone-800 leading-relaxed max-w-md">
              Book now to experience our professional nail care services — where every manicure is a work of art.
            </p>
            <div className="mt-2 flex gap-3 flex-wrap">
              <Link
                href="/booking"
                className="bg-rose-700 hover:bg-rose-800 text-white px-8 py-3.5 rounded-2xl font-medium transition-all hover:scale-[1.02] active:scale-[0.98] text-sm tracking-wide"
              >
                Book now
              </Link>
              <Link
                href="#services"
                className="border border-stone-800 text-black hover:bg-stone-100 px-8 py-3.5 rounded-2xl font-medium transition-colors text-sm"
              >
                price list
              </Link>
            </div>
            {/* Social proof */}
            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-2">
                {['B', 'A', 'O'].map((l) => (
                  <div
                    key={l}
                    className="w-8 h-8 rounded-full bg-rose-100 border-2 border-white flex items-center justify-center text-rose-500 text-xs font-semibold"
                  >
                    {l}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5 mb-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-rose-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-xs text-stone-900">69+ reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
}
