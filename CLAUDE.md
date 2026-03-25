# Favorite Lists

Collaborative PWA for Shantanu and Charlie to create and manage ranked lists of favorite things (e.g., "Favorite Hamburgers").

## Architecture

- **React + Vite + TypeScript** with **TailwindCSS v4** and **Framer Motion**
- **PWA** via `vite-plugin-pwa` — installable on iPhone Safari via "Add to Home Screen"
- **GitHub Pages** hosting with `HashRouter` for client-side routing
- **GitHub Contents API** as serverless database — reads/writes `data/data.json` on `main` branch
- **DiceBear Avatars** for user identity based on display name

## Key Directories

```
src/
  components/   # ListCard, ItemRow, AddItemForm, SettingsModal, SyncStatus, Layout, Avatar
  pages/        # HomePage, ListDetailPage
  services/     # github.ts (API client), sync.ts (polling/push), storage.ts (localStorage)
  hooks/        # useSync.ts, useSettings.ts
  types/        # index.ts (all interfaces)
  context/      # AppContext.tsx (global state)
  utils/        # merge.ts (conflict resolution)
public/icons/   # PWA icons
data/           # data.json (the "database")
```

## Data Flow

1. App loads → reads cached data from localStorage
2. Polls GitHub API every 20s with ETag (304 = no change)
3. On write: optimistic local update → push to GitHub → handle 409 with merge
4. Offline: queues writes in localStorage, flushes on reconnect

## Sync & Merge Strategy

- SHA-based optimistic locking for GitHub writes
- On conflict (409): re-fetch, merge by union of lists/items by ID
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
- Settings stored in localStorage: display name, GitHub PAT, repo owner, repo name
- Theme: deep indigo/purple (#1e1b4b), Space Grotesk headings, Inter body text
