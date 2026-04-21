// app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { serviceId, date, time, customerName, customerEmail, paymentMode, price } = body

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

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({
    bookingId: data.id,
    clientSecret: paymentIntent.client_secret
  })
}