import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import DashboardClient from '@/components/DashboardClient'
import { formatDate } from '@/lib/formatDate'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: meetingsRaw } = await supabase
    .from('meetings')
    .select('id, title, raw_notes, created_at')
    .order('created_at', { ascending: false })

  const meetings = (meetingsRaw ?? []).map((m) => ({
    id: m.id,
    title: m.title,
    raw_notes: m.raw_notes,
    created_at_formatted: formatDate(m.created_at),
  }))

  const { data: actionItemsRaw } = await supabase
    .from('action_items')
    .select('id, text, status, meeting_id, meetings!inner(title, user_id)')
    .eq('meetings.user_id', user?.id ?? '')
    .order('status', { ascending: true })
    .order('created_at', { ascending: false })

  const actionItems = (actionItemsRaw ?? []).map((item) => {
    const meeting = Array.isArray(item.meetings) ? item.meetings[0] : item.meetings
    return {
      id: item.id,
      text: item.text,
      status: item.status,
      meeting_id: item.meeting_id,
      meeting_title: meeting?.title ?? 'Untitled Meeting',
    }
  })

  return (
    <main className="max-w-5xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-indigo-900">Dashboard</h1>
        <Link
          href="/new-meeting"
          className="bg-indigo-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-800 transition"
        >
          + New Meeting
        </Link>
      </div>

      <DashboardClient meetings={meetings} actionItems={actionItems} />
    </main>
  )
}