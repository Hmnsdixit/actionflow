export interface ProcessedMeeting {
  summary: string
  action_items: string[]
}

export class GroqError extends Error {
  status: number
  kind: 'rate_limit' | 'auth' | 'provider' | 'parse' | 'unknown'

  constructor(message: string, status: number, kind: GroqError['kind']) {
    super(message)
    this.status = status
    this.kind = kind
  }
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
    throw new GroqError('GROQ_API_KEY is not configured on the server.', 500, 'auth')
  }

  let response: Response
  try {
    response = await fetch(GROQ_URL, {
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
  } catch {
    throw new GroqError('Could not reach the AI provider. Check your connection.', 503, 'provider')
  }

  if (response.status === 429) {
    throw new GroqError(
      "Groq's free tier is rate-limited and the current quota is exhausted. Please wait a minute and try again.",
      429,
      'rate_limit'
    )
  }

  if (response.status === 401 || response.status === 403) {
    throw new GroqError('AI provider rejected the request (invalid API key).', response.status, 'auth')
  }

  if (!response.ok) {
    const errText = await response.text().catch(() => '')
    throw new GroqError(`AI provider error (${response.status}): ${errText.slice(0, 200)}`, response.status, 'provider')
  }

  const data = await response.json()
  const text = data?.choices?.[0]?.message?.content

  if (!text) {
    throw new GroqError('AI provider returned an unexpected response shape.', 502, 'provider')
  }

  return text
}

function normalizeResult(parsed: unknown): ProcessedMeeting {
  const obj = parsed as { summary?: unknown; action_items?: unknown }
  const summary = typeof obj.summary === 'string' ? obj.summary.slice(0, 4000) : ''
  const action_items = Array.isArray(obj.action_items)
    ? obj.action_items
        .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
        .slice(0, 50)
        .map((item) => item.slice(0, 500))
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
    try {
      const parsed = JSON.parse(cleaned)
      return normalizeResult(parsed)
    } catch {
      throw new GroqError('AI response could not be parsed after retrying.', 502, 'parse')
    }
  }
}