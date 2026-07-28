import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ActionItemRow from '@/components/ActionItemRow'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: meetings } = await supabase
    .from('meetings')
    .select('id, title, created_at')
    .order('created_at', { ascending: false })

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

  const pendingCount = actionItems.filter((i) => i.status === 'pending').length

  return (
    <main className="max-w-5xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-indigo-900">Dashboard</h1>
        <Link
          href="/new-meeting"
          className="bg-indigo-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-800"
        >
          + New Meeting
        </Link>
      </div>

      {(!meetings || meetings.length === 0) ? (
        <div className="border rounded-lg p-8 text-center text-gray-500">
          <p className="mb-3">No meetings yet.</p>
          <Link href="/new-meeting" className="text-indigo-900 font-medium hover:underline">
            Add your first meeting &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">My Meetings</h2>
            <ul className="space-y-2">
              {meetings.map((meeting) => (
                <li key={meeting.id}>
                  <Link
                    href={`/meetings/${meeting.id}`}
                    className="block border rounded-md px-3 py-2 hover:border-indigo-900"
                  >
                    <span className="font-medium text-gray-800">{meeting.title}</span>
                    <span className="block text-xs text-gray-400">
                      {new Date(meeting.created_at).toLocaleDateString()}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Action Items{' '}
              {pendingCount > 0 && (
                <span className="text-sm font-normal text-gray-500">({pendingCount} pending)</span>
              )}
            </h2>
            {actionItems.length === 0 ? (
              <p className="text-gray-500 text-sm">No action items yet.</p>
            ) : (
              <ul className="space-y-2">
                {actionItems.map((item) => (
                  <ActionItemRow
                    key={item.id}
                    id={item.id}
                    text={item.text}
                    status={item.status}
                    meetingTitle={item.meeting_title}
                    meetingId={item.meeting_id}
                  />
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </main>
  )
}