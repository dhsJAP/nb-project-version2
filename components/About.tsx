"use client";

import Image from "next/image";
import { motion } from "framer-motion";


export function About() {
  return (
    <section className="pt-12 pb-0 bg-[#f5f1ee] relative">
    <div className="max-w-6xl mx-auto px-5 grid md:grid-cols-2 gap-16 items-center">
        
        {/* Image */}
        
        <motion.div
          whileHover={{
            scale: 1.04,
            rotate: -1,
          }}
          initial={{ opacity: 0, scale : 0.95 }}
          whileInView={{ opacity: 1, scale : 1 }}
          transition={{
            duration: 1.6,
            ease: [0.16, 1, 0.3, 1],
          }}
          viewport={{ once: true }}
          className="relative w-full h-[520px]"
        >
          <Image
            src="/images/boss2.png"
            alt="About Us"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4
           }}
          viewport={{ once: true }}
        >
          <p
            className="
              text-xs tracking-[4px] text-rose-400 uppercase mb-4
            "
          >
            About Us
          </p>

         <h2
              className="text-4xl text-stone-800 mb-6 leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
            >
              Hello,
              <br />
              I&apos;m <em className="text-rose-600">Trinh Con</em>
            </h2>

          <p className="text-stone-500 leading-relaxed mb-4">
            For more than 7 years, I’ve been helping clients express themselves through elegant and carefully crafted nail designs. 
            I believe great nails are more than just beauty
             — they&apos;re a form of confidence and self-expression.
          </p>

          <p className="text-stone-500 leading-relaxed mb-8">
            My goal is to create a calm, welcoming experience where every client can relax and enjoy a personalized service. 
            From product selection to every small detail, quality and care always come first.
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
              className="
              hover:scale-105 
              transition-all 
              duration-300
              hover:text-rose-700"
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
        </motion.div>
      </div>
    </section>
  );
}