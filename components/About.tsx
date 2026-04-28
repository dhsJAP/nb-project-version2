"use client";

import Image from 'next/image';

export function About() {
    return (
        <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-rose-100 to-amber-50 max-w-sm relative">
              <Image src="/images/boss-nail.png" 
              alt="Trinh" 
              fill
              className="object-cover" />
            </div>
            <div className="absolute -bottom-4 -right-4 md:right-8 bg-rose-500 text-white rounded-2xl px-5 py-4 shadow-xl">
              <p className="text-3xl font-bold leading-none">7+</p>
              <p className="text-xs mt-1 opacity-80">years of experience</p>
            </div>
          </div>

          <div>
            <p className="text-xs tracking-[4px] text-rose-400 uppercase mb-4">About Us</p>
            <h2
              className="text-4xl text-stone-800 mb-6 leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
            >
              Hello,
              <br />
              I&apos;m <em className="text-rose-600">Trinh Con</em>
            </h2>
            <p className="text-stone-500 leading-relaxed mb-4">
              With over 7 years of experience in the nail art industry, I don&apos;t just beautify hands — I create works of art that bear the unique personal touch of each client.
            </p>
            <p className="text-stone-500 leading-relaxed mb-8">
              Every appointment is a relaxing and creative experience. I commit to using high-quality, safe materials and the most meticulous techniques.
            </p>
            <div className="flex gap-6">
              {[
                { number: '500+', label: 'Completed Appointments' },
                { number: '4.9',  label: 'Average Rating'       },
                { number: '100%', label: 'Safe Ingredients'  },
              ].map(({ number, label }) => (
                <div key={label}>
                  <p
                    className="text-2xl text-rose-600 leading-none"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
                  >
                    {number}
                  </p>
                  <p className="text-xs text-stone-400 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
}
