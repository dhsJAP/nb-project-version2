// app/page.tsx
import Image from 'next/image'
import Link from 'next/link'
import { getSupabase } from '@/lib/supabase'
import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { About } from '@/components/About'
import { Services } from '@/components/Services'
import { Portfolio } from '@/components/Portfolio'



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


export function ServiceCard({ service }: { service: Service }) {
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

export function ReviewCard({ review }: { review: Review }) {
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
      <Navbar />

      {/* ── HERO ── */}
      <Hero />

      {/* ── ABOUT ── */}
      <About />

      {/* ── SERVICES ── */}
      <Services services={displayServices} />

      {/* ── PORTFOLIO ── */}
     <Portfolio />

      {/* ── REVIEWS ── */}
      <section id="reviews" className="py-20 bg-[#fdf8f5]">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[4px] text-rose-400 uppercase mb-3">Reviews</p>
            <h2
              className="text-4xl text-stone-800"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
            >
              What Our Clients Say
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

      {/* ── FOOTER ── */}
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
    </main>
  )
}