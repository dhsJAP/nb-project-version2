import { createClient } from '@supabase/supabase-js'
import { Suspense } from 'react'
import { getSupabase } from '@/lib/supabase'
import { getStaffMembers } from '@/lib/staff'
import { BlockedSlot, Booking, Service, ServiceItem } from '@/type'
import BookingClient from './BookingClient'

interface RawBookingFromDB {
  id: string
  staff_id: string
  booking_date: string
  booking_time: string
  status: string
  service_id?: string | null
}

async function getServices(): Promise<Service[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('services')
    .select('id, name, description, price')
    .order('name', { ascending: true })

  if (error) {
    console.error('Failed to fetch services from Database:', error.message)
    return []
  }

  return (data ?? []) as Service[]
}

async function getServiceItems(): Promise<ServiceItem[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('service_items')
    .select('id, service_id, name, description, duration_minutes, price, sort_order')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Failed to fetch service items from Database:', error.message)
    return []
  }

  return (data ?? []) as ServiceItem[]
}

async function getBookings(): Promise<Booking[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    console.error('Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL')
    return []
  }

  const supabaseAdmin = createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  })

  const todayStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())

  const [bookingsRes, itemsRes] = await Promise.all([
    supabaseAdmin
      .from('bookings')
      .select('id, staff_id, booking_date, booking_time, status, service_id')
      .in('status', ['pending', 'confirmed'])
      .gte('booking_date', todayStr),
    supabaseAdmin
      .from('service_items')
      .select('id, duration_minutes'),
  ])

  if (bookingsRes.error) {
    console.error('Failed to fetch bookings from Database:', bookingsRes.error.message)
    return []
  }

  const rawBookings = (bookingsRes.data ?? []) as RawBookingFromDB[]
  const serviceItemsData = (itemsRes.data ?? []) as Array<{ id: string; duration_minutes: number | null }>

  const durationByServiceItemId = new Map<string, number>()
  serviceItemsData.forEach((item) => {
    durationByServiceItemId.set(item.id, item.duration_minutes ?? 0)
  })

  const formattedBookings = rawBookings.map((booking) => ({
    id: booking.id,
    staff_id: booking.staff_id,
    booking_date: booking.booking_date,
    booking_time: booking.booking_time,
    status: booking.status,
    duration_minutes: booking.service_id ? (durationByServiceItemId.get(booking.service_id) || 30) : 30,
  }))

  return formattedBookings as Booking[]
}

async function getBlockedSlots(): Promise<BlockedSlot[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) return []

  const supabaseAdmin = createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  })

  const { data, error } = await supabaseAdmin
    .from('blocked_slots')
    .select('id, staff_id, start_at, end_at, reason')

  if (error) {
    console.error('Failed to fetch blocked slots from Admin Key:', error.message)
    return []
  }

  return (data ?? []) as BlockedSlot[]
}

export const dynamic = 'force-dynamic'

export default async function BookingPage() {
  const [services, serviceItems, staff, bookings, blockedSlots] = await Promise.all([
    getServices(),
    getServiceItems(),
    getStaffMembers(),
    getBookings(),
    getBlockedSlots(),
  ])

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fdf8f5] flex items-center justify-center">Loading...</div>}>
      <BookingClient
        services={services}
        serviceItems={serviceItems}
        staff={staff}
        bookings={bookings}
        blockedSlots={blockedSlots}
      />
    </Suspense>
  )
}
