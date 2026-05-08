"use client";
import Image from 'next/image';
import { motion } from 'framer-motion';

const portfolioImages = [
  "/images/pn1.jpg",
  "/images/pn2.jpg",
  "/images/pn3.jpg",
  "/images/pn4.jpg",
  "/images/pn5.jpg",
];


export function Portfolio() {


    return (
        <section className="py-24 bg-[#f5f1ee] overflow-hidden relative">

          {/* Gradient Fade Left */}
      <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-[#f5f1ee] to-transparent z-10" />

      {/* Gradient Fade Right */}
      <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-[#f5f1ee] to-transparent z-10" />

      <div className="max-w-6xl mx-auto px-5">
          <motion.div
          initial={{ opacity: 0, scale : 0.95 }}
          whileInView={{ opacity: 1, scale : 1 }}
          transition={{
            duration: 1.6,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="text-center mb-12">
            <p className="text-xs tracking-[4px] text-rose-400 uppercase mb-3">Portfolio</p>
            <h2
              className="text-4xl text-stone-800"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
            >
              Highlights
            </h2>
          </motion.div>
          
         <div
          className="flex gap-6 animate-marquee w-max">
        
              {/* First Set */}
              {portfolioImages.map((image, index) => (
                <motion.div
                 whileHover={{
                      y: -8,
                    }}
                    transition={{
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                  key={`first-${index}`}
                  className="group relative overflow-hidden rounded-3xl shrink-0"
                >
                  <Image
                    src={image}
                    alt="Portfolio Image"
                    width={280}
                    height={360}
                    className="
                      w-[280px]
                      h-[360px]
                      object-cover
                      transition-transform
                      duration-700
                      group-hover:scale-105
                    "
                  />
                </motion.div>
              ))}
              {/* Duplicate Set */}
              {portfolioImages.map((image, index) => (
                <motion.div
                 whileHover={{
                      y: -8,
                    }}
                    transition={{
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                  key={`second-${index}`}
                  className="group relative overflow-hidden rounded-3xl shrink-0"
                >
                  <Image
                    src={image}
                    alt="Portfolio Image"
                      width={280}
                      height={360}
                      className="
                      w-[280px]
                      h-[360px]
                      object-cover
                      transition-transform
                      duration-700
                      group-hover:scale-105
                    "
                  />
                </motion.div>
              ))}
           </div>
           
                <p className="text-center mt-6 text-sm text-stone-400">
                  Follow{' '}
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-rose-500 hover:underline"
                  >
                    @Trinh.nails
                  </a>{' '}
                  to see the latest works
                </p>
        </div>
      </section>
    );
}