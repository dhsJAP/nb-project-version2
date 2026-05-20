import { getSupabase } from '@/lib/supabase'
import { BlockedSlot, Booking, Service, ServiceItem } from '@/type'
import BookingClient from './BookingClient'
import { Suspense } from 'react'
import { getStaffMembers } from '@/lib/staff'

// Hàm lấy danh sách dịch vụ (Dùng ANON_KEY công khai là được)
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

// 🟢 SỬA LỖI 1 & 2: Dùng quyền Admin để vượt RLS và giới hạn ngày để tối ưu tốc độ
async function getBookings(): Promise<Booking[]> {
  // Bật quyền admin: true để dùng SERVICE_ROLE_KEY đọc được lịch bận
  const supabase = getSupabase({ admin: true })
  
  // Lấy chuỗi ngày hôm nay theo định dạng YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('bookings')
    .select('id, staff_id, booking_date, booking_time, status')
    .in('status', ['pending', 'confirmed'])
    .gte('booking_date', todayStr) // Chỉ lấy các lịch hẹn từ ngày hôm nay trở đi

  if (error) {
    console.error("Lỗi fetch bookings ở Server Component:", error.message)
    return []
  }
  return (data ?? []) as Booking[]
}

// 🟢 SỬA LỖI 1: Dùng quyền Admin để đọc bảng blocked_slots của thợ
async function getBlockedSlots(): Promise<BlockedSlot[]> {
  const supabase = getSupabase({ admin: true })
  
  const { data, error } = await supabase
    .from('blocked_slots')
    .select('id, staff_id, start_at, end_at, reason')

  if (error) {
    console.error("Lỗi fetch blocked_slots ở Server Component:", error.message)
    return []
  }
  return (data ?? []) as BlockedSlot[]
}

export const dynamic = 'force-dynamic'

export default async function BookingPage() {
  // Chạy song song cả 5 hàm bằng Promise.all với hiệu năng đỉnh cao
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