# Rank our Favorites

Collaborative PWA for Shantanu and Charlie to create and manage ranked lists of favorite things (e.g., "Favorite Hamburgers") and shared to-do lists.

## Architecture

- **React + Vite + TypeScript** with **TailwindCSS v4** and **Framer Motion**
- **PWA** via `vite-plugin-pwa` — installable on iPhone Safari via "Add to Home Screen"
- **GitHub Pages** hosting with `HashRouter` for client-side routing
- **Supabase Realtime** as database + sync — single-row JSONB pattern with WebSocket subscriptions
- **DiceBear Avatars** for user identity based on display name

## Key Directories

```
src/
  components/   # ListCard, ItemRow, AddItemForm, SettingsModal, SyncStatus, Layout, Avatar
  pages/        # HomePage, ListDetailPage, TodoPage
  services/     # supabase.ts (API client), sync.ts (realtime/push), storage.ts (localStorage)
  hooks/        # useSync.ts, useSettings.ts
  types/        # index.ts (all interfaces)
  context/      # AppContext.tsx (global state)
  utils/        # merge.ts (conflict resolution)
public/icons/   # PWA icons
```

## Data Flow

1. App loads → reads cached data from localStorage
2. Subscribes to Supabase Realtime channel for instant updates via WebSocket
3. On write: optimistic local update → push to Supabase → handle conflict with merge
4. Offline: queues writes in localStorage, flushes on reconnect

## Sync & Merge Strategy

- `updated_at` timestamp-based optimistic locking for Supabase writes
- On conflict (no rows updated): re-fetch, merge by union of lists/items by ID, retry write
- Soft-delete via `deletedAt` tombstone (purged after 24h)
- Remote wins for field-level conflicts

## Code Style

- No code comments — code must be self-explanatory
- Concise, readable code — every line must have a purpose
- No unnecessary abstractions or over-engineering

## Commands

- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run deploy` — build + deploy to GitHub Pages

## Config

- `vite.config.ts`: base path `/favorite-lists/`, Tailwind + PWA plugins
- Settings stored in localStorage: display name, Supabase URL, Supabase anon key
- Theme: light gray-50 bg, emerald-500 (#10B981) accents, Eczar headings, Libre Franklin body
- Drag-and-drop reordering via @dnd-kit/core and @dnd-kit/sortable
- Bottom tab bar: Rankings (/) and To Do (/todos)
