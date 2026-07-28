'use client'

import { useState } from 'react'

interface ActionItemRowProps {
  id: string
  text: string
  status: string
  meetingTitle: string
  meetingId: string
}

export default function ActionItemRow({ id, text, status, meetingTitle, meetingId }: ActionItemRowProps) {
  const [currentStatus, setCurrentStatus] = useState(status)
  const [saving, setSaving] = useState(false)

  async function toggle() {
    const newStatus = currentStatus === 'done' ? 'pending' : 'done'
    setCurrentStatus(newStatus) // optimistic update
    setSaving(true)

    try {
      const res = await fetch(`/api/action-items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) {
        setCurrentStatus(currentStatus) // revert on failure
      }
    } catch {
      setCurrentStatus(currentStatus) // revert on network error
    } finally {
      setSaving(false)
    }
  }

  return (
    <li className="flex items-center gap-3 border rounded-md px-3 py-2">
      <input
        type="checkbox"
        checked={currentStatus === 'done'}
        onChange={toggle}
        disabled={saving}
        className="w-4 h-4 accent-indigo-900"
      />
      <div className="flex-1">
        <span className={currentStatus === 'done' ? 'line-through text-gray-400' : 'text-gray-800'}>
          {text}
        </span>
        <a href={`/meetings/${meetingId}`} className="block text-xs text-gray-400 hover:text-indigo-900">
          from: {meetingTitle}
        </a>
      </div>
    </li>
  )
}