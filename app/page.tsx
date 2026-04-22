// app/page.tsx
import Image from 'next/image'
import Link from 'next/link'
import { getSupabase } from '@/lib/supabase'



// ─── Types ───────────────────────────────────────────────────────────────────

interface Service {
  id: string
  name: string
  description: string
  duration_minutes: number
  price: number
}

interface Review {
  id: string
  author: string
  rating: number
  body: string
  created_at: string
}

// ─── Data fetching (Server Component) ────────────────────────────────────────

async function getServices(): Promise<Service[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('price', { ascending: true })
    .limit(4)

  if (error) {
    console.error('Failed to fetch services:', error.message)
    return []
  }
  return data ?? []
}

async function getReviews(): Promise<Review[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3)

  if (error) {
    console.error('Failed to fetch reviews:', error.message)
    return []
  }
  return data ?? []
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={i < rating ? 'text-rose-400' : 'text-stone-200'}
          style={{ fontSize: 14 }}
        >
          ★
        </span>
      ))}
    </div>
  )
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="group relative bg-white border border-rose-100 rounded-2xl p-6 hover:border-rose-300 hover:shadow-lg transition-all duration-300">
      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-2xl">
        <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-rose-50 group-hover:bg-rose-100 transition-colors" />
      </div>
      <h3
        className="text-xl mb-2 text-stone-800"
        style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
      >
        {service.name}
      </h3>
      <p className="text-sm text-stone-500 leading-relaxed mb-5">
        {service.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-stone-400 tracking-wide">
          ⏱ {service.duration_minutes} phút
        </span>
        <span
          className="text-2xl text-rose-600"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
        >
          ${service.price}
        </span>
      </div>
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  const initials = review.author
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="bg-white border border-rose-100 rounded-2xl p-6">
      <StarRating rating={review.rating} />
      <p className="mt-3 mb-5 text-sm text-stone-600 leading-relaxed italic">
        &ldquo;{review.body}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 text-xs font-semibold">
          {initials}
        </div>
        <div>
          <p className="text-sm font-medium text-stone-700">{review.author}</p>
          <p className="text-xs text-stone-400">
            {new Date(review.created_at).toLocaleDateString('vi-VN', {
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>
    </div>
  )
}

const PORTFOLIO_ITEMS = [
  { label: 'Rose Bloom',   bg: 'from-rose-200 to-rose-400' },
  { label: 'Sky Blue',     bg: 'from-sky-200 to-sky-400' },
  { label: 'Mint Fresh',   bg: 'from-emerald-200 to-emerald-400' },
  { label: 'Autumn Gold',  bg: 'from-amber-200 to-amber-400' },
  { label: 'Lavender',     bg: 'from-purple-200 to-purple-400' },
  { label: 'Nude Latte',   bg: 'from-stone-200 to-stone-400' },
]

const FALLBACK_SERVICES: Service[] = [
  { id: '1', name: 'Gel Manicure',    description: 'Tạo hình, chăm sóc cuticle, sơn gel bền màu đến 3 tuần.', duration_minutes: 45, price: 45 },
  { id: '2', name: 'Nail Art Design', description: 'Thiết kế nghệ thuật độc đáo, hoạ tiết theo yêu cầu.',      duration_minutes: 60, price: 65 },
  { id: '3', name: 'Deluxe Pedicure', description: 'Ngâm chân, tẩy da chết, massage và sơn gel cao cấp.',      duration_minutes: 50, price: 55 },
  { id: '4', name: 'Full Set Acrylic',description: 'Đắp bột acrylic toàn bộ, tạo hình và trang trí nghệ thuật.', duration_minutes: 75, price: 80 },
]

const FALLBACK_REVIEWS: Review[] = [
  { id: '1', author: 'Nguyễn Minh Châu', rating: 5, body: 'Lani làm móng rất tỉ mỉ và chuyên nghiệp. Bộ gel giữ được hơn 3 tuần, màu vẫn đẹp như mới. Sẽ quay lại!', created_at: '2025-03-01' },
  { id: '2', author: 'Trần Thu Hà',      rating: 5, body: 'Không gian sạch sẽ, Lani rất thân thiện. Nail art đẹp hơn cả mong đợi!',                                    created_at: '2025-02-15' },
  { id: '3', author: 'Lê Phương Anh',   rating: 5, body: 'Đặt lịch dễ dàng qua web, đến đúng giờ là được phục vụ ngay. Siêu hài lòng.',                               created_at: '2025-01-20' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const [services, reviews] = await Promise.all([getServices(), getReviews()])

  const displayServices = services.length > 0 ? services : FALLBACK_SERVICES
  const displayReviews  = reviews.length  > 0 ? reviews  : FALLBACK_REVIEWS

  return (
    <main className="min-h-screen bg-[#fdf8f5]">

      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-50 bg-[#fdf8f5]/90 backdrop-blur-sm border-b border-rose-100">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <span
            className="text-2xl text-rose-800 italic tracking-wide"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Lani&apos;s Nails
          </span>

          <nav className="hidden md:flex items-center gap-8">
            {[
              { href: '/',          label: 'Trang chủ' },
              { href: '#services',  label: 'Bảng giá'  },
              { href: '#reviews',   label: 'Đánh giá'  },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-stone-500 hover:text-rose-600 transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          <Link
            href="/booking"
            className="bg-rose-500 hover:bg-rose-600 text-white text-sm px-5 py-2.5 rounded-full transition-colors font-medium"
          >
            Đặt lịch
          </Link>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg,#c8727a 0,#c8727a 1px,transparent 0,transparent 50%)',
            backgroundSize: '20px 20px',
          }}
        />
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
                ĐẶT LỊCH NGAY
              </Link>
              <Link
                href="#services"
                className="border border-rose-200 text-rose-600 hover:bg-rose-50 px-8 py-3.5 rounded-full font-medium transition-colors text-sm"
              >
                Xem bảng giá
              </Link>
            </div>
            {/* Social proof */}
            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-2">
                {['C', 'H', 'M'].map((l) => (
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
                <p className="text-xs text-stone-400">200+ khách hàng hài lòng</p>
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
                <p className="text-sm font-medium text-stone-700">Thứ 3, 12:00 PM</p>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-rose-50 border border-rose-100" />
            <div className="absolute -bottom-6 -left-6 w-16 h-16 rounded-full bg-amber-50 border border-amber-100" />
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-rose-100 to-amber-50 max-w-sm relative">
              {/* Thay bằng ảnh thật: <Image src="/lani-portrait.jpg" alt="Lani" fill className="object-cover" /> */}
              <div className="absolute inset-0 flex items-center justify-center text-7xl">🌸</div>
            </div>
            <div className="absolute -bottom-4 -right-4 md:right-8 bg-rose-500 text-white rounded-2xl px-5 py-4 shadow-xl">
              <p className="text-3xl font-bold leading-none">7+</p>
              <p className="text-xs mt-1 opacity-80">Năm kinh nghiệm</p>
            </div>
          </div>

          <div>
            <p className="text-xs tracking-[4px] text-rose-400 uppercase mb-4">Về chúng tôi</p>
            <h2
              className="text-4xl text-stone-800 mb-6 leading-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
            >
              Xin chào,
              <br />
              tôi là <em className="text-rose-600">TRÌNH</em>
            </h2>
            <p className="text-stone-500 leading-relaxed mb-4">
              Với hơn 7 năm kinh nghiệm trong ngành nail art, tôi không chỉ
              làm đẹp đôi tay — tôi tạo ra những tác phẩm nghệ thuật mang dấu
              ấn cá nhân của từng khách hàng.
            </p>
            <p className="text-stone-500 leading-relaxed mb-8">
              Mỗi buổi hẹn là một trải nghiệm thư giãn và sáng tạo. Tôi cam
              kết dùng nguyên liệu cao cấp, an toàn và kỹ thuật tỉ mỉ nhất.
            </p>
            <div className="flex gap-6">
              {[
                { number: '500+', label: 'Lịch hẹn hoàn thành' },
                { number: '4.9',  label: 'Điểm đánh giá'       },
                { number: '100%', label: 'Nguyên liệu an toàn'  },
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

      {/* ── SERVICES ── */}
      <section id="services" className="py-20 bg-[#fdf8f5]">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[4px] text-rose-400 uppercase mb-3">Dịch vụ</p>
            <h2
              className="text-4xl text-stone-800"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
            >
              Bảng Giá Dịch Vụ
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayServices.map((s) => <ServiceCard key={s.id} service={s} />)}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/booking"
              className="inline-block bg-rose-500 hover:bg-rose-600 text-white px-10 py-3.5 rounded-full font-medium transition-all hover:scale-[1.02] text-sm"
            >
              Đặt lịch ngay
            </Link>
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[4px] text-rose-400 uppercase mb-3">Portfolio</p>
            <h2
              className="text-4xl text-stone-800"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
            >
              Tác Phẩm Nổi Bật
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
              @lanis.nails
            </a>{' '}
            để xem thêm tác phẩm mới nhất
          </p>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section id="reviews" className="py-20 bg-[#fdf8f5]">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[4px] text-rose-400 uppercase mb-3">Đánh giá</p>
            <h2
              className="text-4xl text-stone-800"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
            >
              Khách Hàng Nói Gì
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {displayReviews.map((r) => <ReviewCard key={r.id} review={r} />)}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
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
            Sẵn Sàng Để Tỏa Sáng?
          </h2>
          <p className="text-rose-100 mb-8 text-base max-w-md mx-auto">
            Đặt lịch hôm nay — chỉ mất 2 phút, nhận xác nhận ngay qua email.
          </p>
          <Link
            href="/booking"
            className="inline-block bg-white text-rose-600 hover:bg-rose-50 px-10 py-4 rounded-full font-medium transition-all hover:scale-[1.02] text-sm tracking-wide"
          >
            ĐẶT LỊCH NGAY — MIỄN PHÍ
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-stone-900 text-stone-400 py-12">
        <div className="max-w-6xl mx-auto px-5 grid md:grid-cols-3 gap-10">
          <div>
            <p
              className="text-2xl text-white italic mb-3"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Lani&apos;s Nails
            </p>
            <p className="text-sm leading-relaxed">
              Nail artistry crafted for you — with care, creativity, and precision.
            </p>
          </div>

          <div>
            <p className="text-xs tracking-[3px] text-rose-400 uppercase mb-4">Liên hệ</p>
            <ul className="space-y-2 text-sm">
              <li>📍 123 Nguyễn Huệ, Q.1, TP.HCM</li>
              <li>📞 0901 234 567</li>
              <li>✉️ hello@lanisnails.vn</li>
            </ul>
          </div>

          <div>
            <p className="text-xs tracking-[3px] text-rose-400 uppercase mb-4">Giờ mở cửa</p>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Thứ 2 – Thứ 7</span>
                <span className="text-white">9:00 – 19:00</span>
              </li>
              <li className="flex justify-between">
                <span>Chủ nhật</span>
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
          © {new Date().getFullYear()} Lani&apos;s Nails. All rights reserved.
        </div>
      </footer>
    </main>
  )
}