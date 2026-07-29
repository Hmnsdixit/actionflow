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
    setCurrentStatus(newStatus)
    setSaving(true)

    try {
      const res = await fetch(`/api/action-items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) {
        setCurrentStatus(currentStatus)
      }
    } catch {
      setCurrentStatus(currentStatus)
    } finally {
      setSaving(false)
    }
  }

  return (
    <li className="flex items-center gap-3 border rounded-md px-3 py-2 hover:border-indigo-900/40 hover:shadow-sm transition">
      <input
        type="checkbox"
        checked={currentStatus === 'done'}
        onChange={toggle}
        disabled={saving}
        aria-label={`Mark "${text}" as ${currentStatus === 'done' ? 'pending' : 'done'}`}
        className="w-4 h-4 accent-indigo-900 cursor-pointer disabled:cursor-wait"
      />
      <div className="flex-1 min-w-0">
        <span className={currentStatus === 'done' ? 'line-through text-gray-400' : 'text-gray-800'}>
          {text}
        </span>
        <a href={`/meetings/${meetingId}`} className="block text-xs text-gray-400 hover:text-indigo-900 transition truncate">
          from: {meetingTitle}
        </a>
      </div>
      {saving && (
        <span className="w-3 h-3 border-2 border-gray-300 border-t-indigo-900 rounded-full animate-spin shrink-0" />
      )}
    </li>
  )
}