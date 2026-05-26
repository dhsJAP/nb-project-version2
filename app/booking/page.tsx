import { createClient } from '@supabase/supabase-js' // 🟢 Thêm hàm này để tạo Admin Client
import { getSupabase } from '@/lib/supabase'
import { BlockedSlot, Booking, Service, ServiceItem } from '@/type'
import BookingClient from './BookingClient'
import { Suspense } from 'react'
import { getStaffMembers } from '@/lib/staff'

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

// 🟢 TỰ TẠO ADMIN CLIENT VƯỢT QUA BỨC TƯỜNG RLS 100%
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Chìa khóa Admin nằm ẩn an toàn ở môi trường Server

  if (!url || !serviceRoleKey) {
    console.error("❌ Thiếu biến môi trường SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong file .env!")
  }
  return createClient(url || '', serviceRoleKey || '', {
    auth: { persistSession: false }
  })
}

// Hàm lấy lịch đã hẹn
async function getBookings(): Promise<Booking[]> {
  // Dùng quyền Admin tối cao để lấy dữ liệu bận
  const supabaseAdmin = getSupabaseAdmin()
  
  const todayStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date())

  const { data, error } = await supabaseAdmin
    .from('bookings')
    .select('id, staff_id, booking_date, booking_time, duration_minutes, status')
    .in('status', ['pending', 'confirmed'])
    .gte('booking_date', todayStr) // Lọc từ ngày hôm nay trở đi để tối ưu tốc độ

  if (error) {
    console.error("❌ Lỗi fetch bookings trực tiếp bằng Admin Key:", error.message)
    return []
  }
  
  console.log("✈️ SERVER ADMIN ĐÃ LẤY ĐƯỢC SỐ LƯỢNG BOOKINGS LÀ:", data?.length ?? 0)
  return (data ?? []) as Booking[]
}

// Hàm lấy lịch thợ nghỉ
async function getBlockedSlots(): Promise<BlockedSlot[]> {
  const supabaseAdmin = getSupabaseAdmin()
  
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