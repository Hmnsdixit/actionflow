# ActionFlow

**Turn messy meeting notes into organized action — automatically.**

ActionFlow uses AI to transform raw, unstructured meeting notes into a clean summary and a clear list of action items — then keeps every action item tracked across every meeting you've ever logged, in one aggregated dashboard.

🔗 **Live app:** https://actionflow-sand.vercel.app
📋 **Built for:** AB Talks 60-Day Claude AI Challenge — 10-Day Capstone

---

## The Problem

Meeting notes are messy. Even when they're typed, the useful information — decisions made, tasks owed — is buried in unstructured text. Generic AI chat tools can summarize *one* set of notes on request, but they don't retain structure across meetings. There's no persistent, searchable record of everything you owe. Action items get lost.

## The Solution

Paste your raw notes → AI extracts a summary and action items → everything is saved and aggregated on a personal dashboard, so you always know exactly what you still owe, across every meeting.

## Features

- 🔐 **Private accounts** — real authentication, every user's data isolated via database-level Row Level Security
- ✍️ **Paste & process** — submit raw, messy notes and get an instant structured summary
- ✅ **Automatic action item extraction** — no manual tagging required
- 📊 **Unified dashboard** — every meeting and every action item across all meetings, in one place
- ☑️ **Progress tracking** — mark items done, watch your open list shrink
- 🔍 **Search** — quickly find any past meeting by keyword
- ♿ **Accessible** — keyboard skip-link, visible focus states, semantic landmarks
- 📡 **Resilient** — offline detection, graceful error states, hard input validation on both client and server

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend + Backend | [Next.js](https://nextjs.org/) (App Router) + [Tailwind CSS](https://tailwindcss.com/) |
| Database + Auth | [Supabase](https://supabase.com/) (Postgres + Row Level Security) |
| AI | [Groq API](https://groq.com/) (Llama 3.3 70B) — genuinely free tier, no billing required |
| Hosting | [Vercel](https://vercel.com/) |

All services used have a genuinely free tier — this project costs nothing to run at demo scale.

## Getting Started Locally

### Prerequisites
- Node.js v18.18+
- A free [Supabase](https://supabase.com/) account
- A free [Groq](https://console.groq.com/keys) API key

### Setup

```bash
git clone https://github.com/Hmnsdixit/actionflow.git
cd actionflow
npm install
```

Copy `.env.example` to `.env.local` and fill in your own values:

```bash
cp .env.example .env.local
```

Run the SQL in [`docs/SCHEMA.md`](./docs/SCHEMA.md) in your Supabase project's SQL Editor to create the required tables with Row Level Security.

```bash
npm run dev
```

Visit `http://localhost:3000`.

Full setup details: [`docs/SETUP.md`](./docs/SETUP.md)

## Documentation

This project was built following a full SDLC process, documented day-by-day in [`docs/`](./docs):

- [Product Requirements](./docs) · [Architecture](./docs/ARCHITECTURE.md) · [Database Schema](./docs/SCHEMA.md) · [API Reference](./docs/API.md) · [UI Wireframes](./docs/UI-WIREFRAMES.md) · [Project Structure](./docs/PROJECT-STRUCTURE.md)
- Daily build logs: `docs/DAY3-SUMMARY.md` through `docs/DAY9-SUMMARY.md`

## Project Status

Built in a 10-day sprint (Requirements → Design → Setup → Implementation → Testing → Deployment → Maintenance), following a real software development lifecycle. See `docs/DAY*-SUMMARY.md` files for the full daily build history.

## License

MIT — see [LICENSE](./LICENSE).

## Acknowledgments

Built with Claude as part of the AB Talks 60-Day Claude AI Challenge.