// app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import Stripe from 'stripe'
import { Resend } from 'resend' // 1. Import Resend

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const resend = new Resend(process.env.RESEND_API_KEY) // 2. Khởi tạo Resend

export async function POST(req: NextRequest) {
  const supabase = getSupabase()
  const body = await req.json()
  const { serviceId, date, time, customerName, customerEmail, paymentMode, price } = body

  try {
    // Tạo Stripe PaymentIntent
    const amount = paymentMode === 'deposit' ? 1500 : Math.round(price * 100)
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    })

    // Lưu vào Supabase
    const { data, error } = await supabase.from('bookings').insert({
      service_id: serviceId,
      booking_date: date,
      booking_time: time,
      customer_name: customerName,
      customer_email: customerEmail,
      payment_mode: paymentMode,
      stripe_payment_id: paymentIntent.id,
      status: 'pending'
    }).select().single()

    if (error) throw new Error(error.message)

    // 3. Gửi Email tự động sau khi lưu DB thành công
    await resend.emails.send({
      from: "Trinh's Nails <onboarding@resend.dev>", // Thay đổi sau khi cậu verify domain
      to: customerEmail,
      subject: `Xác nhận lịch hẹn: ${customerName}`,
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
          <h2 style="color: #e11d48;">Cảm ơn bạn đã đặt lịch!</h2>
          <p>Chào <strong>${customerName}</strong>,</p>
          <p>Lịch hẹn làm đẹp của bạn đã được ghi nhận thành công với các thông tin sau:</p>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p>📅 <strong>Ngày:</strong> ${date}</p>
          <p>⏰ <strong>Giờ:</strong> ${time}</p>
          <p>💰 <strong>Hình thức:</strong> ${paymentMode === 'deposit' ? 'Đặt cọc $15' : 'Thanh toán đủ'}</p>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p>Vui lòng có mặt trước 5 phút để trải nghiệm dịch vụ tốt nhất nhé.</p>
          <p>Hẹn gặp lại bạn tại salon!</p>
          <p style="font-size: 12px; color: #999;">Đây là email tự động, vui lòng không phản hồi email này.</p>
        </div>
      `,
    })

    return NextResponse.json({
      bookingId: data.id,
      clientSecret: paymentIntent.client_secret
    })

  } catch (err: unknown) {
    console.error("Lỗi API Booking:", (err as Error).message)
    return NextResponse.json({ error: (err as Error).message }, { status: 400 })
  }
}