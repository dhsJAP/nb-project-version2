import Link from "next/link";

export function Banner() {
    return (
        <section className="py-20 bg-rose-500 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(-45deg,white 0,white 1px,transparent 0,transparent 50%)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative z-10 text-center px-5">
          <h2
            className="text-4xl md:text-5xl text-white mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
          >
            Ready to Shine?
          </h2>
          <p className="text-rose-100 mb-8 text-base max-w-md mx-auto">
            Book your appointment today — it only takes 2 minutes, and you&apos;ll receive confirmation via email.
          </p>
          <Link
            href="/booking"
            className="inline-block bg-white text-rose-600 hover:bg-rose-50 px-10 py-4 rounded-full font-medium transition-all hover:scale-[1.02] text-sm tracking-wide"
          >
            BOOK NOW — FREE CONFIRMATION
          </Link>
        </div>
      </section>
    );
}