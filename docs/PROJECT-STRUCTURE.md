# ActionFlow — Project Structure

Status: Finalized Day 2 — scaffolded exactly this way on Day 3.

## Folder Tree

```
actionflow/
├── app/
│   ├── layout.tsx              # Root layout, global styles, nav shell
│   ├── page.tsx                 # Landing/marketing page (or redirect to /login)
│   ├── signup/
│   │   └── page.tsx             # Sign up screen
│   ├── login/
│   │   └── page.tsx             # Log in screen
│   ├── dashboard/
│   │   └── page.tsx             # Main dashboard (meetings list + aggregated action items)
│   ├── new-meeting/
│   │   └── page.tsx             # Paste-notes form
│   ├── meetings/
│   │   └── [id]/
│   │       └── page.tsx         # Single meeting result/detail page
│   └── api/
│       ├── process-meeting/
│       │   └── route.ts         # POST — calls Claude, saves meeting + action items
│       ├── meetings/
│       │   ├── route.ts         # GET — list meetings
│       │   └── [id]/route.ts    # GET — single meeting detail
│       └── action-items/
│           ├── route.ts         # GET — aggregated action items
│           └── [id]/route.ts    # PATCH — toggle status
├── lib/
│   ├── supabase.ts               # Configured Supabase client (browser + server variants)
│   └── claude.ts                 # Claude API helper (builds prompt, calls API, parses JSON)
├── middleware.ts                  # Redirects unauthenticated users away from protected routes
├── docs/                          # All Day 2 design docs (this file and its siblings)
│   ├── ARCHITECTURE.md
│   ├── SCHEMA.md
│   ├── API.md
│   ├── UI-WIREFRAMES.md
│   └── PROJECT-STRUCTURE.md
├── public/                        # Static assets (favicon, etc.)
├── .env.local                     # Local secrets (never committed)
├── .gitignore
├── package.json
└── README.md
```

## Why This Structure

- **`app/` mirrors the URL structure** (Next.js App Router convention) — every route in the UI Flow doc maps to exactly one folder here, so there's never ambiguity about "where does this screen live."
- **`app/api/` keeps the backend colocated with the frontend** — no separate server/repo to manage, consistent with the architecture decision to use Next.js for both layers.
- **`lib/` isolates external service logic** (Supabase, Claude) from UI code — pages import from `lib/`, never talk to Supabase or Claude directly with inline credentials, making it easy to change either service later without touching every page.
- **`middleware.ts` centralizes auth protection** in one file rather than repeating a login check on every page.
- **`docs/`** keeps all planning artifacts inside the repo itself, versioned alongside the code — anyone (including a future AI session) can open the repo and immediately find the architecture, schema, and API contracts.

## Where Future Code Lands (day-by-day)

| Day | Adds to |
|---|---|
| 3 | `app/page.tsx`, `lib/supabase.ts`, base scaffold |
| 4 | `app/signup/`, `app/login/`, `middleware.ts` |
| 5 | `app/new-meeting/`, `app/api/process-meeting/`, `app/meetings/[id]/`, `lib/claude.ts` |
| 6 | `app/dashboard/`, `app/api/meetings/`, `app/api/action-items/` |
| 7 | Search additions inside `app/dashboard/page.tsx` + `app/api/meetings/route.ts` (query param) |

No new top-level folders are expected after Day 6 — Days 7–10 only edit files within this structure.
