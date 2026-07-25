import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { processMeetingNotes } from '@/lib/groq'

export async function POST(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 })
  }

  let body: { title?: string; raw_notes?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const rawNotes = (body.raw_notes ?? '').trim()
  const title = (body.title ?? '').trim() || 'Untitled Meeting'

  if (!rawNotes || rawNotes.length < 10) {
    return NextResponse.json(
      { error: 'Please paste at least a few sentences of meeting notes.' },
      { status: 400 }
    )
  }

  if (rawNotes.length > 20000) {
    return NextResponse.json(
      { error: 'Notes are too long. Please paste under 20,000 characters.' },
      { status: 400 }
    )
  }

  let processed
  try {
    processed = await processMeetingNotes(rawNotes)
  } catch (err) {
    console.error('Groq processing failed:', err)
    return NextResponse.json(
      { error: 'AI processing failed. Please try again in a moment.' },
      { status: 502 }
    )
  }

  const { data: meeting, error: insertError } = await supabase
    .from('meetings')
    .insert({
      user_id: user.id,
      title,
      raw_notes: rawNotes,
      summary: processed.summary,
    })
    .select()
    .single()

  if (insertError || !meeting) {
    console.error('Failed to save meeting:', insertError)
    return NextResponse.json({ error: 'Failed to save meeting.' }, { status: 500 })
  }

  if (processed.action_items.length > 0) {
    const { error: actionItemsError } = await supabase.from('action_items').insert(
      processed.action_items.map((text) => ({
        meeting_id: meeting.id,
        text,
      }))
    )

    if (actionItemsError) {
      console.error('Failed to save action items:', actionItemsError)
    }
  }

  return NextResponse.json({ meeting_id: meeting.id })
}