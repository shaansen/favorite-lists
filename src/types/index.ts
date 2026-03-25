export interface ListItem {
  id: string
  name: string
  notes: string
  rank: number
  addedBy: string
  deletedAt?: string
}

export interface FavoriteList {
  id: string
  name: string
  items: ListItem[]
  createdBy: string
  createdAt: string
  deletedAt?: string
}

export interface TodoItem {
  id: string
  text: string
  completedAt?: string
  addedBy: string
  deletedAt?: string
}

export interface AppData {
  lists: FavoriteList[]
  todos: TodoItem[]
}

export interface AppSettings {
  displayName: string
  supabaseUrl: string
  supabaseAnonKey: string
}

export interface QueuedWrite {
  data: AppData
  timestamp: number
}

export type SyncStatus = 'synced' | 'syncing' | 'offline' | 'error' | 'conflict'
