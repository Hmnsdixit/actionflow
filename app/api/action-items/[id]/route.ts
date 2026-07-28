import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'You must be logged in.' }, { status: 401 })
  }

  let body: { status?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  if (body.status !== 'pending' && body.status !== 'done') {
    return NextResponse.json(
      { error: 'status must be "pending" or "done".' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('action_items')
    .update({ status: body.status })
    .eq('id', id)
    .select()
    .single()

  if (error || !data) {
    return NextResponse.json(
      { error: 'Action item not found or you do not have access to it.' },
      { status: 404 }
    )
  }

  return NextResponse.json({ id: data.id, status: data.status })
}