import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold text-indigo-900">Dashboard</h1>
      <p className="text-gray-600 mt-2">
        Welcome, {user?.email}. Your meetings and action items will appear here starting Day 6.
      </p>
    </main>
  )
}