import { getSupabase } from '@/lib/supabase'
import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { About } from '@/components/About'
import { Services } from '@/components/Services'
import { Portfolio } from '@/components/Portfolio'
import { Reviews } from '@/components/Reviews'
import { Banner } from '@/components/Banner'
import { Footer } from '@/components/Footer'
import { Service, Review, ServiceItem } from '@/type'
import { FALLBACK_REVIEWS } from '@/constants/mockData'

export const dynamic = 'force-dynamic'


// ─── Data fetching (Server Component) ────────────────────────────────────────

async function getServices(): Promise<Service[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('price', { ascending: true })

  if (error) {
    console.error('Failed to fetch services:', error.message)
    return []
  }
  return data ?? []
}

async function getServiceItems(): Promise<ServiceItem[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('service_items')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Failed to fetch service items:', error.message)
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
  const [services, serviceItems, reviews] = await Promise.all([
    getServices(),
    getServiceItems(),
    getReviews(),
  ])

  const displayServices = services
  const displayReviews  = reviews.length  > 0 ? reviews  : FALLBACK_REVIEWS
  const serviceItemsByServiceId = serviceItems.reduce<Record<string, ServiceItem[]>>(
    (acc, item) => {
      const list = acc[item.service_id] ?? []
      list.push(item)
      acc[item.service_id] = list
      return acc
    },
    {}
  )

  return (
    <main className="min-h-screen bg-[#fdf8f5]">

      {/* ── NAVBAR ── */}
      <Navbar />

      {/* ── HERO ── */}
      <Hero />

      {/* ── ABOUT ── */}
      <About />

      {/* ── SERVICES ── */}
      <Services
        services={displayServices}
        serviceItemsByServiceId={serviceItemsByServiceId}
      />

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
