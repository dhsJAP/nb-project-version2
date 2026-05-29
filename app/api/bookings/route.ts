// app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import Stripe from 'stripe'
import { Resend } from 'resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const supabase = getSupabase({ admin: true })
  const body = await req.json()
  const { serviceId, staffId, date, time, customerName, customerEmail, paymentMode, price, notes } = body

  try {
    if (!serviceId || !staffId || !date || !time) {
      throw new Error('Missing required booking fields')
    }

    // 1. Tạo Stripe PaymentIntent
    const amount = paymentMode === 'deposit' ? Math.round(price * 0.3 * 100) : Math.round(price * 100)
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    })

    // 2. 🟢 THAY ĐỔI CỐT LÕI: Gọi hàm book_slot thay vì dùng insert trực tiếp
    const { data: bookingId, error: bookingError } = await supabase.rpc('book_slot', {
      p_customer_name: customerName,
      p_customer_email: customerEmail,
      p_service_id: serviceId,
      p_staff_id: staffId,
      p_booking_date: date, // Truyền thẳng chuỗi ngày từ Frontend
      p_booking_time: time,  // Truyền thẳng chuỗi giờ từ Frontend
      p_payment_mode: paymentMode,
      p_stripe_payment_id: paymentIntent.id,
      p_notes: notes || null,
      p_status: 'pending'
    })

    // Nếu hàm book_slot báo lỗi (Trùng lịch, shop đóng cửa...), văng lỗi ra ngay
    if (bookingError) throw new Error(bookingError.message)

    // 3. Lấy thông tin staff (Bảng staff không có "s" chuẩn bài của bố)
    const { data: staffData, error: staffError } = await supabase
      .from('staff')
      .select('name')
      .eq('id', staffId)
      .single()

    if (staffError) throw new Error(staffError.message)

    // 4. Gửi Email tự động sau khi đặt lịch thành công
    await resend.emails.send({
      from: "Trinh's Nails <onboarding@resend.dev>", 
      to: customerEmail,
      subject: `Xác nhận lịch hẹn: ${customerName}`,
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
          <h2 style="color: #e11d48;">Thank You For Booking With Us!</h2>
          <p>Hello <strong>${customerName}</strong>,</p>
          <p>Your beauty appointment has been successfully booked with the following details:</p>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p>📅 <strong>Date:</strong> ${date}</p>
          <p>⏰ <strong>Time:</strong> ${time}</p>
          <p>💇 <strong>Stylistician:</strong> ${staffData.name}</p>
          <p>💰 <strong>Payment Method:</strong> ${paymentMode === 'deposit' ? 'Deposit' : 'Full Payment'}</p>
          ${notes ? `<p>📝 <strong>Your Notes:</strong></p><p style="background-color: #f5f5f5; padding: 12px; border-left: 4px solid #e11d48; border-radius: 4px;">${notes}</p>` : ''}
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p>Please be present 5 minutes before your appointment for the best service experience.</p>
          <p>We look forward to seeing you at the salon!</p>
          <p style="font-size: 12px; color: #999;">This is an automated email, please do not reply to this message.</p>
        </div>
      `,
    })

    // Trả về bookingId lấy từ hàm book_slot và mã bảo mật Stripe
    return NextResponse.json({
      bookingId: bookingId,
      clientSecret: paymentIntent.client_secret
    })

  } catch (err: unknown) {
    console.error("Lỗi API Booking:", (err as Error).message)
    return NextResponse.json({ error: (err as Error).message || 'Something went wrong' }, { status: 400 })
  }
}