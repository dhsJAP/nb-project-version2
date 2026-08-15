import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, status, date, time } = body as {
      id?: string
      status?: 'confirmed' | 'pending' | 'completed' | 'cancelled'
      date?: string
      time?: string
    }

    if (!id) {
      return NextResponse.json({ error: 'Missing booking id' }, { status: 400 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !serviceRoleKey) {
      return NextResponse.json({ error: 'Supabase admin credentials are not configured' }, { status: 500 })
    }

    const supabase = createClient(url, serviceRoleKey, {
      auth: { persistSession: false },
    })

    const updatePayload: Record<string, string> = {}
    if (status) updatePayload.status = status
    if (date) updatePayload.booking_date = date
    if (time) updatePayload.booking_time = time

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json({ error: 'No update fields provided' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('bookings')
      .update(updatePayload)
      .eq('id', id)
      .select('id')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, booking: data })
  } catch (error) {
    console.error('Admin booking update failed:', error)
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
  }
}
