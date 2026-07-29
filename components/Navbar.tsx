import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from './LogoutButton'

export default async function Navbar() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <nav className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-6xl mx-auto">
        <Link href="/" className="text-xl font-bold text-indigo-900">
          ActionFlow
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-700 hover:text-indigo-900 transition"
              >
                Dashboard
              </Link>
              <span className="hidden sm:inline text-sm text-gray-500 truncate max-w-[160px]">
                {user.email}
              </span>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-700 hover:text-indigo-900 transition"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="text-sm font-medium bg-indigo-900 text-white px-4 py-2 rounded-md hover:bg-indigo-800 active:bg-indigo-950 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}