'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminDashboard from './AdminDashboard'
import { ADMIN_EMAIL, getSupabase, isAdminUser } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default function AdminPage() {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function verifyAdminAccess() {
      try {
        const supabase = getSupabase()
        const { data: { user }, error } = await supabase.auth.getUser()

        if (!isMounted) return

          if (error || !isAdminUser(user) || !ADMIN_EMAIL) {
            router.replace('/admin/login')
          return
        }

        setAuthorized(true)
      } catch {
        if (isMounted) {
          router.replace('/admin/login')
        }
      } finally {
        if (isMounted) {
          setChecking(false)
        }
      }
    }

    verifyAdminAccess()

    return () => {
      isMounted = false
    }
  }, [router])

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: '#4b5563' }}>
        Checking admin access...
      </div>
    )
  }

  if (!authorized) {
    return null
  }

  return <AdminDashboard />
}
