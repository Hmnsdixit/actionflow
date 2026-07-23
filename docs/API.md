# ActionFlow — API Design

Status: Finalized Day 2 — no implementation yet, built Day 4–6.

All endpoints are Next.js API routes under `app/api/`. All (except auth, handled by Supabase client SDK directly) require an active Supabase session cookie.

---

## POST `/api/process-meeting`

**Purpose:** Submit raw meeting notes, get back an AI-generated summary + action items, and persist them.

**Auth:** Required (logged-in session). Reject with 401 if missing.

**Request body:**
```json
{
  "title": "Weekly Sync",
  "raw_notes": "string, required, min 10 chars, max ~20000 chars"
}
```

**Validation:**
- `raw_notes` required, non-empty after trim, length capped (defensive limit, e.g. 20,000 chars).
- `title` optional; defaults to `"Untitled Meeting"` if blank.

**Response (200):**
```json
{
  "meeting_id": "uuid",
  "summary": "string",
  "action_items": [{ "id": "uuid", "text": "string", "status": "pending" }]
}
```

**Error cases:**
| Status | Case |
|---|---|
| 401 | No valid session |
| 400 | Empty/missing `raw_notes` |
| 502 | Claude API call failed or returned unparseable JSON (after one retry) |
| 500 | Database insert failed |

---

## GET `/api/meetings`

**Purpose:** List all meetings for the logged-in user (dashboard list).

**Auth:** Required.

**Request:** none (optional query param `?q=keyword` for stretch search).

**Validation:** `q` (if present) sanitized/escaped before use in an `ILIKE` query.

**Response (200):**
```json
{
  "meetings": [
    { "id": "uuid", "title": "string", "created_at": "ISO date" }
  ]
}
```

**Error cases:** 401 if not logged in; 500 on DB error.

---

## GET `/api/meetings/:id`

**Purpose:** Fetch a single meeting's full detail (summary + its action items) for the result/detail page.

**Auth:** Required. Must also confirm the meeting belongs to the logged-in user (enforced by RLS, but API route should still return 404 rather than another user's data if a mismatched id is requested).

**Response (200):**
```json
{
  "id": "uuid",
  "title": "string",
  "raw_notes": "string",
  "summary": "string",
  "action_items": [{ "id": "uuid", "text": "string", "status": "pending" }]
}
```

**Error cases:** 401 not logged in; 404 not found / not owned by user.

---

## GET `/api/action-items`

**Purpose:** Aggregated action items across all of the user's meetings, for the dashboard's unified view.

**Auth:** Required.

**Response (200):**
```json
{
  "action_items": [
    { "id": "uuid", "text": "string", "status": "pending", "meeting_id": "uuid", "meeting_title": "string" }
  ]
}
```

**Error cases:** 401; 500.

---

## PATCH `/api/action-items/:id`

**Purpose:** Toggle a single action item's status between `pending` and `done`.

**Auth:** Required. RLS ensures only the owning user can update it.

**Request body:**
```json
{ "status": "done" }
```

**Validation:** `status` must be exactly `"pending"` or `"done"` — reject anything else with 400.

**Response (200):**
```json
{ "id": "uuid", "status": "done" }
```

**Error cases:** 401; 400 invalid status value; 404 item not found / not owned.

---

## Auth Endpoints (handled by Supabase client SDK — not custom routes)

| Action | Method |
|---|---|
| Sign up | `supabase.auth.signUp({ email, password })` |
| Log in | `supabase.auth.signInWithPassword({ email, password })` |
| Log out | `supabase.auth.signOut()` |

These do not need custom Next.js API routes — the Supabase JS client calls Supabase's own auth endpoints directly and manages the session cookie.
