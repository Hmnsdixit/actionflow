import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function MeetingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    notFound()
  }

  const { data: meeting, error: meetingError } = await supabase
    .from('meetings')
    .select('*')
    .eq('id', id)
    .single()

  if (meetingError || !meeting) {
    notFound()
  }

  const { data: actionItems } = await supabase
    .from('action_items')
    .select('*')
    .eq('meeting_id', id)
    .order('created_at', { ascending: true })

  const doneCount = (actionItems ?? []).filter((i) => i.status === 'done').length
  const totalCount = actionItems?.length ?? 0

  return (
    <main className="max-w-2xl mx-auto p-4 sm:p-8">
      <Link
        href="/dashboard"
        className="text-sm text-indigo-900 hover:underline inline-flex items-center gap-1"
      >
        &larr; Back to Dashboard
      </Link>

      <h1 className="text-2xl font-bold text-indigo-900 mt-4">{meeting.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        {new Date(meeting.created_at).toLocaleString()}
      </p>

      <section className="mb-8 bg-gray-50 border rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Summary</h2>
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {meeting.summary || 'No summary available.'}
        </p>
      </section>

      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-800">Action Items</h2>
          {totalCount > 0 && (
            <span className="text-xs text-gray-400">
              {doneCount} / {totalCount} done
            </span>
          )}
        </div>
        {actionItems && actionItems.length > 0 ? (
          <ul className="space-y-2">
            {actionItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-2 border rounded-md px-3 py-2 hover:shadow-sm transition"
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    item.status === 'done' ? 'bg-green-500' : 'bg-amber-400'
                  }`}
                  aria-hidden="true"
                />
                <span className={item.status === 'done' ? 'line-through text-gray-400' : 'text-gray-800'}>
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No action items extracted from this meeting.</p>
        )}
      </section>
    </main>
  )
}