'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Alert from '@/components/Alert'

export default function NewMeetingPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [rawNotes, setRawNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (rawNotes.trim().length < 10) {
      setError('Please paste at least a few sentences of meeting notes.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/process-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, raw_notes: rawNotes }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        setLoading(false)
        return
      }

      router.push(`/meetings/${data.meeting_id}`)
    } catch {
      setError('Network error. Please check your connection and try again.')
      setLoading(false)
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-4 sm:p-8">
      <h1 className="text-2xl font-bold text-indigo-900 mb-1">New Meeting</h1>
      <p className="text-sm text-gray-500 mb-6">
        Paste your raw notes below — Groq&apos;s AI will organize them into a summary and action items.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert message={error} />}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title (optional)
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Weekly Sync"
            className="w-full border rounded-md px-3 py-2 transition focus:border-indigo-900"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Meeting Notes
          </label>
          <textarea
            id="notes"
            value={rawNotes}
            onChange={(e) => setRawNotes(e.target.value)}
            placeholder="Paste your raw, messy meeting notes here..."
            rows={14}
            className="w-full border rounded-md px-3 py-2 font-mono text-sm transition focus:border-indigo-900"
            disabled={loading}
          />
          <p className="text-xs text-gray-400 mt-1">{rawNotes.length} / 20,000 characters</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-900 text-white py-3 rounded-md font-medium hover:bg-indigo-800 active:bg-indigo-950 disabled:opacity-60 transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing with AI...
            </>
          ) : (
            'Process with AI'
          )}
        </button>
      </form>
    </main>
  )
}