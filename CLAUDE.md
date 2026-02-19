# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:5173
npm run build    # Build for production
npm run preview  # Preview production build locally
```

No test runner or linter is configured.

## Environment Setup

Copy `.env.example` to `.env` and fill in Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

The Supabase `goals` table must exist before running the app. On first load with an empty table, the app auto-inserts `initialData`.

## Architecture

This is a **monolithic single-component app** — all logic, state, and UI live in `src/App.jsx`. There are only 4 source files:

- `src/App.jsx` — The entire application (state, data fetching, calculations, rendering)
- `src/supabaseClient.js` — Supabase client singleton, reads from `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`
- `src/main.jsx` — React entry point
- `src/index.css` — Global Tailwind imports

## Data Model

Each participant stored as a row in the Supabase `goals` table:

```js
{
  id: number,
  name: string,
  avatar: string,         // emoji
  color: string,          // Tailwind classes for card styling
  barColor: string,       // Tailwind class for progress bar
  goals: [                // JSON array
    {
      id: string,
      text: string,
      total: number,       // target completions
      current: number,     // completions so far
      type: 'daily' | 'weekly' | 'task',
      note?: string
    }
  ]
}
```

## Key Behaviors

- **No auto-save**: state changes are local until the user clicks "Guardar". Supabase writes use `upsert` keyed on participant `id`.
- **Manual reload**: "Recargar" fetches fresh data from Supabase, prompting if there are unsaved changes.
- **Fine calculation** (`calculateFine`): tiered 0–100 Bs penalty based on completion percentage, defined in `App.jsx:157`.
- **Progress tracking**: pill-button UI — clicking a filled pill decrements, clicking an empty pill increments (bounded to `[0, goal.total]`).

## Customization

To add/modify participants or their goals, edit the `initialData` array in `src/App.jsx:7`. Goal `type` values: `daily` (repeats daily, `total` = 7), `weekly` (specific days), `task` (one-time, `total` = 1).
