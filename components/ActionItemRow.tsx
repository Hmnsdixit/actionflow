'use client'

import { useState, useEffect } from 'react'

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
  const [failedMessage, setFailedMessage] = useState('')

  useEffect(() => {
    if (!failedMessage) return
    const timer = setTimeout(() => setFailedMessage(''), 3000)
    return () => clearTimeout(timer)
  }, [failedMessage])

  async function toggle() {
    const newStatus = currentStatus === 'done' ? 'pending' : 'done'
    setCurrentStatus(newStatus)
    setSaving(true)
    setFailedMessage('')

    try {
      const res = await fetch(`/api/action-items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) {
        setCurrentStatus(currentStatus)
        setFailedMessage("Couldn't save — please try again.")
      }
    } catch {
      setCurrentStatus(currentStatus)
      setFailedMessage('Network error — please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <li className="border rounded-md px-3 py-2 hover:border-indigo-900/40 hover:shadow-sm transition">
      <div className="flex items-center gap-3">
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
      </div>
      {failedMessage && (
        <p role="alert" className="text-xs text-red-600 mt-1 pl-7">
          {failedMessage}
        </p>
      )}
    </li>
  )
}