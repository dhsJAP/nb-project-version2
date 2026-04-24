export function Footer() {
    return (
        <footer className="bg-stone-900 text-stone-400 py-12">
        <div className="max-w-6xl mx-auto px-5 grid md:grid-cols-3 gap-10">
          <div>
            <p
              className="text-2xl text-white italic mb-3"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Trinh&apos;s Nails
            </p>
            <p className="text-sm leading-relaxed">
              Nail artistry crafted for you — with care, creativity, and precision.
            </p>
          </div>

          <div>
            <p className="text-xs tracking-[3px] text-rose-400 uppercase mb-4">Contact</p>
            <ul className="space-y-2 text-sm">
              <li>📍 148 Nguyễn Huy Tự, phường Bắc Hà, TP.Hà Tĩnh</li>
              <li>📞 091 255 4570</li>
              <li>✉️ hello@trinhsnails.vn</li>
            </ul>
          </div>

          <div>
            <p className="text-xs tracking-[3px] text-rose-400 uppercase mb-4">Opening Hours</p>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Monday – Saturday</span>
                <span className="text-white">9:00 – 19:00</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span className="text-white">10:00 – 17:00</span>
              </li>
            </ul>
            <div className="flex gap-3 mt-5">
              {['IG', 'FB', 'TT'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-8 h-8 rounded-full border border-stone-700 flex items-center justify-center text-xs hover:border-rose-400 hover:text-rose-400 transition-colors"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-5 mt-10 pt-6 border-t border-stone-800 text-center text-xs">
          © {new Date().getFullYear()} Trinh&apos;s Nails. All rights reserved.
        </div>
      </footer>
    );
}