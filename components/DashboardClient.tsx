'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import ActionItemRow from './ActionItemRow'

interface Meeting {
  id: string
  title: string
  raw_notes: string
  created_at_formatted: string
}

interface ActionItem {
  id: string
  text: string
  status: string
  meeting_id: string
  meeting_title: string
}

export default function DashboardClient({
  meetings,
  actionItems,
}: {
  meetings: Meeting[]
  actionItems: ActionItem[]
}) {
  const [query, setQuery] = useState('')

  const filteredMeetings = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return meetings
    return meetings.filter(
      (m) => m.title.toLowerCase().includes(q) || m.raw_notes.toLowerCase().includes(q)
    )
  }, [meetings, query])

  const pendingCount = actionItems.filter((i) => i.status === 'pending').length

  return (
    <>
      <div className="mb-6">
        <div className="relative max-w-md">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search meetings by title or notes..."
            className="w-full border rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-900/30 focus:border-indigo-900 transition"
          />
        </div>
        {query && (
          <p className="text-xs text-gray-400 mt-1">
            {filteredMeetings.length} of {meetings.length} meetings match &quot;{query}&quot;
          </p>
        )}
      </div>

      {meetings.length === 0 ? (
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
            {filteredMeetings.length === 0 ? (
              <p className="text-gray-500 text-sm">No meetings match your search.</p>
            ) : (
              <ul className="space-y-2">
                {filteredMeetings.map((meeting) => (
                  <li key={meeting.id}>
                    <Link
                      href={`/meetings/${meeting.id}`}
                      className="block border rounded-md px-3 py-2 hover:border-indigo-900 hover:shadow-sm transition"
                    >
                      <span className="font-medium text-gray-800">{meeting.title}</span>
                      <span className="block text-xs text-gray-400">{meeting.created_at_formatted}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
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
    </>
  )
}