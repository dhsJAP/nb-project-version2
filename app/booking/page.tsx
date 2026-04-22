// app/booking/page.tsx
import { getSupabase } from '@/lib/supabase'
import BookingClient from './BookingClient'



interface Service {
  id: string
  name: string
  description: string
  duration_minutes: number
  price: number
}

const FALLBACK_SERVICES: Service[] = [
  { id: '1', name: 'Gel Manicure',     description: 'Tạo hình, chăm sóc cuticle, sơn gel bền màu đến 3 tuần.',       duration_minutes: 45, price: 45 },
  { id: '2', name: 'Nail Art Design',  description: 'Thiết kế nghệ thuật độc đáo, hoạ tiết theo yêu cầu.',           duration_minutes: 60, price: 65 },
  { id: '3', name: 'Deluxe Pedicure',  description: 'Ngâm chân, tẩy da chết, massage và sơn gel cao cấp.',           duration_minutes: 50, price: 55 },
  { id: '4', name: 'Full Set Acrylic', description: 'Đắp bột acrylic toàn bộ, tạo hình và trang trí nghệ thuật.',   duration_minutes: 75, price: 80 },
]

async function getServices(): Promise<Service[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('price', { ascending: true })
  if (error) return FALLBACK_SERVICES
  return data?.length ? data : FALLBACK_SERVICES
}

export default async function BookingPage() {
  const services = await getServices()
  return <BookingClient services={services} />
}