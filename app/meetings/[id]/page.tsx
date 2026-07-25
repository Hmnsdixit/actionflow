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

  return (
    <main className="max-w-2xl mx-auto p-8">
      <Link href="/dashboard" className="text-sm text-indigo-900 hover:underline">
        &larr; Back to Dashboard
      </Link>

      <h1 className="text-2xl font-bold text-indigo-900 mt-4">{meeting.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        {new Date(meeting.created_at).toLocaleString()}
      </p>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Summary</h2>
        <p className="text-gray-700 whitespace-pre-wrap">{meeting.summary || 'No summary available.'}</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Action Items</h2>
        {actionItems && actionItems.length > 0 ? (
          <ul className="space-y-2">
            {actionItems.map((item) => (
              <li key={item.id} className="flex items-center gap-2 border rounded-md px-3 py-2">
                <span className={item.status === 'done' ? 'line-through text-gray-400' : ''}>
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