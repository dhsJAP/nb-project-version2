import { getSupabase } from '@/lib/supabase'
import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { About } from '@/components/About'
import { Services } from '@/components/Services'
import { Portfolio } from '@/components/Portfolio'
import { Reviews } from '@/components/Reviews'
import { Banner } from '@/components/Banner'
import { Footer } from '@/components/Footer'
import { Service, Review } from '@/type'
import { FALLBACK_SERVICES, FALLBACK_REVIEWS } from '@/constants/mockData'


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
      <Reviews review={displayReviews} />

      {/* ── CTA BANNER ── */}
      <Banner />

      {/* ── FOOTER ── */}
      <Footer />
    </main>
  )
}