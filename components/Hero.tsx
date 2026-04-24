"use client";

import Link from "next/link";
import Image from "next/image";


export function Hero() {
    return (
        <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
        >
          <Image src="/images/hero-nail.jpg" 
          alt="Hero" 
          fill 
          className="object-cover"
          priority />
        </div>
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-rose-100 to-pink-50 blur-3xl opacity-60" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-gradient-to-tr from-amber-50 to-rose-50 blur-3xl opacity-50" />

        <div className="relative z-10 max-w-6xl mx-auto px-5 grid md:grid-cols-2 gap-12 items-center py-24">
          {/* Copy */}
          <div>
            <p className="text-xs tracking-[4px] text-rose-400 uppercase mb-5">
              Premium Nail Studio
            </p>
            <h1
              className="text-5xl md:text-6xl leading-[1.1] text-stone-800 mb-6"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
            >
              Sự Tinh Tế
              <br />
              Trên{' '}
              <em className="text-rose-600 not-italic">Đôi Tay</em>
              <br />
              Của Bạn.
            </h1>
            <p className="text-stone-500 leading-relaxed mb-8 max-w-md text-base">
              Đặt lịch ngay để trải nghiệm dịch vụ chăm sóc móng cá nhân
              chuyên nghiệp — nơi mỗi bộ móng là một tác phẩm nghệ thuật.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link
                href="/booking"
                className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-3.5 rounded-full font-medium transition-all hover:scale-[1.02] active:scale-[0.98] text-sm tracking-wide"
              >
                Book now
              </Link>
              <Link
                href="#services"
                className="border border-rose-200 text-rose-600 hover:bg-rose-50 px-8 py-3.5 rounded-full font-medium transition-colors text-sm"
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
                    <span key={i} className="text-rose-400 text-xs">★</span>
                  ))}
                </div>
                <p className="text-xs text-stone-400">69+ reviews</p>
              </div>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative hidden md:block">
            <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-rose-200 via-pink-100 to-amber-100">
              {/* Thay bằng ảnh thật: <Image src="/hero-nails.jpg" alt="Bộ móng nghệ thuật" fill className="object-cover" priority /> */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-9xl select-none">💅</span>
              </div>
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg">
                <p className="text-xs text-stone-400">Next availability</p>
                <p className="text-sm font-medium text-stone-700">Today, 2:00 PM</p>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-rose-50 border border-rose-100" />
            <div className="absolute -bottom-6 -left-6 w-16 h-16 rounded-full bg-amber-50 border border-amber-100" />
          </div>
        </div>
      </section>
    );
}