import type { AppData, SyncStatus } from '../types'
import { fetchDataFile, writeDataFile, createDataFileIfMissing, ConflictError } from './github'
import { storage } from './storage'
import { mergeData } from '../utils/merge'

const POLL_INTERVAL = 20_000

export type SyncListener = (data: AppData, status: SyncStatus) => void

export class SyncManager {
  private token = ''
  private owner = ''
  private repo = ''
  private intervalId: ReturnType<typeof setInterval> | null = null
  private listener: SyncListener | null = null

  configure(token: string, owner: string, repo: string) {
    this.token = token
    this.owner = owner
    this.repo = repo
  }

  onUpdate(listener: SyncListener) {
    this.listener = listener
  }

  private emit(data: AppData, status: SyncStatus) {
    storage.setData(data)
    this.listener?.(data, status)
  }

  async initialize(): Promise<AppData> {
    let result = await fetchDataFile(this.token, this.owner, this.repo, false)
    if (!result) {
      const sha = await createDataFileIfMissing(this.token, this.owner, this.repo)
      const empty: AppData = { lists: [] }
      storage.setData(empty)
      storage.setSha(sha)
      return empty
    }
    storage.setData(result.data)
    storage.setSha(result.sha)
    return result.data
  }

  startPolling() {
    this.stopPolling()
    this.intervalId = setInterval(() => this.poll(), POLL_INTERVAL)
    window.addEventListener('online', this.handleOnline)
  }

  stopPolling() {
    if (this.intervalId) clearInterval(this.intervalId)
    this.intervalId = null
    window.removeEventListener('online', this.handleOnline)
  }

  private handleOnline = () => {
    this.flushQueue()
  }

  private async poll() {
    if (!navigator.onLine) return
    try {
      const result = await fetchDataFile(this.token, this.owner, this.repo)
      if (result) {
        const local = storage.getData() ?? { lists: [] }
        const merged = mergeData(local, result.data)
        storage.setSha(result.sha)
        this.emit(merged, 'synced')
      }
    } catch {
      this.emit(storage.getData() ?? { lists: [] }, 'error')
    }
  }

  async push(data: AppData): Promise<void> {
    if (!navigator.onLine) {
      storage.enqueue(data)
      this.emit(data, 'offline')
      return
    }

    const sha = storage.getSha()
    if (!sha) return

    try {
      this.listener?.(data, 'syncing')
      const newSha = await writeDataFile(this.token, this.owner, this.repo, data, sha)
      storage.setSha(newSha)
      this.emit(data, 'synced')
    } catch (e) {
      if (e instanceof ConflictError) {
        const result = await fetchDataFile(this.token, this.owner, this.repo, false)
        if (result) {
          const merged = mergeData(data, result.data)
          storage.setSha(result.sha)
          const newSha = await writeDataFile(this.token, this.owner, this.repo, merged, result.sha)
          storage.setSha(newSha)
          this.emit(merged, 'synced')
        }
      } else {
        storage.enqueue(data)
        this.emit(data, 'error')
      }
    }
  }

  private async flushQueue() {
    const queue = storage.getQueue()
    if (queue.length === 0) return

    storage.clearQueue()
    const latest = queue[queue.length - 1].data
    const remote = await fetchDataFile(this.token, this.owner, this.repo, false)
    if (!remote) return

    const merged = mergeData(latest, remote.data)
    storage.setSha(remote.sha)
    await this.push(merged)
  }
}

export const syncManager = new SyncManager()
