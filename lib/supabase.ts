import { createClient } from '@supabase/supabase-js'

type SupabaseClientOptions = {
  admin?: boolean
}

export const ADMIN_EMAIL = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL || '').toLowerCase()

export function getSupabase(options: SupabaseClientOptions = {}) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = options.admin
    ? process.env.SUPABASE_SERVICE_ROLE_KEY
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
  }

  if (!key) {
    throw new Error(
      options.admin
        ? 'Missing SUPABASE_SERVICE_ROLE_KEY'
        : 'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY'
    )
  }

  return createClient(url, key)
}

export function isAdminUser(user: { email?: string | null } | null | undefined) {
  if (!user?.email) return false
  return user.email.toLowerCase() === ADMIN_EMAIL
}
