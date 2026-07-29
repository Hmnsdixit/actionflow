import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
      <p className="text-6xl font-bold text-indigo-900 mb-2">404</p>
      <h1 className="text-xl font-semibold text-gray-800 mb-2">Page not found</h1>
      <p className="text-gray-500 mb-6 max-w-sm">
        This page doesn&apos;t exist, or you don&apos;t have access to it.
      </p>
      <Link
        href="/dashboard"
        className="bg-indigo-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-800 transition"
      >
        Back to Dashboard
      </Link>
    </main>
  )
}