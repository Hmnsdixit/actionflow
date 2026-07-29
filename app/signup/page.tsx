'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Alert from '@/components/Alert'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({ email, password })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 p-8 border rounded-lg shadow-sm bg-white"
      >
        <h1 className="text-2xl font-bold text-indigo-900">Sign Up</h1>

        {error && <Alert message={error} />}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-md px-3 py-2 transition focus:border-indigo-900"
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-md px-3 py-2 transition focus:border-indigo-900"
            required
            autoComplete="new-password"
            aria-describedby="password-hint"
          />
          <p id="password-hint" className="text-xs text-gray-400 mt-1">
            At least 6 characters.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-900 text-white py-2 rounded-md font-medium hover:bg-indigo-800 active:bg-indigo-950 disabled:opacity-60 transition flex items-center justify-center gap-2"
        >
          {loading && (
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>

        <p className="text-sm text-gray-600 text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-900 font-medium hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </main>
  )
}