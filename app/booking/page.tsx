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
  service_item_ids?: string[] | null
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

// Hàm lấy lịch đã hẹn và tự động tính toán thời lượng động dựa trên service_items
async function getBookings(): Promise<Booking[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    console.error("❌ LỖI HỆ THỐNG: Không tìm thấy SERVICE_ROLE_KEY trong file .env!")
    return []
  }

  // Tạo client Admin xịn để đi xuyên qua bức tường RLS bảo mật
  const supabaseAdmin = createClient(url, serviceRoleKey, {
    auth: { persistSession: false }
  })
  
  // Lấy ngày hôm nay chuẩn theo múi giờ Chicago của tiệm để lọc lịch quá khứ
  const todayStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date())

  // Chạy song song: Vừa lấy lịch đặt, vừa lấy từ điển thời gian của service_items
  const [bookingsRes, itemsRes] = await Promise.all([
    supabaseAdmin
      .from('bookings')
      .select('id, staff_id, booking_date, booking_time, status, service_item_ids')
      .in('status', ['pending', 'confirmed'])
      .gte('booking_date', todayStr),
    supabaseAdmin
      .from('service_items')
      .select('id, duration_minutes')
  ])

  if (bookingsRes.error) {
    console.error("❌ Lỗi fetch bookings từ Database:", bookingsRes.error.message)
    return []
  }

  const rawBookings = (bookingsRes.data ?? []) as RawBookingFromDB[]
  const serviceItems = itemsRes.data ?? []

  // Tạo một bản đồ (Map) để tra cứu nhanh thời gian của từng ID dịch vụ
  const durationMap = new Map<string, number>()
  serviceItems.forEach(item => {
    durationMap.set(item.id, item.duration_minutes ?? 0)
  })

  // Thuật toán: Duyệt qua từng lịch đặt, ép kiểu dữ liệu chuẩn và tự động cộng dồn thời gian
  const formattedBookings = rawBookings.map((b) => {
    let calculatedDuration = 0

    if (Array.isArray(b.service_item_ids)) {
      b.service_item_ids.forEach((itemId: string) => {
        calculatedDuration += durationMap.get(itemId) || 0
      })
    }

    // Nếu dữ liệu cũ không có duration hoặc bằng 0, cho fallback nhẹ về 30 phút để bảo vệ Frontend
    if (calculatedDuration === 0) calculatedDuration = 30

    return {
      id: b.id,
      staff_id: b.staff_id,
      booking_date: b.booking_date,
      booking_time: b.booking_time,
      status: b.status,
      duration_minutes: calculatedDuration // Gửi thời lượng tính toán động sang cho BookingClient xử lý
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