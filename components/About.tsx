"use client";

import Image from "next/image";

export function About() {
  return (
    <section className="py-24 bg-[#f5f1ee]">
      <div className="max-w-6xl mx-auto px-5 grid md:grid-cols-2 gap-16 items-center">
        
        {/* Image */}
        <div className="relative">
          <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-rose-100 to-amber-50 max-w-sm relative">
            <Image
              src="/images/boss-nail.png"
              alt="Trinh"
              fill
              className="object-cover"
            />
          </div>

          {/* Floating Badge */}
          <div
            className="
              absolute
              bottom-5
              -right-5
              bg-white
              shadow-xl
              rounded-2xl
              px-5
              py-4
            "
          >
            <p
              className="text-3xl leading-none text-rose-600"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600,
              }}
            >
              7+
            </p>

            <p className="text-xs uppercase tracking-[0.2em] text-stone-500 mt-1">
              Years Experience
            </p>
          </div>
        </div>

        {/* Content */}
        <div>
          <p
            className="
              tracking-[0.35em]
              uppercase
              text-pink-500
              text-xs
            "
          >
            About Us
          </p>

          <h2
            className="
              font-serif
              text-5xl
              leading-tight
            "
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 600,
            }}
          >
            Hello,
            <br />
            I&apos;m{" "}
            <em className="italic text-pink-500">
              Trinh Con
            </em>
          </h2>

          <p className="text-stone-500 leading-relaxed mb-4">
            With over 7 years of experience in the nail art industry,
            I don&apos;t just beautify hands — I create works of art
            that bear the unique personal touch of each client.
          </p>

          <p className="text-stone-500 leading-relaxed mb-8">
            Every appointment is a relaxing and creative experience.
            I commit to using high-quality, safe materials and the
            most meticulous techniques.
          </p>

          <div className="grid grid-cols-3 gap-4">
            {[
              {
                number: "500+",
                label: "Completed Appointments",
              },
              {
                number: "4.9",
                label: "Average Rating",
              },
              {
                number: "100%",
                label: "Safe Ingredients",
              },
            ].map(({ number, label }) => (
              <div key={label}
              className="bg-white/70
              backdrop-blur
              rounded-2xl
              p-5
              shadow-sm"
              >
                <p
                  className="text-3xl text-rose-600 leading-none"
                  style={{
                    fontFamily:
                      "'Cormorant Garamond', serif",
                    fontWeight: 600,
                  }}
                >
                  {number}
                </p>

                <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}