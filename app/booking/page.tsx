import { createClient } from '@supabase/supabase-js' // 🟢 Thêm hàm này để tạo Admin Client
import { getSupabase } from '@/lib/supabase'
import { BlockedSlot, Booking, Service, ServiceItem } from '@/type'
import BookingClient from './BookingClient'
import { Suspense } from 'react'
import { getStaffMembers } from '@/lib/staff'

function getChicagoDateISO(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date)

  const year = parts.find((p) => p.type === 'year')?.value
  const month = parts.find((p) => p.type === 'month')?.value
  const day = parts.find((p) => p.type === 'day')?.value

  if (!year || !month || !day) {
    throw new Error('Failed to format Chicago date')
  }

  return `${year}-${month}-${day}`
}

// Hàm lấy danh sách dịch vụ (Dùng ANON_KEY công khai)
async function getServices(): Promise<Service[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('price', { ascending: true })
  if (error) return []
  return data ?? []
}

// Hàm lấy danh sách chi tiết dịch vụ
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

// Hàm lấy lịch đã hẹn
async function getBookings(): Promise<Booking[]> {
  // 1. Lấy biến môi trường trực tiếp bên trong hàm để không bị rỗng khi load trang
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    console.error("❌ LỖI HỆ THỐNG: Không tìm thấy SERVICE_ROLE_KEY trong file .env!");
    return []
  }

  // 2. Tạo Admin Client xịn đi xuyên RLS
  const supabaseAdmin = createClient(url, serviceRoleKey, {
    auth: { persistSession: false }
  })
  
  // Lấy ngày hôm nay theo giờ Mỹ để so sánh
  const todayStr = getChicagoDateISO()

  // 3. Tiến hành lấy lịch bận
  const { data, error, count } = await supabaseAdmin
    .from('bookings')
    .select('id, staff_id, booking_date, booking_time, duration_minutes, status')
    .in('status', ['pending', 'confirmed'])
    .gte('booking_date', todayStr) // Chỉ lấy từ hôm nay trở đi cho nhẹ mượt

  console.log('[getBookings] query debug', {
    todayStr,
    count,
    error: error ? { message: error.message, details: error.details, hint: error.hint, code: error.code } : null,
    sample: data?.slice(0, 3) ?? []
  })

  if (error) {
    console.error("❌ Lỗi truy vấn bảng bookings:", error.message)
    return []
  }
  
  return (data ?? []) as Booking[]
}

// Hàm lấy lịch thợ nghỉ
async function getBlockedSlots(): Promise<BlockedSlot[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) return []

  const supabaseAdmin = createClient(url, serviceRoleKey, {
    auth: { persistSession: false }
  })
  
  const { data, error } = await supabaseAdmin
    .from('blocked_slots')
    .select('id, staff_id, start_at, end_at, reason')

  if (error) {
    console.error("❌ Lỗi truy vấn bảng blocked_slots:", error.message)
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
    getBlockedSlots()
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
