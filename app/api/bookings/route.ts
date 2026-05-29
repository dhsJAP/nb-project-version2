import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import Stripe from 'stripe'
import { Resend } from 'resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const resend = new Resend(process.env.RESEND_API_KEY)

type BookingPaymentMode = 'deposit' | 'full'
type BookingStatus = 'pending' | 'confirmed' | 'cancelled'

type BookingRequestBody = {
  serviceId?: string
  serviceItemIds?: string[]
  staffId?: string
  date?: string
  time?: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  paymentMode?: BookingPaymentMode
  price?: number
  notes?: string | null
}

type BookSlotRpcParams = {
  p_customer_name: string
  p_customer_email: string
  p_service_id: string
  p_staff_id: string
  p_booking_date: string
  p_booking_time: string
  p_payment_mode: BookingPaymentMode
  p_stripe_payment_id: string
  p_notes: string | null
  p_status: BookingStatus
}

export async function POST(req: NextRequest) {
  const supabase = getSupabase({ admin: true })
  const body = (await req.json()) as BookingRequestBody
  const {
    serviceId,
    staffId,
    date,
    time,
    customerName,
    customerEmail,
    paymentMode,
    price,
    notes,
  } = body

  try {
    if (!serviceId || !staffId || !date || !time || !customerName || !customerEmail) {
      throw new Error('Missing required booking fields')
    }

    if (paymentMode !== 'deposit' && paymentMode !== 'full') {
      throw new Error('Invalid payment mode')
    }

    if (typeof price !== 'number' || Number.isNaN(price)) {
      throw new Error('Invalid booking price')
    }

    const amount = paymentMode === 'deposit' ? Math.round(price * 0.3 * 100) : Math.round(price * 100)
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    })

    const rpcParams = {
      p_customer_name: customerName,
      p_customer_email: customerEmail,
      p_service_id: serviceId,
      p_staff_id: staffId,
      p_booking_date: date,
      p_booking_time: time,
      p_payment_mode: paymentMode,
      p_stripe_payment_id: paymentIntent.id,
      p_notes: notes?.trim() ? notes.trim() : null,
      p_status: 'pending',
    } satisfies BookSlotRpcParams

    const { data: bookingId, error: bookingError } = await supabase.rpc('book_slot', rpcParams)

    if (bookingError) throw new Error(bookingError.message)

    const { data: staffData, error: staffError } = await supabase
      .from('staff')
      .select('name')
      .eq('id', staffId)
      .single()

    if (staffError) throw new Error(staffError.message)

    await resend.emails.send({
      from: "Trinh's Nails <onboarding@resend.dev>",
      to: customerEmail,
      subject: `Xac nhan lich hen: ${customerName}`,
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
          <h2 style="color: #e11d48;">Thank You For Booking With Us!</h2>
          <p>Hello <strong>${customerName}</strong>,</p>
          <p>Your beauty appointment has been successfully booked with the following details:</p>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
          <p><strong>Stylistician:</strong> ${staffData.name}</p>
          <p><strong>Payment Method:</strong> ${paymentMode === 'deposit' ? 'Deposit' : 'Full Payment'}</p>
          ${notes ? `<p><strong>Your Notes:</strong></p><p style="background-color: #f5f5f5; padding: 12px; border-left: 4px solid #e11d48; border-radius: 4px;">${notes}</p>` : ''}
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p>Please be present 5 minutes before your appointment for the best service experience.</p>
          <p>We look forward to seeing you at the salon!</p>
          <p style="font-size: 12px; color: #999;">This is an automated email, please do not reply to this message.</p>
        </div>
      `,
    })

    return NextResponse.json({
      bookingId,
      clientSecret: paymentIntent.client_secret,
    })
  } catch (err: unknown) {
    console.error('Booking API error:', (err as Error).message)
    return NextResponse.json({ error: (err as Error).message || 'Something went wrong' }, { status: 400 })
  }
}
