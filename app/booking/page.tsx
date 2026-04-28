// app/booking/page.tsx
import { getSupabase } from '@/lib/supabase'
import { Service } from '@/type'
import BookingClient from './BookingClient'

async function getServices(): Promise<Service[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('price', { ascending: true })
  if (error) return []
  return data ?? []
}

export default async function BookingPage() {
  const services = await getServices()
  return <BookingClient services={services} />
}
