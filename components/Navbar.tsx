import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from './LogoutButton'

export default async function Navbar() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
      <Link href="/" className="text-xl font-bold text-indigo-900">
        ActionFlow
      </Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link href="/dashboard" className="text-sm font-medium text-gray-700 hover:text-indigo-900">
              Dashboard
            </Link>
            <span className="text-sm text-gray-500">{user.email}</span>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-indigo-900">
              Log In
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium bg-indigo-900 text-white px-4 py-2 rounded-md hover:bg-indigo-800"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}