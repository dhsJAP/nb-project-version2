"use client";

import Link from "next/link";



export function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <video
    autoPlay
    muted
    loop
    playsInline
    className="absolute inset-0 w-full h-full object-cover"
  >
    <source src="/videos/heroclip.mp4" type="video/mp4" />
  </video>

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
                className="inline-block bg-rose-500 hover:bg-rose-600 text-white px-10 py-3.5 rounded-full font-medium transition-all hover:scale-[1.02] text-sm"
              >
                Book now
              </Link>
              <Link
                href="#services"
                className="inline-block bg-rose-500 hover:bg-rose-600 text-white px-10 py-3.5 rounded-full font-medium transition-all hover:scale-[1.02] text-sm"
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
                <p className="text-xs text-stone-500 tracking-wider">69+ reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
}
