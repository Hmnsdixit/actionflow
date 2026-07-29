'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Unhandled application error:', error)
  }, [error])

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
      <p className="text-5xl mb-2">⚠️</p>
      <h1 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h1>
      <p className="text-gray-500 mb-6 max-w-sm">
        An unexpected error occurred. You can try again, or head back to your dashboard.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="bg-indigo-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-800 transition"
        >
          Try Again
        </button>
        <Link
          href="/dashboard"
          className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition"
        >
          Back to Dashboard
        </Link>
      </div>
    </main>
  )
}