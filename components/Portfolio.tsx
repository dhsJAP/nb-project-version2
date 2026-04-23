export function Portfolio() {

    const PORTFOLIO_ITEMS = [
  { label: 'Rose Bloom',   bg: 'from-rose-200 to-rose-400' },
  { label: 'Sky Blue',     bg: 'from-sky-200 to-sky-400' },
  { label: 'Mint Fresh',   bg: 'from-emerald-200 to-emerald-400' },
  { label: 'Autumn Gold',  bg: 'from-amber-200 to-amber-400' },
  { label: 'Lavender',     bg: 'from-purple-200 to-purple-400' },
  { label: 'Nude Latte',   bg: 'from-stone-200 to-stone-400' },
]
    return (
        <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[4px] text-rose-400 uppercase mb-3">Portfolio</p>
            <h2
              className="text-4xl text-stone-800"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
            >
              Highlights
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {PORTFOLIO_ITEMS.map(({ label, bg }) => (
              <div
                key={label}
                className={`aspect-square rounded-2xl bg-gradient-to-br ${bg} relative overflow-hidden group cursor-pointer`}
              >
                {/* Thay bằng ảnh thật: <Image src={`/portfolio/${label}.jpg`} alt={label} fill className="object-cover" /> */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm rounded-lg px-2.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs font-medium text-stone-700">{label}</p>
                </div>
              </div>
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