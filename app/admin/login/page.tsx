'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ADMIN_EMAIL, getSupabase, isAdminUser } from '@/lib/supabase'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function redirectIfAlreadySignedIn() {
      const supabase = getSupabase()
      const { data: { user } } = await supabase.auth.getUser()

      if (isAdminUser(user)) {
        router.replace('/admin')
      }
    }

    redirectIfAlreadySignedIn().catch(() => undefined)
  }, [router])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!ADMIN_EMAIL) {
      setError('Admin email is not configured.')
      return
    }

    setLoading(true)

    try {
      const supabase = getSupabase()
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError || !data.user) {
        throw new Error(signInError?.message || 'Unable to sign in')
      }

      if (!isAdminUser(data.user)) {
        await supabase.auth.signOut()
        throw new Error('This account does not have admin access.')
      }

      router.replace('/admin')
    } catch (signInError) {
      setError(signInError instanceof Error ? signInError.message : 'Unable to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card" aria-labelledby="admin-login-title">
        <div className="admin-login-mark">T</div>
        <p className="admin-login-eyebrow">Trinh&apos;s Nails</p>
        <h1 id="admin-login-title">Admin sign in</h1>
        <p className="admin-login-copy">Sign in to manage bookings and your salon schedule.</p>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {error && <p className="admin-login-error" role="alert">{error}</p>}
          <button className="admin-login-button" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  )
}
