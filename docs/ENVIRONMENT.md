# ActionFlow — ENVIRONMENT.md

Full reference of every environment variable, tool, and configuration file this project depends on.

## Environment Variables (`.env.local`)

| Variable | Where to find it | Exposed to browser? | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project Settings → API → Project URL | Yes (prefix `NEXT_PUBLIC_` makes it public) | Tells the Supabase client which project to connect to |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Project Settings → API → anon public key | Yes | Public key used for client-side Supabase requests (safe to expose — protected by Row Level Security) |
| `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys | **No — server-only** | Used exclusively inside Next.js API routes to call Claude; never referenced in client components |

**Important:** `ANTHROPIC_API_KEY` must never be prefixed with `NEXT_PUBLIC_` — doing so would expose it in the browser bundle.

## Where These Are Set

| Environment | Location |
|---|---|
| Local development | `.env.local` file at project root (never committed — listed in `.gitignore`) |
| Production (Vercel) | Vercel Project → Settings → Environment Variables (set for the "Production" environment specifically, per Day 9 plan) |

## Development Tools

| Tool | Version in use | Purpose |
|---|---|---|
| Node.js | v24.18.0 | JavaScript runtime |
| npm | v11.16.0 | Package manager |
| Next.js | 16.2.11 (App Router, Turbopack) | Frontend + backend framework |
| TypeScript | via `create-next-app` default | Type safety |
| Tailwind CSS | via `create-next-app` default | Styling |
| VS Code | latest | Code editor |
| Git | latest | Version control |

## Key Configuration Files

| File | Purpose |
|---|---|
| `next.config.ts` | Next.js build/runtime configuration |
| `tsconfig.json` | TypeScript compiler settings, including the `@/*` import alias |
| `eslint.config.mjs` | Linting rules |
| `postcss.config.mjs` | Required by Tailwind CSS for processing styles |
| `.gitignore` | Excludes `node_modules`, `.env.local`, `.next` build output from version control |
| `.env.local` | Local secrets (never committed) |

## External Service Accounts Required

| Service | Free tier? | Used for |
|---|---|---|
| GitHub | Yes | Source control + Vercel deploy trigger |
| Supabase | Yes | Database + Authentication |
| Anthropic (Claude API) | Usage-based, low cost at this scale | AI summary/action-item generation |
| Vercel | Yes | Hosting (connected Day 9) |
