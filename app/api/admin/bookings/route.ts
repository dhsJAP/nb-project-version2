import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { ADMIN_EMAIL } from '@/lib/supabase'

export async function PATCH(req: NextRequest) {
  try {
    // ========================================
    // 1. Lấy access token từ Authorization
    // ========================================
    const authorization =
      req.headers.get('authorization') ||
      req.headers.get('Authorization')

    const authToken = authorization?.startsWith('Bearer ')
      ? authorization.slice(7)
      : null

    if (!authToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // ========================================
    // 2. Lấy dữ liệu cần update
    // ========================================
    const body = await req.json()

    const { id, status, date, time } = body as {
      id?: string
      status?: 'confirmed' | 'pending' | 'completed' | 'cancelled'
      date?: string
      time?: string
    }

    if (!id) {
      return NextResponse.json(
        { error: 'Missing booking id' },
        { status: 400 }
      )
    }

    // ========================================
    // 3. Tạo Supabase client
    //    Dùng ANON KEY, KHÔNG dùng SERVICE ROLE
    // ========================================
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !anonKey) {
      return NextResponse.json(
        { error: 'Supabase credentials are not configured' },
        { status: 500 }
      )
    }

    const supabase = createClient(url, anonKey, {
      auth: {
        persistSession: false,
      },
    })

    // ========================================
    // 4. Xác thực access token
    // ========================================
    const {
      data: userData,
      error: authError,
    } = await supabase.auth.getUser(authToken)

    if (authError || !userData.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // ========================================
    // 5. LỚP BẢO MẬT 1
    //    Kiểm tra ADMIN_EMAIL
    // ========================================
    const userEmail =
      userData.user.email?.toLowerCase() || ''

    if (
      !ADMIN_EMAIL ||
      userEmail !== ADMIN_EMAIL.toLowerCase()
    ) {
      return NextResponse.json(
        { error: 'Forbidden: admin access required' },
        { status: 403 }
      )
    }

    // ========================================
    // 6. Chuẩn bị dữ liệu UPDATE
    // ========================================
    const updatePayload: Record<string, string> = {}

    if (status) {
      updatePayload.status = status
    }

    if (date) {
      updatePayload.booking_date = date
    }

    if (time) {
      updatePayload.booking_time = time
    }

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json(
        { error: 'No update fields provided' },
        { status: 400 }
      )
    }

    // ========================================
    // 7. UPDATE bookings
    //
    //    QUAN TRỌNG:
    //    Không dùng SERVICE_ROLE_KEY.
    //
    //    Request này sẽ đi qua RLS.
    // ========================================
    const { data, error } = await supabase
      .from('bookings')
      .update(updatePayload)
      .eq('id', id)
      .select('id')
      .single()

    // ========================================
    // 8. RLS từ chối → UPDATE thất bại
    // ========================================
    if (error) {
      console.error('Booking update failed:', error)

      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    // ========================================
    // 9. Thành công
    // ========================================
    return NextResponse.json({
      success: true,
      booking: data,
    })
  } catch (error) {
    console.error('Admin booking update failed:', error)

    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}