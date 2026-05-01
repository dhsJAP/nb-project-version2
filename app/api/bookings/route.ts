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
  const { serviceId, staffId, date, time, customerName, customerEmail, paymentMode, price } = body

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
      staff_id: staffId,
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
          <h2 style="color: #e11d48;">Thank You For Booking With Us!</h2>
          <p>Hello <strong>${customerName}</strong>,</p>
          <p>Your beauty appointment has been successfully booked with the following details:</p>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p>📅 <strong>Date:</strong> ${date}</p>
          <p>⏰ <strong>Time:</strong> ${time}</p>
          <p>💇 <strong>Stylistician:</strong> ${staffId}</p>
          <p>💰 <strong>Payment Method:</strong> ${paymentMode === 'deposit' ? 'Deposit $15' : 'Full Payment'}</p>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p>Please be present 5 minutes before your appointment for the best service experience.</p>
          <p>We look forward to seeing you at the salon!</p>
          <p style="font-size: 12px; color: #999;">This is an automated email, please do not reply to this message.</p>
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