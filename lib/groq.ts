export interface ProcessedMeeting {
  summary: string
  action_items: string[]
}

const GROQ_MODEL = 'llama-3.3-70b-versatile'
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

function buildPrompt(rawNotes: string): string {
  return `You are an assistant that turns messy meeting notes into a structured summary and a list of action items.

Read the following raw meeting notes and respond with ONLY valid JSON (no markdown code fences, no extra text before or after) in exactly this shape:

{"summary": "a concise 2-4 sentence summary of what was discussed and decided", "action_items": ["short action item 1", "short action item 2"]}

Rules:
- action_items should be short, clear, actionable phrases (not full sentences like "I will...").
- If no clear action items exist, return an empty array for action_items.
- Do not invent information that isn't in the notes.

Raw meeting notes:
"""
${rawNotes}
"""`
}

function stripCodeFences(text: string): string {
  return text.trim().replace(/^```(json)?/i, '').replace(/```$/, '').trim()
}

async function callGroq(prompt: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured on the server.')
  }

  const response = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      response_format: { type: 'json_object' },
    }),
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(`Groq API request failed (${response.status}): ${errText}`)
  }

  const data = await response.json()
  const text = data?.choices?.[0]?.message?.content

  if (!text) {
    throw new Error('Groq API returned an unexpected response shape.')
  }

  return text
}

function normalizeResult(parsed: unknown): ProcessedMeeting {
  const obj = parsed as { summary?: unknown; action_items?: unknown }
  const summary = typeof obj.summary === 'string' ? obj.summary : ''
  const action_items = Array.isArray(obj.action_items)
    ? obj.action_items.filter((item): item is string => typeof item === 'string')
    : []
  return { summary, action_items }
}

export async function processMeetingNotes(rawNotes: string): Promise<ProcessedMeeting> {
  const prompt = buildPrompt(rawNotes)

  let raw = await callGroq(prompt)
  let cleaned = stripCodeFences(raw)

  try {
    const parsed = JSON.parse(cleaned)
    return normalizeResult(parsed)
  } catch {
    const retryPrompt = `${prompt}\n\nIMPORTANT: Your previous response was not valid JSON. Respond with ONLY the JSON object, nothing else — no markdown, no commentary.`
    raw = await callGroq(retryPrompt)
    cleaned = stripCodeFences(raw)
    const parsed = JSON.parse(cleaned)
    return normalizeResult(parsed)
  }
}