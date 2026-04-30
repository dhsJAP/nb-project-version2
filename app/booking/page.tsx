// app/booking/page.tsx
import { getSupabase } from '@/lib/supabase'
import { Service, ServiceItem, StaffMember } from '@/type'
import BookingClient from './BookingClient'
import { Suspense } from 'react'

async function getServices(): Promise<Service[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('price', { ascending: true })
  if (error) return []
  return data ?? []
}

async function getServiceItems(): Promise<ServiceItem[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('service_items')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })
  if (error) return []
  return data ?? []
}

async function getStaff(): Promise<StaffMember[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('staff')
    .select('id, name, role, image_url')
    .eq('is_active', true)
    .order('created_at', { ascending: true })
  if (error) return []
  return data ?? []
}

export default async function BookingPage() {
  const [services, serviceItems, staff] = await Promise.all([getServices(), getServiceItems(), getStaff()])
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fdf8f5]" />}>
      <BookingClient services={services} serviceItems={serviceItems} staff={staff} />
    </Suspense>
  )
}
