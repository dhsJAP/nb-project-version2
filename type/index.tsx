export interface Service {
  id: string
  name: string
  description: string
  duration_minutes: number
  price: number
}

export interface ServiceItem {
  id: string
  service_id: string
  name: string
  description: string | null
  duration_minutes: number | null
  price: number | null
  sort_order: number
}

export interface Review {
  id: string
  author: string
  rating: number
  body: string
  created_at: string
}

export interface StaffMember {
  id: string
  name: string
  role: string
  image_url: string | null
}

export interface Booking {
  id: string
  customer_name: string
  customer_email: string
  service_id: string
  staff_id: string
  booking_date: string // Dạng 'YYYY-MM-DD'
  booking_time: string // Dạng 'HH:MM:SS'
  status: 'pending' | 'confirmed' | 'cancelled' // Khớp với Enum booking_status của bố
  payment_mode: string
  stripe_payment_id: string | null
  notes: string | null
}

// 2. Kiểu dữ liệu chuẩn cho Lịch thợ nghỉ (Khớp chuẩn 100% với public.blocked_slots)
export interface BlockedSlot {
  id: string
  staff_id: string | null // null nếu nghỉ toàn tiệm
  start_at: string        // Kiểu timestamptz từ DB trả về (Dạng ISO String: 2026-05-20T12:00:00Z)
  end_at: string          // Kiểu timestamptz từ DB trả về
  reason?: string | null
}

export interface ServicesProps {
  services: Service[]
  serviceItemsByServiceId: Record<string, ServiceItem[]>
}

export interface ReviewCardProps {
  review: Review
}


export interface BookingState {
  service:     Service | null
  date:        string | null   // 'YYYY-MM-DD'
  time:        string | null   // 'HH:MM'
  paymentMode: 'deposit' | 'full'
  name:        string
  email:       string
  phone:       string
  cardNumber:  string
  cardExpiry:  string
  cardCvc:     string
  cardName:    string
  notes:       string
}
