import type { AppData, AppSettings, QueuedWrite } from '../types'

const KEYS = {
  settings: 'favlists-settings',
  data: 'favlists-data',
  sha: 'favlists-sha',
  etag: 'favlists-etag',
  queue: 'favlists-queue',
} as const

function get<T>(key: string): T | null {
  const raw = localStorage.getItem(key)
  return raw ? JSON.parse(raw) : null
}

function set(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
}

export const storage = {
  getSettings: () => get<AppSettings>(KEYS.settings),
  setSettings: (s: AppSettings) => set(KEYS.settings, s),

  getData: () => get<AppData>(KEYS.data),
  setData: (d: AppData) => set(KEYS.data, d),

  getSha: () => localStorage.getItem(KEYS.sha),
  setSha: (sha: string) => localStorage.setItem(KEYS.sha, sha),

  getEtag: () => localStorage.getItem(KEYS.etag),
  setEtag: (etag: string) => localStorage.setItem(KEYS.etag, etag),

  getQueue: () => get<QueuedWrite[]>(KEYS.queue) ?? [],
  setQueue: (q: QueuedWrite[]) => set(KEYS.queue, q),
  enqueue: (data: AppData) => {
    const queue = get<QueuedWrite[]>(KEYS.queue) ?? []
    queue.push({ data, timestamp: Date.now() })
    set(KEYS.queue, queue)
  },
  clearQueue: () => localStorage.removeItem(KEYS.queue),
}
