# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

SDR Portal — a unified portal for the SDR (Sales Development Representative) team.

## Roadmap

- **v1**: Initial tracking, data wiring, minimal UI
- **v2**: Full UI + role-based team views
- **v3**: Scale, reliability, alerts/notifications/integrations

---

## Frontend

React + Vite + TypeScript. Located in `frontend/`.

### Commands

```bash
cd frontend
npm install       # install deps
npm run dev       # dev server (http://localhost:5173)
npm run build     # production build
npm run preview   # preview production build
```

### Architecture

- **Entry**: `src/main.tsx` → `src/App.tsx`
- **Routing**: React Router v6 with a single nested route tree. All pages live under the `<Layout />` shell (`src/components/Layout.tsx`).
- **Pages** (`src/pages/`):
  - `Dashboard` — stats grid, recent leads table, today's tasks
  - `Leads` — searchable/filterable leads table
  - `Accounts` — card grid of companies
  - `Tasks` — interactive task list with done/pending toggle, filter by due date
  - `Analytics` — conversion stats, activity bar chart, lead funnel
- **Styling**: Plain CSS per component (co-located `.css` files). CSS custom properties defined in `src/index.css` (colors, sidebar width, header height). No CSS framework.
- **Dependencies**: `react-router-dom`, `@tanstack/react-query` (available, not yet wired to API), `axios`, `lucide-react` (icons).

### Key CSS Variables (`src/index.css`)

| Variable | Purpose |
|---|---|
| `--primary` | Brand blue (#2563eb) |
| `--sidebar-bg` | Sidebar dark background |
| `--sidebar-w` | Sidebar width (240px) |
| `--header-h` | Header height (60px) |
| `--surface` | Card/panel background |
| `--bg` | Page background |
| `--border` | Border color |

## Backend

`backend/` has empty subdirectories (`helper/`, `router/`, `utils/`) — not yet implemented.
