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

export interface AppData {
  lists: FavoriteList[]
}

export interface GitHubFileResponse {
  content: string
  sha: string
  encoding: string
}

export interface AppSettings {
  displayName: string
  githubToken: string
  repoOwner: string
  repoName: string
}

export interface QueuedWrite {
  data: AppData
  timestamp: number
}

export type SyncStatus = 'synced' | 'syncing' | 'offline' | 'error' | 'conflict'
