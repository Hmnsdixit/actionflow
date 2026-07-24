# ActionFlow — SETUP.md

How to get this project running from scratch on a new machine.

## Prerequisites

| Tool | Version | Why it's needed |
|---|---|---|
| Node.js | v18.18+ (v24.18 used in dev) | JavaScript runtime that powers Next.js, npm, and the dev server |
| npm | v9+ (v11.16 used in dev) | Installs and manages all project dependencies |
| Git | any recent version | Version control, connects to GitHub |
| A Supabase account | free tier | Hosts the Postgres database and handles authentication |
| An Anthropic API key | pay-as-you-go | Powers the AI summary/action-item extraction |

## 1. Clone the repository

```
git clone https://github.com/<your-username>/actionflow.git
cd actionflow
```

## 2. Install dependencies

```
npm install
```

This installs Next.js, React, Tailwind CSS, the Supabase client libraries, and the Anthropic SDK — everything listed in `package.json`.

## 3. Configure environment variables

Create a file named `.env.local` in the project root (see `ENVIRONMENT.md` for the full list of required variables and where to find each value).

## 4. Run the development server

```
npm run dev
```

Visit **http://localhost:3000** — you should see the ActionFlow homepage with the Navbar.

## 5. Verify routes

Confirm these all load without errors:
- `/` — homepage
- `/login` — login form shell
- `/signup` — signup form shell
- `/dashboard` — placeholder dashboard
- `/new-meeting` — placeholder new meeting page

## 6. Supabase setup (one-time, per project)

1. Create a new project at supabase.com.
2. In the SQL Editor, run the schema SQL from `docs/SCHEMA.md` to create the `meetings` and `action_items` tables with Row Level Security enabled.
3. Copy your Project URL and anon public key from **Project Settings → API** into `.env.local`.

## Common Setup Issues

| Problem | Fix |
|---|---|
| `npm run dev` fails with a module not found error | Run `npm install` again; confirm you're in the project root, not a subfolder |
| Terminal prompt shows `...\actionflow\app>` instead of `...\actionflow>` | The Next.js project was scaffolded one folder too deep — move all project files up to the true repo root (see Day 3 fix in `DAY3-SUMMARY.md`) |
| Blank page / Supabase errors in console | Double-check `.env.local` values match your Supabase project exactly, and restart the dev server after editing `.env.local` |
