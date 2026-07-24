# ActionFlow — Project Structure

Status: Updated end of Day 3 to reflect the actual scaffolded project (corrected from an initial nesting issue — see `DAY3-SUMMARY.md`).

## Folder Tree (actual, as of Day 3)

```
actionflow/                       # true project + repo root
├── app/
│   ├── layout.tsx                # Root layout — renders Navbar + page content
│   ├── page.tsx                  # Homepage ("ActionFlow is Ready!")
│   ├── globals.css               # Tailwind base styles
│   ├── favicon.ico
│   ├── login/
│   │   └── page.tsx              # Login form shell (wired Day 4)
│   ├── signup/
│   │   └── page.tsx              # Signup form shell (wired Day 4)
│   ├── dashboard/
│   │   └── page.tsx              # Placeholder (built Day 6)
│   └── new-meeting/
│       └── page.tsx              # Placeholder (built Day 5)
├── components/
│   └── Navbar.tsx                # Shared navigation, present on every page via layout.tsx
├── lib/
│   └── supabase.ts               # Configured Supabase browser client
├── docs/                         # All planning + design docs (versioned with the code)
│   ├── ARCHITECTURE.md
│   ├── SCHEMA.md
│   ├── API.md
│   ├── UI-WIREFRAMES.md
│   ├── PROJECT-STRUCTURE.md      # (this file)
│   ├── SETUP.md
│   ├── ENVIRONMENT.md
│   └── DAY3-SUMMARY.md
├── public/                       # Static assets
├── node_modules/                 # Installed dependencies (git-ignored)
├── .env.local                    # Local secrets (git-ignored)
├── .gitignore
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
├── package.json
├── package-lock.json
└── README.md
```

## What Changed vs. the Day 2 Version

- No structural changes to the *plan* — the API route folders (`app/api/...`) are simply not created yet because Day 3 is Setup only; they arrive Day 4–6 exactly as originally planned.
- One real-world correction: the project was briefly, incorrectly nested one level deep (`actionflow/app/` contained a second, duplicate Next.js project). This was caught via the `package-lock.json` warning and fixed by moving all Next.js files up to the true repository root. The structure now matches the Day 2 design exactly.
- `middleware.ts` is still pending — scheduled for Day 4 when real authentication logic is added (per Blueprint).

## Where Future Code Lands (unchanged from Day 2 plan)

| Day | Adds to |
|---|---|
| 4 | Auth logic inside `app/login/`, `app/signup/`, new `middleware.ts` |
| 5 | `app/api/process-meeting/`, `lib/claude.ts`, real content in `app/new-meeting/` and new `app/meetings/[id]/` |
| 6 | `app/api/meetings/`, `app/api/action-items/`, real content in `app/dashboard/` |
| 7 | Search/polish edits within existing files — no new top-level folders |
