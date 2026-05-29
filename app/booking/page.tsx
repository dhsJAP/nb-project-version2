import { createClient } from '@supabase/supabase-js'
import { getSupabase } from '@/lib/supabase'
import { BlockedSlot, Booking, Service, ServiceItem } from '@/type'
import BookingClient from './BookingClient'
import { Suspense } from 'react'
import { getStaffMembers } from '@/lib/staff'

// Định nghĩa kiểu dữ liệu tạm thời cho cấu trúc bảng bookings dưới Database
interface RawBookingFromDB {
  id: string
  staff_id: string
  booking_date: string
  booking_time: string
  status: string
  service_id?: string | null // Khớp chuẩn cột service_id (uuid) trong ảnh của bố
}

// Hàm lấy danh sách dịch vụ (Dùng ANON_KEY công khai)
async function getServices(): Promise<Service[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('services')
    .select('id, name')
    .order('name', { ascending: true })

  if (error) {
    console.error("❌ Lỗi fetch services từ Database:", error.message)
    return []
  }
  return (data ?? []) as unknown as Service[]
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

async function getBookings(): Promise<Booking[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    console.error("❌ LỖI HỆ THỐNG: Không tìm thấy SERVICE_ROLE_KEY trong file .env!")
    return []
  }

  const supabaseAdmin = createClient(url, serviceRoleKey, {
    auth: { persistSession: false }
  })
  
  const todayStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date())

  // 🟢 THAY ĐỔI CHIẾN THUẬT: Gọi bảng bookings kết hợp bảng CHI TIẾT service_items
  const [bookingsRes, itemsRes] = await Promise.all([
    supabaseAdmin
      .from('bookings')
      .select('id, staff_id, booking_date, booking_time, status, service_id')
      .in('status', ['pending', 'confirmed'])
      .gte('booking_date', todayStr),
    supabaseAdmin
      .from('service_items') // 🎯 Nhắm thẳng vào bảng dịch vụ con chứa duration chuẩn!
      .select('id, duration_minutes')
  ])

  if (bookingsRes.error) {
    console.error("❌ Lỗi fetch bookings từ Database:", bookingsRes.error.message)
    return []
  }

  const rawBookings = (bookingsRes.data ?? []) as RawBookingFromDB[]
  const serviceItemsData = itemsRes.data ?? []

  // Tạo bản đồ tra cứu thời gian dựa trên ID của service_items
  const durationMap = new Map<string, number>()
  serviceItemsData.forEach(item => {
    durationMap.set(item.id, item.duration_minutes ?? 0)
  })

  // Thuật toán: Ánh xạ thời gian từ bảng dịch vụ con sang cho từng lịch đặt
  const formattedBookings = rawBookings.map((b) => {
    // Tìm thời lượng chuẩn trong bảng service_items, nếu không có mới chịu lùi về 30 phút
    const calculatedDuration = b.service_id ? (durationMap.get(b.service_id) || 30) : 30

    return {
      id: b.id,
      staff_id: b.staff_id,
      booking_date: b.booking_date,
      booking_time: b.booking_time,
      status: b.status,
      duration_minutes: calculatedDuration // Bơm số phút xịn từ service_items sang Frontend
    }
  })

  return formattedBookings as unknown as Booking[]
}

// Hàm lấy lịch thợ nghỉ (Dùng Admin Client để đảm bảo đồng bộ)
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
    console.error("❌ Lỗi fetch blocked_slots bằng Admin Key:", error.message)
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